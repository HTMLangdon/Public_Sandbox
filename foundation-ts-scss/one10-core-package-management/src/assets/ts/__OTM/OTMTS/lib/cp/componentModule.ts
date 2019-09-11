/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Component wrapper module.
 * @module cp/componentModule
 */

import { IModule, Module } from './moduleShared';
//import { SecurityService } from 'bsp/services/mock/securityService'; // Every application MUST implement a SecurityService.
import { SecurityService } from 'bsp/services/securityService'; // Every application MUST implement a SecurityService.
import { ComplexControl, ServerControl, ServerControlDef, KeyValueCollection } from './util';
import { ApplicationContext } from './appShared';
import { Inject } from './di';

/**
 * Component wrapper module.
 * This is a non-Generic interface created for easier use.
 * @extends IModule
 */
export interface IComponentModule extends IModule {
	/** Component configuration. */
	Config: ComponentConfig;

	/** Collection of controls accessible by the component. */
	Controls: ComponentControls;

	/** Template references */
	// [TODO] Make this a KeyValueCollection?
	Templates: any;

	/** Current application context. */
	AppContext: ApplicationContext;

	/** Collection of child components. */
	Components: IComponentCollection;

	/** Template callback collection. */
	Callbacks: IKeyValueCollection<TemplateCallbackInfo>;

	/** Default callback method invoked when the service watcher indicates completion. */
	DefaultServiceWatchCallback: ServiceWatchCallback;

	/** Managed resource and content collection. */
	Resources: ResourceList;

	///**
	// * Write a message to the log.
	// * @param {string} message - Message to be written.
	// * @param {any} data - Optional data to attach to the log entry.
	// */
	//WriteLog(message: string, data?: any): void;

	/**
	 * Traverse a source object and convert all app-relative paths ("~/") to site-absolute paths.
	 * @param {object} src - Source object.
	 */
	CleanPaths(src: object): void

	/**
	 * Get the message to display based on a service response.
	 * @param {string} messageBase - Base/fixed portion of the message.
	 * @param {WsResponse} response - Service response.
	 * @param {string} delimPrefix - Optional suffix appended to each line/message/error. Default blank.
	 * @param {string} delimSuffix - Optional suffix appended to each line/message/error. Default "<br/>\r\n".
	 * @returns {string} Formatted response message.
	 */
	GetServiceMessage(messageBase: string, response: WsResponse, delimPrefix?: string, delimSuffix?: string): string;

	/**
	 * Clear/hide the message container.
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	ClearMessage(control?: any): void;

	/**
	 * Show a message (error or informational).
	 * @param {string} message - Message contents.
	 * @param {CalloutType} messageType - Enum (error, success, info, warning)
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	ShowMessage(message: string, messageType: CalloutType, control?: JQuery): void;

	/**
	 * Show Progress Indicator.
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	ShowProgress(control?: any): void;

	/**
	 * Hide Progress Indicator.
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	HideProgress(control?: any): void;

	/**
	 * Bind a model to the page starting at a root/base element.
	 * @param {JQuery} rootElement - Root/base element to bind to. Sub-controls will be parsed and bound as needed. Optional. Default "Controls.RootElement".
	 * @param {any} model - Optional model to bind. Default "State.model".
	 */
	BindModel(rootElement?: JQuery, model?: any): void;

	/**
	 * Binds the validation subsystem to the page.
	 * NOTE: Currently a wrapper for Kendo validator, but retain in case that changes.
	 * @param {boolean} validateOnBlur - Optional boolean indicating if validation should trigger on control blur. Default "true".
	 * @param {any} rootElement - Optional root/base element used to bind validatio. Default "Controls.RootElement".
	 * @returns {Validator} Validator instance.
	 */
	BindValidator(validateOnBlur?: boolean, rootElement?: any): Validator;

	/**
	 * Gets the validator associated with the component.
	 * @returns {Validator} Validator instance.
	 */
	GetValidator(): Validator;

	/**
	 * Gets one or more controls and saves references to them.
	 * NOTE: This should NOT be used for Complex Control types.
	 * @param {string[]} list - List of control IDs (without prefix or selector markup).
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 */
	GetControls(list: string[], controls?: any): void;

	/**
	 * Gets a control reference and saves it to the control collection.
	 * NOTE: This should NOT be used for Complex Control types.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {JQuery} - Control reference.
	 */
	GetControl(id: string, controls?: any): JQuery;

	/**
	 * Gets a complex control reference and saves it to the control collection.
	 * NOTE: Currently a wrapper for Kendo controls (Widget), but retain in case that changes.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {string} type - Control type name.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {Control} Control reference.
	 */
	GetComplexControl(id: string, type: string, controls?: any): ComplexControl<Control>;

	/**
	 * Gets a complex control reference and saves it to the control collection.
	 * The returned object is strongly typed.
	 * NOTE: Currently a wrapper for Kendo controls, but retain in case that changes.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {string} type - Control type name.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {ComplexControl<T>} Control reference.
	 */
	GetComplexControlTyped<T extends kendo.ui.Widget>(id: string, type: string, controls?: any): ComplexControl<T>;

	/**
	 * Bind one or more buttons to their respective events.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_click".
	 * @param {string[]} list - List of button IDs.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 */
	BindButtons(list: string[], events?: any, controls?: any): void;

	/**
	 * Bind a button to its respective event.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_click".
	 * @param {string} id - Button ID.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {JQuery} Reference to the control.
	 */
	BindButton(id: string, events?: any, controls?: any): JQuery;

