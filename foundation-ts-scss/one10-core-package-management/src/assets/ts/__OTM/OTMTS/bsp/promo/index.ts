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
//import { PromoService } from 'bsp/promo/services/promoService';
import { PromoService } from 'bsp/promo/services/mock/promoService';
import { WsPromotionStatus, WsPromotionDetails } from 'bsp/promo/services/models/promoModels';

interface PromotionDetails extends WsPromotionDetails, Observable { }

// Load components
//import { YyyComponent, YyyModel } from './components/Yyy';

interface SectionData extends Observable {
	//Value1: string;
}

interface ViewData extends Observable {
	//Flag1: boolean;
}

interface SearchLookupData extends Observable {
	PromotionStatuses: WsPromotionStatus[];
}
interface SearchData extends Observable {
	PromotionId?: number;
	PromotionName: "";
	PromotionStatusId?: number;
	Lookups: SearchLookupData;
}

//interface LookupData extends Observable {
//	PromotionStatuses: WsPromotionStatus[];
//}

// Optional: Service-bound models (converted to observables)
//interface Xxx extends WsXxxResult, Observable { }

interface SectionModel extends ComponentModel {
	Data: SectionData;
	View: ViewData;
	//Lookups: LookupData;
	Search: SearchData;

	// Add service-bound models
	//Xxx: Xxx;

	// Add child component models
	//Yyy: YyyModel;
}

interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
	pageMain: JQuery;
}

interface SectionTemplates extends ComponentTemplates {
	Page: Template;
}

// Optional: Child components
//@Injectable() @DiscardBinding()
//class SectionComponents extends ComponentCollection {
//	@Inject() Yyy: YyyComponent;
//}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Promo: PromoService = null;
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
		
		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetTemplates(["Page"]);
		//mod.BindButtons(["btnSearch"]); // Can't do this here because it hasn't been rendered yet

		// Create the model
		let model = state.model = mod.CreateObservable({
			Search: { // [TODO] Add to interfaces
				PromotionId: null,
				PromotionName: '',
				PromotionStatusId: null,
				Lookups: {
					PromotionStatuses: []
				}
			},
			Data: {
				//Value1: ""
			},
			View: {
				//Flag1: false
			}//,
			//Lookups: {
			//	PromotionStatuses: []
			//}
		}//,
			// Optional: Service flags
			//["PromotionStatuses"]
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
		mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: '', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);

		// [TODO] Do we need to call this for blocks that are being re-built and re-bound?
		// Not necessarily here, but anywhere?
		//kendo.unbind(..)

		mod.BindButtons(["btnSearch1"]);

		// Load the page data
		mod.LoadData();
	}

	public LoadData() {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.Promo.GetPromotionStatuses()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					// Add a first item for all
					data.Data.unshift({ PromotionStatusId: null, PromotionStatusName: '(ALL)' });
					model.Search.Lookups.set("PromotionStatuses", data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading promotion statuses.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("PromotionStatuses");
			});
	}

	btnSearch_click(e) {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;
		let model = mod.State.model;
		let search = model.Search;

		let control = $(e);

		let targetName = control.data("controlTarget");

		// [TODO] Show spinner while waiting for the service

		services.Promo.GetPromotions({ PromotionId: search.PromotionId, PromotionStatusId: search.PromotionStatusId, Name: search.PromotionName })
			.then(data => {
				//debugger;

				if (data.ResponseCode == constants.ResponseCode.Success) {
					let target = $("#" + targetName); // [TODO] Replace JQuery. ComplexControl ideal, but we don't really need it registered with the page component
					mod.bind_searchResults(target, data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Get Promotions", data), CalloutType.Error);
				}
			});
	}

	bind_searchResults(target: JQuery, data: any[]): void {
		//debugger;
		let mod = this;

		// Get the grid container
		let grid = target.data("kendoGrid");

		// See if the grid has been instantiated yet
		if (grid) {
			// Update the data
			grid.dataSource.data(data);
		} else {
			target.kendoGrid({
				//dataSource: data,
				dataSource: {
					data: data,
					schema: {
						model: {
							id: "PromotionId",
							fields: {
								PromotionId: { type: "number" },
								ShortName: { type: "string" },
								PromotionStatusName: { type: "string" },
								DataStart: { type: "date" },
								DataEnd: { type: "date" }
							}
						}
					},
					pageSize: 20
				},
				height: 550,
				scrollable: true,
				sortable: true,
				filterable: false,
				pageable: {
					input: true,
					numeric: false
				},
				noRecords: {
					template: "No records found."
				},
				columns: [
					{
						command: [{
							name: "View",
							className: "button",
							click: function (e: Event) {
								// Hand off execution to a child function
								// Note the change of context of "this", hence the use of "call" to revert it back to the page component
								mod.btnViewPromo_click.call(mod, e, this);
							}
						}]
					},
					{ field: "PromotionId", title: "ID" },
					{ field: "ShortName", title: "Name" },
					{ field: "PromotionStatusName", title: "Status" },
					{ field: "DataStart", title: "Start", format: "{0:d}" },
					{ field: "DataEnd", title: "End", format: "{0:d}" }
				]
			});
		}
	}

	btnViewPromo_click(e: Event, grid: kendo.ui.Grid): void {
		//debugger;
		let mod = this;

		// We will handle the click
		e.preventDefault();

		// Get the data item associated with the grid row
		// [TODO] Make a wrapper function
		var dataItem = <PromotionDetails>grid.dataItem($(e.currentTarget).closest("tr"));

		// Get an absolute path to the root
		let sr = mod.AppConfig.Core.SiteRoot;
		if (sr.charAt(sr.length - 1) != '/')
			sr += '/';

		location.href = sr + "promo/details?id=" + dataItem.PromotionId.toString();
	}
	
}
