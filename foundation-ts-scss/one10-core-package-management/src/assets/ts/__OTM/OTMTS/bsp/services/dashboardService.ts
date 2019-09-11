/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { UserInfo, MenuItem, LoginResponse, LogoffResponse } from 'cp/securityShared';
import { ServiceModule, ServiceManager, WsResponse, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { WsUserGizmoResponse, GizmoInfo, WsGizmoData, GizmoStructure } from 'bsp/services/models/dashboardModels';

@Injectable(null, ScopeType.Singleton)
export class DashboardService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("DashboardService", sm);

		//debugger;
		let mod = this;

		// Initialize
		mod.Initialize();
	}

	public GetUserGizmos(): Promise<WsResponseData<WsUserGizmoResponse>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/home/getUserGizmos",
			Method: constants.Method.Get
		})
			.then((r: WsResponseData<GizmoInfo[]>) => {
				let ret = {
					structure: GizmoStructure,
					gizmos: []
				};

				if (r.ResponseCode == constants.ResponseCode.Success) {
					ret.gizmos = r.Data;
				} else {
					// @@@ nothing?
				}

				mod.CleanPaths(ret);

				return {
					StatusCode: r.StatusCode, Status: r.Status, ResponseCode: r.ResponseCode, ResponseKey: r.ResponseKey, ResponseMessage: r.ResponseMessage,
					Errors: [],
					Data: ret
				};
			});
	}

	public GetGizmoData(req: GizmoInfo): Promise<WsResponseData<WsGizmoData>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// [TODO] Do we need to include the data source? Include anything else? Custom additional params indicated by the "get inclusion" process?
		let data = { id: req.id, subtype: req.subtype, dataSourceType: req.dataSourceType, dataSource: req.dataSource };		

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: req.dataSource,
			Method: constants.Method.Post,
			Data: JSON.stringify(data),
			ParseDates: true
		});
	}
}

