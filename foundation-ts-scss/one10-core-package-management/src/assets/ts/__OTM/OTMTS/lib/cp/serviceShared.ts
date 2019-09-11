/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Shared functionality for data services.
 * @module cp/serviceShared
 */

/****************************************************************************
Notes & To-Do:

- FIX!: JSONP/callback services broken with module pattern change.
- TEST: WebMethod "service" types. Might be broken with module pattern change.
- Should MaxTries be split into errors vs. timeouts?
- Why do we always return "data" as a string from jsonp calls?
	- Is it difficult/messy to return objects?
	- Is it so we can return different objects (custom model vs. error info)?
- Add more validation in public functions and callbacks.
	- How do we notify the parent/caller and/or the server on errors?
****************************************************************************/

import { Module } from './moduleShared';
import { MenuItem } from './securityShared';
import { Utility } from './util';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { IKeyValueCollection } from 'bsp/services/commonService';

/**
 * Service constants and defaults.
 */
export class ServiceConstants {
	/** Web service method types. */
	static Method = { Get: "GET", Post: "POST", Put: "PUT", Delete: "DELETE" };
	/** Web service types. */
	static ServiceType = { WebApi: "api", WebMethod: "wm" };
	/** Numeric service status codes. */
	static ServiceStatusCode = { Success: 200, Other: 500, Unauthorized: 401, Forbidden: 403, NotFound: 404 };
	/** Service status messages. */
	static ServiceStatusMessage = { Success: "success", Other: "See result code.", Unauthorized: "Resource requires authentication.", Forbidden: "Access to the resource is forbidden.", NotFound: "Resource not found." };
	/** Service return types. */
	static ReturnType = { Normal: "normal", Callback: "callback" };
	/** Numeric service response codes. */
	static ResponseCode = { Unknown: 0, Success: 1, Error: 2, BadRequest: 3, Timeout: 4, TriesExceeded: 5, Discarded: 6, Unauthorized: 7, NotFound: 8, LockedOut: 9, Expired: 10, AccessDenied: 11, LoggedOut: 10000 };
	/** Service response messages. */
	static ResponseMessage = {
		Unknown: "Unknown",
		Success: "Success",
		Error: "One or more errors occurred",
		BadRequest: "Invalid request",
		Timeout: "Request timed out",
		TriesExceeded: "Maximum number of tries exceeded",
		Discarded: "Call discarded",
		Unauthorized: "Unauthorized request",
		NotFound: "Item not found",
		AccessDenied: "Access denied",
		LoggedOut: "User logged out"
	};
	/** Default queue name. This does not imply that queues are used by default. */
	static DefaultQueue = "default";
	/** Value used to indicate if a service call should be discarded. */
	static DiscardCall = { DiscardServiceCall: true };
	/** Value used to indicate no data should be sent to a service call. */
	static NoData = null;
}

/**
 * Web service error response.
 */
export class WsError {
	/** Error code. */
	public Code: string;
	/** Error description. */
	public Description: string;

	constructor(code?: string, description?: string) {
		let mod = this;
		mod.Code = code;
		mod.Description = description;
	}
}

/**
 * Web service response information.
 */
export class WsResponse { // @@@ Merge with ResponseData and have "WsResponse<Empty>" or "WsResponse<{}>" ?
	//public CallId?: number;

	/**
	 * Numeric status code. This generally equates to HTTP status codes (200, etc.)
	 * This code does not reflect the response to the action (e.g., success, not found, access denied).
	 * @see ResponseCode
	 */
	public StatusCode: number = ServiceConstants.ServiceStatusCode.Other;
	/** Status message. */
	public Status: string = ServiceConstants.ServiceStatusMessage.Other;
	/** Numeric response message. */
	public ResponseCode: number = ServiceConstants.ResponseCode.Unknown;
	/** Resource key associated with the response message. */
	public ResponseKey: string;
	/** Response message. */
	public ResponseMessage: string = ServiceConstants.ResponseMessage.Unknown;

	/** Collection of errors. This may be empty. NOTE: This property will be deprecated. */
	public Errors: WsError[];

	/**
	 * Create a standard "success" response.
	 * @returns {WsResponse} Success response instance.
	 */
	public static Success(): WsResponse {
		return new WsResponse(
			ServiceConstants.ServiceStatusCode.Success, ServiceConstants.ServiceStatusMessage.Success,
			ServiceConstants.ResponseCode.Success, ServiceConstants.ResponseMessage.Success
		);
	}

