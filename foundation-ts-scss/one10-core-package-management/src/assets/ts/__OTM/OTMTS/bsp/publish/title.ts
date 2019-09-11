/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

// This sample component file contains some items that are commented out in order to show alternatives.

// Load standard modules
//import { ComponentModule, ComponentCollection } from 'cp/componentModule'; // ComponentCollection is needed if there are child components.
import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';

// Load services
import { ServiceCollection } from 'cp/serviceShared';
//import { PublishService } from 'bsp/publish/services/mock/publishService';
import { PublishService } from 'bsp/publish/services/publishService'; // Notice the difference between a mock and real service is only a few characters in the path
import { WsTitleTypeBasic, WsPublisherBasic, WsTitle, WsTitleResponse } from 'bsp/publish/services/models/publishModels';

// Load sub-components
//import { YyyComponent, YyyModel } from './components/Yyy';

// Define sub-objects for the model.
// Convention is to use the prefix "Section".
// Many models contain a property called "Data".
//interface SectionData extends Observable {
//	//Value1: string;
//}

// Sometimes we need to redefine a simple WS model as Observable
interface Title extends WsTitleResponse, Observable { }

interface SearchModel extends Observable {
	TitleTypeId: number;
	PublisherId: number;
	TitleName: string;
}

interface LookupsModel extends Observable {
	TitleTypes: WsTitleTypeBasic[];
	Publishers: WsPublisherBasic[];
}

interface ViewModel extends Observable {
	ShowResults: boolean;
	ShowSearch: boolean;
	ShowDetails: boolean;
}

// Define the main model for the PageComponent.
// Convention is to use the name "SectionModel".
interface SectionModel extends ComponentModel {
	Search: SearchModel;
	Lookups: LookupsModel;
	View: ViewModel;
	Details: Title;
}

// Use the ComponentState generic to make the model strongly-typed
interface SectionState extends ComponentState<SectionModel> { }

// Define any controls you need to access directly (outside of MVVM or event callbacks).
// We do not write JQuery or other DOM selectors in these components.
interface SectionControls extends ComponentControls {
	pageMain: JQuery;
	gridResults: ComplexControl<kendo.ui.Grid>;
}

// Define any templates we might need to reference
//interface SectionTemplates extends ComponentTemplates {
//	Page: Template;
//	Child1: Template;
//}

// Define child components.
// See "SectionServices" regarding dependency injection and decorators.
//@Injectable() @DiscardBinding()
//class SectionComponents extends ComponentCollection {
//	@Inject() Yyy: YyyComponent;
//}

// Define the services that will be used.
// @Injectable allows it to be created by the Depenency Injector.
// @DiscardBinding tells the Dependency Injector it will not be used again. This prevents potential name collisions between components on the page.
@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Publish: PublishService = null;
}

@Injectable()
export class PageComponent extends ComponentModule {
	// Override the parent's definition for Controls and State with a more strongly-typed version.
	// TypeScript allows this so long as the new definition is the same or inherits the same type as the parent.
	public Controls: SectionControls;
	public State: SectionState;
	// Include this if templates are defined above.
	//public Templates: SectionTemplates;

	// Define the constructor.
	// Both parameters will be filled in by the Dependency Injector.
	// The first parameter is passed to the parent class.
	// The second parameter is automatically wired to a module-level property called "Services".
	// This is done by using the "public" scope descriptor on the parameter.
	// It means that you can reference "mod.Services" even though it was not explicitly defined as a property above.
	// The same thing can be done with sub-components.
	//constructor(ac: ApplicationContext, public Services: SectionServices, public Components: SectionComponents) {
	constructor(ac: ApplicationContext, public Services: SectionServices) {
		super("Page", ac);
		// It can be handy to pre-write debugger and "let" statements, even if they are not used. Be sure to comment them out.
		//debugger;
		//let mod = this;
	}

