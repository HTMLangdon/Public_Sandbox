/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { ServiceConstants } from 'cp/serviceShared';
//import { ReportParameters, AccountService, WsIMData } from 'bsp/services/accountService';
import { ReportParameters } from 'bsp/services/models/reportModels';
import { AccountService } from 'bsp/services/accountService';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	//GameData: WsIMData[];
}

interface SectionState extends ComponentState<SectionModel> { }
//interface SectionControls extends ComponentControls {
//	btnValidate: JQuery;
//}

@Injectable()
export class PageComponent extends ComponentModule {
	//public Controls: SectionControls;
	public State: SectionState;

	public Services = {
		Constants: ServiceConstants,
		ReportSvc: <AccountService>null
	};

	constructor(ac: ApplicationContext, rs: AccountService) {
		// Call the parent
		super("Page", ac);

		let mod = this;
		mod.Services.ReportSvc = rs;
	}

	Initialize() {
		let mod = this;
		let state = mod.State;
		let util = mod.Util;

		// Call the parent
		super.Initialize();
		let params: ReportParameters = {
			RptID: "",
			StartYear: 0,
			StartMonth: 0,
			SearchValue: "",
			StatusCd: ""
		};

		//let imData: WsIMData[];
		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params
		});
		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic

		model.set("Params.RptID", "LoginActRptdtl");
		model.set("Params.StartYear", new URLSearchParams(document.location.search).get("AccessYear"));
		model.set("Params.StartMonth", new URLSearchParams(document.location.search).get("AccessMonth"));
		model.set("Params.SearchValue", new URLSearchParams(document.location.search).get("EventId"));
		model.set("Params.StatusCd", new URLSearchParams(document.location.search).get("EventStatus"));

		//mod.Controls.RootElement.foundation();
		mod.BindReport();
	}

	BindReport() {
		//debugger;
		let mod = this;
		var rptTitle = "Login Activity Detail Report"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetLoginActivityDetailData(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {
						let cols: any[] = data.Data.ColumnHeader;

						var element = $("#reportResults").kendoGrid({
							dataSource: {
								serverPaging: false,
								serverSorting: false,
								serverFiltering: false,
								data: data.Data.ReportData
							},
							dataBound: function (e) {
								e.sender.saveAsExcel()
									//,e.sender.table.hide()
									;
							},
							noRecords: true,
							messages: {
								noRecords: "There is no data for this selection."
							},
							columns: cols,
							pageable: false,
							sortable: false,
							filterable: false,
							scrollable: false

						});
					}
					//element.setDataSource(data.Data.ReportData);
					//element.dataBound();

				}
			});
	}
}