	/**
	 * Create an instance of a service response.
	 * @param {number} statusCode - Optional status code. Default "ServiceConstants.ServiceStatusCode.Other".
	 * @param {string} status - Optional status message. Default "ServiceConstants.ServiceStatusMessage.Other".
	 * @param {number} responseCode - Optional response code. Default "ServiceConstants.ResponseCode.Unknown".
	 * @param {string} responseMessage - Optional response message. Default "ServiceConstants.ResponseMessage.Unknown".
	 * @param {WsError[]} errors - Optional error collection.
	 */
	constructor(statusCode?: number, status?: string, responseCode?: number, responseMessage?: string, errors?: WsError[]) {
		let mod = this;

		if (statusCode != null)
			mod.StatusCode = statusCode;
		if (status != null) // @@@ base message off of code when status is null (same for response); need a way to automate matching (success->success, etc.)
			mod.Status = status;
		if (responseCode != null)
			mod.ResponseCode = responseCode;
		if (responseMessage != null)
			mod.ResponseMessage = responseMessage;
		if (errors != null)
			mod.Errors = errors;
	}
}

/**
 * Web service response information with associated returned data.
 */
export class WsResponseData<T> extends WsResponse {
	/** Response data. */
	public Data: T;

	/**
	 * Create a standard "success" response.
	 * @param {T} data - Response data.
	 * @returns {WsResponseData<T>} Success response instance.
	 */
	public static SuccessData<T>(data: T): WsResponseData<T> {
		return new WsResponseData<T>(
			data,
			ServiceConstants.ServiceStatusCode.Success, ServiceConstants.ServiceStatusMessage.Success,
			ServiceConstants.ResponseCode.Success, ServiceConstants.ResponseMessage.Success
		);
	}

	/**
	 * Create an instance of a service response.
	 * @param {T} data - Optional data associated with the response.
	 * @param {number} statusCode - Optional status code. Default "ServiceConstants.ServiceStatusCode.Other".
	 * @param {string} status - Optional status message. Default "ServiceConstants.ServiceStatusMessage.Other".
	 * @param {number} responseCode - Optional response code. Default "ServiceConstants.ResponseCode.Unknown".
	 * @param {string} responseMessage - Optional response message. Default "ServiceConstants.ResponseMessage.Unknown".
	 * @param {WsError[]} errors - Optional error collection.
	 */
	constructor(data?: T, statusCode?: number, status?: string, responseCode?: number, responseMessage?: string, errors?: WsError[]) {
		super(statusCode, status, responseCode, responseMessage, errors);
		let mod = this;

		// If data is passed in, consider a success
		if (data != null) {
			mod.StatusCode = ServiceConstants.ServiceStatusCode.Success;
			mod.Status = ServiceConstants.ServiceStatusMessage.Success;
			mod.ResponseCode = ServiceConstants.ResponseCode.Success;
			mod.ResponseMessage = ServiceConstants.ResponseMessage.Success;
		}

		mod.Data = data;
	}
}

/**
 * Internal class used to handle invalid service responses.
 */
class InvalidServiceResponse extends WsResponseData<any> {

	constructor(responseCode: number, responseMessage: string, callInfo: ICallInfo, statusCode: number = ServiceConstants.ServiceStatusCode.Other, statusMessage: string = ServiceConstants.ServiceStatusMessage.Other) {
		super(null, null, responseMessage, responseCode);

		let mod = this;
		let constants = ServiceConstants;

		let data = {
			Queue: callInfo.Queue,
			Timeout: callInfo.Timeout,
			MaxTries: callInfo.MaxTries,
			CallId: callInfo.CallId,
			TryCount: callInfo.CallId
		};

		// Set passed-in values
		mod.ResponseCode = responseCode;
		mod.ResponseMessage = responseMessage;
		mod.Data = data;
		//mod.Status = constants.ServiceStatusMessage.Other;
		//mod.StatusCode = constants.ServiceStatusCode.Other;
		mod.Status = statusMessage;
		mod.StatusCode = statusCode;
		mod.Errors = [];
	}
}

/**
 * Service callback data.
 * NOTE: This is an internal construct.
 */
interface WsCallbackData {
	CallId: number;
	StatusCode: number;
	Status: string;
	Data?: any;
}

//export interface JsonpResponse extends WsResponseData<any> {
//	CallId: number;
//	//Data?: any;
//}

export interface MockTypeMap {
	id: number;
	values: number[];
}

/**
 * Service queue collection.
 * NOTE: This is an internal construct.
 */
interface IServiceQueueCollection {
	[index: string]: IServiceQueue;
}

/**
 * Service queue information.
 * NOTE: This is an internal construct.
 */
interface IServiceQueue {
	CurrentCall?: ICallInfo;
	Items: ICallInfo[];
}

/**
 * Service queue information.
 * NOTE: This is an internal construct.
 */
class ServiceQueue implements IServiceQueue {
	CurrentCall?: ICallInfo = null;
	Items: ICallInfo[] = [];
}

/**
 * Service call information.
 */
export interface ICallInfo {
	CallId?: number;
	TID?: number;
	Data?: any;
	Queue?: string;
	TryCount?: number;
	MaxTries?: number;
	Timeout?: number;
	Resolve?(response: WsResponse): void;
	Reject?(error?: any): void;
	EndPoint: string;
	ServiceType?: string;
	Method: string;
	ReturnType?: string;
	Promise?: Promise<any>;
	ParseDates?: boolean;
}

/**
 * Service call metadata collection.
 * NOTE: This is an internal construct.
 */