	// Define the Initialize method
	Initialize() {
		// Putting a debugger statement at the top of the method is convenient during development
		//debugger;
		// Always save a reference to "this" to prevent scope issues.
		// Convention is to use a variable called "mod".
		let mod = this;
		let state = mod.State;

		// Initialize the parent
		super.Initialize();
		mod.WriteLog("Initialize.");

		// [TODO] Allow coming in with parameters already set?
		//let id = util.ToSafeInteger(util.GetParameterByName("id"));

		// [TODO] Handle missing or invalid params

		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		//mod.GetTemplates(["Page"]);
		//mod.BindButtons(["btnSearch"]); // Can't do this here because it hasn't been rendered yet

		// Create the model.
		// Specify empty and default values for the various parts in the model.
		// It is important that lookup types be initialized with an empty array.
		let model = state.model = mod.CreateObservable({
			Search: {
				TitleTypeId: 0,
				PublisherId: 0,
				TitleName: ""
			},
			Lookups: {
				TitleTypes: [],
				Publishers: []
			},
			//Data: {},
			View: {
				ShowSearch: true,
				ShowDetails: false,
				ShowResults: false
			},
			Details: { }
		},
			// Define any service watchers.
			// In this case, watch for the "TitleTypes" and "Publishers" service completion flags to be set.
			["TitleTypes", "Publishers"]
		);

		// Bind the model to the page
		// In this case, it has no effect since the page will be rendered via template, but it does not hurt to call the method.
		// The first parameter is the container to bind to.
		// By default, it will be "formMain"(or whatever is defined in mod.Config.RootElement).
		mod.BindModel(null, model);

		// Initialize sub-components.
		// Do this AFTER binding and starting the service watcher.
		// This can be done even if there are no sub-components.
		// Leaving it in the code makes it easier if we ever add new sub - components.
		mod.InitializeComponents();

		// Render the main page template.
		// The "Context" property allows templates to keep and use a reference to this page component.
		// The "Name" property is the name of the template. It will be fetched and compiled if it has not been done so already.
		// The "Parent" property is the name of the parent template or container. In many cases, this is filled in for you, but we need to do it manually for the first call on the outermost template.
		// The "ChildKey" property is used for assigning IDs to child template items. For example, in a loop, the loop iterator variable can be used so that each iteration has a unique ID.
		// The "Data" property is the model to be used by the template. In this case, it is the whole model, but it could be a sub-section of the model.
		// The output in the "pageMain" element (last parameter).
		mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: 'pageMain', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);

		// Get/bind controls inside templates.
		// This needs to be done after the main RenderTemplate call has returned.
		// This method finds an element with the specified ID and saves a reference in the Controls collection (like GetControl does).
		// It also looks for a method with the name of the ID plus "_click" (e.g., "btnSearch_click"). If found, it will bind the event.
		mod.BindButton("btnSearch");
		mod.BindButton("btnBack");

		// First get a complex control reference.
		// The first parameter is the control's ID.
		// The second parameter is the control's type. It corresponds to the "data" attribute Kendo will use to store the control object in the DOM. It is also the name of the function used to instantiate the control.
		mod.GetComplexControl("gridResults", "kendoGrid"); // Get a complex control reference
		// Instantiate the grid without any data.
		// Include any options, such as paging, sorting, filtering, etc.
		mod.Controls.gridResults.item.kendoGrid({
			// Make selection of items be the entire row
			selectable: "row",
			change: (e) => { // "change" event fires when a row in the parent grid is selected
				// Hand off execution to a child function.
				// Note: There is a change of context of "this", hence the use of "call" to revert it back to the page component.
				mod.gridResults_change.call(mod, e);
			},
			noRecords: {
				template: mod.Resources["Pages:Publish:Title:Message:NoRecords"].Content
			},
			dataSource: [], // Empty data
			// Define the columns.
			// Use resources for the displayed text.
			// Optionally define data types, format strings, etc.
			// When using format strings, use "short codes" instead of explicit custom formats (e.g., "d" not "m/d/yyyy"; "n2" not "#,##0.00").
			columns: [
				{ field: "TitleId", title: mod.Resources["Pages:Publish:Title:Results:TitleId"].Content },
				{ field: "TitleTypeName", title: mod.Resources["Pages:Publish:Title:Results:TitleTypeName"].Content },
				{ field: "TitleName", title: mod.Resources["Pages:Publish:Title:Results:TitleName"].Content },
				{ field: "PublisherName", title: mod.Resources["Pages:Publish:Title:Results:PublisherName"].Content },
				{ field: "AuthorNames", title: mod.Resources["Pages:Publish:Title:Results:AuthorNames"].Content },
				{ field: "PublishDate", title: mod.Resources["Pages:Publish:Title:Results:PublishDate"].Content, type: "date", format: "{0:d}" },
				{ field: "StatusName", title: mod.Resources["Pages:Publish:Title:Results:StatusName"].Content },
				{
					command: [
						{
							//name: "View", // Use resources for all displayed text
							name: mod.Resources["Pages:Publish:Title:Results:Label:View"].Content,
							click: function (e: Event) {
								// Hand off execution to a child function.
								// Note: There is a change of context of "this", hence the use of "call" to revert it back to the page component.
								mod.btnViewTitle_click.call(mod, e, this);
							}
						}
						// Potential future use:
						//{ name: mod.Resources["Pages:Publish:Title:Results:Label:Edit"].Content, click: function (e: Event) { mod.btnEditTitle_click.call(mod, e, this); } }
					]
				}
			]
		});

