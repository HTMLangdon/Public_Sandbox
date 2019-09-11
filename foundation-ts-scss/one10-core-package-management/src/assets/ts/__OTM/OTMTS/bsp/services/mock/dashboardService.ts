/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule, WsResponse, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { GizmoData, EarningsChecksPending, EarningsChecksPaid } from './dashboardData';
import { WsUserGizmoResponse, GizmoInfo, WsGizmoData, GizmoStructure } from 'bsp/services/models/dashboardModels';
import { KeyValueCollection } from 'cp/util';
import { RecognitionService, WsRecognitionData, WsRecogitionMenu, WsStat, WsRecognitionPerson } from 'bsp/services/recognitionService';

@Injectable(null, ScopeType.Singleton)
export class DashboardService extends ServiceModule {
	constructor(sm: ServiceManager) {
		super("DashboardService", sm);
	}

	public GetUserGizmos(): Promise<WsResponseData<WsUserGizmoResponse>> {
		//debugger;
		let mod = this;

		let data = GizmoStructure;
		mod.CleanPaths(data);
		let list: GizmoInfo[] = [];
		GizmoData.forEach((value, index, arr) => {
			let meta = GizmoStructure[value.subtype];
			list.push({ gizmoId: value.gizmoId, id: value.id, subtype: value.subtype, dataSourceType: meta.dataSourceType, dataSource: meta.dataSource });
		});

		return new Promise<WsResponseData<WsUserGizmoResponse>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<WsUserGizmoResponse>({ structure: data, gizmos: list }));
		});
	}

	public GetGizmoData(req: GizmoInfo): Promise<WsResponseData<WsGizmoData>> {
		//debugger;
		let mod = this;

		//let data = GizmoData;
		let data = GizmoData.first(item => item.id == req.id && item.subtype == req.subtype);
		mod.CleanPaths(data);

		return new Promise<WsResponseData<WsGizmoData>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<WsGizmoData>(data));
		});
	}

	private GetMockPagedData(source: any[], pageSize: number, currentSize: number): Promise<WsResponseData<any[]>> {
		//debugger;
		let mod = this;
		let data = [];
		let max = currentSize + pageSize;
		if (max > source.length) max = source.length;

		for (let i = 0; i < max; i++) {
			data.push(source[i]);
		}

		return new Promise<WsResponseData<any[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<any[]>(data));
		});
	}

	public Get_earningsCheck_pending(pageSize: number, currentSize: number): Promise<WsResponseData<any[]>> {
		//debugger;
		let mod = this;
		return mod.GetMockPagedData(EarningsChecksPending, pageSize, currentSize);
	}

	public Get_earningsCheck_paid(pageSize: number, currentSize: number): Promise<WsResponseData<any[]>> {
		//debugger;
		let mod = this;
		return mod.GetMockPagedData(EarningsChecksPaid, pageSize, currentSize);
	}
}
