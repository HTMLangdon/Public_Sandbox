/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule, ComponentCollection } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
import { ServiceConstants, ServiceCollection } from 'cp/serviceShared';
import { FilterComponent, FilterModel } from './components/processFilter';
//import { OpsService } from 'svc/opsService';
import { OpsService } from 'bsp/ops/services/opsService';
//import { OpsService } from 'bsp/ops/services/mock/opsService';
import { WsProcessLog, WsProcessType, WsProcessStatusType, WsProcessLogSearchRequest, WsProcessFeedLogRequest } from 'bsp/ops/services/models/opsModels';

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Ops: OpsService = null;
}

interface IViewModel extends Observable {
	ShowResults: boolean;
}
interface ProcessLog extends Observable, WsProcessLog { } // Wrap the original with an observable
interface SectionModel extends ComponentModel {
	Details: ProcessLog; // Details for currently selected log entry
	View: IViewModel;
	Filter: FilterModel;
}
interface SectionState extends ComponentState<SectionModel> {
	SearchResults: WsProcessLog[]; // Outside of model because we don't need it to be observable
}
interface SectionTemplates extends ComponentTemplates {
	mainStatusTemplate: Template;
	stepStatusTemplate: Template;
}
interface SectionControls extends ComponentControls {
	gridResults: ComplexControl<kendo.ui.Grid>;
	gridSteps: ComplexControl<kendo.ui.Grid>;
	logDetails: JQuery;
	detailsModal: JQuery;
	loadModal: JQuery;
  Modal: FoundationSites.Reveal;
  logMessage: JQuery;
}
@Injectable() @DiscardBinding()
class SectionComponents extends ComponentCollection {
	@Inject() Filter: FilterComponent;
}
@Injectable()
export class PageComponent extends ComponentModule {
	public Templates: SectionTemplates;
	public Controls: SectionControls;
	public State: SectionState;
	@Inject() public Components: SectionComponents;
	@Inject() public Services: SectionServices;

	constructor(ac: ApplicationContext) {
		super("ProcessLog", ac);
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

		services.Ops.ServiceDefaults.Timeout = 60000;  // Extend the timeout; milliseconds

		// Get controls & templates, bind buttons
    mod.GetControls(["logDetails", "detailsModal", "loadModal", "logMessage"]);
		mod.GetComplexControl("gridResults", "kendoGrid");
		mod.GetComplexControl("gridSteps", "kendoGrid");
    mod.BindButtons(["btnSearch", "btnClose", "btnLogCopy"]);
		mod.GetTemplates(["mainStatusTemplate", "stepStatusTemplate"]);

		// Create the initial model
		let model = mod.State.model = <SectionModel>mod.CreateObservable(
			{
				Details: {
					ProcessLogId: 0,
					ProcessTypeId: 0,
					ProcessTypeName: "",
					ProcessStatusTypeName: "",
					ProcessStatusTypeId: "",
					RunId: "",
					StartTime: null,
					EndTime: null,
					Duration: 0,
					ProcessUserId: 0,
					ProcessUsername: "",
					ProcessLog: "",
					ProcessFeedLogs: []
				},
				View: {
					ShowResults: false  // Grid hidden by default
				},
				Filter: mod.Components.Filter.State.model // Bring in the sub-component model
			}
		);

		mod.State.SearchResults = [];

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();

		// [TODO] Link IsLoaded with divLoading, but also allow for manual showing
		mod.Controls.loadModal.hide();
	}

