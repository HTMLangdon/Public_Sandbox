/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { PartialComponent, ComponentCollection } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
import { ServiceConstants, ServiceCollection } from 'cp/serviceShared';
import { OpsService } from 'bsp/ops/services/opsService';
//import { OpsService } from 'bsp/ops/services/mock/opsService';
import { WsProcessLog, WsProcessType, WsProcessStatusType, WsProcessLogSearchRequest, WsProcessFeedLogRequest } from 'bsp/ops/services/models/opsModels';

export interface FilterLookups extends Observable {
	ProcessTypes: WsProcessType[];
	ProcessStatusTypes: WsProcessStatusType[];
}

export interface FilterSearch extends WsProcessLogSearchRequest, Observable { }

export interface FilterModel extends ComponentModel {
	Data: FilterSearch;
	Lookups: FilterLookups;
}

interface FilterState extends ComponentState<FilterModel> { }

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Ops: OpsService = null;
}

@Injectable()
export class FilterComponent extends PartialComponent {
	//public Controls: FilterControls;
	public State: FilterState;
	@Inject() public Services: SectionServices;

	constructor(ac: ApplicationContext) {
		// Call the parent
		super("Filter", ac);

		let mod = this;

		// Default to today 00:00:00 to 23:59:59
		let start = new Date();
		start.setHours(0, 0, 0, 0);
		let end = new Date(start.getTime());
		end.setHours(23, 59, 59, 0);

		// Create the initial model
		mod.State.model = <FilterModel>mod.CreateObservable({
			Data: {
				StartDate: start,
				EndDate: end,
				ProcessTypeId: 0,
				ProcessStatusTypeId: "",
				RunId: ""
			},
			Lookups: {
				ProcessTypes: [],
				ProcessStatusTypes: []
			}
		},
			["ProcessTypes", "ProcessStatusTypes"]
		);
	}

	Initialize() {
		let mod = this;
		let state = mod.State;
		let util = mod.Util;
		let controls = mod.Controls;
		let config = mod.Config;

		let services = mod.Services;

		// Call the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		// Fetch the data
		mod.BindData();
	}

	BindData(): void {
		let mod = this;
		let model = mod.State.model;

		mod.Services.Ops.GetProcessTypes()
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					// Sort based on type name
					let d = data.Data.sort((a, b) => a.ProcessTypeName > b.ProcessTypeName ? 1 : -1);

					// Add an empty option
					d.unshift({ ProcessTypeId: 0, ProcessTypeName: "(All)" });

					// Save the data to the model
					// model.Lookups.ProcessTypes = d; // Tip: Write like this and convert to "set"
					model.Lookups.set("ProcessTypes", d);

					// Tell the service watcher the data is ready
					mod.SetServiceFlag("ProcessTypes");
				} else {
					mod.ShowMessage(mod.Config.Messages.FetchError, CalloutType.Error);
				}
			});

		mod.Services.Ops.GetProcessStatusTypes()
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					// Sort based on type name
					let d = data.Data.sort((a, b) => a.ProcessStatusTypeName > b.ProcessStatusTypeName ? 1 : -1);

					// Add an empty option
					d.unshift({ ProcessStatusTypeId: "", ProcessStatusTypeName: "(All)" });

					// Save the data to the model
					model.Lookups.set("ProcessStatusTypes", d);

					// Tell the service watcher the data is ready
					mod.SetServiceFlag("ProcessStatusTypes");
				} else {
					mod.ShowMessage(mod.Config.Messages.FetchError, CalloutType.Error);
				}
			});
	}
}
