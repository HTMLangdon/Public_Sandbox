/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Shared utility functionality.
 * @module cp/util
 */

/**
 * Query string parameters collection.
 */
export class QsParams {
	/** Gets the count of parameters. */
	public Count: number = 0;
	/** Parameter values collection. */
	public Values: StringCollection = {};

	/**
	 * Get a query string parameter by name.
	 * If one is not found, a blank string will be returned.
	 * @param {string} name - Parameter name to fetch.
	 * @returns {string} Parameter value.
	 */
	public Get(name: string): string {
		let mod = this;
		let util = Utility;

		return util.ToSafeString(mod.Values[name.toLocaleLowerCase()]);
	}
}

/**
 * Complex control definition (meta-data).
 */
export class ComplexControlDef {
	/** Control ID. */
	Id: string;
	/** Control type name. */
	Type: string;

	constructor(id: string, type: string) {
		let mod = this;
		mod.Id = id;
		mod.Type = type;
	}
}

/**
 * Complex control wrapper.
 * @implements IComplexControl
 */
export class ComplexControl<T extends kendo.ui.Widget> implements ComplexControl<T> {
	constructor(public id: string, public type: string) {
		//let mod = this;
	}

	/** Gets the JQuery selector reference. */
	get item(): JQuery { return $("#" + this.id); }

	/**
	 * Gets the control reference.
	 * NOTE: Each call to this property incurs a small performance penalty, however maintaining a copy of the control is not recommended as it may change.
	 */
	get control(): T { return this.item.data(this.type); }
}

/**
 * Server control definition (meta-data).
 */
export class ServerControlDef {
	/** Control ID. */
	Id: string;

	/** Control friendly name. */
	Name: string;

	constructor(id: string, name: string) {
		let mod = this;
		mod.Id = id;
		mod.Name = name;
	}
}

/**
 * Server control wrapper.
 */
export class ServerControl<T extends Telerik.Web.UI.RadWebControl> {
	private _ref: T;
	private _item: JQuery;
	constructor(public id: string, public name: string) {
		let mod = this;
		//mod._ref = <T>$find(id);
		mod._item = $("#" + id);
		mod._ref = mod._item[0]["control"];
	}

	/** Gets the JQuery selector reference. */
	get item(): JQuery { return this._item; }

	/**
	 * Gets the control reference.
	 * NOTE: Each call to this property incurs a small performance penalty, however maintaining a copy of the control is not recommended as it may change.
	 */
	get control(): T { return this._ref; }
}

/**
 * Common strongly-typed event information.
 */
export class EventCommon<TS> {
	/** Cancels the default event, if possible. */
	preventDefault: Function;
	/** Gets the flag indicating if the default event activity is prevented (cancelled). */
	isDefaultPrevented: () => boolean;
	/** The event sender (origin). */
	sender: TS;
}

/**
 * Common strongly-typed event with additional data.
 */
export class DataEventCommon<TS, TD> extends EventCommon<TS> {
	/** Event data. */
	data: TD;

	constructor(data: TD) {
		super();
		this.data = data;
	}
}

/**
 * Information for Observable-triggered events.
 */
export class ObservableDataEvent<T> extends DataEventCommon<kendo.Observable, T> { }

/** Strongly typed key-value collection. */
export class KeyValueCollection<T> implements IKeyValueCollection<T> {
	[index: string]: T;
}

/**
 * Common utility class.
 */
export class Utility {
	private static qsParams: QsParams = null;
	private static state: any = {};

	/**
	 * Gets the current timestamp.
	 * It accounts for some variances in browser implementation.
	 * If the correct function is not found, a simple counter will be used.
	 * @returns number
	 */
	static GetTimestamp(): number {
		return Date.now();
	}