	/**
	 * Gets the current user.
	 * NOTE: This uses an asynchronous Promise.
	 * @returns {Promise<IUserInfo>} Promise that will resolve the user info.
	 */
	GetUser(): Promise<IUserInfo>;

	/**
	 * Create an observable object from a model.
	 * NOTE: Currently a wrapper for Kendo, but retain in case that changes.
	 * @param {any} model - Source model to convert.
	 * @param {string[]} serviceFlags - Optional list of service flags to watch.
	 * @returns {T} Model instance converted to an observable.
	 */
	CreateObservable<T extends ComponentModel>(model: any, serviceFlags?: string[]): T;

	/**
	 * Begin watching the service flag collection.
	 * @param {string[]} flags - Optional collection of service flags to watch.
	 * @param {boolean} includeComponents - Optional flag indicating if the child components should be included. Default to false.
	 * @param {ServiceWatchCallback} callback - Optional callback to invoke after all flags have been triggered. Default (undefined) to the "DefaultServiceWatchCallback". Null indicates no callback.
	 * @param {string} modelPath - Optional path within the model to the flag collection. Default to "ServiceFlags".
	 */
	WatchServiceFlags(flags?: string[], includeComponents?: boolean, callback?: ServiceWatchCallback, modelPath?: string): void;

	/**
	 * Set the IsLoaded model flag to true. The on-screen message container will also be cleared.
	 * @param {string} modelPath - Not used.
	 */
	SetIsLoaded(modelPath?: string): void;

	/**
	 * Sets a service completion flag.
	 * @param {string} name - Flag name.
	 * @param {string} modelPath - Optional path within the model to the flag collection.
	 */
	SetServiceFlag(name: string, modelPath?: string): void;

	/**
	 * Initialize the child components.
	 */
	InitializeComponents(): void;

	/** Get a message resource.
	 *** DEPRECATED - replaced by GetResource
	 * @param {string} key - Resource key.
	 */
	GetPXMessage(key: string): ResourceInfo;

	/** Get a content resource.
	 *** DEPRECATED - replaced by GetResource
	 * @param {string} key - Resource key.
	 */
	GetPXContent(key: string): ResourceInfo;

	/** Get a resource.
	 * @param {string} key - Resource key.
	 */
	GetPXResource(key: string): ResourceInfo;

	/**
	 * Render a template.
	 * @param {TemplateRunInfo} info - Template information.
	 * @param {JQuery} target - Template target container.
	 */
	RenderTemplate(info: TemplateRunInfo, target: JQuery): void;

	/** Process pending post-template bind items. */
	ProcessBindList(): void;
}

/**
 * Partial component wrapper.
 */
export interface IPartialComponent extends IComponentModule {
	/** Gets the parent component module. */
	Parent: IComponentModule;
	/**
	 * Tells the partial component it is about to be shown.
	 * The component can indicate that it should not be shown due to its current state.
	 * @returns {Promise<boolean>} - Promise that when resolved indicates if the component should be shown or not.
	 */
	Show(): Promise<boolean>;
	/**
	 * Tells the partial component it is about to be hidden.
	 * This is used to clean up the component.
	 */
	Hide(): void;
	/**
	 * Notify the parent component that a condition has been met.
	 * @param {string} modelPath - Optional path within the model to the flag collection. Default to "ServiceFlags".
	 */
	NotifyParent(modelPath?: string): void;
}

/** Collection of sub-components. */
interface IComponentCollection extends IKeyValueCollection<IPartialComponent> { }

interface MessageState {
	Container?: JQuery;
	Type?: CalloutType;
	IsVisible: boolean;
	Icon?: JQuery;
	Message?: JQuery;
}

export interface TemplateCallbackInfo {
	ControlPath: string;
	MetaPath?: string;
}

/**
 * Component wrapper module.
 * @extends Module<TM, TS, TCfg>
 */
