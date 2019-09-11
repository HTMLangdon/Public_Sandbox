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
import { ClaimService, WsFileData } from 'bsp/services/claimService';
import { ReportParameters } from 'bsp/services/models/reportModels';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	FileData: WsFileData[];
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
			SearchType: "",
			SearchValue:""
		};

		let fileData: WsFileData[];
		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			FileData: fileData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
			btnReset_Click: function () {
				mod.ClearModel();
			}
		});
		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "BulkClaimSubRpt");
		mod.BindFileDropdown();
		mod.Controls.RootElement.foundation();
	}

	BindFileDropdown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetAllFileNames(mod.State.model.Params)
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						d.Data.unshift({ SearchType: "0", SearchValue: "(Please select a File)"});
						model.set("Params.SearchType", "0");
						model.set("FileData", d.Data);
					}
				}
			});

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
		var rptTitle = "BulkClaimSubRpt"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call
		// debugger;
		mod.Services.ReportSvc.GetSubmittedBulkClaimReport(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {

						data.Data.ReportData.forEach(function (v1: any) {

							v1.SaleDate = v1.SaleDate != null ? new Date(v1.SaleDate).toLocaleDateString("en-US") : null; //todo: globilization
							v1.UploadedOn = v1.UploadedOn != null ? new Date(v1.UploadedOn).toLocaleDateString("en-US") : null;

						});

						let cols: any[] = data.Data.ColumnHeader;
						//  this.removeGrid($("#reportResults"));
						$("#reportResults").html("");
						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							columns: cols,
							excel: {
								fileName: "Bulk Claim Report.xlsx",
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
							pageable: true,
							sortable: true,
							filterable: true,
							scrollable: true
						});
					}
				}
			});
	}

	ClearModel(): void {
		//debugger;

		let mod = this;
		let model = mod.State.model;
		let services = mod.Services;

		mod.State.model.set("Params.StartDate", "");
		mod.State.model.set("Params.EndDate", "");

	}
}