	/**
	 * Get query string (URL) parameters.
	 * @returns {QsParams} Query string parameters collection.
	 */
	public static GetParameters(): QsParams {
		let util = Utility;

		// *** Note: Does not handle the same parameter more than once on the same QS (which is possible) ***

		let pcol = new QsParams();

		let s = location.search;
		if (!s || s.length < 1)
			return pcol;
		let items = s.substring(1, s.length).split("&");

		let paramList = {};
		let pc = 0;
		for (let i = 0; i < items.length; i++) {
			//let item = items[i].trim();
			let item = util.Trim(items[i]);
			if (item.length > 0) {
				let ind = item.indexOf("=");
				if (ind > 0)
					//paramList[item.substring(0, ind).trim()] = ToSafeString(decodeURIComponent(item.substring(ind + 1, item.length)));
					paramList[util.Trim(item.substring(0, ind)).toLowerCase()] = util.ToSafeString(decodeURIComponent(item.substring(ind + 1, item.length)));
				else
					paramList[item.toLowerCase()] = "";
				pc++;
			}
		}
		pcol.Count = pc;
		pcol.Values = paramList;
		return pcol;
	}

	/**
	 * Get a query string parameter by name.
	 * If one is not found, a blank string will be returned.
	 * @param {string} name - Parameter name to fetch.
	 * @returns {string} Parameter value.
	 */
	static GetParameterByName(name: string): string {
		let util = Utility;

		if (util.qsParams == null)
			util.qsParams = util.GetParameters();
		if (util.qsParams.Count == 0)
			return "";
		return util.ToSafeString(util.qsParams.Values[name.toLowerCase()]);
	}

	/**
	 * Trims leading and trailing whitespace from a string.
	 * @param {string} source - Source string.
	 * @returns {string} Trimmed string.
	 */
	static Trim(source: string): string {
		let util = Utility;

		// Pass-through to jQuery.
		// Leave this function for compatibility.
		return $.trim(util.ToSafeString(source));
	}

	/**
	 * Reverse a string.
	 * @param {string} source - Source value.
	 * @returns {string} Reversed string.
	 */
	static Reverse(source: string): string {
		let util = Utility;

		let item = util.ToSafeString(source);
		let s = "";
		let i = item.length;
		while (i > 0) {
			s += item.substring(i - 1, i);
			i--;
		}
		return s;
	}

	/**
	 * Safely converts any value to a string.
	 * Undefined and null will be converted to a blank string.
	 * @param {any} source - Source value.
	 * @returns {string} A non-null string.
	 */
	static ToSafeString(source: any): string {
		let util = Utility;

		if (!util.IsDefined(source) || util.IsNullOrBlank(source)) return "";
		return source.toString();
	}

	/**
	 * Safely converts any value to a Boolean.
	 * Numbers will treat non-zero as true, zero as false.
	 * Strings of "true", "t", "yes", and "y" will be true, otherwise false.
	 * @param {boolean} source - Source value.
	 * @returns {boolean} Converted boolean value.
	 */
	static ToSafeBoolean(source: any): boolean {
		let util = Utility;

		if (typeof source == "boolean") return source;
		if (!util.IsDefined(source) || util.IsNull(source)) return false;
		if (isNaN(source)) {
			let s = source.toString().toLowerCase();
			return (s == "true" || s == "t" || s == "yes" || s == "y");
		} else
			return Number(source) != 0;
	}

	/**
	 * Safely converts any value to an Integer.
	 * @param {any} source - Source value.
	 * @param {number} defaultValue - Optional value to return if the item is not a number.  Default 0.
	 * @returns {number} Converted numeric value.
	 */
	static ToSafeInteger(source: any, defaultValue: number = 0): number {
		let util = Utility;

		if (util.IsNull(defaultValue) || isNaN(defaultValue) || util.IsNullOrBlank(defaultValue))
			defaultValue = 0;
		else
			defaultValue = Number(defaultValue);
		if (isNaN(defaultValue)) defaultValue = 0;

		if (util.IsNull(source) || isNaN(source) || util.IsNullOrBlank(source))
			return defaultValue;
		let n = Number(source);
		if (isNaN(n))
			return defaultValue;
		return n < 0 ? Math.ceil(n) : Math.floor(n);
	}

