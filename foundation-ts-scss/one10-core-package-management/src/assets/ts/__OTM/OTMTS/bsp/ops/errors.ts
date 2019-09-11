/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { ServiceConstants } from 'cp/serviceShared';
//import { OpsService } from 'svc/opsService';
//import { OpsService } from 'svc/mock/opsService';
import { OpsService } from 'bsp/ops/services/mock/opsService';
//import { IErrorDetails } from 'svc/models/opsModels';
import { IErrorDetails } from 'bsp/ops/services/models/opsModels';

interface ISearchModel extends Observable {
	StartDate: Date;
	EndDate: Date;
	Username: string;
	Path: string;
	Text: string;
	ErrorId: string;
}
interface IViewModel extends Observable {
	ShowResults: boolean;
}
interface SectionModel extends ComponentModel {
	Search: ISearchModel;
	//SearchResults: IErrorDetails[];
	Details: IErrorDetails;
	View: IViewModel;
}
interface SectionState extends ComponentState<SectionModel> {
	SearchResults: IErrorDetails[]; //Outside of model because we don't need it to be observable
}
interface SectionControls extends ComponentControls {
	gridResults: ComplexControl<kendo.ui.Grid>;
	detailsModal: JQuery;
	loadModal: JQuery;
	Modal: FoundationSites.Reveal;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;

	public Services = {
		Constants: ServiceConstants,
		Ops: <OpsService>null
	};

	constructor(ac: ApplicationContext, os: OpsService) {
		// Call the parent
		super("Errors", ac);

		let mod = this;
		let services = mod.Services;
		services.Ops = os;
	}

	Initialize() {
		//debugger;
		let mod = this;
		let controls = mod.Controls;
		let services = mod.Services;
		let constants = services.Constants;
		let util = mod.Util;

		// Call the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		mod.GetControls(["detailsModal", "loadModal"]);
		mod.GetComplexControl("gridResults", "kendoGrid");
		mod.BindButtons(["btnSearch", "btnClose"]);

		// Default to today 00:00:00 to 23:59:59
		let start = new Date();
		start.setHours(0, 0, 0, 0);
		let end = new Date(start.getTime());
		end.setHours(23, 59, 59, 0);

		let model = mod.State.model = <SectionModel>mod.CreateObservable({
			Search: {
				StartDate: start,
				EndDate: end,
				Username: "",
				Path: "",
				Text: "",
				ErrorId: ""
			},
			Details: {
				ErrorId: 0,
				Timestamp: null,
				Message: "",
				Type: "",
				Source: "",
				UserId: 0,
				Username: "",
				StackTrace: "",
				Collections: []
			},
			View: {
				ShowResults: false
			}
		});
		mod.State.SearchResults = [];

		mod.BindModel(null, model);

		// [TODO] Link IsLoaded with divLoading, but also allow for manual showing
		mod.Controls.loadModal.hide();
	}

	btnSearch_click(e) {
		//debugger;
		let mod = this;
		let constants = mod.Services.Constants;
		let ops = mod.Services.Ops;
		let model = mod.State.model;
		let sm = model.Search;
		let controls = mod.Controls;

		ops.GetErrors(sm.StartDate, sm.EndDate, sm.ErrorId)
			.then((data) => {
				//debugger;

				if (data.ResponseCode == constants.ResponseCode.Success) {
					mod.State.SearchResults = data.Data;

					// If the grid has been initialized, destroy it
					// @@@
					//controls.gridResults.control.destroy();

					// Build the grid
					controls.gridResults.item.kendoGrid({
						selectable: "row",
						pageable: {
							//refresh: true,
							pageSizes: true,
							pageSize: 50,
							buttonCount: 5
						},
						sortable: true,
						filterable: true,
						change: (e) => {
							//debugger;
							let grid = e.sender;
							let selectedRows = grid.select();
							if (selectedRows.length > 0) {
								//debugger;

								// Item is not really IErrorDetails, but they overlap a lot
								// TS compiler doesn't like the casting. Swap the lines to get intellisense, but use "any" for final version
								//let item: IErrorDetails = <IErrorDetails>grid.dataItem(selectedRows[0]);
								let item: any = <any>grid.dataItem(selectedRows[0]);
								model.set("Details.ErrorId", item.ErrorId);
								model.set("Details.Timestamp", item.Timestamp);
								model.set("Details.Message", item.Message);
								model.set("Details.Type", item.Type);
								model.set("Details.Source", item.Source);
								model.set("Details.Server", item.Server);
								model.set("Details.Path", item.Path);
								model.set("Details.Referrer", item.Referrer);
								model.set("Details.UserId", item.UserId);
								model.set("Details.Username", item.Username);
								model.set("Details.StackTrace", item.Detail);
								//model.set("Details.Collections", item.Collections);

								//let opt = { closeOnClick: false, closeOnEsc: false };
								//let opt = { closeOnClick: false, closeOnEsc: false };
								//var win = mod.Controls.Modal = new Foundation.Reveal(mod.Controls.detailsModal, opt);
								var win = mod.Controls.Modal = new Foundation.Reveal(mod.Controls.detailsModal);
								win.open();
							}
						},
						dataSource: {
							serverFiltering: false,
							//serverPaging: true,
							data: data.Data,

							schema: {
								model: {
									fields: {
										ErrorId: { type: "string" },
										Timestamp: { type: "date" },
										Message: { type: "string" },
										Type: { type: "string" },
										Server: { type: "string" },
										Path: { type: "string" },
										Referrer: { type: "string" },
										//Source: { type: "string" },
										UserId: { type: "number" },
										Username: { type: "string" }
									}
								}
							},

						},
						columns: [
							{ field: "ErrorId", title: "Id", width: 90 },
							{ field: "Timestamp", title: "Timestamp", width: 100, format: "{0:yyyy-MM-dd HH:mm:ss} ET" },
							{ field: "Message", title: "Message", width: 200 },
							{ field: "Type", title: "Type", width: 120 },
							{ field: "Path", title: "Path", width: 200 },
							//{ field: "Source", title: "Source", width: 90 },
							{ field: "UserId", title: "User ID", width: 30 },
							{ field: "Username", title: "Username", width: 100 }
						]
					});

					model.View.set("ShowResults", true);
				} else {
					mod.ShowMessage(data.ResponseMessage, CalloutType.Error);
				}
			});
	}
	btnClose_click(e) {
		//debugger;
		let mod = this;

		mod.Controls.Modal.close();
	}
}
