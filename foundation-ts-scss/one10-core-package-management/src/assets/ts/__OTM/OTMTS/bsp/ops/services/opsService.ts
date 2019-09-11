/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, WsResponse, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { IErrorDetails, WsDiagAction, WsDiagItem, WsDiagModel, WsDiagResult, WsProcessFeedLog, WsProcessFeedLogRequest, WsProcessLog, WsProcessLogSearchRequest, WsProcessLogStep, WsProcessLogStepItem, WsProcessStatusType, WsProcessType } from 'bsp/ops/services/models/opsModels';

@Injectable(null, ScopeType.Singleton) // [TODO] Use DI AutoInit
export class OpsService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("OpsService", sm);

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

	public GetProcessTypes(): Promise<WsResponseData<WsProcessType[]>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/ops/getProcessTypes",
			Method: constants.Method.Get
		})
	}

	public GetProcessStatusTypes(): Promise<WsResponseData<WsProcessStatusType[]>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/ops/getProcessStatusTypes",
			Method: constants.Method.Get
		})
	}

	public GetProcessLogs(req: WsProcessLogSearchRequest): Promise<WsResponseData<WsProcessLog[]>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = {
			StartDate: req.StartDate,
			EndDate: req.EndDate,
			ProcessTypeId: req.ProcessTypeId,
			ProcessStatusTypeId: req.ProcessStatusTypeId,
			RunId: req.RunId
		};

		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/ops/getProcessLogs",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
			// [TODO] Come up with a JSON reviver pattern
			//Reviver: {
			//	Type: "none|auto|list|function",
			//	Fields: [{ field: "StartDate", type: "Date" }] // List version
			//	Function: (key, value) => { if ( key == "StartDate") return Date.parse(value); } // Function version
			//	Auto: This would look for certain patterns, maybe by field naming convention (end in "Date" or "Time").
			//}
		})
			.then((data: WsResponseData<WsProcessLog[]>) => {
				//debugger;
				// If we got data back, "revive" date fields
				if (data.ResponseCode == constants.ResponseCode.Success && data.Data && data.Data.length > 0) {
					let items = data.Data;
					for (let i = 0; i < items.length; i++) {
						let item = items[i];
						item.StartTime = new Date(item.StartTime.toString());

						// Variant: Copy to an "any" and then convert
						let s: any = item.StartTime;
						item.StartTime = new Date(s);

						// Example of a reviver (outside of service call)
						//var y = JSON.parse('{ StartDate: "2018-10-10", field2: "blah" }', (key, value) => {
						//	if (key == "StartDate")
						//		return Date.parse(value);
						//	return value;
						//});

						if (item.EndTime)
							item.EndTime = new Date(item.EndTime.toString());

						// [TODO] Revive step & step item date fields

						// [TODO] Format LogInfo XML?
					}
				}

				return data;
			});
	}

	public GetProcessFeedLogs(req: WsProcessFeedLogRequest): Promise<WsResponseData<WsProcessFeedLog[]>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = {
			ProcessLogId: req.ProcessLogId
		};

		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/ops/getProcessFeedLogs",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public RunDiag(action: string): Promise<WsResponseData<WsDiagResult>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		return services.MakeServiceCall({
			//EndPoint: appConfig.Core.WSRoot + "/pub/runDiag/" + action,
			EndPoint: appConfig.Core.WSRoot + action,
			Method: constants.Method.Get,
			Data: null
		});
	}
}