	/**
	 * Determines if an item is defined.
	 * @param {any} item - Item to check.
	 * @returns {boolean} True if the item is defined, otherwise false.
	 */
	static IsDefined(item: any): boolean;
	/**
	 * Determines if an item is defined.
	 * @param {any} parentObj - Parent object.
	 * @param {string} name - Child item name.
	 * @returns {boolean} True if the item is defined on the parent, otherwise false.
	 */
	static IsDefined(parentObj: any, name: string): boolean;
	/**
	 * Determines if an item is defined.
	 * @param {any} parentObj - Parent object.
	 * @param {string} name - Child item name to check. (Nullable on implementation overload only.)
	 * @returns {boolean} True if the item is defined on the parent, otherwise false.
	 */
	static IsDefined(parentObj: any, name?: string): boolean {
		// If "name" is not passed in, check the "parent object" as the object of interest
		if (name === undefined)
			return parentObj !== undefined;
		// If the parent object is undefined or null
		// (and we know name is defined, so it should be an object),
		// then "name" obviously cannot exist either
		if (parentObj === undefined || parentObj == null)
			return false;
		// Check for direct ownership
		// Doesn't work with inheritance
		if (parentObj.hasOwnProperty(name))
			return true;
		// Go through the properties
		for (let p in parentObj) {
			if (p == name)
				return true;
		}
		// If we've gotten this far, we didn't find it
		return false;
	}

	/**
	 * Determines if an item is null or undefined.
	 * @param {any} source - Source value.
	 * @returns {boolean} True if the value is null or undefined, otherwise false.
	 */
	static IsNull(source: any): boolean {
		let util = Utility;

		if (util.IsDefined(source) && source !== null) return false;
		return true;
	}

	/**
	 * Determines if an item is null, blank, or undefined.
	 * @param {any} source - Source value.
	 * @returns {boolean} True if the value is null, blank, or undefined, otherwise false.
	 */
	static IsNullOrBlank(source: any): boolean {
		let util = Utility;

		if (typeof source === "string")
			return source.length == 0;
		if (!util.IsDefined(source) || util.IsNull(source))
			return true;
		return source.toString().length == 0;
	}

	/**
	 * Determines if an item is a function.
	 * If the item is a string and evaluates as a function name, it will also return true.
	 * @param {any} source - Source value
	 * @returns {boolean} True if the value is a function, otherwise false.
	 */
	static IsFunction(source: any): boolean {
		let util = Utility;

		// See if it is an actual function
		if (typeof source === "function") return true;

		// See if it is null or an object
		//if (util.IsNull(item) || _.isObject(item) || _.isArray(item)) return false;
		if (util.IsNull(source)) return false;

		// Convert to a string
		let fn = util.ToSafeString(source);

		// Blank strings are obviously not functions
		if (fn == "") return false;

		// See if it is a string representing a function
		try {
			return eval("typeof " + fn) === "function";
		}
		catch (err) {
			// (nothing)
		}
		return false;
	}

	/**
	 * Determines if an item is an array.
	 * This is a safer check than the built-in function (Array.isArray) when dealing with observables.
	 * @param {any} source - Source value.
	 */
	static IsArray(source: any): boolean {
		// Note: This is a safer check than the built-in function (Array.isArray) when dealing with observables
		if (source === undefined || source === null) return false;

		if (typeof source === "object") {
			if (source["length"] !== undefined && typeof source.length === "number")
				return true;
		}
		return false;
	}

	/**
	 * Determines if an array has data.
	 * @param {any[]} source - Source array.
	 * @returns {boolean} True if the source is an array, not null, and has at lease one item, otherwise false.
	 */
	static HasData(source: any[]): boolean {
		let util = Utility;

		if (util.IsNull(source))
			return false;
		return source.length > 0;
	}

