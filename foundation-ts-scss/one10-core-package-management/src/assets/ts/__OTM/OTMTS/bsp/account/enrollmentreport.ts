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
import { ErrorMessage } from 'bsp/services/models/errorModels';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	ErrorMsg: ErrorMessage;
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
		let params: ReportParameters = {
			RptID: "",
			StartDate: null,
			EndDate: null
		};

		let error: ErrorMessage = {
			errorMsg: "",
			showError: false
		};

		let model: SectionModel = state.model = mod.CreateObservable({
			ErrorMsg: error,
			Params: params,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
		});

		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "EnrollmentRpt");

		//mod.Controls.RootElement.foundation();
		//mod.BindReport();
	}

	public btnSubmit_Click(e) {
		let mod = this;
		if (mod.checkForInputErrors()) {
			mod.BindReport();
		}
	}

	private checkForInputErrors() : boolean {
		let mod = this;
		mod.State.model.set("ErrorMsg", ""); //clear errors
		if (mod.State.model.Params.StartDate != null || mod.State.model.Params.EndDate != null) {
			if (mod.State.model.Params.StartDate > mod.State.model.Params.EndDate) {

				let error: ErrorMessage = {
					errorMsg: "The start date must come before the end date.",
					showError: true
				};

				mod.State.model.set("ErrorMsg", error);
				return false;
			}
			else
				return true;
		} else 
			return true; //null dates are allowed for this report
	}

	BindReport() {
		//debugger;
		let mod = this;
		var rptTitle = "Enrollment Report"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetEnrollmentDetailData(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {
						let cols: any[] = data.Data.ColumnHeader;
						//this.removeGrid($("#reportResults"));

						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							excel: {
								fileName: "EnrollmentReport.xlsx",
								filterable: true,
								allPages: true
							},
							dataSource: {
								serverPaging: false,
								serverSorting: false,
								serverFiltering: false,
								data: data.Data.ReportData,
								pageSize: 10
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
							scrollable: true
						});
					}
					element.setDataSource(data.Data.ReportData);
				}
			});
	}
}