export abstract class ComponentModule
	extends Module
	implements IComponentModule {
	/** Private module ID. Used primarily for logging to indicate scope. */
	private pcmid: string = "ComponentModule";

	private static _messageState: MessageState[] = [];

	/** Module configuration. */
	// Redefined with stronger type.
	public Config: ComponentConfig;

	/** Module state. */
	public State: ComponentState<ComponentModel>;

	/** Security service. */
	protected Security: SecurityService;

	/** Current user information. */
	private _user: IUserInfo = null;

	/** Reference to the promise handle for obtaining users */
	// [TODO] Consider moving promise and fetch to App Context so that it doesn't happen multiple times on the same page (one for each Component)
	private _userP: Promise<IUserInfo> = null;

	/** Current application context. */
	public AppContext: ApplicationContext;

	/** Collection of child components. */
	public Components: IComponentCollection = {};

	/** Collection of controls accessible by the component. */
	public Controls: ComponentControls = <ComponentControls>{};

	/** Template references */
	public Templates: ComponentTemplates = {};

	/** Template callback collection. */
	public Callbacks: IKeyValueCollection<TemplateCallbackInfo> = {};

	/** Default callback method invoked when the service watcher indicates completion. */
	public DefaultServiceWatchCallback: ServiceWatchCallback = this.SetIsLoaded;

	/** Managed resource and content collection. */
	public Resources: ResourceList;

	/**
	 * Create an instance of the component.
	 * @param {string} id - Component ID.
	 * @param {ApplicationContext} ac - Application context.
	 */
	constructor(id: string, ac: ApplicationContext) {
		// Call the parent
		super(id);

		let mod = this;
		let config = mod.Config;

		mod.WriteLog("Create: " + id, mod.pcmid);

		mod.AppContext = ac;
		mod.Security = ac.Security;

		// Get the resources
		// [TODO] Potentially hook into service or something on initialization
		mod.Resources = window["CPResourceData"];

		// Highest level element the component is aware of.
		config.RootElement = "#formMain";

		// Where messages are displayed (errors, status, loading)
		config.MessageContainer = "#pageMessage";

		// Where progress displayed 
		config.ProgressContainer = "#pageLoading";

		config.Ui = {
			//MessageSuccessClass: "k-notification-success", // [TODO] MOVE THESE TO A COMMON "config" IN "app"
			MessageSuccessClass: "success",
			MessageSuccessIcon: "fi-checkbox",
			//MessageErrorClass: "k-notification-error",
			MessageErrorClass: "alert",
			MessageErrorIcon: "fi-alert",
			MessageWarningClass: "warning",
			MessageWarningIcon: "fi-info",
			//LoadingClass: "k-notification-info",
			LoadingClass: "loading",
			LoadingIcon: "fi-clock",
			MenuDisplay: MenuDisplayType.Visible
		};
		config.Messages = {
			SaveSuccess: "Save successful.",
			SaveError: "Error during save.",
			FetchError: "Error fetching data from the server."
		};

		config.TemplateContentType = "text/x-kendo-template";
	}

	/**
	 * Initialize the component.
	 * @param {TM} model - Optional model to be used by the component.
	 */
	public Initialize(model: any = null): void {
		// Call the (parent) module's initialize
		super.Initialize(model);

		let mod = this;
		let controls = mod.Controls;
		let config = mod.Config;

		mod.WriteLog("Initialize", mod.pcmid);

		// Fetch the user
		// No need to assign the return value
		// This is meant to initiate the async operation
		// [TODO] NEED TO HANDLE EVENT WHEN PROMISE RESOLVES
		mod.GetUser();

		// Get standard controls
		controls.RootElement = $(config.RootElement);
		controls.MessageContainer = $(config.MessageContainer);

		// Set the locale
		let loc = mod.AppConfig.Core.Locale.CurrentLocaleId;
		loc = loc.substring(0, 3) + loc.substring(3, 5).toUpperCase();
		kendo.culture(loc);
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
	 * Get the message to display based on a service response.
	 * @param {string} messageBase - Base/fixed portion of the message.
	 * @param {WsResponse} response - Service response.
	 * @param {string} delimPrefix - Optional suffix appended to each line/message/error. Default blank.
	 * @param {string} delimSuffix - Optional suffix appended to each line/message/error. Default "<br/>\r\n".
	 * @returns {string} Formatted response message.
	 */
	// [TODO] Need options for how it will be formatted
	public GetServiceMessage(messageBase: string, response: WsResponse, delimPrefix?: string, delimSuffix?: string): string {
		//debugger;
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(delimPrefix))
			delimPrefix = "";
		if (util.IsNull(delimSuffix))
			delimSuffix = "<br/>\r\n";

		// Start the message
		let m = delimPrefix + messageBase;

		// Add the service response, if specified
		if (!util.IsNullOrBlank(response.ResponseMessage))
			m += ' - ' + response.ResponseMessage;

		// Add the first/main item suffix
		m += delimSuffix;

		// Go through the errors, if any
		if (!util.IsNull(response.Errors)) {
			if (response.Errors.length > 0) {
				let errs = response.Errors;
				for (let i = 0; i < errs.length; i++) {
					m += delimPrefix + errs[i].Description + delimSuffix;
				}
			}
		}

		return m;
	};

	/**
	 * Get the message container state. If it is unknown, a new state object will be created and the container will be reset.
	 * @param {JQuery} control - Message container selector.
	 */
	private GetMessageState(control: JQuery): MessageState {
		let mod = this;
		//let states = mod._messageState;
		let states = ComponentModule._messageState;

		// Look for the control
		let ms: MessageState = null;
		for (let i = 0; i < states.length; i++) {
			if (states[i].Container[0] == control[0]) {
				ms = states[i];
				break;
			}
		}

		// If we didn't find one, build a new one, add it to the collection, and do a reset
		if (ms == null) {
			ms = { Container: control, IsVisible: false };
			states.push(ms);
			mod.ResetMessageState(ms);
		}

		return ms;
	}

	/**
	 * Reset the message container and state.
	 * @param {MessageState} ms - Message state information.
	 */
	private ResetMessageState(ms: MessageState): void {
		let mod = this;
		let config = mod.Config;

		// Save references
		let control = ms.Container;
		let icon = ms.Icon = control.find("i");
		let mc = ms.Message = control.find("#litResultMsg"); // [TODO] Make configurable

		// Hide it
		control.hide();

		// Force it into success state
		// Clear all states and then add success
		control.removeClass(config.Ui.MessageSuccessClass);
		control.removeClass(config.Ui.MessageErrorClass);
		control.removeClass(config.Ui.MessageWarningClass);
		icon.removeClass(config.Ui.MessageSuccessIcon);
		icon.removeClass(config.Ui.MessageErrorIcon);
		icon.removeClass(config.Ui.MessageWarningIcon);

		control.addClass(config.Ui.MessageSuccessClass);
		icon.addClass(config.Ui.MessageSuccessIcon);

		ms.IsVisible = false;
		ms.Type = CalloutType.Success;
	}

	/**
	 * Get the message container. If no control is passed in or it is missing, the standard container control will be used.
	 * @param {JQuery} control - Optional control for the message container.
	 */
	public GetMessageContainer(control?: JQuery): JQuery {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		if (util.IsNull(control) || control.length == 0) {
			if (util.IsNull(controls.MessageContainer) || controls.MessageContainer.length == 0)
				controls.MessageContainer = $(mod.Config.MessageContainer);
			return controls.MessageContainer;
		}
		return control;
	}

	/**
	 * Clear/hide the message container.
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	public ClearMessage(control?: JQuery): void {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		// Get the message container
		control = mod.GetMessageContainer(control);

		// Get the message state
		let ms = mod.GetMessageState(control);

		// Hide the control
		if (ms.IsVisible)
			control.hide();
	}

	/**
	 * Show a message (error or informational).
	 * @param {string} message - Message contents.
	 * @param {CalloutType} messageType - Enum (error, success, info, warning)
	 * @param {any} control - Optional message container control. Default "Controls.MessageContainer".
	 */
	// [TODO] Need flag(s) to indicate if it is cumulative and dismissable
	public ShowMessage(message: string, messageType: CalloutType, control?: JQuery): void {
		//debugger;
		let mod = this;
		let controls = mod.Controls;
		let config = mod.Config;
		let util = mod.Util;

		// Get the message container
		control = mod.GetMessageContainer(control);

		// Get the message state and container
		let ms = mod.GetMessageState(control);

		// Hide so it doesn't flicker
		if (ms.IsVisible)
			control.hide();

		// Get child control references and last type
		let lastType = ms.Type;
		let icon = ms.Icon;
		let mc = ms.Message;

		// Set the message
		mc.html(message);

		// See if the type changed
		if (lastType != messageType) {
			// Undo the last type
			if (lastType == CalloutType.Error) {
				control.removeClass(config.Ui.MessageErrorClass);
				icon.removeClass(config.Ui.MessageErrorIcon);
			} else if (lastType == CalloutType.Success) {
				control.removeClass(config.Ui.MessageSuccessClass);
				icon.removeClass(config.Ui.MessageSuccessIcon);
			} else if (lastType == CalloutType.Warning) {
				control.removeClass(config.Ui.MessageWarningClass);
				icon.removeClass(config.Ui.MessageWarningIcon);
			}

			// Apply the new type
			if (messageType == CalloutType.Error) {
				control.addClass(config.Ui.MessageErrorClass);
				icon.addClass(config.Ui.MessageErrorIcon);
			} else if (messageType == CalloutType.Success) {
				control.addClass(config.Ui.MessageSuccessClass);
				icon.addClass(config.Ui.MessageSuccessIcon);
			} else if (messageType == CalloutType.Warning) {
				control.addClass(config.Ui.MessageWarningClass);
				icon.addClass(config.Ui.MessageWarningIcon);
			}

			// Save the changed type
			ms.Type = messageType;
		}

		// Show the control
		control.show();
		ms.IsVisible = true;
	}

	/**
	 * Get the progress container. If no control is passed in or it is missing, the standard container control will be used.
	 * @param {JQuery} control - Optional control for the progress container.
	 */
	public GetProgressContainer(control?: JQuery): JQuery {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		if (util.IsNull(control) || control.length == 0) {
			if (util.IsNull(controls.ProgressContainer) || controls.ProgressContainer.length == 0)
				controls.ProgressContainer = $(mod.Config.ProgressContainer);
			return controls.ProgressContainer;
		}
		return control;
	}

	/**
	 * Show the progress indicator container.
	 * @param {any} control - Optional Progress container control. Default "Controls.ProgressContainer".
	 */
	public ShowProgress(control?: JQuery): void {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		// Get the message container
		control = mod.GetProgressContainer(control);

		control.show();
	}

	/**
	 * Hide the progress indicator container.
	 * @param {any} control - Optional Progress container control. Default "Controls.ProgressContainer".
	 */
	public HideProgress(control?: JQuery): void {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		// Get the message container
		control = mod.GetProgressContainer(control);

		control.hide();
	}

	/**
	 * Bind a model to the page starting at a root/base element.
	 * @param {JQuery} rootElement - Root/base element to bind to. Sub-controls will be parsed and bound as needed. Optional. Default "Controls.RootElement".
	 * @param {any} model - Optional model to bind. Default "State.model".
	 */
	public BindModel(rootElement?: JQuery, model?: any): void { // [TODO] Reverse parameters and make model required
		//debugger;
		let mod = this;
		let util = mod.Util;
		let state = mod.State;
		let controls = mod.Controls;

		// Use defaults for arguments not set
		if (util.IsNull(rootElement))
			rootElement = controls.RootElement;
		if (util.IsNull(model))
			model = state.model;

		// Pass-through
		util.BindModel(rootElement, model);
	}

	/**
	 * Binds the validation subsystem to the page.
	 * NOTE: Currently a wrapper for Kendo validator, but retain in case that changes.
	 * @param {boolean} validateOnBlur - Optional boolean indicating if validation should trigger on control blur. Default "true".
	 * @param {any} rootElement - Optional root/base element used to bind validatio. Default "Controls.RootElement".
	 * @returns {Validator} Validator instance.
	 */
	public BindValidator(validateOnBlur?: boolean, rootElement?: any): Validator {
		let mod = this;
		let util = mod.Util;
		let controls = mod.Controls;

		if (util.IsNullOrBlank(validateOnBlur))
			validateOnBlur = true;
		if (util.IsNull(rootElement))
			rootElement = controls.RootElement;

		return rootElement.kendoValidator({ validateOnBlur: validateOnBlur }).data("kendoValidator");
	}

	/**
	 * Gets the validator associated with the component.
	 * @returns {Validator} Validator instance.
	 */
	public GetValidator(): Validator {
		let mod = this;
		let controls = mod.Controls;
		let state = mod.State;
		let util = mod.Util;

		if (util.IsNull(state.Validator)) {
			state.Validator = controls.RootElement.data("kendoValidator");
		}

		return state.Validator;
	}

	/**
	 * Gets one or more controls and saves references to them.
	 * NOTE: This should NOT be used for Complex Control types.
	 * @param {string[]} list - List of control IDs (without prefix or selector markup).
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 */
	public GetControls(list: string[], controls?: ControlContainer): void {
		let mod = this;

		for (let i = 0; i < list.length; i++) {
			mod.GetControl(list[i], controls);
		}
	}

	/**
	 * Gets a control reference and saves it to the control collection.
	 * NOTE: This should NOT be used for Complex Control types.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 * @returns {JQuery} - Control reference.
	 */
	public GetControl(id: string, controls?: ControlContainer): JQuery {
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(controls))
			controls = mod.Controls;
		let ctl = $("#" + id);
		controls[id] = ctl;
		return ctl;
	}

	/**
	 * Gets one or more complex controls and saves references to them.
	 * @param {ComplexControlDef[]} list - List of complex control definitions.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 */
	public GetComplexControls(list: ComplexControlDef[], controls?: ControlContainer): void {
		let mod = this;
		for (let i = 0; i < list.length; i++) {
			let d = list[i];
			mod.GetComplexControl(d.Id, d.Type, controls);
		}
	}

	/**
	 * Gets a complex control reference and saves it to the control collection.
	 * NOTE: Currently a wrapper for Kendo controls (Widget), but retain in case that changes.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {string} type - Control type name.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 * @returns {ComplexControl<Control>} Control reference.
	 */
	public GetComplexControl(id: string, type: string, controls?: ControlContainer): ComplexControl<Control> {
		let mod = this;
		return mod.GetComplexControlTyped<kendo.ui.Widget>(id, type, controls);
	}

	/**
	 * Gets a complex control reference and saves it to the control collection.
	 * The returned object is strongly typed.
	 * NOTE: Currently a wrapper for Kendo controls, but retain in case that changes.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {string} type - Control type name.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 * @returns {ComplexControl<T>} Control reference.
	 */
	public GetComplexControlTyped<T extends kendo.ui.Widget>(id: string, type: string, controls?: ControlContainer): ComplexControl<T> {
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(controls))
			controls = mod.Controls;
		let c = new ComplexControl<T>(id, type);
		controls[id] = c;
		return c;
	}

	/**
	 * Gets one or more complex controls and saves references to them.
	 * @param {ServerControlDef[]} list - List of server control definitions.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 */
	public GetServerControls(list: ServerControlDef[], controls?: ControlContainer): void {
		let mod = this;
		for (let i = 0; i < list.length; i++) {
			let d = list[i];
			mod.GetServerControl(d.Id, d.Name, controls);
		}
	}

	/**
	 * Gets a server control reference and saves it to the control collection.
	 * @param {string} id - Control ID without prefix or selector markup.
	 * @param {string} name - Control (friendly) name. This will be the name in the controls collection.
	 * @param {ControlContainer} controls - Optional controls collection. Default "ComponentModule.Controls".
	 * @returns {ServerControl<T>} Control reference.
	 */
	public GetServerControl<T extends Telerik.Web.UI.RadWebControl>(id: string, name: string, controls?: ControlContainer): ServerControl<T> {
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(controls))
			controls = mod.Controls;
		let c = new ServerControl<T>(id, name);
		controls[name] = c; // Use name instead of ID
		return c;
	}

	/**
	 * Gets the specified template and saves a reference to it.
	 * @param {string} id - Template ID.
	 * @param {TemplateContainer} templates - Optional templates collection. Default "ComponentModule.Templates".
	 * @returns {Template} Template instance.
	 */
	public GetTemplate(id: string, templates?: TemplateContainer): Template {
		let mod = this;
		let util = mod.Util;

		let sel = $("#" + id + "Template");
		if (sel.length == 0)
			sel = $("#" + id);

		// [TODO] Handle if template/selector not found
		let content = sel.html();
		return mod.CompileTemplate(id, content, templates);
	}

	/**
	 * Gets one or more templates and saves references to them.
	 * @param {string[]} list - List of template IDs (without prefix or selector markup).
	 * @param {TemplateContainer} templates - Optional templates collection. Default "ComponentModule.Templates".
	 */
	public GetTemplates(list: string[], templates?: TemplateContainer): void {
		let mod = this;

		for (let i = 0; i < list.length; i++) {
			mod.GetTemplate(list[i], templates);
		}
	}

	/**
	 * Compliles a template and saves a reference to it.
	 * @param {string} id - Template ID to be added to the templates collection.
	 * @param {string} content - Template content.
	 * @param {TemplateContainer} templates - Optional templates collection. Default "ComponentModule.Templates".
	 * @returns {Template} Template instance.
	 */
	public CompileTemplate(id: string, content: string, templates?: TemplateContainer): Template {
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(templates))
			templates = mod.Templates;
		let t = kendo.template(content);
		templates[id] = t;
		return t;
	}

	/**
	 * Append a template to the HTML DOM.
	 * @param {string} id - Template ID.
	 * @param {string} content - Template content.
	 * @param {string} contentType - Optional content type. Default to "ComponentModule.Config.TemplateContentType".
	 */
	public AppendTemplate(id: string, content: string, contentType?: string): void {
		// [TODO] Add param to compile the template and add it to the collection?

		let mod = this;
		let util = mod.Util;

		if (util.IsNullOrBlank(contentType))
			contentType = mod.Config.TemplateContentType;

		$("body").append('<script id="' + id + '" type="' + contentType + '">' + content + '</script>');
	}

	/**
	 * Bind one or more controls to their respective events.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_eventName".
	 * If an event collection is not passed or if the size of the events collection
	 * is smaller than control collection it will default to 'click' event a better solution
	 * would be to have a constant collection of default events for control types
	 * @param {string[]} list - List of control IDs.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 */
	public BindControls(list: string[], events?: string[], controls?: ControlContainer): void {
		//debugger;
		let mod = this;
		let util = mod.Util;

		for (let i = 0; i < list.length; i++) {
			mod.BindControl(list[i], util.IsNull(events[i]) ? 'click' : events[i], controls);
		}
	}
	/**
	 * Bind a button to its respective event.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_click".
	 * @param {string} id - Button ID.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {JQuery} Reference to the control.
	 */
	public BindControl(id: string, event?: string, controls?: ControlContainer): JQuery {
		//debugger;
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(controls))
			controls = mod.Controls;
		event = util.IsNull(event) ? 'click' : event;
		// Get the control, if known
		let ctl: JQuery = <JQuery>controls[id];

		// If not known, fetch it
		if (util.IsNull(ctl))
			ctl = mod.GetControl(id, controls);

		if (ctl && ctl.length > 0) {
			let e = mod[id + "_" + event];
			// Wrap event in an anonymous function so we can preserve context (with "call")
			ctl.bind(event, function (args) {
				e.call(mod, args);
			});
		}

		return ctl;
	}
	/**
	 * Bind one or more buttons to their respective events.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_click".
	 * @param {string[]} list - List of button IDs.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 */
	public BindButtons(list: string[], events?: any, controls?: ControlContainer): void {
		//debugger;
		let mod = this;
		let util = mod.Util;

		for (let i = 0; i < list.length; i++) {
			mod.BindButton(list[i], events, controls);
		}
	}

	/**
	 * Bind a button to its respective event.
	 * The control is also added to the controls collection.
	 * NOTE: Event names should follow the convention "[ControlID]_click".
	 * @param {string} id - Button ID.
	 * @param {any} events - Optional events collection. Default to the current component.
	 * @param {any} controls - Optional controls collection. Default "Controls.MessageContainer".
	 * @returns {JQuery} Reference to the control.
	 */
	public BindButton(id: string, events?: any, controls?: ControlContainer): JQuery {
		//debugger;
		let mod = this;
		let util = mod.Util;

		if (util.IsNull(controls))
			controls = mod.Controls;
		if (util.IsNull(events))
			events = mod;

		// Get the control, if known
		let ctl: JQuery = <JQuery>controls[id];

		// If not known, fetch it
		if (util.IsNull(ctl))
			ctl = mod.GetControl(id, controls);

		if (ctl && ctl.length > 0) {
			let e = events[id + "_click"];
			// Wrap event in an anonymous function so we can preserve context (with "call")
			ctl.bind('click', function (args) {
				e.call(mod, args);
			});
		}

		return ctl;
	}

	/**
	 * Gets the current user.
	 * NOTE: This uses an asynchronous Promise.
	 * @returns {Promise<IUserInfo>} Promise that will resolve the user info.
	 */
	public GetUser(): Promise<IUserInfo> {
		let mod = this;
		let util = mod.Util;

		// Outstanding promise, return that
		if (!util.IsNull(mod._userP)) return mod._userP;
		// User not yet known, fetch it
		if (mod._user == null) return mod.FetchUser();
		// Return the known user
		return Promise.resolve(mod._user);
	}

	/**
	 * Fetches user info from the server.
	 * NOTE: This priave method is used to force a server fetch instead of relying on a cache.
	 * @returns {Promise<IUserInfo>} Promise that will resolve the user info.
	 */
	private FetchUser(): Promise<IUserInfo> {
		let mod = this;
		let security = mod.Security;

		// Check for a user fetch promise
		// If not found, we'll create a new one
		// If found, we'll return it (no need to fetch twice)
		if (mod._userP == null) {
			// Get the current user from the server
			mod._userP = security.CurrentUser()
				.then(result => {
					return new Promise<IUserInfo>((resolve, reject) => {
						// Save the user info, clear the promise handle, and resolve
						mod._user = result;
						resolve(mod._user);
						mod._userP = null;
					})
				});
		}

		// Send back the promise
		return mod._userP;
	}

	/**
	 * Create an observable object from a model.
	 * NOTE: Currently a wrapper for Kendo, but retain in case that changes.
	 * @param {any} model - Source model to convert.
	 * @param {string[]} serviceFlags - Optional list of service flags to watch.
	 * @returns {T} Model instance converted to an observable.
	 */
	public CreateObservable<T extends ComponentModel>(model: any, serviceFlags: string[] = null): T {
		//debugger;
		let mod = this;
		let util = mod.Util;

		// Build shared model structure
		let s = {
			IsLoaded: false
		};

		// Copy the model and splice in shared values
		let m = $.extend(true, {}, model, s);

		// Create and attach the model
		// Also start the service flag watcher
		let o = mod.State.model = <T>util.CreateObservable(m);
		mod.WatchServiceFlags(serviceFlags, true, undefined, "ServiceFlags");
		return o;
	}

	/**
	 * Begin watching the service flag collection.
	 * @param {string[]} flags - Optional collection of service flags to watch.
	 * @param {boolean} includeComponents - Optional flag indicating if the child components should be included. Default to false.
	 * @param {ServiceWatchCallback} callback - Optional callback to invoke after all flags have been triggered. Default (undefined) to the "DefaultServiceWatchCallback". Null indicates no callback.
	 * @param {string} modelPath - Optional path within the model to the flag collection. Default to "ServiceFlags".
	 */
	public WatchServiceFlags(flags: string[] = null, includeComponents: boolean = false, callback: ServiceWatchCallback = undefined, modelPath: string = "ServiceFlags"): void {
		// [TODO] Make "includeComponents" multi-typed. Boolean, component collection, component array.

		//debugger;
		let mod = this;
		let util = mod.Util;
		let model = mod.State.model;

		// Check/set defaults
		if (!util.IsDefined(callback))
			callback = mod.DefaultServiceWatchCallback;
		if (util.IsNullOrBlank(modelPath))
			modelPath = "ServiceFlags";

		let sf = util.HasData(flags) ? flags : [];

		if (includeComponents) {
			// Iterate over the components collection and see if they have service flags
			// If so, create an entry for the component
			for (let cn in mod.Components) {
				let comp = mod.Components[cn];
				if (comp.State && comp.State.model && util.HasData(comp.State.model.get(modelPath)))
					sf.push("_" + comp._ID);
			}
		}

		// Save the colection of flags and completion callback
		model.set(modelPath, sf);
		model.set(modelPath + "_callback", callback);

		// Make sure there is something to do, if not invoke the callback right away
		if (sf.length == 0) {
			//debugger;
			callback.call(mod, modelPath);
		}
	}

	/**
	 * Set the IsLoaded model flag to true. The on-screen message container will also be cleared.
	 * @param {string} modelPath - Not used.
	 */
	public SetIsLoaded(modelPath: string = null): void {
		//debugger;
		let mod = this;
		mod.State.model.set("IsLoaded", true);

		let clearMessage = true; // [TODO] Make configurable? [TODO] Do not clear if there is an error!
		if (clearMessage)
			mod.ClearMessage();
	}

	/**
	 * Sets a service completion flag.
	 * @param {string} name - Flag name.
	 * @param {string} modelPath - Optional path within the model to the flag collection.
	 */
	public SetServiceFlag(name: string, modelPath: string = "ServiceFlags"): void {
		//debugger;
		let mod = this;

		// Check for the service flag
		let model = mod.State.model;
		let sf: string[] = model.get(modelPath);
		if (mod.Util.HasData(sf)) {
			for (let i = 0; i < sf.length; i++) {
				if (sf[i] == name) {
					// Remove the item
					sf.splice(i, 1);
					break;
				}
			}
		} else
			sf = [];

		if (sf.length == 0) {
			let cb: ServiceWatchCallback = model.get(modelPath + "_callback");
			if (cb)
				// [TODO] Save "modelPath" along with the callback in a complex "info" object (method plus args)?
				cb.call(mod, modelPath);
		}

	}

	/**
	 * Initialize the child components.
	 */
	public InitializeComponents(): void {
		let mod = this;
		let list = mod.Components;

		if (list) {
			// Go through the list, assign the parent, and call initialize
			for (let cn in list) {
				// Make sure the item is an object.
				if (typeof list[cn] == "object") {
					list[cn].Parent = mod;
					list[cn].Initialize();
				}
			}
		}
	}

	/** Get a message resource.
	 *** DEPRECATED - replaced by GetResource
	 * @param {string} key - Resource key.
	 */
	GetPXMessage(key: string): ResourceInfo {
		let mod = this;
		let r = mod.Resources["Message:" + key];
		if (r)
			return r;
		return { Key: key, Content: "UNKNOWN MESSAGE '" + key + "'." };
	}

	/** Get a content resource.
	 *** DEPRECATED - replaced by GetResource
	 * @param {string} key - Resource key.
	 */
	GetPXContent(key: string): ResourceInfo {
		let mod = this;
		let r = mod.Resources["Content:" + key];
		if (r)
			return r;
		return { Key: key, Content: "UNKNOWN CONTENT RESOURCE '" + key + "'." };
	}

	/** Get a content resource.
	 *** DEPRECATED - replaced by GetResource
	 * @param {string} key - Resource key.
	 */
	GetPXResource(key: string): ResourceInfo {
		let mod = this;
		let r = mod.Resources[key];
		if (r)
			return r;
		return { Key: key, Content: "UNKNOWN RESOURCE '" + key + "'." };
	}

	/**
	 * Get a resource to be used within a template.
	 * @param {string} key - Resource key.
	 * @param {boolean} debugAsHtml - Optional flag indicating if the resource output can be rendered as HTML when the system is in debug mode.
	 */
	GetTemplateResource(key: string, debugAsHtml: boolean = false): string {
		let mod = this;

		let debugMode = mod.AppConfig.Core.Resource.DebugMode;
		//let debugMode = true;

		let r = mod.Resources[key];
		if (!r)
			// [TODO] Can we put this message (or the base part) in the resource collection so that it can be localized?
			return "UNKNOWN RESOURCE '" + key + "'.";

		let ret = '';
		if (debugMode) {
			if (debugAsHtml) {
				// [TODO] Need to centralize this rendering/markup.
				ret = "<span class='debugtip'><div class='debugtip__popup'>[" + key + "]</div></span>";
			} else {
				ret = '[' + r.Key + ']';
			}
		}
		ret += r.Content;

		return ret;
	}

	/**
	 * Render a template.
	 * @param {TemplateRunInfo} info - Template information.
	 * @param {JQuery} target - Template target container.
	 */
	public RenderTemplate(info: TemplateRunInfo, target: JQuery): void {
		//debugger;
		let mod = this;

		// Run the template and inject the output
		let pc = CpWeb.App.RenderTemplate(info);
		target.html(pc);

		mod.ProcessBindList();
	}

	/**
	 * Format a value according to a format string.
	 * @param {any} value - Source value.
	 * @param {string} format - Optional format string.
	 */
	public Format(value: any, format?: string): string {
		//debugger;
		let mod = this;
		let util = mod.Util;

		// Check for a function token
		// [TODO] Put function token into config or constant?
		if (format && format.length > 0 && format.substring(0, 1) == '|') {
			// Look for and execute the format function
			var fn = format.substring(1);
			if (mod[fn])
				return mod[fn](value);
			throw new Error("Invalid format helper '" + fn + "' specified."); // [TODO] Better error handling
		} else
			return mod.Util.Format(value, format);
	}

	/** Process pending post-template bind items. */
	public ProcessBindList(): void {
		//debugger;
		let mod = this;

		// Bind models where needed
		// [TODO] Automate
		if (mod.Util.HasData(CpWeb.App.BindList)) {
			for (let i = 0; i < CpWeb.App.BindList.length; i++) {
				let rb = CpWeb.App.BindList[i];
				let ss = $("#" + rb.ControlId);
				if (rb.Type == "bound") { // [TODO] Use enum or constant
					let sm = rb.Data;
					mod.BindModel(ss, sm);
				} else if (rb.Type == "callback") {
					// Save the callback info
					mod.Callbacks[rb.ExtraInfo.Callback] = { ControlPath: rb.ControlId, MetaPath: rb.ExtraInfo.MetaPath };

					if (mod[rb.ExtraInfo.Callback])
						mod[rb.ExtraInfo.Callback](rb.Data);
				}
			}

			// Clear the binding list
			CpWeb.App.BindList = [];
		}
	}

	// [3158][TODO] Pseudo-observer logic broken. Fix or remove.
	//public RebindTemplate(data: Observable, callback: (type: string) => void): void {
	//	let mod = this;

	//	if (!data) return; // [TODO] ERROR? What if rebinding isn't allowed or it is handled elsewhere? Return "boolean"?

	//	let id = data["_controlPath"]; // [TODO] Different location
	//	if (id) {
	//		let type = data["type"]; // [TODO] Get from Meta?
	//		if (type) {
	//			let template = CpWeb.App.GetTemplate(type);
	//			if (template) {
	//				let e = $("#" + id);
	//				if (e && e.length > 0) {
	//					let out = template.Template(data);
	//					e.replaceWith(out);

	//					//$(document).foundation();
	//					//if (type == "gizmo") { // [TODO] Add meta-data to know when masonry or foundation need to be reloaded
	//					//	mod.ReloadMasonry();
	//					//}
	//					if (callback)
	//						callback(type);
	//				} else {
	//					mod.RebindTemplate(data.parent(), callback);
	//				}
	//			} else {
	//				mod.RebindTemplate(data.parent(), callback);
	//			}
	//		} else {
	//			mod.RebindTemplate(data.parent(), callback);
	//		}
	//	} else {
	//		//let parent = data.parent();
	//		mod.RebindTemplate(data.parent(), callback);
	//	}
	//}
}

