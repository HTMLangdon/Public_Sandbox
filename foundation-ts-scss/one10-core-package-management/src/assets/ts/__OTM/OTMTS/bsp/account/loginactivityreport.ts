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
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "LoginActRptSum");

		//mod.Controls.RootElement.foundation();
		mod.BindReport();
	}

	//removeGrid(g) {
	//	var tmp = [];
	//	try {
	//		tmp = g.data("kendoGrid").dataSource.data();
	//	} catch (e) { }
	//	var container = g.parent();
	//	g.remove
	//	container.append("<div id='" + g.attr("id") + "' class='" + g.attr("class") + "'></div>");
	//	return tmp;
	//}


	BindReport() {
		//debugger;
		let mod = this;
		var rptTitle = "Login Activity Report"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetLoginActivityData(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {
						let cols: any[] = data.Data.ColumnHeader;
						//this.removeGrid($("#reportResults"));

						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							excel: {
								fileName: "LoginActivityReport.xlsx",
								filterable: true,
								allPages: true
							},
							dataSource: {
								serverPaging: false,
								serverSorting: false,
								serverFiltering: false,
								data: data.Data.ReportData,
								pageSize: 100
							},
							noRecords: true,
							messages: {
								noRecords: "There is no data for this selection."
							},
							columns: cols,
							pageable: true,
							sortable: true,
							filterable: true,
							scrollable: true

						});
					}
					//element.setDataSource(data.Data.ReportData);

				}
			});
	}
}