interface ICallInfoCollection {
	[index: string]: ICallInfo;
}

/**
 * Service call default information.
 * NOTE: This is an internal construct.
 */
interface ServiceDefaults {
	Method: string;
	ServiceType: string;
	ReturnType: string;
	Queue: any;
	Timeout: number;
	MaxTries: number;
}

/**
 * Service manager model.
 * NOTE: This is an internal construct.
 */
interface ServiceManagerModel { }

/**
 * Service manager configuration.
 * NOTE: This is an internal construct.
 */
interface ServiceManagerConfig extends ComponentConfig {
	GlobalVarBase: string;
	ServiceVarBase: string;
	ExplicitCallbackName: string;
	ExplicitServiceCallback: string;
	ServiceDefaults: ServiceDefaults;
}

/**
 * Service manager state.
 * NOTE: This is an internal construct.
 */
interface ServiceManagerState extends ComponentState<any> { }

/**
 * Service manager module.
 */
@AutoInit()
@Injectable(null, ScopeType.Singleton)
export class ServiceManager extends Module {
	/** Module configuration. */
	public Config: ServiceManagerConfig;

	/** Service call queue collection. */
	private queues: IServiceQueueCollection = {};
	/** Collection of all pending service calls. */
	private allCalls: ICallInfoCollection = {};
	/** Number of pending service calls. */
	private callCount: number = 0;
	/** Service call ID sequence (latest ID). */
	private callId: number = 0;

	/**
	 * Create an instance of the service manager module.
	 */
	constructor() {
		// Call the parent
		super("ServiceManager");

		let mod = this;
		let config = mod.Config;
		let constants = ServiceConstants;

		// Global/root variable.
		config.GlobalVarBase = "One10";
		
		// Variable name for service-related functionality. This is located underneath the root variable.
		config.ServiceVarBase = "Service";

		// Function name for explicit (JSONP) callbacks.
		config.ExplicitCallbackName = "JsonPCallback";
		
	}

	/**
	 * Initialize the component.
	 */
	public Initialize() {
		super.Initialize();

		let mod = this;
		let config = mod.Config;
		let util = mod.Util;
		let constants = ServiceConstants;
		
		mod.WriteLog("Initialize.");

		// debugger;
		// Default service values.
		config.ServiceDefaults =
			{
				Method: constants.Method.Get,
				ServiceType: constants.ServiceType.WebApi,
				ReturnType: constants.ReturnType.Normal,
				//Queue: constants.DefaultQueue, // Default: Queued on default queue
				Queue: null,
				Timeout: mod.AppConfig.Core.ServiceTimeout,
				MaxTries: 1 // @@@ Max tries total? Need diff settings for timeouts vs errors? Setting to sleep between calls?
			};

		// Need to expose the JSONP callback as a global/public
		// Place it at the window level since strict mode doesn't allow undeclared variable assignment
		// Save the final, full reference path for efficiency.

		// @@@ What are these doing?  They were here, but until autoInit was implemented for DI, these were never being called
		//let gb = util.GetOrCreate(window, config.GlobalVarBase, {});
		//let sb = util.GetOrCreate(gb, config.ServiceVarBase, {});
		//config.ExplicitServiceCallback = config.GlobalVarBase + "." + config.ServiceVarBase + "." + config.ExplicitCallbackName;
	}

	// ---------------------------------------------------------------------------
	// Public methods
	// ---------------------------------------------------------------------------

	/**
	 * Gets or sets the default service configuration.
	 * @param {anyServiceDefaults} data - Optional configuration information. If omitted, the current configuration will be returned.
	 * @returns {ServiceDefaults} Updated configuration, if "data" specified, otherwise the current configuration.
	 */
	// @@@ Consider making this a property with getter/setter. (Make sure getter returns a copy.)
	public Configure(data?: ServiceDefaults): ServiceDefaults {
		//debugger;
		let mod = this;
		let config = mod.Config;
		let util = mod.Util;

		mod.WriteLog("Configure.");

		if (!util.IsNull(data)) {
			// Validate passed-in settings
			// @@@ TO DO

			// Update values
			$.extend(config.ServiceDefaults, data);
		}

		// Return a copy of the config
		return <ServiceDefaults>$.extend(false, {}, config.ServiceDefaults);
	}

