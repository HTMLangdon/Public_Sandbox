/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Shared core module functionality.
 * @module cp/moduleShared
 */

import { Utility } from './util';
import { Log } from './log';
import { Config } from '~config';
import { CommonService } from 'bsp/services/commonService';
import { Inject } from 'cp/di';

/*
 * Core module class to be inherited by all other modules and components.
 * This is a non-Generic interface created for easier use.
 */
export interface IModule {
	/** Intenal module ID. */
	_ID: string;

	/** Module configuration. */
	Config: ModuleConfig;

	/** Module state. */
	State: IModuleState;

	/** Application logger. */
	Log: Log;

	/** Common utility. */
	Util: Utility;

	/** Application configuration. */
	AppConfig: Config;

	/** Global (window-level) variable name for the component.
	 * If blank or null, it will not be registered.
	 * This value may be set externally during module creation.
	 */
	GlobalReference: string;

	/**
	 * Initialize the module.
	 * @param {any} model - Optional model to be used by the component.
	 */
	Initialize(model?: any): void;

	/**
	 * Write a message to the log.
	 * @param {string} message - Message to be written.
	 * @param {any} data - Optional data to attach to the log entry.
	 */
	WriteLog(message: string, data?: any): void;
}

/**
 * Core module class to be inherited by all other modules and components.
 */
export abstract class Module implements IModule {
	/** Private module ID. Used primarily for logging to indicate scope. */
	private pmid = "Module";

	/** Intenal module ID. */
	public _ID: string;

	/** Module configuration. */
	public Config: ModuleConfig = <ModuleConfig>{};

	/** Module state. */
	public State: IModuleState = <IModuleState>{
		model: null,
		temp: {}
	};

	/** Application logger. */
	public Log: Log = Log.GetInstance();

	/** Common utility. */
	public Util = Utility;

	/** Application configuration. */
	@Inject()
	public AppConfig: Config;

	/** Global (window-level) variable name for the component.
	 * If blank or null, it will not be registered.
	 * This value may be set externally during module creation.
	 */
	public GlobalReference: string = "";

	/**
	 * Create an instance of the module.
	 * @param {string} id - Module ID.
	 */
	constructor(id: string) {
		let mod = this;
		
		mod.Log.Write("Create: " + id, mod.pmid);

		// Save the ID
		mod._ID = id;
	}

	/**
	 * Initialize the module.
	 * @param {any} model - Optional model to be used by the component.
	 */
	public Initialize(model: any = null): void {
		//debugger;
		let mod = this;
		mod.Log.Write("Initialize", this.pmid);

		// Save the model, if specified
		if (!mod.Util.IsNull(model))
			mod.State.model = model;
	}

	/**
	 * Write a message to the log.
	 * @param {string} message - Message to be written.
	 * @param {any} data - Optional data to attach to the log entry.
	 */
	public WriteLog(message: string, data?: any): void {
		let mod = this;
		mod.Log.Write(message, mod, data);
	}
}
