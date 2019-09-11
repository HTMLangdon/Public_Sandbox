/****************************************************************************
Copyright (c) 2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/
import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { ServiceConstants } from 'cp/serviceShared';
import { ReportParameters } from 'bsp/services/models/reportModels';
import { ClaimService, WsMyClaimReport, ClaimReportParameters } from 'bsp/services/claimService';

interface SectionModel extends ComponentModel {
	RptParams: ClaimReportParameters;
	ReportData: WsMyClaimReport[];
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
		ReportSvc: <ClaimService>null
	};

	constructor(ac: ApplicationContext, rs: ClaimService) {
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
			EndDate: null,
		};

		let rptParams: ClaimReportParameters = {
			SalesDateFrom: null,
			SalesDateTo: null,
			ClaimDateFrom: null,
			ClaimDateTo: null,
			ContactId: 0
		};

		let reportData: WsMyClaimReport[];

		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			RptParams: rptParams,
			ReportData: reportData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
			btnReset_Click: (e: any) => { mod.btnReset_Click.call(mod, e); },
		});

		mod.BindModel(null, model);
		//mod.BindProgramNameDropDown();
		//mod.BindRecognitionStatusDropDown();
		//mod.BindReceiverRecognitionStatusDropDown();
		//mod.BindReceiverStatusDropDown();
		//mod.BindIncludeExternalPointLoadDropDown();

		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "SubmittedClaimReport");
		mod.Controls.RootElement.foundation();
	}

	removeGrid(g) {
		var tmp = [];
		try {
			tmp = g.data("kendoGrid").dataSource.data();
		} catch (e) { }
		var container = g.parent();
		g.remove();
		container.append("<div id='" + g.attr("id") + "' class='" + g.attr("class") + "'></div>");
		return tmp;
	}

	public btnSubmit_Click(e) {
		let mod = this;
		mod.BindReport();
	}

	public btnReset_Click(e) {

		let mod = this;
		let model = mod.State.model;

		this.removeGrid($("#reportResults"));
		model.set("RptParams.SalesDateFrom", "");
		model.set("RptParams.SalesDateTo", "");
		model.set("RptParams.ClaimDateFrom", "");
		model.set("RptParams.ClaimDateTo", "");

	}

	BindReport() {

		let mod = this;
		let model = mod.State.model;

		var rptTitle = "SubmittedClaimReport"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		if (!mod.State.model.RptParams.ClaimDateFrom) {
			model.set("RptParams.ClaimDateFrom", "1/1/1900");
		}

		if (!mod.State.model.RptParams.ClaimDateTo) {
			model.set("RptParams.ClaimDateTo", new Date());
		}

		if (!mod.State.model.RptParams.SalesDateFrom) {
			model.set("RptParams.SalesDateFrom", "1/1/1900");
		}

		if (!mod.State.model.RptParams.SalesDateTo) {
			model.set("RptParams.SalesDateTo", new Date());
		}


		mod.Services.ReportSvc.GetSubmittedClaimReport(mod.State.model.RptParams)
			.then(data => {

				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {

						//format date's here... required for excel export
						data.Data.ReportData.forEach(function (v1: any) {
							v1.Salesdate = v1.Salesdate != null && v1.Salesdate != "" ? new Date(v1.Salesdate).toLocaleDateString("en-US") : "";  //todo: globilization
							v1.AddDt = v1.AddDt != null && v1.AddDt != "" ? new Date(v1.AddDt).toLocaleDateString("en-US") : "";
							v1.AwardDate = v1.AwardDate != null && v1.AwardDate != "" ? new Date(v1.AwardDate).toLocaleDateString("en-US") : "";
						});

						let cols: any[] = data.Data.ColumnHeader;

						this.removeGrid($("#reportResults"));

						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							columns: cols,
							//excelExport: function (v2: any) {
							//var index = cols.map(function (e) { return e.field }).indexOf('certUrl');
							//var sheet = v2.workbook.sheets[0];
							//sheet.columns[index].width = 0; //TODO: Is there a better way to hide, or rather delete, this column?
							//},
							excel: {
								fileName: "Submitted Claim Report.xlsx",
								filterable: true,
								allPages: true
							},
							dataSource: {
								data: data.Data.ReportData,
								pageSize: 10
							},
							noRecords: true,
							messages: {
								noRecords: "There is no data for this selection."
							},
							/*dataBound: function () {
								for (var i = 0; i < this.columns.length; i++) {  //TODO:  This is causing several seconds to get added to page load. 
									this.autoFitColumn(i);
								}
							},*/
							pageable: true,
							sortable: true,
							filterable: true,
							scrollable: true
						});
					}
				}
			});
	}

}
