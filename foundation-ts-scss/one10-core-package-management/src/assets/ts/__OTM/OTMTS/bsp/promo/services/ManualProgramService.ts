/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, WsResponseData, MockServiceModule, ICallInfo } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { WsManualForm, WsProgramType, WsJobTitle, WsAccountNumber, WsDateRange, WsProgramData, WsSimilarProgramCheckRequest, WsBackupUser } from './models/manualProgramModels';
//import { WsXxx, WsYyyRequest, WsYyy } from '../models/manualProgramServiceModels';

@Injectable(null, ScopeType.Singleton)
export class ManualProgramService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("ManualProgramService", sm);

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

  public GetProgramTypes(): Promise<WsResponseData<WsProgramType[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/GetProgramTypes",
      Method: constants.Method.Post
    });
  }


  public GetJobTitles(): Promise<WsResponseData<WsJobTitle[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/GetJobTitles",
      Method: constants.Method.Post
    });
  }

  public GetAccountNumbers(): Promise<WsResponseData<WsAccountNumber[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/GetAccounts",
      Method: constants.Method.Post
    });
  }

  public GetBackupUsers(userId: number): Promise<WsResponseData<WsBackupUser[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;

    let d = { UserId: userId };

    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/GetManualProgramBackups",
      Method: constants.Method.Post,
      Data: JSON.stringify(d)
    });
  }

  public CreateManualProgram(req: WsManualForm): Promise<WsResponseData<WsManualForm[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/CreateManualProgram",
      Method: constants.Method.Post,
      Data: JSON.stringify(req)
    });
  }

  public CheckForSimilarPrograms(req: WsSimilarProgramCheckRequest): Promise<WsResponseData<WsProgramData[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    debugger;
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Promo/CheckForSimilarPrograms",
      Method: constants.Method.Post,
      Data: JSON.stringify(req)
    });
  }
}
