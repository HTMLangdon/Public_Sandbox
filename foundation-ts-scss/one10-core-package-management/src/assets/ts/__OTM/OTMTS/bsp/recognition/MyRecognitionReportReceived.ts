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
import { RecognitionService, WsMyRecognitionReport } from 'bsp/services/recognitionService';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
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

		let reportData: WsMyRecognitionReport[];

		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			ReportData: reportData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
		});

		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "RecognitionDtlReport");
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
		var rptTitle = "RecognitionDtlReport"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call
		//debugger;

		mod.Services.ReportSvc.GetMyRecognitionReceviedReport(mod.State.model.Params)
			.then(data => {
				
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {

						//format date's here... required for excel export
						data.Data.ReportData.forEach(function (v1: any) {
							var d = new Date(v1.AddDt);
							v1.AddDt = d.toLocaleDateString("en-US");  //todo: globilization
						});

						let cols: any[] = data.Data.ColumnHeader;

						//  this.removeGrid($("#reportResults"));
						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							columns: cols,
							excel: {
								fileName: "Recognition Received Report.xlsx",
								filterable: true,
								allPages: true
							},
							excelExport: function (v2: any) {
								var index = cols.map(function (e) { return e.field }).indexOf('certUrl');
								var sheet = v2.workbook.sheets[0];
								sheet.columns[index].width = 0; //TODO: Is there a better way to hide, or rather delete, this column?
							},
							dataSource: {
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
