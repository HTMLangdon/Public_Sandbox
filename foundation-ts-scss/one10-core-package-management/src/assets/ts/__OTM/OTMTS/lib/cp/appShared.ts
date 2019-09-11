/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Core application functionality.
 * @module cp/appShared
 */

import "~reflection";
import { Utility, QsParams } from './util';
import { UserInfo, UserChangedEvent } from './securityShared';
//import { SecurityService } from 'bsp/services/mock/securityService';
import { SecurityService } from 'bsp/services/securityService';
import { Config } from '~config';
import { ScopeType, Injectable, ServiceProvider, StaticServiceDescriptor, TypeServiceDescriptor, ServiceBindingOptions } from './di';
import { IComponentModule } from './componentModule';

/*
// RXJS - Not currently used. Retaining potential code for now.

import { Subject } from 'rxjs/Subject';

// Taken from Angular's EventEmitter
// https://github.com/angular/angular/blob/master/packages/core/src/event_emitter.ts
export class EventEmitter<T> extends Subject<T> {
	private __isAsync: boolean;

	constructor(isAsync: boolean = false) {
		super();
		this.__isAsync = isAsync;
	}

	emit(value?: T) { super.next(value); }

	subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
		let schedulerFn: (t: any) => any;
		let errorFn = (err: any): any => null;
		let completeFn = (): any => null;

		if (generatorOrNext && typeof generatorOrNext === 'object') {
			schedulerFn = this.__isAsync ? (value: any) => {
				setTimeout(() => generatorOrNext.next(value));
			} : (value: any) => { generatorOrNext.next(value); };

			if (generatorOrNext.error) {
				errorFn = this.__isAsync ? (err) => { setTimeout(() => generatorOrNext.error(err)); } :
					(err) => { generatorOrNext.error(err); };
			}

			if (generatorOrNext.complete) {
				completeFn = this.__isAsync ? () => { setTimeout(() => generatorOrNext.complete()); } :
					() => { generatorOrNext.complete(); };
			}
		} else {
			schedulerFn = this.__isAsync ? (value: any) => { setTimeout(() => generatorOrNext(value)); } :
				(value: any) => { generatorOrNext(value); };

			if (error) {
				errorFn =
					this.__isAsync ? (err) => { setTimeout(() => error(err)); } : (err) => { error(err); };
			}

			if (complete) {
				completeFn =
					this.__isAsync ? () => { setTimeout(() => complete()); } : () => { complete(); };
			}
		}

		return super.subscribe(schedulerFn, errorFn, completeFn);
	}
}
*/


type ProviderCollection = (ServiceBindingOptions | Constructor<any>)[];

/**
 * Internal class containing metadata keys.
 */
class Meta {
	public static readonly ServiceProviders: string = "services:providers";
}

/**
 * Web component information.
 * NOTE: This is a separate copy from the one in 'lib/web/web'. That is a non-module TS file and cannot import from here.
 */
export class ComponentInfo {
	/** Component wrapper module from the loader. */
	Component: KeyValueCollection<Constructor<any>>;
	/** Component name. */
	Name: string;
	/** Optional model associated with the component. */
	Model?: any;
	/** Optional global (window-level) variable name for the component.. */
	GlobalReference?: string;
	/** Component file path. */
	Path: string;

	constructor(component: any, name: string, path: string, model?: any, globalReference?: string) {
		let mod = this;
		mod.Component = component;
		mod.Name = name;
		mod.Path = path;
		mod.Model = model;
		mod.GlobalReference = globalReference;
	}
}

/**
 * Application startup options.
 */
interface AppStartupOptions {
	providers: (Constructor<any> | ServiceBindingOptions)[];
}

/**
 * Class decorator used to configure the application on startup.
 * @param {AppStartupOptions} options - Application startup options.
 */
export function AppStartup(options: AppStartupOptions) {
	//debugger;
	return (ctor: Constructor<any>) => {
		//debugger;

		let services: ServiceBindingOptions[] = [];

		// Go through the list of specified providers
		for (let i = 0; i < options.providers.length; i++) {
			let p = options.providers[i];

			if (typeof p == "function") {
				let np = new ServiceBindingOptions(p, null, null, ScopeType.Transient);
				services.push(np)
			} else {
				services.push(p);
			}
		}

		//debugger;
		Reflect.defineMetadata(Meta.ServiceProviders, services, ctor);
	};
}

/**
 * Application launch options.
 * NOTE: This is a separate copy from the one in 'lib/web/web'. That is a non-module TS file and cannot import from here.
 */