	/**
	 * Make a service call.
	 * NOTE: At the time of initiating, the returned type is an empty/anonymous Promise. The resolved data may be a different type.
	 * @param {ICallInfo} callInfo - Service call information.
	 * @returns {Promise<{}>} Asyncronous promise.
	 */
	MakeServiceCall(callInfo: ICallInfo): Promise<any> {
		//debugger;
		let mod = this;
		let config = mod.Config;
		let util = mod.Util;
		let constants = ServiceConstants;
		
		//mod.WriteLog("Make service call.");

		// Package the call
		let sc: ICallInfo = <ICallInfo> $.extend(false, {}, config.ServiceDefaults, callInfo);

		// Set some base values
		// Do this outside of "extend" because we need to control them
		sc.CallId = ++mod.callId;
		sc.TryCount = 0;
		sc.TID = 0;

		// Set up and save the promise
		let p = new Promise((resolve, reject) => {
				// Save callback references
				sc.Resolve = resolve;
				sc.Reject = reject;
			}
		);

		// Attach it to the call info
		sc.Promise = p;

		// @@@ JSONP TEMPORARILY REMOVED
		// Need to test after converting to use promises.
		if (callInfo.ReturnType == constants.ReturnType.Callback) {
			throw "Callback/JSONP not currently supported.";
		}

		mod.WriteLog("Make service call: " + sc.CallId.toString());

		// See if the call is queueable
		if (!util.IsNullOrBlank(sc.Queue)) {
			// Get the queue
			let q = mod.GetQueue(sc.Queue, true);

			// If there is a current call, add the new call to the queue and end
			if (!util.IsNull(q.CurrentCall)) {
				mod.WriteLog("Adding call to queue: " + sc.CallId.toString());
				q.Items.push(sc);
				return p;
			}
		}

		// Make the call
		mod.CallRemoteService(sc);
		return p;
	}

	/**
	 * Gets the number of pending calls.
	 * @param {string} queue - Optional queue name. If not specified, all queues and non-queued calls will be counted.
	 * @returns {number} Number of pending calls.
	 */
	public PendingCallCount(queue?: string): number {
		//debugger;
		let mod = this;
		let util = mod.Util;
		let queues = mod.queues;

		if (util.IsNullOrBlank(queue)) {
			// Get current call list
			let c = mod.callCount;

			// Go through the queues and get their counts
			// Do not count current call since it was in "allCalls"
			for (let qn in queues) {
				c += queues[qn].Items.length;
			}

			return c;
		} else {
			// Get the queue
			let q = mod.GetQueue(queue, false);
			// No queue or current item, then zero
			if (q == null || q.CurrentCall == null) return 0;
			// Item list length plus one for the current call (assumed)
			return q.Items.length + 1;
		}
	}

	// ---------------------------------------------------------------------------
	// Private methods
	// ---------------------------------------------------------------------------

	/**
	 * Gets a queue by name. If not found, either return null or create one depending on 'autoCreate' parameter.
	 * @param {string} name - Queue name.
	 * @param {boolean} autoCreate - Optional flag indicating if the queue should be created if it is not found. Default "false".
	 * @returns {IServiceQueue} Specified queue. If not found and autoCreate is false, null is returned.
	 */
	private GetQueue(name: string, autoCreate: boolean = false): IServiceQueue {
		let mod = this;
		let queues = mod.queues;
		let util = mod.Util;

		// See if the queue exists
		if (!util.IsDefined(queues[name])) {
			if (util.ToSafeBoolean(autoCreate))
				// Create a new one
				queues[name] = new ServiceQueue();
			else
				// Not found, so null
				return null;
		}

		return queues[name];
	}

	/**
	 * Executes the next service call in the queue, if any.
	 * @param {string} queue - Queue name.
	 * @returns {number} CallId. 0 if none.
	 */
	private NextServiceCall(queue: string): number {
		//debugger;
		let mod = this;
		let util = mod.Util;

		// Get the queue
		let q = mod.GetQueue(queue, false);

		// See if there are pending calls and we're not already waiting on a response
		if (q == null || q.Items.length == 0) {
			mod.WriteLog("Queue is empty.");
			return 0;
		}
		if (q.CurrentCall != null) {
			// This shouldn't happen
			mod.WriteLog("Cannot dequeue. Still waiting on a call.");
			return 0;
		}

		// Pull from the queue
		let sc = q.Items.shift();

		mod.WriteLog("Call " + sc.CallId.toString() + " pulled from queue '" + queue + "'.");

		// Make the call
		mod.CallRemoteService(sc);
		return sc.CallId;
	}