		// Load the page data
		mod.LoadData();
	}

	public LoadData(): void {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		// Call the services and handle the return using the "then" callback.
		// Each set of data is called individually and handled asynchronously.
		services.Publish.GetTitleTypes()
			.then(r => {
				// Verify the service's response code
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Add an item to the top for selecting "all"
					r.Data.unshift({ TitleTypeId: 0, TitleTypeName: mod.Resources["Pages:Publish:Title:Dropdown:All"].Content });

					// Save the data from the service call.
					// Since we're using MVVM, updating the model will cause the page to automatically update.
					// No need to re-run the template.
					model.Lookups.set("TitleTypes", r.Data);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Title:Message:TitleTypeLoadError"].Content, r), CalloutType.Error);
				}
				// Update the service flag
				mod.SetServiceFlag("TitleTypes");
			});
		services.Publish.GetPublishers()
			.then(r => {
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Add an item to the top for selecting "all"
					r.Data.unshift({ PublisherId: 0, PublisherName: mod.Resources["Pages:Publish:Title:Dropdown:All"].Content });

					// Save the data from the service call.
					// Since we're using MVVM, updating the model will cause the page to automatically update.
					// No need to re-run the template.
					model.Lookups.set("Publishers", r.Data);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Title:Message:PublisherLoadError"].Content, r), CalloutType.Error);
				}
				// Update the service flag
				mod.SetServiceFlag("Publishers");
			});

	}

	// This method is wired up and invoked automatically with the call to "mod.BindButton"
	public btnSearch_click(e): void {
		//debugger;
		let mod = this;
		let model = mod.State.model;
		let search = model.Search;
		let services = mod.Services;
		let constants = services.Constants;

		// Clear any messages
		mod.ClearMessage();

		// Start the progress indicator
		// [TODO]

		// Call the service, passing values from the model.
		// The model contains the latest values. No need to fetch them from the controls themselves.
		services.Publish.GetTitles({ TitleTypeId: search.TitleTypeId, PublisherId: search.PublisherId, TitleName: search.TitleName })
			.then(r => {
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Update the grid's data.
					// No need to rebind, re-render, or anything else.
					mod.Controls.gridResults.control.dataSource.data(r.Data);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Title:Message:TitleSearchError"].Content, r), CalloutType.Error);
				}

				// Turn off the progress indicator
				// [TODO]

				// Show the results
				model.View.set("ShowResults", true);
			});
	}

	// This event is called indirectly. See the model creation in Initialize for details.
	private gridResults_change(e: kendo.ui.GridChangeEvent): void {
		//debugger;
		let mod = this;
		let model = mod.State.model;
		let services = mod.Services;

		// Clear any messages
		mod.ClearMessage();

		// Get a reference to the grid
		let grid = e.sender;

		// Get the selected row
		let selectedRows = grid.select();

		// See if anything was selected
		if (selectedRows.length > 0) {
			// Get the data item associated with the grid row.
			// We can cast it because Title is Observable, as is the return value from the "dataItem" function.
			// We can assume only one row was selected.
			let dataItem = <Title>grid.dataItem(selectedRows[0]);

			// Show the details
			mod.GetTitleDetails(dataItem.TitleId);
		}
	}

	// This event is called indirectly. See the model creation in Initialize for details.
	private btnViewTitle_click(e: Event, grid: kendo.ui.Grid) {
		//debugger;
		let mod = this;

		// We will handle the click
		e.preventDefault();

		// Get the data item associated with the grid row.
		// [TODO] Make a wrapper function to eliminate use of JQuery.
		let dataItem = <Title>grid.dataItem($(e.currentTarget).closest("tr"));

		// Show the details
		mod.GetTitleDetails(dataItem.TitleId);
	}

	private GetTitleDetails(titleId: number): void {
		let mod = this;
		let services = mod.Services.Publish;
		let constants = mod.Services.Constants;
		let model = mod.State.model;

		// Clear any messages
		mod.ClearMessage();

		// Start the progress indicator
		// [TODO]

		// Call the service and handle the return using the "then" callback
		services.GetTitle(titleId)
			.then(r => {
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Save the data
					// Do NOT write it as an assignment: model.Details = r.Data;
					model.set("Details", r.Data);

					// Hide the search and show the details
					model.View.set("ShowSearch", false);
					model.View.set("ShowDetails", true);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Title:Message:TitleLoadError"].Content, r), CalloutType.Error);
				}

				// Turn off the progress indicator
				// [TODO]
			});
	}

	// This method is wired up and invoked automatically with the call to "mod.BindButton"
	private btnBack_click(e: Event): void {
		let mod = this;
		let view = mod.State.model.View;

		// Hide the details and show the search
		view.set("ShowDetails", false);
		view.set("ShowSearch", true);
	}
}
