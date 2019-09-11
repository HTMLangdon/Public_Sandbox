/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Dependency Injection functionality.
 * @module cp/di
 */

import "~reflection";
import { Utility } from './util';

export type ServiceFactory = (sp: ServiceProvider) => any;

export enum ScopeType {
	Transient = 0,
	Singleton = 1
	//Scoped = 2 // Potential future use
}

/**
 * Internal class containing metadata keys.
 */
class Meta {
	public static readonly MethodParams: string = "design:paramtypes";
	public static readonly PropertyType: string = "design:type";
	public static readonly ParamType: string = "param:type:";
	public static readonly ServiceInfo: string = "service:info";
	public static readonly ServiceParams: string = "service:params";
	public static readonly ServiceClassName: string = "design:serviceclassname";
	public static readonly ServiceDiscardBinding: string = "service:discardbinding";
	public static readonly ServiceAutoInitialize: string = "service:autoinitialize";
}

/**
 * Options for configuring property service injection.
 */
class PropertyServiceOptions {
	Target: Object;
	Property: string | symbol;
	ServiceType: Constructor<any>;

	constructor(target: object, property: string | symbol, serviceType: Constructor<any>) {
		let mod = this;
		mod.Target = target;
		mod.Property = property;
		mod.ServiceType = serviceType;
	}
}

/**
 * Options for configuring service bindings during application startup.
 */
export class ServiceBindingOptions {
	/** Service type. */
	public serviceType: Constructor<any>;
	/** Optional implementation type. Default to the service type (if factory and instance are omitted). */
	public useClass?: Constructor<any>;
	/** Optional type factory method. */
	public useFactory?: ServiceFactory;
	/** Optional static instance. If specified, scope will be forced to Singleton. */
	public useInstance?: any = null;
	/** Optional scope type. Default "Transient". */
	public scopeType?: ScopeType = ScopeType.Transient;

	constructor(serviceType: Constructor<any>, useClass?: Constructor<any>, useFactory?: ServiceFactory, useInstance?: any, scopeType?: ScopeType) {
		let mod = this;

		if (Utility.IsNull(serviceType)) throw new Error("Missing provide type.");

		mod.serviceType = serviceType;

		let hasClass: boolean = !Utility.IsNull(useClass);
		let hasFactory: boolean = !Utility.IsNull(useFactory);
		let hasInstance: boolean = !Utility.IsNull(useInstance);

		if (hasClass) {
			if (hasFactory || hasInstance) throw new Error("Multiple use types specified.");
			mod.useClass = useClass;
		} else if (hasFactory) {
			if (hasInstance) throw new Error("Multiple use types specified.");
			mod.useFactory = useFactory;
		} else if (hasInstance) {
			mod.useInstance = useInstance;
		} else
			// The provide type and class type are the same
			mod.useClass = serviceType;

		if (!Utility.IsNull(scopeType))
			mod.scopeType = scopeType;
	}
}

/**
 * Service descriptor base (abstract) class.
 */
abstract class ServiceDescriptor {
	private _serviceType: Constructor<any>;
	protected _type: ScopeType;
	protected _instance: any = null;
	protected _factory: (sp: ServiceProvider) => any;

	/** Gets the service class type. */
	public get ServiceType(): Constructor<any> { return this._serviceType; }
	/** Gets the descriptor type. */
	public get Type(): ScopeType { return this._type; }
	/** Gets the service instance, if any. This property should not be accessed directly. */
	public get Instance(): any { return this._instance; }
	/** Sets the service instance. This property should not be accessed directly. */
	public set Instance(instance: any) {
		let mod = this;
		if (!Utility.IsNull(mod._instance)) throw new Error("Instance cannot be overwritten.");
		if (mod._type == ScopeType.Transient) throw new Error("Cannot set instance on Transient service.");
		if (Utility.IsNull(instance)) throw new Error("Missing or invalid instance."); // [TODO] Doesn't handle scalar "service" values (number, boolean) [maybe that is ok]
		mod._instance = instance;
	}
	/** Gets the service factory. This property should not be accessed directly. */
	public get Factory(): (sp: ServiceProvider) => any { return this._factory; }