	/**
	 * Call a remote service.
	 * @param {ICallInfo} callInfo - Service call information.
	 * @returns {number} CallId being executed, if any, otherwise 0.
	 */
	private CallRemoteService(callInfo: ICallInfo): number {
		//debugger;
		let mod = this;
		let config = mod.Config;
		let util = mod.Util;
		let allCalls = mod.allCalls;
		let constants = ServiceConstants;

		let retVal = 0;

		// Check data; call method if needed
		let data = util.IsFunction(callInfo.Data) ? callInfo.Data() : callInfo.Data;

		// See if there is data. If not, the call will be discarded.
		// Note: undefined, blank, and null are not conditions for discarding the call.
		//if (isNaN(data) && data !== undefined) {
		//if (util.IsDefined(data) && !util.IsNull(data)) {
		if (data === constants.DiscardCall) {
			// See if this item is part of a queue
			if (util.IsNullOrBlank(callInfo.Queue)) {
				mod.WriteLog("Call " + callInfo.CallId.toString() + " discarded.");
			} else {
				mod.WriteLog("Call " + callInfo.CallId.toString() + " discarded. Processing next call in queue '" + callInfo.Queue + "'.");

				// Call the next item in the queue
				retVal = mod.NextServiceCall(callInfo.Queue);
			}

			// End
			// Services always resolve, even on error
			callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.Discarded, constants.ResponseMessage.Discarded, callInfo));
			return retVal;
		}

		// Increment try counter
		callInfo.TryCount++;

		// Check try counter
		if (callInfo.TryCount > callInfo.MaxTries) {
			//debugger;

			// Notify that tries exceeded
			mod.WriteLog("Service call " + callInfo.CallId.toString() + " exceeded number of tries.");
			callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.TriesExceeded, constants.ResponseMessage.TriesExceeded, callInfo));

			// Get the queue
			let q = mod.GetQueue(callInfo.Queue);
			if (!util.IsNull(q)) {
				// Remove the current item
				q.CurrentCall = null;

				// Call the next item in the queue
				return mod.NextServiceCall(callInfo.Queue);
			}
			return 0;
		}

		// Set up the actual call
		let ci: JQueryAjaxSettings = {
			url: callInfo.EndPoint,
			timeout: 0 // we will handle our own timeouts
		};

		if (callInfo.ReturnType == constants.ReturnType.Normal) {
			ci.method = callInfo.Method;
			ci.dataType = "json";
			ci.contentType = "application/json";
			ci.data = data;
			if (callInfo.Timeout > 0) ci.timeout = callInfo.Timeout;
		} else {
			ci.method = "GET";
			ci.dataType = "jsonp";
			ci.data = { CallId: callInfo.CallId, Data: util.IsNull(data) ? "" : data };
			ci.jsonpCallback = config.ExplicitServiceCallback;
		}

		// Save the current call info
		allCalls[callInfo.CallId] = callInfo;
		mod.callCount++;
		if (!util.IsNullOrBlank(callInfo.Queue)) {
			let q = mod.GetQueue(callInfo.Queue, false);
			// @@@ Need to check for current call != null ??
			q.CurrentCall = callInfo;
		}

		// Make the call, wiring in the callbacks
		let p = $.ajax(ci)
			.then(
			function (result, status, xhr) { mod.NormalServiceCallback(callInfo, result, status, xhr) },
			function (xhr, status, errorString) { mod.NormalServiceCallback(callInfo, errorString, status, xhr) }
			);

		// Set the timer, but only on Callback/JSONP
		if (callInfo.ReturnType == constants.ReturnType.Callback && callInfo.Timeout > 0)
			callInfo.TID = setTimeout(mod.ServiceCallTimeout, callInfo.Timeout, callInfo);

		return callInfo.CallId;
	}

	/**
	 * Callback for service calls that timeout.
	 * @param {ICallInfo} callInfo - Service call information.
	 */
	private ServiceCallTimeout(callInfo: ICallInfo): void {
		//debugger;
		let mod = this;
		let util = mod.Util;
		let allCalls = mod.allCalls;
		let constants = ServiceConstants;

		// Defaults
		let callId = callInfo.CallId;

		// Look for the call
		let ci = allCalls[callId];

		// See if the call is still valid
		if (util.IsNull(ci)) {
			mod.WriteLog("Service Timeout - Unknown Call:" + callId.toString());
			// @@@ Notify parent? Send something to the server?
			return;
		}

		// If the call is part of a queue, check the current service call
		if (!util.IsNullOrBlank(ci.Queue)) {
			// Get the queue
			let q = mod.GetQueue(ci.Queue, false);

			// If the queue doesn't have a current call or the call IDs don't match, discard this timeout
			if (q.CurrentCall == null || callId != q.CurrentCall.CallId) {
				mod.WriteLog("Service Timeout - Not Current Call: " + callId.toString());
				// @@@ Notify parent? Send something to the server?

				// Remove the call from the master list
				delete allCalls[callId];
				mod.callCount--;

				return;
			}
		}

		mod.WriteLog("Service Retry - Timeout: " + callId.toString());

		// Retry the call
		mod.CallRemoteService(callInfo);

		// Resolve the promise, indicating the timeout
		// @@@ Need to differentiate timeout vs. error
		callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.Timeout, constants.ResponseMessage.Timeout, callInfo));
	}

	/**
	 * Handles explicit (jsonp) service callbacks.
	 * Passthrough to ServiceCallbackCommon return value.
	 * @param {WsCallbackData} data - Data returned from the service call. It should conform to the internal "JsonPData" object structure.
	 */
	private ExplicitServiceCallback(data: WsCallbackData): void {
		//debugger;
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(data)) {
			mod.WriteLog("Invalid service callback.");
			return;
		}

		mod.WriteLog("Service Callback: " + data.CallId.toString());

		// If data was sent back, convert it to an object
		// @@@ Why do we return a string? Why not return an object? Make this configurable?
		if (!util.IsNullOrBlank(data.Data))
			data.Data = JSON.parse(data.Data);

		// Pass-through
		mod.ServiceCallbackCommon(data.CallId, data);
	}

	/**
	 * Handles normal (ajax) service callbacks.
	 * Passthrough to ServiceCallbackCommon return value.
	 * @param {ICallInfo} callInfo - Service call information.
	 * @param {any} result - Data returned from the service. For errors, this will be the error string.
	 * @param {string} status - Text value of the status [success/error].
	 * @param {JQueryXHR} xhr - Request information.
	 */
	private NormalServiceCallback(callInfo: ICallInfo, result: any, status: string, xhr: JQueryXHR): void {
		//debugger;
		let mod = this;
		let util = mod.Util;

		// Validate the call.
		if (util.IsNull(callInfo)) {
			mod.WriteLog("Invalid service callback.");
			return null;
		}

		mod.WriteLog("Service Callback: " + callInfo.CallId.toString());

		// Pass-through
		// Wrap the data and add a few things to be consistent
		// @@@ Make the creation of the 2nd argument use a function or ctor
		return mod.ServiceCallbackCommon(callInfo.CallId, { Data: result, Status: status, StatusCode: xhr.status, CallId: callInfo.CallId });
	}

	/**
	 * Common service callback for both normal and explicit types.
	 * @param {number} callId - Service call ID.
	 * @param {WsCallbackData} returnData - Data returned from the service.
	 */
	private ServiceCallbackCommon(callId: number, returnData: WsCallbackData): void {
		//debugger;
		let mod = this;
		let util = mod.Util;
		let allCalls = mod.allCalls;
		let constants = ServiceConstants;

		// Defaults
		let callNext = false;
		//let result: any = {};

		// Look up the call
		let callInfo = allCalls[callId];

		// See if the call was found
		// If not, it might have been responded to already
		if (util.IsNull(callInfo)) {
			mod.WriteLog("Service Callback - Unknown Call:" + callId.toString());
			// @@@ Notify parent? Send something to the server?
			return;
		}

		// Cancel any timers
		if (callInfo.TID > 0)
			clearTimeout(callInfo.TID);

		// Remove the call from the master list
		delete allCalls[callId];
		mod.callCount--;

		// Check the status
		if (returnData.StatusCode >= 200 && returnData.StatusCode < 299) {
			// Unpackage data
			// @@@ could JSON.parse() here instead of parent ??
			let result = returnData.Data;
			if (!util.IsNull(result) && callInfo.ServiceType == constants.ServiceType.WebMethod && callInfo.ReturnType == constants.ReturnType.Normal)
				// Web methods wrap the returned object
				result = result.d; // @@@ Still correct? Needs testing after changes.

			// Copy the status if it isn't present
			if (!result.StatusCode) {
				result.StatusCode = returnData.StatusCode;
				result.Status = returnData.Status;
			}

			// See if data was returned and we're supposed to convert dates
			if (result && result.Data && callInfo.ParseDates)
				mod.Util.ConvertDatesByName(result.Data);

			// Special response check
			// If we get an UnAuth response, go to the login or go to the "LoggedOut" page
			// [TODO] Make behavior configurable (consider returning special response object with behavior and destination path)
			if (result.ResponseCode && result.ResponseCode == constants.ResponseCode.LoggedOut) {
				//debugger;
				let p = "";
				if (!mod.Util.IsNullOrBlank(document.location.search) && document.location.search != "?") {
					p = document.location.search;
					if (p.substring(0, 1) == "?")
						p = p.substring(1, p.length);
					p = "&params=" + encodeURIComponent(p);
				}
				document.location.href = mod.AppConfig.Core.LoginPath + "?source=" + encodeURIComponent(document.location.pathname) + p;
			}

			// Success
			callInfo.Resolve(result);

			// If this was a queue-owned call, tell it to make the next call
			if (!util.IsNullOrBlank(callInfo.Queue))
				callNext = true;
		} else {
			// See if we're supposed to try again
			if (callInfo.TryCount < callInfo.MaxTries) {
				// Try again
				// @@@ Here or wait for the end?
				// @@@ Does not work right now !!
				// This method returns data to a promise. We're essentially deferring that promise to try again.
				// Return a new promise? Return the original promise?
				mod.CallRemoteService(callInfo);
				return;
			} else {
				// Check the status
				if (returnData.Status == "timeout") // @@@ Not ideal. Can we use the xhr [xhr.status is zero]? At minimum, use constant.
					callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.Timeout, constants.ResponseMessage.Timeout, callInfo));
				if (callInfo.TryCount >= callInfo.MaxTries && callInfo.MaxTries > 1)
					callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.TriesExceeded, constants.ResponseMessage.TriesExceeded, callInfo));
				else if (returnData.StatusCode == constants.ServiceStatusCode.Unauthorized)
					callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.Unauthorized, constants.ResponseMessage.Unauthorized, callInfo, constants.ServiceStatusCode.Unauthorized, constants.ServiceStatusMessage.Unauthorized));
				else if (returnData.StatusCode == constants.ServiceStatusCode.Forbidden)
					callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.AccessDenied, constants.ResponseMessage.AccessDenied, callInfo, constants.ServiceStatusCode.Forbidden, constants.ServiceStatusMessage.Forbidden));
				else
					callInfo.Resolve(new InvalidServiceResponse(constants.ResponseCode.Unknown, constants.ResponseMessage.Unknown, callInfo));

				// If this was a queue-owned call, tell it to make the next call
				if (!util.IsNullOrBlank(callInfo.Queue))
					callNext = true;
			}
		}

		// See if we're supposed to make another call
		if (callNext) {
			// Get the queue
			let q = mod.GetQueue(callInfo.Queue);
			if (q == null) {
				mod.WriteLog("Invalid queue specified: " + callInfo.Queue);
			} else {
				// Remove the current item
				q.CurrentCall = null;

				// Call the next item in the queue
				mod.NextServiceCall(callInfo.Queue);
			}
		}
	}
}

