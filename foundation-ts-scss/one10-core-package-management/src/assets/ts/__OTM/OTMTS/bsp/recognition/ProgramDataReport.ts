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
import { RecognitionService, WsMyRecognitionReport, ProgramDataReportParameters } from 'bsp/services/recognitionService';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	RptParams: ProgramDataReportParameters;
	ReportData: WsMyRecognitionReport[];
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
		ReportSvc: <RecognitionService>null
	};

	constructor(ac: ApplicationContext, rs: RecognitionService) {
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

		let rptParams: ProgramDataReportParameters = {
			RecognitionId: null,
			RecognitionStatus: null,
			ReceiverStatus: null,
			RecognitionReceiverStatus: null,
			IncludePointLoad: true,
			ReceiverReportingLevel2: null,
			StartDate: null,
			EndDate: null,
		};

		let reportData: WsMyRecognitionReport[];

		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			RptParams: rptParams,
			ReportData: reportData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
		});

		mod.BindModel(null, model);
		mod.BindProgramNameDropDown();
		mod.BindRecognitionStatusDropDown();
		mod.BindReceiverRecognitionStatusDropDown();
		mod.BindReceiverStatusDropDown();
		mod.BindIncludeExternalPointLoadDropDown();

		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "ProgramDataReport");
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

	BindReport() {

		let mod = this;
		var rptTitle = "ProgramDataReport"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetProgramDataReport(mod.State.model.RptParams)
			.then(data => {

				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {

						//format date's here... required for excel export
						data.Data.ReportData.forEach(function (v1: any) {

							v1.UpdateDt = v1.UpdateDt != null ? new Date(v1.UpdateDt).toLocaleDateString("en-US") : null;  //todo: globilization
							v1.recognitionDateSubmitted = v1.recognitionDateSubmitted != null ? new Date(v1.recognitionDateSubmitted).toLocaleDateString("en-US") : null;
							v1.BeginDt = v1.BeginDt != null ? new Date(v1.BeginDt).toLocaleDateString("en-US") : null;
							v1.EndDt = v1.EndDt != null ? new Date(v1.EndDt).toLocaleDateString("en-US") : null;
							v1.ApprovalDt = v1.ApprovalDt != null ? new Date(v1.ApprovalDt).toLocaleDateString("en-US") : null;

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
								fileName: "Program Data Report.xlsx",
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

	BindProgramNameDropDown() {

		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetRecognitionProgramCd()
		.then(d => {
			if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
				if (d.Data != null) {
	
					model.set("ProgramName", d.Data);
				}
			}
		});
	}

	BindRecognitionStatusDropDown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetRecognitionStatusCd()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						model.set("RecognitionStatus", d.Data);
					}
				}
			});
	}

	BindReceiverRecognitionStatusDropDown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetReceiverRecognitionStatusCd()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						model.set("ReceiverRecognitionStatus", d.Data);
					}
				}
			});
	}

	BindReceiverStatusDropDown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetReceiverStatusCd()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						model.set("ReceiverStatus", d.Data);
					}
				}
			});
	}

	BindIncludeExternalPointLoadDropDown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetExternalPointLoad()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						model.set("IncludeExternalPointLoad", d.Data);
					}
				}
			});
	}
}