	/**
	 * Creates a new ServiceDescriptor instance.
	 * @param {Constructor<any>} serviceType - Service class type.
	 * @param {ScopeType} scopeType - Optional service scope. Default "Transient".
	 */
	constructor(serviceType: Constructor<any>, scopeType: ScopeType = ScopeType.Transient) {
		let mod = this;
		if (Utility.IsNull(serviceType)) throw new Error("Missing or invalid service class type.");

		mod._serviceType = serviceType;
		mod._type = scopeType;
	}
}

/**
 * Service descriptor based on a type (class).
 */
export class TypeServiceDescriptor extends ServiceDescriptor {
	/**
	 * Creates a new TypeServiceDescriptor instance.
	 * @param {Constructor<any>} classType - Service class type.
	 * @param {ScopeType} scopeType - Optional service scope (lifetime).
	 * @param {Constructor<any>} useClass - Optional implementation type. If null, the classType will be used.
	 */
	constructor(classType: Constructor<any>, scopeType?: ScopeType, useClass?: Constructor<any>) {
		super(classType, scopeType);
		let mod = this;

		let ctor: Constructor<any> = Utility.IsNull(useClass) ? classType : useClass;

		mod._factory = (sp: ServiceProvider): any => {
			//debugger;

			// Go through the constructor parameters
			let args: any[] = [];

			let types: any[] = Reflect.getOwnMetadata(Meta.MethodParams, ctor);

			if (Utility.HasData(types)) {
				for (let i = 0; i < types.length; i++) {
					let ai: any;
					if (Reflect.hasOwnMetadata(Meta.ParamType + i.toString(), ctor)) {
						let argName: string = Reflect.getOwnMetadata(Meta.ParamType + i.toString(), ctor);
						if (Utility.IsNullOrBlank(argName)) {
							throw new Error("Unknown parameter at position " + i.toString() + ".");
						}
						ai = sp.Create(argName);
					} else {
						ai = sp.Create(types[i]);
					}
					args.push(ai);
				}
			}

			// Create the new object instance
			let ret = Object.create(ctor.prototype);
			ctor.apply(ret, args);

			// Inject properties
			// This only happens on this main class.
			// ServiceProvider.Create() handles it for constructor arguments.
			sp.InjectProperties(ret, ctor);

			// Call Initialize for objects that have the method
			// [NO!] Can't do this because some require a model. Would be nice to do for non-components, like services
			//if ('Initialize' in ret && Utility.IsFunction(ret["Initialize"])) {
			//	ret["Initialize"]();
			//}

			if (Reflect.hasOwnMetadata(Meta.ServiceAutoInitialize, ctor) && Reflect.getOwnMetadata(Meta.ServiceAutoInitialize, ctor)) {
				if (ret["Initialize"]) {
					ret["Initialize"]();
				}
				else {
					alert("AutoInit set to true on a class with no Initialize() method!");
				}				
			}

			return ret;
		};
	}
}

/**
 * Service descriptor based on a factory method.
 */
export class FactoryServiceDescriptor extends ServiceDescriptor {
	/**
	 * Creates a new FactoryServiceDescriptor instance.
	 * @param {Constructor<any>} classType - Service class type.
	 * @param {Function} factory - Service factory method.
	 * @param {ScopeType} scopeType - Optional service scope (lifetime).
	 */
	constructor(classType: Constructor<any>, factory: (sp: ServiceProvider) => any, scopeType: ScopeType = ScopeType.Transient) {
		super(classType, scopeType);
		let mod = this;
		if (Utility.IsNull(factory)) throw new Error("Missing or invalid factory.");
		mod._factory = factory;
	}
}

/**
 * Service descriptor based on a static instance.
 */
export class StaticServiceDescriptor extends ServiceDescriptor {
	/**
	 * Creates a new StaticServiceDescriptor instance.
	 * @param {Constructor<any>} classType - Service class type.
	 * @param {any} instance - Service instance.
	 */
	constructor(classType: Constructor<any>, instance: any) {
		super(classType, ScopeType.Singleton);

		let mod = this;
		if (Utility.IsNull(instance)) throw new Error("Missing or invalid instance.");
		mod._instance = instance;
		mod._factory = (sp: ServiceProvider): any => { return mod._instance; };
	}
}