/**
 * Service module interface.
 */
export interface IServiceModule {
	Constants: ServiceConstants;
	ServiceDefaults: ServiceDefaults;
	CleanPaths(src: object): void;
}

/**
 * Service module model.
 * NOTE: This is an internal construct.
 */
interface ServiceModuleModel { }

/**
 * Service module state.
 * NOTE: This is an internal construct.
 */
interface ServiceModuleState extends ComponentState<any> { }

/**
 * Service module configuration.
 * NOTE: This is an internal construct.
 */
interface ServiceModuleConfig extends ComponentConfig { }

/**
 * Base class inherited by mock services.
 */
export abstract class MockServiceModule extends Module implements IServiceModule {
	/** Service constants. */
	public readonly Constants = ServiceConstants;
	public ServiceDefaults: ServiceDefaults = null;

	/**
	 * Create an instance of the mock service module.
	 * @param {string} id - Module ID.
	 */
	constructor(id: string) {
		super(id);

		let mod = this;
		let constants = ServiceConstants;

		mod.ServiceDefaults = {
			Method: constants.Method.Get,
			ServiceType: constants.ServiceType.WebApi,
			ReturnType: constants.ReturnType.Normal,
			Queue: null,
			//Timeout: mod.AppConfig.Core.ServiceTimeout, // [TODO] Fix this, if possible.
			Timeout: 5000,
			MaxTries: 1
		};
	}