export class LaunchOptions {
	/** Collection of components loaded at launch. */
	Components: ComponentInfo[];
	/** Optional global variable reference for the application manager. */
	ManagerGlobalReference?: string;
	/** Optional application startup component. */
	StartupComponent?: ComponentInfo;
	/** Optional application configuration. */
	Config?: Config;

	constructor(components: ComponentInfo[], config?: Config, managerGlobalReference?: string, startupComponent?: ComponentInfo) {
		let mod = this;
		mod.Components = components;
		mod.Config = config;
		mod.ManagerGlobalReference = managerGlobalReference;
		mod.StartupComponent = startupComponent;
	}
}

/**
 * Application launcher.
 */
export class ApplicationLauncher {
	constructor(opt: LaunchOptions) {
		//debugger;

		// Get the start component and provider list
		let start = opt.StartupComponent;
		let sm: any;
		let providers: (ServiceBindingOptions | Constructor<any>)[];
		if (!Utility.IsNull(start)) {
			providers = Reflect.getOwnMetadata(Meta.ServiceProviders, start.Component[start.Name]);
			sm = start.Model;
		}

		// Create the app manager
		let am = new ApplicationManager(opt.Components, providers, start, sm, opt.Config);

		// Save the app manager to a global reference, if specified
		if (!Utility.IsNullOrBlank(opt.ManagerGlobalReference))
			window[opt.ManagerGlobalReference] = am;
	}
}

/**
 * Primary application entry point and manager.
 */
export class ApplicationManager {
	/**
	 * Reference to the app context.
	 * For a SPA, this would not exist within the manager.
	 */
	private _context: ApplicationContext;

	/**
	 * Collection of initially loaded components.
	 * For a SPA, this would not exist within the manager.
	 */
	private _components: IComponentModule[] = [];

	/** Application configuration. */
	public Config: Config;

	/** Service provider. */
	public Services: ServiceProvider;

	/**
	 * Creates a new ApplicationManager instance.
	 * @param {ComponentInfo[]} components - Collection of components loaded at launch.
	 * @param {ProviderCollection} providers - Collection of service provider bindings.
	 * @param {ComponentInfo} start - Optional start component.
	 * @param {any} startModel - Optional model passed to the start component.
	 */
	constructor(components: ComponentInfo[], providers: ProviderCollection, start?: ComponentInfo, startModel?: any, config?: Config) {
		//debugger;
		let mod = this;
		let util = Utility;

		// Create the service provider
		let services = mod.Services = new ServiceProvider(providers);

		// Set up config service, if it hasn't been already
		if (!services.HasService(Config)) {
			if (Utility.IsNull(config))
				services.Add(new TypeServiceDescriptor(Config, ScopeType.Singleton));
			else
				services.Add(new StaticServiceDescriptor(Config, config));
		}

		// Get the config
		mod.Config = services.Create<Config>(Config);

		// Instantiate the startup component, if specified
		if (!Utility.IsNull(start)) {
			let s = new start.Component[start.Name](startModel);
			if (!Utility.IsNullOrBlank(start.GlobalReference))
				window[start.GlobalReference] = s;
		}

		// Create the app context
		let ac = services.Create<ApplicationContext>(ApplicationContext);
		mod._context = ac;

		// If tracking is enabled, send the page view
		if (mod.Config.Core.Tracking.TrackingId) {
			//debugger;

			let track = mod.Config.Core.Tracking;

			// Create the tracker and handle the "ready" callback
			ga('create', track.TrackingId, 'auto');
			ga((tracker) => {
				//debugger;

				// [TODO] Track role and user type
				//if (track.RoleDimension)
				//	ga('set', track.RoleDimension, @@@);
				//if (track.UserTypeDimension)
				//	ga('set', track.UserTypeDimension, @@@);

				// Track the page view
				ga('send', 'pageview');
			});
		}

		// Go through the component queue
		for (let i = 0; i < components.length; i++) {
			//debugger;
			let ci = components[i];

			// Get the component name
			let cn = mod.GetComponentName(ci.Component, ci.Name);

			// Make sure it was found
			if (util.IsNullOrBlank(cn)) {
				alert("Unable to load component '" + name + "' (" + ci.Path + ").");
				return;
			}

			// Create the component
			let c: IComponentModule = mod.Services.Create<IComponentModule>(ci.Component[cn]);

			// Save a reference
			mod._components.push(c);

			// Assign it to a root (window) level variable
			let g: string = null;
			if (!util.IsNullOrBlank(ci.GlobalReference)) {
				// Save the value and overwrite the module property
				g = ci.GlobalReference;
				c.GlobalReference = g;
			} else if (!util.IsNullOrBlank(c.GlobalReference)) {
				// Save the value
				g = c.GlobalReference;
			}
			if (!util.IsNullOrBlank(g)) {
				if (util.IsNullOrBlank(window[g])) {
					window[g] = c;
				} else {
					alert("Global reference '" + g + "' already in use.");
					return;
				}
			}

			// Initialize the component
			// [TODO] Move initialize to its own loop (create all then initialize all)
			// [TODO] Create post-initialization methods/events (ApplicationManager and each component)?
			// [TODO] Add IsInitialized flag (root of State object)?
			c.Initialize(ci.Model);
		}
	}