/**
 * Service provider.
 */
export class ServiceProvider implements ServiceProvider {
	private _map: IKeyValueCollection<ServiceDescriptor> = {};

	constructor(services?: (ServiceBindingOptions | Constructor<any>)[]) {
		//debugger;
		let mod = this;
		if (!Utility.HasData(services)) return;

		for (let i = 0; i < services.length; i++) {
			let s: ServiceBindingOptions | Constructor<any> = services[i];

			if (Utility.IsNull(s)) throw new Error("Missing service binding.");

			if (Utility.IsFunction(s)) {
				let ctor = <Constructor<any>>s;
				mod.Add(new TypeServiceDescriptor(ctor, ScopeType.Transient));
			} else {
				mod.Bind(<ServiceBindingOptions>s);
			}
		}
	}

	/**
	 * Get the class name.
	 * @param {Function} classType - Class type (constructor).
	 * @returns {string} The class name, if found, otherwise null.
	 */
	private GetServiceClassName<T>(classType: Constructor<T>): string {
		let mod = this;

		let key: string = Reflect.getOwnMetadata(Meta.ServiceClassName, classType);
		if (Utility.IsNullOrBlank(key))
			key = classType["name"];
		if (Utility.IsNullOrBlank(key))
			return null;
		return key;
	}

	/**
	 * Create a service instance.
	 * @param {Constructor<T>} classType - Class type (constructor).
	 * @returns {T} Service instance.
	 */
	public Create<T>(classType: Constructor<T>): T;
	/**
	 * Create a service instance.
	 * @param {string} classType - Class type name (key).
	 * @returns {T} Service instance.
	 */
	public Create<T>(classType: string);
	/**
	 * Create a service instance.
	 * @param {Constructor<T>|string} classType - Class type constructor or name.
	 * @returns {T} Service instance.
	 */
	public Create<T>(classType: Constructor<T> | string): T {
		//debugger;
		let mod = this;
		let sd: ServiceDescriptor = null;
		let key: string;
		let ctor: Constructor<T>;

		// ### TEST
		//if (classType["name"] == "SectionServices") {
		//	debugger;
		//}

		let isCtor = typeof classType == "function";

		if (isCtor) {
			ctor = <Constructor<T>>classType;
			key = mod.GetServiceClassName<T>(ctor);
		} else
			key = <string>classType;

		sd = mod._map[key];

		// If the service is unknown and is being created via constructor/class, try to bind it
		if (Utility.IsNull(sd) && isCtor) {
			//debugger;
			// See if binding info exists
			if (Reflect.hasOwnMetadata(Meta.ServiceInfo, ctor)) {
				// Bind it
				let s: ServiceBindingOptions = Reflect.getOwnMetadata(Meta.ServiceInfo, ctor);
				sd = mod.Bind(s);
			}
		}

		// See if it is a known service
		if (Utility.IsNull(sd)) {
			throw new Error("Missing or invalid service key '" + key + "'.");
		}

		let instance: T;

		if (Utility.IsNull(sd.Instance)) {
			// Call the factory
			instance = sd.Factory(mod);

			// Save the instance for non-transient services
			if (sd.Type != ScopeType.Transient)
				sd.Instance = instance;
		} else {
			instance = sd.Instance;
		}

		return instance;
	}

	/**
	 * Inject object properties using the service provider.
	 * @param {any} obj - Object instance.
	 * @param {Constructor<any>} ctor - Object constructor. This is used to retrieve the property metadata.
	 */
	public InjectProperties(obj: any, ctor: Constructor<any>) {
		let mod = this;

		let pi: PropertyServiceOptions[] = Reflect.getOwnMetadata(Meta.ServiceParams, ctor);

		if (Utility.HasData(pi)) {
			for (let i = 0; i < pi.length; i++) {
				let p: PropertyServiceOptions = pi[i];
				let t: Constructor<any> = Reflect.getOwnMetadata(Meta.PropertyType, p.Target, p.Property);
				if (!Utility.IsNull(t)) {
					// Create the child object and assign it to the property
					let v = mod.Create(t);
					obj[p.Property] = v;
				}
			}
		}

		// Get the parent prototype
		// If it is a constructor (function), make a recursive call
		// We might be able to also check if '!Utility.IsNullOrBlank(parent["name"])', but not sure.
		let parent: Object | Constructor<any> = Object.getPrototypeOf(ctor);
		if (!Utility.IsNull(parent) && typeof parent == "function") {
			mod.InjectProperties(obj, parent);
		}
	}

