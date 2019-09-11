/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';

//export interface IKeyValuePair extends Observable {
export interface IKeyValuePair {
	Key: string;
	Value: string;
}
//export interface IKeyValueCollection extends Observable {
export interface IKeyValueCollection {
	Name: string;
	Items: IKeyValuePair[];
}

/**
 * Status type.
 */
export class StatusType {
	/** Status (ID/code). */
	public Status: number;
	/** Status name. */
	public StatusName: string;
}

/**
 * Locale type.
 */
export class LocaleType {
	/** Locale ID. */
	public LocaleId: string;
	/** Locale description. */
	public LocaleDescription: string;
}

export class Quicklink {
	public Name: string;
	public Link: string;
}



/**
 * Service used to interact with common data and lookups.
 */
@Injectable(null, ScopeType.Singleton)
export class CommonService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("CommonService", sm);

		//debugger;
		//let mod = this;
	}

	/**
	 * Gets the list of locale types (lookup).
	 * @returns {Promise<WsResponseData<LocaleType[]>>} Promise that will resolve to the locale type lookup data.
	 */
	GetLocaleTypes(): Promise<WsResponseData<LocaleType[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/common/locales",
			Method: constants.Method.Get,
			Data: null
		});
	}

	/**
	 * Gets the list of status types (lookup).
	 * @returns {Promise<WsResponseData<StatusType[]>>} Promise that will resolve to the status type lookup data.
	 */
	GetStatusTypes(): Promise<WsResponseData<StatusType[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/common/statuses",
			Method: constants.Method.Get,
			Data: null
		});
	}

	/**
	 * Get a status name based on its numeric value.
	 * @param {number} value - Numeric status code.
	 * @returns {string} Status name.
	 */
	ParseStatus(value: number): string { // @@@ Get from DB
		switch (value) {
			case 0: return "Inactive";
			case 1: return "Active";
			case 2: return "Deleted";
			case -1: return "None";
			default: return "Unknown";
		}
	}

	GetQuickLinks(): Promise<WsResponseData<Quicklink[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/getQuickLinks",
			Method: constants.Method.Post,
			//TryCount: 3,
			//Timeout: 10000,
			Data: null 
		});
	}
}