	/**
	 * Discover the component name.
	 * @param {any} comp - Component wrapper module.
	 * @param {string} name - Component name.
	 * @returns {string} The resolved component name, if found, otherwise null.
	 */
	private GetComponentName(comp: any, name: string): string {
		let mod = this;

		if (!comp)
			return null;
		var n = comp["_EntryPoint"];
		if (n && mod.IsCtor(comp, n))
			return n;
		n = name + "Component";
		if (mod.IsCtor(comp, n))
			return n;
		n = name;
		if (mod.IsCtor(comp, n))
			return n;
		return null;
	}

	/**
	 * Determines if the specified key points to a constructor.
	 * @param {any} comp - Component wrapper module.
	 * @param {string} key - Item key within the component wrapper.
	 * @returns {boolean} True if the key points to a constructor, otherwise false.
	 */
	private IsCtor(comp: any, key: string): boolean {
		return comp[key] !== undefined && typeof comp[key] === "function";
	}
}

/**
 * Common application context.
 */
@Injectable(null, ScopeType.Singleton)
export class ApplicationContext {
	/** Reference to the user fetch Promise, if any. */
	private _userP: Promise<IUserInfo> = null;

	/** Current user information. */
	public User: IUserInfo = null;

	/** Event emitter for user changes. */
	public UserChanged: kendo.Observable; // @@@ Future: Wrap in EventEmitter<T> structure

	/** Application configuration. */
	public Config: Config;

	/** Common utility. */
	public Util = Utility;

	/** Query string parameters collection. */
	public Params: QsParams;

	/** Security service. */
	public Security: SecurityService;

	// @@@ Future:
	// Session cache
	// App storage (shared across running modules)
	// App Manager?
	// ServiceProvider?

	/**
	 * Creates a new ApplicationContext instance.
	 * @param {Config} config - Application configuration.
	 * @param {SecurityService} security - Security service.
	 */
	constructor(config: Config, security: SecurityService) {
		//debugger;
		let mod = this;

		// Save parameters
		mod.Config = config;
		mod.Security = security;

		// Set up events
		if (mod.Util.IsDefined(window, "kendo")) // @@@ NEED BETTER WRAPPER
			mod.UserChanged = new kendo.Observable();

		// Get the page parameters
		mod.Params = mod.Util.GetParameters();

		// Create a shell user
		mod.User = {
			IsValid: false,
			UserId: 0,
			Username: "",
			FirstName: "",
			LastName: "",
			Email: "",
			Roles: [],
			Privileges: [],
			ParticipantId: 0,
			IsImp: false
		};

		// Fetch the current user (async)
		mod.FetchUser();
	}

	/**
	 * Gets the current user info as a Promise.
	 * If the user is known, it will not fetch it again and the Promise will be immediately resolved.
	 * @returns {Promise<IUserInfo>} Promise that resolves to the user information.
	 */
	public GetUser(): Promise<IUserInfo> {
		let mod = this;

		// Outstanding promise, return that
		if (mod._userP != null) return mod._userP;
		// User not yet known, fetch it
		if (mod.User == null) return mod.FetchUser();
		// Return the known user
		return Promise.resolve(mod.User);
	}

	/**
	 * Fetches the user via a service, ignoring the cache.
	 * @returns {Promise<IUserInfo>} Promise that resolves to the user information.
	 */
	private FetchUser(): Promise<IUserInfo> {
		var mod = this;
		if (mod._userP == null) {
			mod._userP = mod.Security.CurrentUser()
				.then(result => {
					//debugger;
					// Save the result
					mod.User = result;
					// Trigger a change event
					// @@@ NEED BETTER WRAPPER					
					if (mod.Util.IsDefined(mod, "UserChanged"))
						mod.UserChanged.trigger("changed", new UserChangedEvent(result));
					// Clear the promise
					mod._userP = null;
					// Return the result
					return result;
				});
		}

		return mod._userP;
	}
}