	/**
	 * Bind a service. This is a private method.
	 * @param {ServiceBindingOptions} opt - Binding options.
	 */
	private Bind(opt: ServiceBindingOptions): ServiceDescriptor {
		let mod = this;
		let key: string = mod.GetServiceClassName(opt.serviceType);

		let hasFactory: boolean = !Utility.IsNull(opt.useFactory);
		let hasInstance: boolean = !Utility.IsNull(opt.useInstance);

		// Create the appropriate service descriptor
		let sd: ServiceDescriptor;
		if (hasFactory)
			sd = new FactoryServiceDescriptor(opt.serviceType, opt.useFactory, opt.scopeType);
		else if (hasInstance)
			sd = new StaticServiceDescriptor(opt.serviceType, opt.useInstance);
		else
			sd = new TypeServiceDescriptor(opt.serviceType, opt.scopeType, opt.useClass);

		// See if the binding should be discarded or not
		let a = Reflect.getOwnMetadata(Meta.ServiceDiscardBinding, opt.serviceType);
		if (!a)
			// Save the binding
			mod.Add(sd);
		//else debugger; // ### TEST

		// Return the service descriptor
		return sd;
	}

	/**
	 * Add a service to the provider.
	 * An error will be raised if the service key has already been added.
	 * @param {ServiceDescriptor} sd - Service descriptor.
	 * @see TypeServiceDescriptor
	 * @see FactoryServiceDescriptor
	 * @see StaticServiceDescriptor
	 */
	public Add(sd: ServiceDescriptor): void {
		//debugger;
		let mod = this;

		// Validation
		if (Utility.IsNull(sd)) throw new Error("Missing or invalid service descriptor.");
		let key = mod.GetServiceClassName(sd.ServiceType);
		if (Utility.IsNullOrBlank(key)) throw new Error("Unable to resolve service class key.");
		if (!Utility.IsNull(mod._map[key])) throw new Error("Specified key '" + key + "' already exists.");
		if (Utility.IsNull(sd.Factory)) throw new Error("Missing or invalid factory.");

		// Save the descriptor
		mod._map[key] = sd;
	}

	/**
	 * Determine if a service has already been added to the provider.
	 * @param {Constructor<T>} classType - Class type constructor.
	 * @returns {boolean} True if the service exists, otherwise false.
	 */
	public HasService(classType: Constructor<any>): boolean {
		//debugger;
		let mod = this;
		let key = mod.GetServiceClassName(classType);
		if (Utility.IsNullOrBlank(key)) return false;
		return Utility.IsDefined(mod._map[key]);
	}
}

/**
 * Class decorator used to indicate an injected object should be auto-initialized.
 * @param {boolean} autoInit - Optional. If true, automatically calls Initialize. Default is true.
 */
export function AutoInit(autoInit: boolean = true) {
	//debugger;

	return function (ctor: Constructor<any>) {
		//debugger;
		Reflect.defineMetadata(Meta.ServiceAutoInitialize, autoInit, ctor);
	};
}

/**
 * Class decorator used to indicate the service injection binding should be discarded after it is used.
 */
export function DiscardBinding() {
	//debugger;

	return function (ctor: Constructor<any>) {
		//debugger;

		// Tell the service provider to discard the binding
		Reflect.defineMetadata(Meta.ServiceDiscardBinding, true, ctor);
	};
}

/**
 * Class decorator used to indicate the class can be created through service injection.
 * @param {Constructor<any>} serviceType - Optional service (class) type. Default is the imlementing class.
 * @param {ScopeType} scopeType - Optional service scope type. Default "ScopeType.Transient".
 */
