/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule, ComponentCollection } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';

// Load services
import { ServiceCollection } from 'cp/serviceShared';
import { BiService } from 'bsp/bi/services/mock/biService';
//import { BiService } from 'bsp/bi/services/mock/biService';
import { WsIndustryType } from 'bsp/bi/services/models/biModels';

export interface ReportInfo extends Observable {
	ReportId: number;
	ReportName: string;
}

export interface ReportDetails extends Observable {
	Data: any[]; // Cannot strongly type since each report will be different
	Info: ReportInfo;
}

// Load components
//import { YyyComponent, YyyModel } from './components/Yyy';

//interface SectionData extends Observable {
//	//Value1: string;
//}

//interface ViewData extends Observable {
//	//Flag1: boolean;
//}

//interface LookupData extends Observable {
//	PromotionStatuses: WsPromotionStatus[];
//}

// Optional: Service-bound models (converted to observables)
//interface Xxx extends WsXxxResult, Observable { }

export interface SectionModel extends ComponentModel {
	Report: ReportDetails;

	// Add service-bound models
	//Xxx: Xxx;

	// Add child component models
	//Yyy: YyyModel;
}

export interface SectionState extends ComponentState<SectionModel> { }

export interface SectionControls extends ComponentControls {
	pageMain: JQuery;
}

export interface SectionTemplates extends ComponentTemplates {
	//Page: Template;
}

// Optional: Child components
//@Injectable() @DiscardBinding()
//class SectionComponents extends ComponentCollection {
//	@Inject() Yyy: YyyComponent;
//}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Bi: BiService = null;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;
	public Templates: SectionTemplates;
	@Inject() public Services: SectionServices;
	//@Inject() public Components: SectionComponents;

	constructor(ac: ApplicationContext) {
		super("Page", ac);
		//let mod = this;
	}

	Initialize() {
		//debugger;
		let mod = this;
		let state = mod.State;
		let util = mod.Util;

		// Initialize the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		// Get the report parameters
		let reportId = util.ToSafeInteger(util.GetParameterByName("id"));

		// [TODO] Handle missing or invalid params

		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetTemplates(["Page"]);

		// Create the model
		let model = state.model = mod.CreateObservable({
			Report: {
				Info: {
					ReportId: reportId,
					ReportName: "Unknown"
				},
				Data: []
			}
		},
			["ReportData"]
		);

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();

		// [TODO] Should the page info come from an async service?
		//mod.Services.Promo.GetPageInfo('Index')
		//	.then(data => {
		//		debugger;
		//		let pc = mod.Templates.Page(data.Data);
		//		$("#pageMain").html(pc);
		//	});

		// Render the main page template
		// By using "pageTemplate" as the parent, the control paths/names are clean. Plus, you don't want a template and a controlPath to be the same
		mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: 'pageTemplate', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);

		// [TODO] Do we need to call this for blocks that are being re-built and re-bound?
		// Not necessarily here, but anywhere?
		//kendo.unbind(..)

		// Load the page data
		mod.LoadData();
	}

	public LoadData(): void {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.Bi.GetReportData({ ReportId: model.Report.Info.ReportId })
			.then(data => {
				//debugger;

				if (data.ResponseCode == constants.ResponseCode.Success) {
					// Save the report name and data
					model.Report.Info.set("ReportName", data.Data.ReportName);
					model.Report.set("Data", data.Data.Items);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading report data.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("ReportData");

				// Update the grid
				// Need to do this after service flag is set
				if (data.ResponseCode == constants.ResponseCode.Success)
					mod.reportResults_render(model.Report);
			});
	}

	public reportResults_render(model): void {
		//debugger;
		let mod = this;
		//let model = mod.State.model.Report;

		// See if the page has been loaded yet
		// Might not be ideal. Forces the service flag to be set early or multiple status checks
		// But we need to know where we are at in the lifecycle (hide grid vs. show "no results")
		if (!mod.State.model.IsLoaded) return;

		// Get the grid control
		// [TODO] Create helper to abstract JQuery reference
		// Can possibly use a ComplexControl, but the ID could change and still need to handle instantiation
		let rc = $("#" + mod.Callbacks.reportResults_render.ControlPath);

		// Get the grid container
		let grid = rc.data("kendoGrid");

		// See if the grid has been instantiated yet
		if (grid) {
			// Update the data
			grid.dataSource.data(model.Data);
		} else {
			// Create the grid
			// [TODO] Replace with reporting framework metadata; also store in more centralized location
			rc.kendoGrid({
				noRecords: { template: "No results found" }, // [TODO] Use resource or constant
				dataSource: {
					data: model.Data
				},
				columns: [
					{ field: 'EntityId', title: 'ID' },
					{ field: 'Username', title: 'User' },
					{ field: 'FirstName', title: 'First Name' },
					{ field: 'LastName', title: 'Last Name' }
				]
			});
		}
	}
}
