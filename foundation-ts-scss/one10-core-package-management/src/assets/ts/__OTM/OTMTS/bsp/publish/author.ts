/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

// Load standard modules
import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';

// Load services
import { ServiceCollection } from 'cp/serviceShared';
//import { PublishService } from 'bsp/publish/services/mock/publishService';
import { PublishService } from 'bsp/publish/services/publishService';
import { WsStatusType } from 'bsp/publish/services/models/publishModels';
import { ComplexControl } from 'cp/util';

// Define sub-objects for the model.
// Convention is to use the prefix "Section".
interface SectionData extends Observable {
	Status: string;
	FirstName: string;
	LastName: string;
}

interface LookupData extends Observable {
	StatusTypes: WsStatusType[];
}

interface ViewData extends Observable {
	ShowResults: boolean;
}

// Define the main model for the PageComponent.
// Convention is to use the name "SectionModel".
// Typical section model items are "View" and "Lookups". Often there is a "Data" item.
// Keep the model clean by separating different types of data.
// It also helps later when breaking off sub-components.
interface SectionModel extends ComponentModel {
    Search: SectionData;
    Lookups: LookupData;
    View: ViewData;
}

// Use the ComponentState generic to make the model strongly-typed
interface SectionState extends ComponentState<SectionModel> { }

// Define any controls you need to access directly (outside of MVVM or event callbacks).
// We do not write JQuery or other DOM selectors in these components.
interface SectionControls extends ComponentControls {
	pageMain: JQuery;
	gridResults: ComplexControl<kendo.ui.Grid>;
}

// Define the services that will be used.
// @Injectable allows it to be created by the Depenency Injector.
// @DiscardBinding tells the Dependency Injector it will not be used again. This prevents potential name collisions between components on the page.
@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	// @Inject tells the Dependency Injector to instantiate this property. No need to use a constructor.
    @Inject() Publish: PublishService = null;
}

@Injectable()
export class PageComponent extends ComponentModule {
	// Override the parent's definition for Controls and State with a more strongly-typed version.
	// TypeScript allows this so long as the new definition is the same or inherits the same type as the parent.
    public Controls: SectionControls;
    public State: SectionState;

	// Define the constructor.
	// Both parameters will be filled in by the Dependency Injector.
	// The first parameter is passed to the parent class.
	// The second parameter is automatically wired to a module-level property called "Services".
	// This is done by using the "public" scope descriptor on the parameter.
	// It means that you can reference "mod.Services" even though it was not explicitly defined as a property above.
    constructor(ac: ApplicationContext, public Services: SectionServices) {
        super("Page", ac);
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

        // Get control and template references; bind buttons
        mod.GetControl("pageMain");
        //mod.GetTemplates(["Page"]); @@@

		// Create the model.
		// Specify empty and default values for the various parts in the model.
		// It is important that lookup types be initialized with an empty array.
        let model = state.model = mod.CreateObservable({
			Search: {
				Status: '',
				FirstName: '',
				LastName: ''
			},
			Lookups: {
				StatusTypes: []
			},
			View: {
				ShowResults: false
			}
        },
			// Define any service watchers.
			// In this case, watch for the "StatusTypes" service completion flag to be set.
            ["StatusTypes"]
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

		// Create the grid (without data).
		// This allows us to instantiate it, define columns, and specify options up front.
		// Then all we have to do is update the data once it has been retrieved.

		// First get a complex control reference.
		// The first parameter is the control's ID.
		// The second parameter is the control's type. It corresponds to the "data" attribute Kendo will use to store the control object in the DOM. It is also the name of the function used to instantiate the control.
		mod.GetComplexControl("gridResults", "kendoGrid");
		// Instantiate the grid without any data.
		// Include any options, such as paging, sorting, filtering, etc.
		mod.Controls.gridResults.item.kendoGrid({
			noRecords: {
				template: mod.Resources["Pages:Publish:Author:Message:NoRecords"].Content
			},
			dataSource: [], // Empty data
			// Define the columns.
			// Use resources for the displayed text.
			// Optionally define data types, format strings, etc. (not shown here)
			columns: [
				{ field: "AuthorId", title: mod.Resources["Pages:Publish:Author:Results:AuthorId"].Content },
				{ field: "FirstName", title: mod.Resources["Pages:Publish:Author:Results:FirstName"].Content },
				{ field: "LastName", title: mod.Resources["Pages:Publish:Author:Results:LastName"].Content },
				{ field: "StatusName", title: mod.Resources["Pages:Publish:Author:Results:StatusName"].Content }
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

		// Call the service and handle the return using the "then" callback
		services.Publish.GetStatusTypes()
			.then(r => {
				// Verify the service's response code
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Add an item to the top for selecting "all"
					r.Data.unshift({ Status: '', StatusName: mod.Resources["Pages:Publish:Author:Dropdown:All"].Content });

					// Save the data from the service call.
					// Since we're using MVVM, updating the model will cause the page to automatically update.
					// No need to re-run the template.
					model.Lookups.set("StatusTypes", r.Data);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Author:Message:StatusTypeLoad"].Content, r), CalloutType.Error);
				}
				// Update the service flag
				mod.SetServiceFlag("StatusTypes");
			});
	}

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
		services.Publish.GetAuthors({ Status: search.Status, FirstName: search.FirstName, LastName: search.LastName })
			.then(r => {
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Update the grid's data.
					// No need to rebind, re-render, or anything else.
					mod.Controls.gridResults.control.dataSource.data(r.Data);
				} else {
					// Show an error
					mod.ShowMessage(mod.GetServiceMessage("Error fetching author list.", r), CalloutType.Error); // [TODO] Pull from resources
				}

				// Turn off the progress indicator
				// [TODO]

				// Show the results
				model.View.set("ShowResults", true);
			});
	}

}
