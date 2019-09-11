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
import { WsFeature } from 'bsp/publish/services/models/publishModels';

// Sometimes we need to redefine a simple WS model as Observable
interface Feature extends WsFeature, Observable { }

// Define the main model for the PageComponent.
// Convention is to use the name "SectionModel".
interface SectionModel extends ComponentModel {
	Features: Feature[];
}

// Use the ComponentState generic to make the model strongly-typed
interface SectionState extends ComponentState<SectionModel> { }

// Define any controls you need to access directly (outside of MVVM or event callbacks).
// We do not write JQuery or other DOM selectors in these components.
interface SectionControls extends ComponentControls {
	pageMain: JQuery;
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
		// The first line of code of any constructor that inherits/excends another class MUST call "super".
		super("Page", ac);
	}

	// Define the Initialize method
	Initialize() {
		// Putting a debugger statement at the top of the method is convenient during development
		//debugger;
		// Always save a reference to "this" to prevent scope issues.
		// Convention is to use a variable called "mod".
		let mod = this;
		// Save references to additional pieces of the component
		let state = mod.State;

		// Initialize the parent
		super.Initialize();
		mod.WriteLog("Initialize.");

		// Fetch a reference to the "pageMain" control (selector).
		// This method looks for an element with the same ID as the first parameter.
		// It also stores a reference to the control in the "Controls" collection of the component.
		mod.GetControl("pageMain");
		
		// Create the model.
		// Specify empty and default values for the various parts in the model.
		// It is important that lookup types be initialized with an empty array.
		// In this case, we can define an empty array for the feature list.
		let model = state.model = mod.CreateObservable({
			Features: []
		},
			// Define any service watchers.
			// In this case, watch for the "Features" service completion flag to be set.
			["Features"]
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

		// Load the page data
		mod.LoadData();
	}

	public LoadData(): void {
		//debugger;
		// Save references to the component and other pieces we might need
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		// Call the service and handle the return using the "then" callback
		services.Publish.GetPublishFeatures()
			.then(r => {
				// Verify the service's response code
				if (r.ResponseCode == constants.ResponseCode.Success) {
					// Save the data from the service call.
					// Since we're using MVVM, updating the model will cause the page to automatically update.
					// No need to re-run the template.
					model.set("Features", r.Data);
				} else {
					// Show an error message
					mod.ShowMessage(mod.GetServiceMessage(mod.Resources["Pages:Publish:Message:FeatureLoadError"].Content, r), CalloutType.Error);
				}
				// Update the service flag
				mod.SetServiceFlag("Features");
			});
	}
}
