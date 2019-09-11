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
import { AccountService } from 'bsp/services/accountService';
import { ReportParameters } from 'bsp/services/models/reportModels';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	//GameData: WsIMData[];
}

interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
	btnValidate: JQuery;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
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
		var today = new Date();
		var dd = String(today.getDate());
		var mm = String(today.getMonth() + 1); //January is 0!
		var yyyy = String(today.getFullYear()-1);

		if (Number(dd) < 10) {
			dd = '0' + dd
		}

		if (Number(mm) < 10) {
			mm = '0' + mm
		}

		let params: ReportParameters = {
			RptID: "",
			StartDate: new Date(mm + '/' + dd + '/' + yyyy),
			EndDate: new Date(),
			ParticipantId: null,
			SearchValue: null
		};

		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
		});


		var queryString = document.location.search.substring(1);
		const paramsNew = {};

		const queries = queryString.split("&");

		queries.forEach((indexQuery: string) => {
			const indexPair = indexQuery.split("=");

			const queryKey = decodeURIComponent(indexPair[0]);
			const queryValue = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : "");

			paramsNew[queryKey] = queryValue;
		});


		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "EarningsStatement");
		model.set("Params.SearchValue", paramsNew["ContactCtrContactId"]);
		model.set("Params.ParticipantId", paramsNew["ContactCtrUserId"] );

		//mod.Controls.RootElement.foundation();
		mod.BindReport();
	}

	public btnSubmit_Click(e) {
		let mod = this;
		mod.BindReport();
	}

	BindReport() {
		let mod = this;
		var rptTitle = "Earnings Statement"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetEarningsStatement(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {

					if (data.Data.ReportDataPoints != null) {
						let cols: any[] = data.Data.ColumnHeaderPoints;
						//this.removeGrid($("#reportResults"));

						var element = $("#reportResultsPoints").kendoGrid({
							dataSource: {
								serverPaging: false,
								serverSorting: false,
								serverFiltering: false,
								data: data.Data.ReportDataPoints,
								pageSize: 10
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
			
					if (data.Data.ReportData != null) {
						let cols: any[] = data.Data.ColumnHeader;
						//this.removeGrid($("#reportResults"));

						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							excel: {
								fileName: "EarningsStatement.xlsx",
								filterable: true,
								allPages: true
							},
							dataSource: {
								//serverPaging: false,
								//serverSorting: false,
								//serverFiltering: false,
								data: data.Data.ReportData,
								pageSize: 100
							},
							noRecords: true,
							messages: {
								noRecords: "There is no data for this selection."
							},
							dataBound: function (e) {
								for (var i = 0; i < this.columns.length; i++) {
									this.autoFitColumn(i);
								}
							},
							columns: cols,
							pageable: true,
							sortable: true,
							filterable: true,
							scrollable: false
						});
					}
					element.setDataSource(data.Data.ReportData);
				}
			});
	}
}