export function Injectable(serviceType?: Constructor<any>, scopeType: ScopeType = ScopeType.Transient) {
	//debugger;

	return function (ctor: Constructor<any>) {
		//debugger;

		if (Utility.IsNull(serviceType)) serviceType = ctor;

		let className: string = ctor["name"];
		if (Utility.IsNullOrBlank(className)) throw new Error("Unable to determine service implementation key.");
		let key: string = Utility.IsNull(serviceType) ? className : serviceType["name"];
		if (Utility.IsNullOrBlank(key)) throw new Error("Unable to determine service key.");

		// Get the metadata
		var types: any[] = Reflect.getOwnMetadata(Meta.MethodParams, ctor);

		// If there are no types, there is no constructor (which is ok)
		if (!Utility.HasData(types)) types = [];

		// Go through the list and make sure the types are known
		for (let i = 0; i < types.length; i++) {
			let name: string = null;

			// See if a custom type was specified. That always overrides the "types" collection above.
			if (Reflect.hasOwnMetadata(Meta.ParamType + i.toString(), ctor))
				name = Reflect.getOwnMetadata(Meta.ParamType + i.toString(), ctor);

			if (name == null) {
				// Get it from the standard collection
				name = types[i].name;
			}

			if (Utility.IsNullOrBlank(name) || name.toLowerCase() == "object") {
				throw new Error("Unknown parameter at position " + i.toString() + " for " + className + " constructor.");
			}
		}

		// Save the info so it can be auto-bound later
		// Attach it to the ServiceProvider class/constructor (not the class being injected)
		if (Utility.IsNull(scopeType)) scopeType = ScopeType.Transient;

		// Save the service info
		Reflect.defineMetadata(Meta.ServiceInfo, new ServiceBindingOptions(serviceType, ctor, null, null, scopeType), ctor);

		// Save the class name, in case it was overridden
		// Plus, this gives a common location to look for it
		Reflect.defineMetadata(Meta.ServiceClassName, key, ctor);
	}
}

/**
 * Decorator used to override the service class for a parameter or to specify property injection.
 * @param {Constructor<any>} serviceType - Service type used for injection.
 */
export function Inject(serviceType?: Constructor<any>) {
	//debugger;

	return (target: Object, propertyKey: string | symbol, parameterIndex?: number | undefined) => {
		//debugger;

		if (Utility.IsDefined(parameterIndex)) {
			if (Utility.IsNull(serviceType)) throw new Error("Missing service type.");

			Reflect.defineMetadata(Meta.ParamType + parameterIndex.toString(), serviceType, target, propertyKey);
		} else {
			// Get the injection info
			// Use the target's constructor so that we're always dealing with a "class type" (constructor) for DI
			var pi: PropertyServiceOptions[] = Reflect.getOwnMetadata(Meta.ServiceParams, target.constructor);
			if (Utility.IsNull(pi)) {
				// Add a new collection
				pi = [];
				Reflect.defineMetadata(Meta.ServiceParams, pi, target.constructor);
			}

			pi.push(new PropertyServiceOptions(target, propertyKey, serviceType));
		}
	};
}

///**
// * Class decorator used to indicate the class can be created through service injection as a simple object.
// * Simple objects do not have constructor parameters and do not have to be uniquely named.
// * These objects are always Transient scoped, even if injected child properties are not.
// * Child properties can be injected via the @Inject() property decorator.
// */
//export function SimpleInjectable() { // *** DEPRECATED ***
//	// [TODO] Any way to merge Injectable and SimpleInjectable?
//	// That way we could allow parameters on the constructor.
//	// Their nested natures complicate things.
//	// We could add a "discardBinding: boolean = false" parameter, but that is messy and other params don't really align.

//	//debugger;

//	return function (ctor: Constructor<any>) {
//		//debugger;

//		// Tell the service provider to discard the binding
//		Reflect.defineMetadata(Meta.ServiceDiscardBinding, true, ctor);

//		// Create a custom binding with a custom factory
//		let sb: ServiceBindingOptions = {
//			serviceType: ctor,
//			useFactory: (sp: ServiceProvider) => {
//				//debugger;

//				// Create the instance manually
//				let instance = new ctor();

//				// Fill in the properties
//				sp.InjectProperties(instance, ctor);

//				return instance;
//			}
//		}
//		Reflect.defineMetadata(Meta.ServiceInfo, sb, ctor);
//	};
//}
