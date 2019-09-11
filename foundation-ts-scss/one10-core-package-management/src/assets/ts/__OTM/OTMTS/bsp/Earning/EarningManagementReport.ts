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
import { EarningService,  WsPromotion, WsStatus } from 'bsp/services/earningService';
import { ReportParameters } from 'bsp/services/models/reportModels';
//import { GameService, WsGameData } from 'bsp/services/gameService';

interface SectionModel extends ComponentModel {
	Params: ReportParameters;
	PromotionData: WsPromotion[];
	SelectedPromotions: WsPromotion[];
	SelectedCodes: WsStatus[];
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
		ReportSvc: <EarningService>null
	};

	constructor(ac: ApplicationContext, rs: EarningService) {
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
			PromotionId: "",
			StartDate: "",
			EndDate: "",
			StatusCd: ""
		} as any;



		let promotionData: WsPromotion[];
		let model: SectionModel = state.model = mod.CreateObservable({
			Params: params,
			PromotionData: promotionData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
		});
		mod.BindModel(null, model);
		//@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
		model.set("Params.RptID", "ParticipantDtlReport");
		mod.BindPromotionDropdown();
		mod.BindStatusDropdown();
		mod.Controls.RootElement.foundation();
	}

	BindPromotionDropdown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetDistinctEarningPromotions()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						d.Data.unshift({ PromotionId: "", PromotionDesc: "All Promotions" });
						model.set("Params.PromotionId", "");
						model.set("PromotionData", d.Data);
					}
				}
			});

	}

	BindStatusDropdown() {
		let mod = this;
		let model = mod.State.model;

		mod.Services.ReportSvc.GetEarningStatusCd()
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data != null) {
						model.set("Params.StatusCd", "");
						model.set("StatusData", d.Data);
						//model.set("StringData", model.Params.StatusCd)

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
		var rptTitle = "EarningManagementReport"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		let selectedPromotionsCSV: string = "";
		let selectedPromotions = mod.State.model.SelectedPromotions;
		if (selectedPromotions != null && selectedPromotions.length > 0) {
			selectedPromotions.forEach(function (promo, index) {
				if (selectedPromotionsCSV != "")
					selectedPromotionsCSV = selectedPromotionsCSV + "," + promo.PromotionId;
				else
					selectedPromotionsCSV = promo.PromotionId;
			});
		}

		let selectedCodesCSV: string = "";
		let selectedCodes = mod.State.model.SelectedCodes;
		if (selectedCodes != null && selectedCodes.length > 0) {
			selectedCodes.forEach(function (code, index) {
				if (selectedCodesCSV != "")
					selectedCodesCSV = selectedCodesCSV + "," + code.StatusCd;
				else
					selectedCodesCSV = code.StatusCd;
			});
		}

		mod.State.model.set("Params.PromotionId", selectedPromotionsCSV);
		mod.State.model.set("Params.StatusCd", selectedCodesCSV);
		mod.Services.ReportSvc.GetEarningManagementReport(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {
						let cols: any[] = data.Data.ColumnHeader;
						this.removeGrid($("#reportResults"));
						var element = $("#reportResults").kendoGrid({
							toolbar: ["excel"],
							excel: {
								fileName: "Earning Management Report.xlsx",
								filterable: true,
								allPages: true
							},
							dataSource: {
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
							scrollable: true
						});
					}
				}
			});
	}
}
