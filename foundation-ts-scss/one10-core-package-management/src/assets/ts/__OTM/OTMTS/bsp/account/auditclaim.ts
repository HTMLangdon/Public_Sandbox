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
import { AccountService, WsAuditStatusData } from 'bsp/services/accountService';
import { AuditClaimParameters, ReportHeader, UpdateAuditClaimParameters, ClaimRowXML } from 'bsp/services/models/reportModels';
import { ErrorMessage } from 'bsp/services/models/errorModels';
import { ComplexControl } from 'cp/util';

interface SectionModel extends ComponentModel {
	Params: AuditClaimParameters;
	ErrorMsg: ErrorMessage;
	StatusData: WsAuditStatusData[];
}

interface ClaimRow extends UpdateAuditClaimParameters, Observable {
	SIPromoId: number;
	ProductId: number;
	InputDataId: string;
	ContactTypeCD: number;
	SerialNumber: string;
	ModelNumber: string;
	SalesDate: string;
	UserId: number;
}



interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
	bulkUpdPanel: JQuery;
	reportResults: ComplexControl<kendo.ui.Grid>;
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

		mod.GetControls(["bulkUpdPanel"]);

		// Call the parent
		super.Initialize();
		let params: AuditClaimParameters = {
			ClaimId: null,
			ClaimStatus: "",
			SoldCompanyName: "",
			SubmitterName: "",
			SubmitterCompanyName: "",
			ClaimStartDate: null,
			ClaimEndDate: null,
			SalesStartDate: null,
			SalesEndDate: null,
			BulkAuditComment: "",
			BulkClaimStatus: ""
		};

		let error: ErrorMessage = {
			errorMsg: "",
			showError: false
		};

		let statusData: WsAuditStatusData[];

		let model: SectionModel = state.model = mod.CreateObservable({
			ErrorMsg: error,
			Params: params,
			StatusData: statusData,
			btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
			btnUpdate_Click: (e: any) => { mod.btnUpdate_Click.call(mod, e); },
			onClick: (e: any) => { mod.onClick.call(mod, e); },
			Claim_Update_Click: (e: any) => { mod.Claim_Update_Click.call(mod, e); },
			//changeClaim: (ClaimId: number, ClaimStatus: string, AuditComment: string) => { mod.changeClaim.call(mod, ClaimId, ClaimStatus, AuditComment); },
		});
		mod.BindModel(null, model);
		mod.BindStatusDropdown();
		mod.BindBulkDropdown();
	}

	BindStatusDropdown() {
		let mod = this;
		let model = mod.State.model;
		//debugger;
		mod.Services.ReportSvc.GetAuditStatus(mod.State.model.Params)
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data == null) {

						let error: ErrorMessage = {
							errorMsg: "Status Dropdown is empty.",
							showError: true
						};

						mod.State.model.set("ErrorMsg", error);
						return false;
					}
					else {
						model.set("StatusData", d.Data);
					}
				}
			});

	}

	BindBulkDropdown() {
		let mod = this;
		let model = mod.State.model;
		//debugger;
		mod.Services.ReportSvc.GetAuditStatus(mod.State.model.Params)
			.then(d => {
				if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (d.Data == null) {

						let error: ErrorMessage = {
							errorMsg: "Search Dropdown is empty.",
							showError: true
						};

						mod.State.model.set("ErrorMsg", error);
						return false;
					}
					else {
						model.set("StatusData", d.Data);
					}
				}
			});

	}
	public btnSubmit_Click(e) {
		let mod = this;
		if (mod.checkForInputErrors()) {
			mod.BindReport();
			//mod.BindBulkDropdown();
			mod.Controls.bulkUpdPanel.show();
		}
	}

	public btnUpdate_Click(e) {

		//debugger;

		let mod = this;
		let grid = mod.Controls.reportResults.control;
		let uCount = 0;

		grid.tbody.find("input:checked").each(x => {  //gets all checked checkboxes

			uCount++;
			//debugger;

			let dtItem: ClaimRow = <ClaimRow>grid.dataItem(grid.tbody.find("input:checked")[x].closest("tr")); //gets the closest tr to the checked checkbox

			let auditComment: string = mod.State.model.Params.BulkAuditComment; //get bulk update drop down
			let claimStatus: string = mod.State.model.Params.BulkClaimStatus; //get bulk update drop down
			let claimLineId: number = dtItem.ClaimLineId; //get value from Kendo Grid Data
			let claimId: number = dtItem.ClaimId; //get value from Kendo Grid Data
			let contactId: number = dtItem.ContactId; //get value from Kendo Grid Data
			let promoId: number = dtItem.SIPromoId; //get value from Kendo Grid Data
			let productId: number = dtItem.ProductId;
			let SIPromoId: number = dtItem.SIPromoId;
			let InputDataId: string = dtItem.InputDataId;
			let contactTypeCD: number = dtItem.ContactTypeCD;
			let serialNumber: string = dtItem.SerialNumber;
			let modelNumber: string = dtItem.ModelNumber;
			let salesDate: string = dtItem.SalesDate;
			let userId: number = dtItem.UserId;

			//build XML Data
			var XmlData = [];
			XmlData.push(
				"<root>",
				"<AppRec>",
				"<ClaimId>" + claimId + "</ClaimId>",
				"<ClaimLineId>" + claimLineId + "</ClaimLineId>",
				"<ClStatus>" + claimStatus + "</ClStatus>",
				"<StatusNote>" + auditComment + "</StatusNote>",
				"<ProductId>" + productId + "</ProductId>",
				"<ContactId>" + contactId + "</ContactId>",
				"<SIPromoId>" + SIPromoId + "</SIPromoId>",
				"<InputDataId>" + InputDataId + "</InputDataId>",
				"<ContactTypeCD>" + contactTypeCD + "</ContactTypeCD>",
				"<SerialNumber>" + serialNumber + "</SerialNumber>",
				"<ModelNumber>" + modelNumber + "</ModelNumber>",
				"<SalesDate>" + salesDate + "</SalesDate>",
				"<UpdatedBy>" + userId + "</UpdatedBy>",
				"</AppRec>",
				"</root>"
			);

			if (claimId > 0) {
				mod.changeClaim(XmlData.join(""));
			} else {
				//todo: error
			}

			return;
		});

		if (uCount > 0)
			mod.ShowMessage(uCount + " Record(s) Update", CalloutType.Success, $('#msgStatus'));
		else
			mod.ShowMessage("Please select at least one claim", CalloutType.Warning, $('#msgStatus'));

		mod.BindReport();
	}

	public Claim_Update_Click(e: Event): any {

		//debugger;

		let mod = this;

		let grid = mod.Controls.reportResults.control;
		//e.sender;
		
		let targetRow = (<JQuery>(<any>e.currentTarget)).closest("tr"); //casting to any, then JQuery to resolve .closest error

		let dtItem: ClaimRow = <ClaimRow>grid.dataItem(targetRow);
		//let dtItem = grid.dataItem(targetRow);

		if (dtItem) {

			let claimStatus: string = $(targetRow).find("#ClaimStatus").val();  //get value from template override
			let auditComment: string = $(targetRow).find("#AuditorComment").val(); //get value from template override
			let claimLineId: number = dtItem.ClaimLineId; //get value from Kendo Grid Data
			let claimId: number = dtItem.ClaimId; //get value from Kendo Grid Data
			let contactId: number = dtItem.ContactId; //get value from Kendo Grid Data
			let promoId: number = dtItem.SIPromoId; //get value from Kendo Grid Data
			let productId: number = dtItem.ProductId;
			let SIPromoId: number = dtItem.SIPromoId;
			let InputDataId: string = dtItem.InputDataId;
			let contactTypeCD: number = dtItem.ContactTypeCD;
			let serialNumber: string = dtItem.SerialNumber;
			let modelNumber: string = dtItem.ModelNumber;
			let salesDate: string = dtItem.SalesDate;
			let userId: number = dtItem.UserId;

			//build XML Data
			var XmlData = [];
			XmlData.push(
				"<root>",
				"<AppRec>",
				"<ClaimId>" + claimId + "</ClaimId>",
				"<ClaimLineId>" + claimLineId + "</ClaimLineId>",
				"<ClStatus>" + claimStatus + "</ClStatus>",
				"<StatusNote>" + auditComment + "</StatusNote>",
				"<ProductId>" + productId + "</ProductId>",
				"<ContactId>" + contactId + "</ContactId>",
				"<SIPromoId>" + SIPromoId + "</SIPromoId>",
				"<InputDataId>" + InputDataId + "</InputDataId>",
				"<ContactTypeCD>" + contactTypeCD + "</ContactTypeCD>",
				"<SerialNumber>" + serialNumber + "</SerialNumber>",
				"<ModelNumber>" + modelNumber + "</ModelNumber>",
				"<SalesDate>" + salesDate + "</SalesDate>",
				"<UpdatedBy>" + userId + "</UpdatedBy>",
				"</AppRec>",
				"</root>"
			);

			if (claimId > 0) {
				mod.changeClaim(XmlData.join(""));
			} else {
				//todo: error
			}
		}
	}

	public changeClaim(XMLData: string): boolean {

		let mod = this;

		let data: ClaimRowXML = <ClaimRowXML>{ XMLData: XMLData };

		//call service with parameters
		mod.Services.ReportSvc.UpdateAuditClaim(data)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					return true;
				} else {
					//todo: error condition
				}
			});

		//alert on errors
		return false;
	}

	private checkForInputErrors(): boolean {
		let mod = this;
		mod.State.model.set("ErrorMsg", ""); //clear errors
		if (mod.State.model.Params.ClaimStartDate != null || mod.State.model.Params.ClaimEndDate != null) {
			if (mod.State.model.Params.ClaimStartDate > mod.State.model.Params.ClaimEndDate) {

				let error: ErrorMessage = {
					errorMsg: "The Claim start date must come before the Claim end date.",
					showError: true
				};

				mod.State.model.set("ErrorMsg", error);
				return false;
			}

			else if (mod.State.model.Params.SalesStartDate > mod.State.model.Params.SalesEndDate) {

				let error: ErrorMessage = {
					errorMsg: "The Sales start date must come before the Sales end date.",
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

	public categoryDropDownEditor(container, options) {

	$('<input required name="' + options.field + '" />')
		.appendTo(container)
		.kendoDropDownList({
			autoBind: false,
			dataTextField: "StatusDescription",
			dataValueField: "StatusCode",
			dataSource: {
				type: "POST",
				dataType: "json", 
				transport: {
					read: "/api/v1/account/getAllAuditStatusSimple"
				}
			}
		});
	}

	BindReport() {
		//debugger;
		let mod = this;
		var rptTitle = "Audit Claim"; //@@@ Pending work, Replace with results from a service call
		var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

		mod.Services.ReportSvc.GetAuditClaim(mod.State.model.Params)
			.then(data => {
				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data.ReportData != null) {
						//debugger;
						let cols: any[] = data.Data.ColumnHeader;

						let cbCol: ReportHeader = {
							//command: { text: "Update", change: function (e) { mod.Claim_Update_Click.call(mod, e); }, 
							selectable: "true", Width: "50px", ColumnStyle: "CbGridSelected", GroupSortOrder: 0.5 //, headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>"
						};

						cols.unshift(cbCol)

						//let newCol: ReportHeader = { command: { text: "Update", click: this.Claim_Update_Click }, title: " ", Width: "180px" };
						let cmdCol: ReportHeader = {
							command: { text: "Update", click: function (e) { mod.Claim_Update_Click.call(mod, e); } }, title: " ", Width: "180px"
						};
					
						cols.push(cmdCol);

						for (var i = 0; i < cols.length; i++) {
							//debugger;
							switch (cols[i].field) {
								case "ClaimStatus":
									cols[i].template = kendo.template($("#ClaimStatus-template").html()) //todo: mod.gettemplate
									break;
								case "AuditorComment":
									cols[i].template = kendo.template($("#AuditorComment-template").html())
									break;
							}
						}

						mod.GetComplexControl("reportResults", "kendoGrid");

						this.removeGrid($("#reportResults")); //clean grid

						var element = $("#reportResults").kendoGrid({  //todo: add to mod.controls using mod.getcomplex
							toolbar: ["excel"],
							excel: {
								fileName: "AuditClaim.xlsx",
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
									this.autoFitColumn(i);  //todo: try not to use this
								}
							},
							columns: cols,
							selectable: true,
							pageable: true,
							sortable: true,
							filterable: true,
							scrollable: true,
							editable: true,
							edit: function (e) {
								var fieldName = e.container.find("input").attr("name");
								// alternative (if you don't have the name attribute in your editable):
								// var columnIndex = this.cellIndex(e.container);
								// var fieldName = this.thead.find("th").eq(columnIndex).data("field");

								if (!isEditable(fieldName, e.model)) {
									this.closeCell(); // prevent editing
								}
							}
						});

						var grid = $("#reportResults").data("kendoGrid");3
						grid.thead.on("click", ".k-checkbox", mod.onClick);
					}

					//

					//element.setDataSource(data.Data.ReportData);
				}
			});

		function isEditable(fieldName, model) {

			if (fieldName === "AuditorComment") {
				return true; //allow editing of the column
			}

			return model.hasOwnProperty("IsFkEnabled") && model.IsFkEnabled; // default to non-editable
		}

		

	}

	onClick(e) {
		let mod = this;
		var checked = e.target.checked; //did the check, or uncheck, the header checkbox

		if (checked) {
			$(".k-checkbox").prop('checked', true);
		}
		else {
			$(".k-checkbox").prop('checked', false);
		}
	};

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
}