	/**
	 * Gets a property by name from the parent object (parentObj).
	 * If the property does not exist, a new property will be created.
	 * If defaultValue is not specified, the new value will be null.
	 * @param {any} parentObj - Parent object.
	 * @param {string} name - Property name for the child.
	 * @param {any} defaultValue - Optional default value if the child property is not found.
	 * @returns {any} The child property value, or defaultValue if the property was not found.
	 */
	static GetOrCreate(parentObj: any, name: string, defaultValue?: any): any {
		let util = Utility;

		if (util.IsNull(parentObj))
			throw "Parent object is required.";
		if (util.IsNullOrBlank(name))
			throw "Property name is required.";
		if (defaultValue === undefined)
			defaultValue = null;
		if (!util.IsDefined(parentObj, name))
			parentObj[name] = defaultValue;
		return parentObj[name];
	}

	/**
	 * Hides one or more controls.
	 * Each item to be affected should be of type JQuery or ComplexControl.
	 * @param {any} controls - Collection of controls.
	 * @param {string[]} list - List of control names.
	 */
	static HideControls(controls: any, list: string[]): void {
		let util = this;

		if (!util.HasData(list)) return;

		for (let i = 0; i < list.length; i++) {
			//controls[list[i]].hide();
			let c = controls[list[i]];

			//if (typeof (c["control"]) == "function")
			if (c instanceof ComplexControl)
				c.control.wrapper.hide();
			else
				c.hide();
		}
	}

	/**
	 * Shows one or more controls.
	 * Each item to be affected should be of type JQuery or ComplexControl.
	 * @param {any} controls - Collection of controls.
	 * @param {string[]} list - List of control names.
	 */
	static ShowControls(controls: any, list: string[]): void {
		let util = this;

		if (!util.HasData(list)) return;

		for (let i = 0; i < list.length; i++) {
			//controls[list[i]].show();
			let c = controls[list[i]];

			//if (typeof (c["control"]) == "function")
			if (c instanceof ComplexControl)
				c.control.wrapper.show();
			else
				c.show();
		}
	}

	/**
	 * Hides and shows one or more controls specified by separate lists.
	 * Each item to be affected shoul dbe of type JQuery or ComplexControl.
	 * @param {any} controls - Collection of controls.
	 * @param {string[]} hideList - List of control names to hide. This may be null or empty.
	 * @param {string[]} showList - List of control names to show. This may be null or empty.
	 */
	static HideShowControls(controls: any, hideList?: string[], showList?: string[]): void {
		let util = this;

		//debugger;
		util.HideControls(controls, hideList);
		util.ShowControls(controls, showList);
	}

	/**
	 * Create an observable object from a model.
	 * NOTE: Currently a wrapper for Kendo, but retain in case that changes.
	 * @param {any} model - Source model to convert.
	 * @returns {T} Model instance converted to an observable.
	 */
	static CreateObservable<T extends Observable>(model: any): T {
		return <T>kendo.observable(model);
	}

	/**
	 * Bind a model to the page starting at a root/base element.
	 * NOTE: Currently a wrapper for Kendo, but retain in case that changes.
	 * @param {JQuery} rootElement - Root/base element to bind to. Sub-controls will be parsed and bound as needed.
	 * @param {any} model - Model to bind.
	 */
	static BindModel(rootElement: JQuery, model: any): void {
		kendo.bind(rootElement, model);
	}

	/**
	 * Build a query string based on a model.
	 * This is often used for server-side filtering or property specification.
	 * @param {any} model - Model to interrogate.
	 * @returns {string} Query string representation of the model.
	 */
	static BuildModelQS(model: any): string {
		let qs = "";

		if (!Utility.IsNull(model)) {
			// Go through the model data and convert it to query string parameters
			for (let pn in model) {
				let v = Utility.ToSafeString(model[pn]);
				if (!Utility.IsNullOrBlank(v) && !Utility.IsFunction(v))
					qs += "&" + pn + "=" + encodeURIComponent(v);
			}
			if (qs.length > 0)
				qs = "?" + qs.substring(1, qs.length);
		}
		return qs;
	}

