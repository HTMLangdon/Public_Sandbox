/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { MockServiceModule, WsResponse, WsResponseData, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { IErrorDetails, WsDiagAction, WsDiagItem, WsDiagModel, WsDiagResult, WsProcessFeedLog, WsProcessFeedLogRequest, WsProcessLog, WsProcessLogSearchRequest, WsProcessLogStep, WsProcessLogStepItem, WsProcessStatusType, WsProcessType } from 'bsp/ops/services/models/opsModels';
import { DiagResults, Errors, ProcessFeedLogs, ProcessLogs, ProcessStatusTypes, ProcessTypes } from './opsData';

@Injectable(null, ScopeType.Singleton) // [TODO] Use DI AutoInit
export class OpsService extends MockServiceModule {
	constructor() {
		super("OpsService");
	}

	public GetErrors(startDate?: Date, endDate?: Date, errorId?: string): Promise<WsResponseData<IErrorDetails[]>> {
		let mod = this;

		let data = Errors;
		mod.CleanPaths(data)

		return new Promise<WsResponseData<IErrorDetails[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(data));
		});
	}

	public GetProcessTypes(): Promise<WsResponseData<WsProcessType[]>> {
		let mod = this;

		return new Promise<WsResponseData<WsProcessType[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(ProcessTypes));
		});
	}

	public GetProcessStatusTypes(): Promise<WsResponseData<WsProcessStatusType[]>> {
		let mod = this;

		return new Promise<WsResponseData<WsProcessStatusType[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(ProcessStatusTypes));
		});
	}

	public GetProcessFeedLogs(req: WsProcessFeedLogRequest): Promise<WsResponseData<WsProcessFeedLog[]>> {
		let mod = this;

		return new Promise<WsResponseData<WsProcessFeedLog[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData(ProcessFeedLogs));
		});
	}

	public GetProcessLogs(req: WsProcessLogSearchRequest): Promise<WsResponseData<WsProcessLog[]>> {
		let mod = this;

		return new Promise<WsResponseData<WsProcessLog[]>>((resolve, reject) => {
			let d = ProcessLogs;
			resolve(WsResponseData.SuccessData(ProcessLogs));
		});
	}

	public RunDiag(action: string): Promise<WsResponseData<WsDiagResult>> {
		let mod = this;
		let constants = ServiceConstants;

		let i = action.lastIndexOf('/');
		action = action.substring(i + 1);

		// Look for the action in the mock service collection
		let result = DiagResults[action];

		if (!result) {
			// [TODO] Show invalid action
			result = {
				Action: action,
				IsHealthy: false,
				AggregateResult: "",
				Info: []
			};
		}

		return new Promise<WsResponseData<WsDiagResult>>((resolve, reject) => {
			if (action == "error")
				// [TODO] Can we make this look more like what the server returns?
				resolve(new WsResponseData<WsDiagResult>(null, constants.ServiceStatusCode.Success, constants.ServiceStatusMessage.Success, constants.ResponseCode.Error, constants.ResponseMessage.Error));
			else
				resolve(WsResponseData.SuccessData(result));
		});
	}
}