/**
 * Partial component wrapper.
 */
export abstract class PartialComponent extends ComponentModule implements IPartialComponent {
	/** Gets the parent component module. */
	public Parent: IComponentModule;

	constructor(id: string, ac: ApplicationContext) {
		super(id, ac);
		let mod = this;

		// Override the default callback
		this.DefaultServiceWatchCallback = mod.NotifyParent;
	}

	/**
	 * Tells the partial component it is about to be shown.
	 * The component can indicate that it should not be shown due to its current state.
	 * @returns {Promise<boolean>} - Promise that when resolved indicates if the component should be shown or not.
	 */
	public Show(): Promise<boolean> { return new Promise<boolean>((resolve, reject) => { resolve(true); }) }

	/**
	 * Tells the partial component it is about to be hidden.
	 * This is used to clean up the component.
	 */
	public Hide(): void { }

	/**
	 * Notify the parent component that a condition has been met.
	 * @param {string} modelPath - Optional path within the model to the flag collection. Default to "ServiceFlags".
	 */
	public NotifyParent(modelPath: string = "ServiceFlags"): void {
		//debugger;
		let mod = this;

		// Notify the parent, if one is attached
		if (mod.Parent)
			mod.Parent.SetServiceFlag("_" + mod._ID, modelPath);
	}
}

/**
 * Collection of sub-components.
 */
export class ComponentCollection extends KeyValueCollection<IPartialComponent> implements IComponentCollection { }
