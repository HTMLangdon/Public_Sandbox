/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
//import { ServiceModule } from 'cp/serviceShared';
import { ServiceModule, ServiceManager } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';

//debugger;

export class WsUserModel {
	public UserId: number;
	public UserName: string;
	public Email: string;
	public LocaleId: string;
	public AuthenticationType: number;
	public Status: number;
	public LockoutStatus: number;
	public LockoutDate: Date;
	public AccessFailedCount: number;
	public ForcePasswordChange: number;
	public NewPassword: string;
}

@Injectable(null, ScopeType.Singleton)
export class UserService extends ServiceModule {

	constructor(sm: ServiceManager) {
		// Call the parent
		super("UserService", sm);

		//debugger;
		let mod = this;

		// Initialize
		mod.Initialize();
	}

	Initialize() {
		// Call the parent
		super.Initialize();

		//debugger;
		let mod = this;
		let util = mod.Util;

		mod.WriteLog("Initialize.");
	}
	
	UpdateUser(item: WsUserModel): Promise<WsResponse> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/user/UpdateMain",
			Method: constants.Method.Post,
			Data: JSON.stringify(item)
		});
	}

	UnlockUser(data: WsUserModel): Promise<WsResponse> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/user/UnlockUser",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	ParseLockout(value) { // @@@ Use DB lookup
		//debugger;
		switch (value) {
			case 0: return "Unlocked";
			case 1: return "Locked";
			default: return "Unknown";
		}
	}
}