	/**
	 * Traverse a source object and convert all app-relative paths ("~/") to site-absolute paths.
	 * @param {object} src - Source object.
	 */
	public CleanPaths(src: object): void {
		let mod = this;
		mod.Util.CleanPaths(src, mod.AppConfig.Core);
	}

	/**
	 * Get a mock data set.
	 * @param {any} source - Source data.
	 * @param {boolean} copyData - True if a copy of the data should be made, otherwise the original will be returned. Default to true.
	 * @param {boolean} cleanPaths - True if path-like values should be cleaned. Default to true.
	 */
	public GetMockData<T>(source: any, copyData: boolean = true, cleanPaths: boolean = true): Promise<WsResponseData<T>> {
		let mod = this;

		// [TODO] Handle/test for null
		// [TODO] Replace JQuery; Fix $.extend? It alters the object (arrays are no longer arrays)
		//let data = copyData ? $.extend(true, {}, source) : source;
		let data = source;

		if (cleanPaths)
			mod.CleanPaths(data);

		return new Promise<WsResponseData<T>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(data));
		});
	}

	// [TODO] Create common signature for filtering callbacks
	// [TODO] Replace "Function" type in doc comment with proper callback signature.
	/**
	 * Get the first matching item in an array as a mock service.
	 * @param {T[]} source - Source data collection.
	 * @param {Function} cb - Callback function invoked for each item in the array. Returning true will return the item.
	 * @param {T} defaultValue - Optional default value returned if no matches are found. Default to null.
	 * @param {boolean} copyData - True if a copy of the data should be made, otherwise the original will be returned. Default to true.
	 * @param {boolean} cleanPaths - True if path-like values should be cleaned. Default to true.
	 */
	public GetMockFirstData<T extends object>(source: T[], cb: (item: T) => boolean, defaultValue?: T, copyData: boolean = true, cleanPaths: boolean = true): Promise<WsResponseData<T>> {
		let mod = this;

		let item = source.first(cb, defaultValue);

		// [TODO] Handle/test for null
		//if (copyData)
		//	item = $.extend(true, {}, item); // [TODO] Replace JQuery; Fix $.extend? It alters the object (arrays are no longer arrays)
		if (cleanPaths)
			mod.CleanPaths(item);

		return new Promise<WsResponseData<T>>((resolve, reject) => {
			if (item == null)
				resolve(new WsResponseData<T>(null, ServiceConstants.ResponseCode.NotFound, ServiceConstants.ResponseMessage.NotFound));
			else
				resolve(WsResponseData.SuccessData<T>(item));
		});
	}

	// [TODO] Create common signature for filtering callbacks
	// [TODO] Replace "Function" type in doc comment with proper callback signature.
	/**
	 * Get a filtered (array) data set as a mock service.
	 * @param {T[]} source - Source data collection.
	 * @param {Function} cb - Callback function invoked for each item in the array. Returning true will include the item in the new array.
	 * @param {boolean} copyData - True if a copy of the data should be made, otherwise the original will be returned. Default to true.
	 * @param {boolean} cleanPaths - True if path-like values should be cleaned. Default to true.
	 */
	public GetMockFilteredData<T extends object>(source: T[], cb: (item: T) => boolean, copyData: boolean = true, cleanPaths: boolean = true): Promise<WsResponseData<T[]>> {
		let mod = this;

		let items = source.where(cb);

		// [TODO] Handle/test for null
		//if (copyData)
		//	items = $.extend(true, {}, items); // [TODO] Replace JQuery; Fix $.extend? It alters the object (arrays are no longer arrays)
		if (cleanPaths)
			mod.CleanPaths(items);

		return new Promise<WsResponseData<T[]>>((resolve, reject) => {
			if (items == null || items.length == 0)
				resolve(new WsResponseData<T[]>(null, ServiceConstants.ResponseCode.NotFound, ServiceConstants.ResponseMessage.NotFound));
			else
				resolve(WsResponseData.SuccessData<T[]>(items));
		});
	}

	/**
	 * Get a mapped list of items as a mock service.
	 * @param {MockTypeMap[]} idSource - Mock data mapping construct.
	 * @param {any} itemSource - Item source data.
	 * @param {number} filterId - ID to filter the mapping list on.
	 * @param {string} itemProperty - Property name used to look up the individual items.
	 */
	public GetMockMapList<T>(idSource: MockTypeMap[], itemSource: any[], filterId: number|number[], itemProperty: string) {
		// [TODO] Add options for copyData and cleanPaths?
		let mod = this;
		let constants = mod.Constants;

		// Get the list of filter Ids
		// It might be a single number or an array
		// Always use/convert to an array
		let list: number[];
		if (typeof filterId == "number")
			// Array of one item
			list = [filterId];
		else
			list = filterId;

		// Get the list of IDs to resolve
		// [TODO] Optimize nested looping
		let idList = { values: [] };
		for (let i = 0; i < list.length; i++) {
			let map = idSource.first(item => item.id == list[i]);
			if (map != null) {
				// [TODO] Handle dupes/overlap
				map.values.forEach((value, index, data) => {
					idList.values.push(value);
				});
			}
		}

		// See if it was found
		if (idList == null)
			return new Promise<WsResponseData<T[]>>((resolve, reject) => {
				resolve(new WsResponseData<T[]>(null, constants.ResponseCode.NotFound, constants.ResponseMessage.NotFound));
			});

		// Resolve the items corresponding with the IDs
		let data = itemSource.where((item) => { return idList.values.contains(item[itemProperty]); });

		// Return the data
		return new Promise<WsResponseData<T[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(data));
		});
	}

	/**
	 * Get a data set based on a unique key as a mock service.
	 * @param {KeyValueCollection<T>} source - Mock data source.
	 * @param {string} key - Data key.
	 */
	public GetMockKeyedData<T>(source: KeyValueCollection<T>, key: string): Promise<WsResponseData<T>> {
		let mod = this;
		let constants = mod.Constants;

		let ret = source[key];

		return new Promise<WsResponseData<T>>((resolve, reject) => {
			if (ret == undefined)
				resolve(new WsResponseData<T>(null, constants.ResponseCode.NotFound, constants.ResponseMessage.NotFound));
			else
				resolve(WsResponseData.SuccessData(ret));
		});
	}
}