	btnSearch_click(e) {
		//debugger;
		let mod = this;
		let constants = mod.Services.Constants;
		let ops = mod.Services.Ops;
		let model = mod.State.model;
		let sm = model.Filter.Data;
		let controls = mod.Controls;

		// Clear any previous messages
		mod.ClearMessage();

		// Create spinner modal
		let sw = mod.Controls.Modal = new Foundation.Reveal(mod.Controls.loadModal);
		sw.open();

		// Fetch the data
		ops.GetProcessLogs(sm)
			.then((data) => {
				//debugger;

				// Close the modal once service has returned
				mod.Controls.Modal.close();

				if (data.ResponseCode == constants.ResponseCode.Success) {
					mod.State.SearchResults = data.Data;

					// Build the grid
					// [TODO] We probably should not rebuild the grid every time. We should use a data source.
					controls.gridResults.item.kendoGrid({
						selectable: "row",
						pageable: {
							//refresh: true,
							pageSizes: true,
							pageSize: 50,
							buttonCount: 5
						},
						sortable: true,
						filterable: false,
						resizable: true,
						detailInit: (e: GridDetailInitDataEvent<ProcessLog>) => { // "detailInit" event fires when a row in the parent grid is expanded
							// Hand off execution to a child function
							// Note the change of context of "this", hence the use of "call" to revert it back to the page component
							mod.gridResults_detailInit.call(mod, e);
						},
						change: (e) => { // "change" event fires when a row in the parent grid is selected
							// Hand off execution to a child function
							// Note the change of context of "this", hence the use of "call" to revert it back to the page component
							mod.gridResults_change.call(mod, e);
						},
						dataSource: {
							serverFiltering: false,
							//serverPaging: true,
							data: data.Data,
							schema: {
								model: {
									id: "ProcessLogId",
									fields: {
										ProcessTypeName: { type: "string" },
										ProcessStatusTypeName: { type: "string" },
										ProcessLogId: { type: "number" },
										ProcessTypeId: { type: "number" },
										ProcessStatusTypeId: { type: "string" },
										RunId: { type: "string" },
										StartTime: { type: "date" },
										EndTime: { type: "date" },
										Duration: { type: "number" },
										ProcessUserId: { type: "number" },
										ProcessUsername: { type: "string" },
										ProcessLog: { type: "string" }
									}
								}
							},
						},
						columns: [
							// Note: These sizes are not always exact unless all columns are specified AND the width of the grid is specified.
							// In all other cases, these become sizes relative to each other

							{ field: "ProcessTypeName", title: "Type" },
							//{ field: "ProcessStatusTypeName", title: "Status" }, // Option 1: Normal
							//{ title: "Status", template: "<strong>#:ProcessStatusTypeName#</strong>" }, // Option 2: Inline template
							//{ title: "Status", template: kendo.template($("#mainStatusTemplate").html()), width: "60px" }, // Option 3a: External template using JQuery
							// [TODO] Allow column sorting. Possible with cell/column template?
							{ title: "Status", template: mod.Templates.mainStatusTemplate, width: "80px" }, // Option 3b: Pre-compiled external template
							{ field: "RunId", title: "RunId", },
							{ field: "StartTime", title: "Start", format: "{0:yyyy-MM-dd HH:mm:ss} CT", width: "100px" },
							{ field: "EndTime", title: "End", format: "{0:yyyy-MM-dd HH:mm:ss} CT", width: "100px" },
							{ field: "ProcessUserId", title: "User ID", width: "90px" },
							//{ template: "<strong>#: name # </strong>" }
							//{ template: kendo.template($("#mainButtonTemplate").html()) }
							{
								command: [{
									name: "Copy RunID",
									className: "button",
									click: function (e: Event) {
										// Hand off execution to a child function
										// Note the change of context of "this", hence the use of "call" to revert it back to the page component
										mod.btnCopyRunId_click.call(mod, e, this);
									}
								}]
							}
							//{ field: "ProcessUsername", title: "User Name" } // We don't have this field
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

  btnLogCopy_click(e) {
    let mod = this;
    let model = mod.State.model.Details;

    // We will handle the click
    e.preventDefault();

    // Create an input for copying
    var temp = document.createElement("input");

    // Get the text from the element passed into the input
    temp.setAttribute("value", model.LogInfo);

    // Append the aux input to the body
    document.body.appendChild(temp);

    // Highlight the content
    temp.select();

    // Execute the clipboard copy command
    document.execCommand("copy");

    // Remove the input from the body
    document.body.removeChild(temp);

    // Show a message
    mod.ShowMessage("Log copied to clipboard.", CalloutType.Success, mod.Controls.logMessage);

  }

	btnCopyRunId_click(e: Event, grid: kendo.ui.Grid) {
		//debugger;
		let mod = this;

		// We will handle the click
		e.preventDefault();

		// Get the data item associated with the grid row
		// [TODO] Make a wrapper function
		var dataItem = <ProcessLog>grid.dataItem($(e.currentTarget).closest("tr"));

		// Copy the value to the clipboard
		// We do this by creating a new temporary input box, putting the value in the box, selecting the contents, and then copying to the clipboard
		// Source: https://jsfiddle.net/alvaroAV/a2pt16yq/

		// Create an input for copying
		var temp = document.createElement("input");

		// Get the text from the element passed into the input
		temp.setAttribute("value", dataItem.RunId);

		// Append the aux input to the body
		document.body.appendChild(temp);

		// Highlight the content
		temp.select();

		// Execute the clipboard copy command
		document.execCommand("copy");

		// Remove the input from the body
		document.body.removeChild(temp);

		mod.ShowMessage("RunID " + dataItem.RunId + " copied to clipboard.", CalloutType.Success);
	}

	gridResults_detailInit(e: GridDetailInitDataEvent<ProcessLog>) {
		//debugger;
		let mod = this;

		// Fetch the child data
		mod.Services.Ops.GetProcessFeedLogs(e.data)
			.then(childdata => {
				//debugger;
				// Create a new container within the parent grid and populate a child grid
				$("<div/>").appendTo(e.detailCell).kendoGrid({
					dataSource: childdata.Data,
					scrollable: false,
					sortable: false,
					filterable: false,
					pageable: false,
					columns: [
						// [TODO] Consider setting column widths so that all child grids have similar alignment
						{ field: "ProcessFeedLogId", title: "ID", width: "120px" },
						{ field: "FeedTypeId", title: "Type ID", width: "120px" },
						{ field: "FeedTypeName", title: "Type", width: "240px" },
						//{ field: "ProcessStatusTypeId", title: "Status" },
						{ field: "ProcessStatusTypeName", title: "Status", width: "120px" },
						{ field: "FeedFilename", title: "Filename" }
					]
				})
			});
	}

	gridResults_change(e: kendo.ui.GridChangeEvent) {
		//debugger;
		let mod = this;
		let model = mod.State.model;

    mod.ClearMessage(mod.Controls.logMessage);
		let grid = e.sender;
		let selectedRows = grid.select();
		if (selectedRows.length > 0) {
			//debugger;

			// Save the info from the selected item
			// We have to do it one field at a time because the data item has extra properties that we don't want in the model
			// [TODO] Create a helper to do this?
			let item = <ProcessLog>grid.dataItem(selectedRows[0]);
			model.Details.set("ProcessTypeName", item.ProcessTypeName);
			model.Details.set("ProcessStatusTypeName", item.ProcessStatusTypeName);
			model.Details.set("ProcessStatusTypeId", item.ProcessStatusTypeId);
			model.Details.set("ProcessLogId", item.ProcessLogId);
			model.Details.set("ProcessTypeId", item.ProcessTypeId);
			model.Details.set("RunId", item.RunId);
			model.Details.set("StartTime", item.StartTime);
			model.Details.set("EndTime", item.EndTime);
			model.Details.set("Duration", item.Duration);
			model.Details.set("ProcessUserId", item.ProcessUserId);
			model.Details.set("ProcessUsername", item.ProcessUsername);
			model.Details.set("LogInfo", item.LogInfo);

			mod.Controls.gridSteps.item.kendoGrid({
				pageable: false, sortable: false, filterable: false, selectable: "none", resizable: true,
				dataSource: {
					serverFiltering: false,
					data: item.Steps,
					schema: {
						model: {
							fields: {
								Name: { type: "string" },
								Type: { type: "string" },
								Result: { type: "boolean" },
								StartTime: { type: "Date" },
								EndTime: { type: "Date" },
								Duration: { type: "number" }
							}
						}
					}
				},
				columns: [
					{ field: "Name", title: "Step Name" },
					{ field: "Type", title: "Type" },
					//{ field: "Result", title: "Succeeded", width: "120px" },
					//{ title: "Succeeded", template: mod.Templates.stepStatusTemplate, width: "120px" },
					{ title: "Status", template: mod.Templates.stepStatusTemplate, width: "120px" },
					{ field: "StartTime", title: "Start", format: "{0:HH:mm:ss} CT", width: "140px" },
					{ field: "EndTime", title: "End", format: "{0:HH:mm:ss} CT", width: "140px" },
					{ field: "Duration", title: "Duration", format: "{0:#,##0.0}", width: "110px" }
				]
			});

			//let opt = { closeOnClick: false, closeOnEsc: false };
			//let win = mod.Controls.Modal = new Foundation.Reveal(mod.Controls.detailsModal, opt);
			let win = mod.Controls.Modal = new Foundation.Reveal(mod.Controls.detailsModal);
			win.open();

			// Re-apply foundation (for the collapsible section)
			mod.Controls.logDetails.foundation();
		}
	}
}