	/**
	 * Safely add one or more items to an existing array. If the "add" parameter is null, it will not throw an error.
	 * @param source - Source array.
	 * @param add - Array to add to the source.
	 */
	static AddRange(source: any[], add: any[]) {
		if (add && add.length > 0) {
			//source.addRange(source, add); // not supported
			for (let i = 0; i < add.length; i++) {
				source.push(add[i]);
			}
		}
	}

	/**
	 * Traverse a source object and convert all app-relative paths ("~/") to site-absolute paths.
	 * @param {object} src - Source object.
	 * @param {CoreConfig} config - Application core config.
	 */
	static CleanPaths(src: object, config: CoreConfig): void {
		let mod = this;

		for (let key in src) {
			let value = src[key];
			let type = typeof value;
			
			if (type === "object") {
				mod.CleanPaths(value, config);
			} else if (type === "string") {
				if (value && value.length > 1) {
					// [TODO] What if assets aren't in "/assets"? We don't have a config with both before and after cache busting
          src[key] = src[key]["replaceAll"]('~/assets/', config.AssetsRoot + '/'); // Not ideal to always apply to all strings.
					if (value.substring(0, 9) == '~/assets/')
						src[key] = config.AssetsRoot + value.substring(8); // 8 chars instead of 9 to keep the slash
					else if (value && value.length > 1 && value.substring(0, 2) == '~/')
						src[key] = config.SiteRoot + value.substring(2);
				}
			}
		}
	}

	/**
	 * Format a value according to a format string.
	 * @param {any} value - Source value.
	 * @param {string} format - Optional format string.
	 */
	static Format(value: any, format?: string): string {
		let mod = this;

		// See if a format string was specified
		if (format)
			// Pass-through (abtraction) for Kendo
			return kendo.toString(value, format);
		kendo.format
		// Handle nulls/undefined
		if (mod.IsNull(value))
			return '';
		return value.toString();
	}

	/**
	 * Format a string replacing tokens with one or more values.
	 * @param {string} format - Format string to parse.
	 * @param {any[]} values - One or more values to replace tokens in the format string.
	 */
	static FormatString(format: string, ...values: any[]): string {
		let mod = this;

		// Pass-through to Kendo
		// This function is used to abstract the use of Kendo
		return kendo.format(format, values);
	}

	/**
	 * Convert date/time properties from strings into Date objects.
	 * Conversions are done in-place, overwriting the original values.
	 * The process operates recursively.
	 * @param {any} source - Source object to convert.
	 */
	static ConvertDatesByName(source: any): void {
		let mod = this;

		// Short-circuit certain types and values
		if (source === undefined || source === null || source === "" || (typeof source !== "object" && typeof source !== "string")) return source;

		// Handle arrays separately
		if (mod.IsArray(source)) {
			for (let i = 0; i < source.length; i++) {
				let v = source[i];
				if (typeof v === "object" && v !== undefined && v !== null) {
					mod.ConvertDatesByName(v);
					source[i] = v;
				}
			}
			return;
		}

		// Go through each property
		for(let key in source) {
			let value = source[key];

			// Skip undefined and null
			if (value === undefined || value === null) continue;

			if (typeof value === "object") {
				// Recursive call for objects
				mod.ConvertDatesByName(value);
			} else if (typeof value === "string") {
				// For strings, check the key name
				let k = key.toLowerCase();
				if (k.length >= 4) {
					// Look at the end of the string (last 4 chars)
					let s = k.substring(k.length - 4, k.length);
					if (s == "date" || s == "time") {
						// Try to convert the value
						try {
							let d = new Date(value);
							if (!isNaN(d.getTime()))
								source[key] = d;
						} catch (exp) {
							// Nothing; leave the value alone
						}
					}
				}
			}
		}
	}
}