/**
 * Base class inherited by web services.
 */
export abstract class ServiceModule extends Module implements IServiceModule {
	/** Service manager instance. */
	public Services: ServiceManager;
	/** Service constants. */
	public readonly Constants = ServiceConstants;
	public ServiceDefaults: ServiceDefaults = null;

	/**
	 * Create an instance of the service module.
	 * @param {string} id - Module ID.
	 */
	constructor(id: string, sm: ServiceManager) {
		// Call the parent
		super(id);

		let mod = this;
		mod.Services = sm;
		mod.ServiceDefaults = sm.Config.ServiceDefaults;
	}

	/**
	 * Traverse a source object and convert all app-relative paths ("~/") to site-absolute paths.
	 * @param {object} src - Source object.
	 */
	public CleanPaths(src: object): void {
		let mod = this;
		mod.Util.CleanPaths(src, mod.AppConfig.Core);
	}
}

/**
 * Collection of services used by a component.
 */
export abstract class ServiceCollection {
	/** Service constants and defaults. */
	Constants: typeof ServiceConstants = ServiceConstants;

	// [TODO] Can we move/point ServiceDefaults here?
	// Need to work with DI.
	// Can't use Inject() because we don't want a root object. We want an object's config.
	// Adding a constructor makes it messier for inheriting classes.
	// How would we handle mock vs. real (or does it not matter)?
}
