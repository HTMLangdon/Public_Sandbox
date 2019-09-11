/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

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
//import { BiService } from 'bsp/bi/services/biService';
import { WsReportViewConfig, WsIndustryType, WsProductCategoryType, WsProductType, WsReportRequest } from 'bsp/bi/services/models/biModels';
import { ReportData } from './services/mock/biData';

interface SelectionData extends Observable {
	//ReportTypeId: number; // Moved to Config section of the model
	IndustryTypes: number[];
	StartDate: Date;
	EndDate: Date;
	ProductCategoryTypes: number[];
	ProductTypes: number[];
	//HierarchyIds: number[];
	HierarchyId: number;
}

interface SelectionViewData extends Observable {
	ShowSubmit: boolean;
	ShowDateSelection: boolean;
	ShowIndustrySelection: boolean;
	ShowProductCategorySelection: boolean;
	ShowProductSelection: boolean;
	ShowHierarchySelection: boolean;
	ShowReportResults: boolean; // [TEST] Added to display report results on clicking a button
}

interface SelectionLookupData extends Observable {
	ReportTypes: WsReportViewConfig[];
	IndustryTypes: WsIndustryType[];
	ProductCategoryTypes: WsProductCategoryType[];
	ProductTypes: WsProductType[];
	//Hierarchies: WsHierarchy[]; // FUTURE
	HierarchySource: kendo.data.HierarchicalDataSource; // [TODO] Abstract/wrap kendo.
}
interface SelectionDetails extends Observable {
	Config: WsReportViewConfig;
	Data: SelectionData;
	Lookups: SelectionLookupData;
	View: SelectionViewData;
	Request: WsReportRequest; // [TEST] Added this to store and display the report request
	RequestJson: string; // [TEST] Added this to store and display the report request
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

interface SectionModel extends ComponentModel {
	Selection: SelectionDetails;
}

interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
  pageMain: JQuery;
  gridResults: ComplexControl<kendo.ui.Grid>;
}

interface SectionTemplates extends ComponentTemplates {
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

	constructor(ac: ApplicationContext, public Services: SectionServices) {
		super("Page", ac);
		//let mod = this;
	}

  Initialize() {
    //debugger;
    let mod = this;
    let state = mod.State;
    let util = mod.Util;

    // [TEST] Fix the TreeView control
    mod.FixTreeView();

    // Initialize the parent
    super.Initialize();

    mod.WriteLog("Initialize.");

    // [TODO] Allow coming in with parameters already set?
    //let id = util.ToSafeInteger(util.GetParameterByName("id"));

    // [TODO] Handle missing or invalid params

    // Get control and template references; bind buttons
    mod.GetControl("pageMain");
    mod.GetTemplates(["Page"]);
    //mod.BindButtons(["btnSearch"]); // Can't do this here because it hasn't been rendered yet

    // Create the model
    let model = state.model = mod.CreateObservable({
      Selection: { // Model is mostly empty. We have a default population method.
        Config: {
          ReportTypeId: 0,
          ReportTypeName: '',
          ShowSubmit: false,
          ShowDateSelection: false,
          ShowIndustrySelection: false,
          ShowProductCategorySelection: false,
          ShowProductSelection: false,
          ShowHierarchySelection: false
        },
        Lookups: {
          ReportTypes: [],
          HierarchySource: new kendo.data.HierarchicalDataSource({}) // TreeView needs a special data source
        },
        Data: {},
        View: {},
        // [TODO] Consider auto wire-up. Add method to observable model and auto-bind to matching component method.
        ReportType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.ReportType_Change.call(mod, e); },
        IndustryType_Change: (e: kendo.ui.MultiSelectChangeEvent) => { mod.IndustryType_Change.call(mod, e); },
        ProductCategoryType_Change: (e: kendo.ui.MultiSelectChangeEvent) => { mod.ProductCategoryType_Change.call(mod, e); }
        //HierarchyId_Select: (e: kendo.ui.TreeViewSelectEvent) => { mod.HierarchyId_Select.call(mod, e); }
        //Hierarchy_Change: (e: kendo.ui.TreeViewChangeEvent) => { mod.Hierarchy_Change.call(mod, e); }, // FUTURE?
      }
    },
      ["ReportTypes"]
    );
    mod.InitViewModel(state.model.Selection);
    // Bind the model to the page
    mod.BindModel(null, model);

    // Initialize sub-components
    // Do this AFTER binding and starting the service watcher
    mod.InitializeComponents();

    // Get report parameters from the URL (if any)
    // TO EARLY !!
    //mod.GetReportParams();

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
    mod.BindButton("btnSubmit");
    mod.GetComplexControl("gridResults", "kendoGrid"); // Get a complex control reference
    mod.Controls.gridResults.item.kendoGrid({ // Initialize the grid (columns, etc.) with no data
      dataSource: [], // Empty data
      //dataSource: new kendo.data.DataSource(), // This is not needed. Kendo will create one for us.
      columns: [ // This is limiting us to one type of output for the grid. Make dynamic!
        { field: "FirstName", title: "First Name" },
        { field: "LastName", title: "Last Name" },
        { field: "Username", title: "Username" }
      ]
    });

    // Load the page data
    mod.LoadData();
  }

	public GetReportParams(): void {

		// [TODO] This really doesn't work. It is clunky and requires changing how things are built

		// Sample params in JSON and Query String format
		// {"ReportId":1,"IndustryTypes":[1],"StartDate":"2019-02-26T15:36:15.068Z","EndDate":"2019-02-26T15:36:15.068Z","ProductCategoryTypes":[100,110],"ProductTypes":[102,112],"HierarchyId":21}
		// ?id=1&industry=1&start=2019-02-26T15:36:15.068Z&end=2019-02-26T15:36:15.068Z&productCat=100,110&prodType=102,112&hier=21

		//debugger;

		let mod = this;
		let model = mod.State.model.Selection;
		let util = mod.Util;

		// Get values and store in the model
		let reportId = util.ToSafeInteger(util.GetParameterByName("id"));

		//model.Data.ReportTypeId; // Does not exist
		//model.Config.ReportTypeId // This is what we want, but we need the whole "config" object

		if (reportId > 0) {
			// Get the report item
			// Not sure why "first()" does not work as expected
			let report: WsReportViewConfig = null;
			for (let i = 0; i < model.Lookups.ReportTypes.length; i++) {
				if (model.Lookups.ReportTypes[i].ReportTypeId == reportId) {
					report = model.Lookups.ReportTypes[i];
					break;
				}
			}

			if (report) {
				// Save the config
				model.set("Config", report);

				// Need to let the report dropdown know there was a change
				// Trigger the event
				// ?????

				let startDate = util.GetParameterByName("start");
				if (startDate) model.Data.set("StartDate", new Date(startDate));
				let endDate = util.GetParameterByName("end");
				if (endDate) model.Data.set("EndDate", new Date(endDate)); // [TODO] Create and use Util.ToSafeDate()

				//debugger;

				// [TODO] Cast the values. Note: These might be arrays.
				let industry = util.GetParameterByName("industry");
				if (industry) model.Data.set("IndustryTypes", mod.ConvertAll(industry.split(','), util.ToSafeInteger));
				let productCat = util.GetParameterByName("productCat");
				if (productCat) model.Data.set("ProductCategoryTypes", mod.ConvertAll(productCat.split(','), util.ToSafeInteger));
				let prodType = util.GetParameterByName("prodType");
				if (prodType) model.Data.set("ProductTypes", mod.ConvertAll(prodType.split(','), util.ToSafeInteger));
				let hier = util.GetParameterByName("hier");
				if (hier) model.Data.set("HierarchyId", util.ToSafeInteger(hier));

				// Need to sequence these or somehow call them in parallel and wait for them to finish
				// Or need a more unified way of handling state/flags
				
				//mod.ReportType_Change(null);
				//mod.IndustryType_Change(null);
				//mod.ProductCategoryType_Change(null);

				if (model.View.ShowIndustrySelection) {
					mod.PopulateIndustryTypes();
					mod.PopulateHierarchy();
				};

			}
		}
	}

	public ConvertAll<T>(source: any[], conversionFn : (s) => T): T[] {
		let mod = this;
		let util = mod.Util;

		let ret: T[] = [];
		source.forEach((value, index, array) => {
			ret.push(conversionFn(value));
		});

		return ret;
	}

	public LoadData(): void {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.Bi.GetReportTypes()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					data.Data.unshift({ ReportTypeId: 0, ReportTypeName: "(Please select)", ShowDateSelection: false, ShowIndustrySelection: false, ShowHierarchySelection: false, ShowProductCategorySelection: false, ShowProductSelection: false });
					model.Selection.Lookups.set("ReportTypes", data.Data);
					// [TEST] Add to the model directly so we have an item in the list that is not found later
					model.Selection.Lookups.ReportTypes.push({ ReportTypeId: 4, ReportTypeName: "Report D", ShowDateSelection: false, ShowIndustrySelection: false, ShowHierarchySelection: false, ShowProductCategorySelection: false, ShowProductSelection: false });

					// Get report parameters from the URL (if any)
					// [TODO] Ideally we would watch for the model's ReportTypes to be filled in, and run after that (rather than putting code inside this fetch callback)
					mod.GetReportParams();
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading report types.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("ReportTypes");
			});
	}

	// [TODO] Move to common location (if retained)
	public UpdateModelChildren(model: Observable, data: object): void {
		let mod = this;

		// [TODO] Look at batch updating. Can we update them all and then trigger a single change?
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				var value = data[key];
				if (typeof value != "function")
					model.set(key, value);
			}
		}
	}

	// [TODO] Move to common location (util?) or remove if not used
	private SetIfDifferent(model: Observable, key: string, value: any): void {
		let mod = this;

		let old = model[key];
		if (old != value)
			model.set(key, value);
	}

	public ReportType_Change(e: kendo.ui.ComboBoxChangeEvent): void {
		// [TODO] Automate. Create standard wrappers, but allow for custom implementation.
		//debugger;
		let mod = this;
		let model = mod.State.model.Selection;
		let services = mod.Services;
		let constants = services.Constants;

		mod.ClearMessage();
		// temp hack - save report id in a lcoal var and replace it after reinitializing the model
		let reportTypeId = model.Config.ReportTypeId;
		// Reset the Data and View objects in model to clear out prior selection values
		mod.InitViewModel(model);

		//mod.Engine.Set("Bi:ReportType", model.Data.ReportTypeId);
		// Method to fetch Report Config form a service to deermine which controls to display based on report selection
		services.Bi.GetReportConfig(reportTypeId)
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					// Save the config separately and then initialize the view model
					let config = data.Data;
					model.set("Config", config);
					model.View.set("ShowSubmit", true);
					model.View.set("ShowDateSelection", config.ShowDateSelection);
					model.View.set("ShowIndustrySelection", config.ShowIndustrySelection);
					model.View.set("ShowProductCategorySelection", false);
					model.View.set("ShowHierarchySelection", true);
				}
				else {
					mod.ShowMessage("Unable to determine report configuration for the selected report", CalloutType.Error);
				}
				//call method to populate the industry type drop down
				if (model.View.ShowIndustrySelection) {
					mod.PopulateIndustryTypes();
					mod.PopulateHierarchy();
				};
			});
	}

	public IndustryType_Change(e: kendo.ui.MultiSelectChangeEvent): void {
		//debugger;
		let mod = this;
		let constants = mod.Services.Constants;
		let model = mod.State.model.Selection;

		mod.ClearMessage();

		model.View.set("ShowProductSelection", false);

		if (model.Data.IndustryTypes && model.Data.IndustryTypes.length > 0) {
			mod.Services.Bi.GetProductCategoryTypes(model.Data.IndustryTypes)
				.then(data => {
					if (data.ResponseCode == constants.ResponseCode.Success) {
						model.Lookups.set("ProductCategoryTypes", data.Data);
						model.View.set("ShowProductCategorySelection", model.Config.ShowProductCategorySelection);
						//model.Data.set("ProductCategoryTypes", model.Data.ProductCategoryTypes); // This will not work. Model sees it as "no change".

						if (model.Config.ShowProductCategorySelection) {
							if (model.Data.ProductCategoryTypes.length > 0) {
								// Re-add the product categories. There is an odd behavior where replacing the lookup list causes the selected items to disappear.
								// [TODO] Consider making common wrapper for handling this
								let pc = [];
								model.Data.ProductCategoryTypes.forEach((value, index, arr) => { pc.push(value); }); // First, save the list
								model.Data.set("ProductCategoryTypes", []); // Second, blank it
								model.Data.set("ProductCategoryTypes", pc); // Third, re-apply the list
								model.View.set("ShowProductSelection", model.Config.ShowProductSelection);
							}
							else
								model.View.set("ShowProductSelection", false);
						} else
							model.View.set("ShowProductSelection", false);
					} else {
						mod.ShowMessage("Unable to determine product categories for the selected industries", CalloutType.Error);
					}
				});
		} else {
			model.View.set("ShowProductCategorySelection", false);
			model.View.set("ShowProductSelection", false);
		}
	}

	// [TEST] Not currently used. Add-on for MVVM value selection makes this obsolete. Code left behind for reference.
	//public HierarchyId_Select(e: kendo.ui.TreeViewSelectEvent): void {
	//	//debugger;
	//	let mod = this;

	//	let treeView = e.sender;
	//	let di = treeView.dataItem(e.node);
	//	mod.State.model.Selection.Data.set("HierarchyId", di["id"]);
	//}

	public ProductCategoryType_Change(e: kendo.ui.MultiSelectChangeEvent): void {
		//debugger;
		let mod = this;
		let constants = mod.Services.Constants;
		let model = mod.State.model.Selection;

		mod.ClearMessage();

		if (model.Data.ProductCategoryTypes && model.Data.ProductCategoryTypes.length > 0) {
			mod.Services.Bi.GetProductTypes(model.Data.ProductCategoryTypes)
				.then(data => {
					if (data.ResponseCode == constants.ResponseCode.Success) {
						model.Lookups.set("ProductTypes", data.Data);
						model.View.set("ShowProductSelection", model.Config.ShowProductSelection);

						if (model.Config.ShowProductSelection) {
							if (model.Data.ProductTypes.length > 0) {
								// Re-add the products. There is an odd behavior where replacing the lookup list causes the selected items to disappear.
								let p = [];
								model.Data.ProductTypes.forEach((value, index, arr) => { p.push(value); });
								model.Data.set("ProductTypes", []);
								model.Data.set("ProductTypes", p);
							}
						}
					} else {
						mod.ShowMessage("Unable to determine products for the selected product categories", CalloutType.Error);
					}
				});
		} else {
			model.View.set("ShowProductSelection", false);
		}
	}

  public btnSubmit_click(e) {
    let mod = this;
    let constants = mod.Services.Constants;
    let model = mod.State.model.Selection;
    let reportDataRequest: WsReportRequest = {
      ReportId: model.Config.ReportTypeId,
      IndustryTypes: model.Data.IndustryTypes,
      StartDate: model.Data.StartDate,
      EndDate: model.Data.EndDate,
      ProductCategoryTypes: model.Data.ProductCategoryTypes,
      ProductTypes: model.Data.ProductTypes,
      //Hierarchies: model.Data.Hierarchies // FUTURE?
      HierarchyId: model.Data.HierarchyId
    }
    model.set("Request", reportDataRequest);
    model.set("RequestJSon", JSON.stringify(reportDataRequest));
    //model.View.set("ShowReportResults", true);
    model.View.set("ShowReportResults", false); // Hide the results. [TODO] Show a progress indicator.

    //let grid = mod.GetComplexControl("gridResults", "kendo.ui.Grid"); // Don't do this in the button click

    // These are all equivalent:
    //mod.Controls.gridResults.control
    //mod.Controls.gridResults.item.data("kendoGrid");
    //$("#gridResults").data("kendoGrid");

    //let grid = mod.Controls.gridResults.control;

    // Test: Inject the data (don't call the service)
    //grid.dataSource.data([
    //  { FirstName: "John", LastName: "Doe", Username: "pax-01" },
    //  { FirstName: "Jane", LastName: "Smith", Username: "pax-02" }
    //]);

    // Invoke the service
    //mod.Services.Bi.GetReportData(reportDataRequest)
    //  .then(data => {
    //    // Check service return status
    //    if (data.ResponseCode == constants.ResponseCode.Success) {
    //      // Get the control reference
    //      let grid = mod.Controls.gridResults.control;

    //      // Give the new data to the grid
    //      grid.dataSource.data(data.Data.Items);

    //      // Show the report
    //      // [TODO] Turn off progress indicator
    //      model.View.set("ShowReportResults", true);
    //    } else {
    //      // [TODO] Replace alert with on-screen message
    //      alert('Service error.');
    //    }
    //  });

    // Alternate: Call the async method in a synchronous way
    mod.GetReportData(reportDataRequest);


    // Example of nested promises.
    // This might be a good candidate for using await for each call
    //mod.Services.Bi.GetHierarchy()
    //  .then(data => {
    //    mod.Services.Bi.GetProductTypes(null)
    //      .then(data2 => {

    //        let a = data.Data;
    //        let b = data2.Data;

    //      });
    //  });
  }

  private async GetReportData(reportDataRequest) {
    let mod = this;
    let constants = mod.Services.Constants;
    let model = mod.State.model.Selection;

    let data = await mod.Services.Bi.GetReportData(reportDataRequest);

    // Check service return status
    if (data.ResponseCode == constants.ResponseCode.Success) {
      // Get the control reference
      let grid = mod.Controls.gridResults.control;

      // Give the new data to the grid
      grid.dataSource.data(data.Data.Items);

      // Show the report
      // [TODO] Turn off progress indicator
      model.View.set("ShowReportResults", true);
    } else {
      // [TODO] Replace alert with on-screen message
      alert('Service error.');
    }

  }

	private PopulateHierarchy(): void {
		let mod = this;
		let model = mod.State.model.Selection;
		let services = mod.Services;
		let constants = services.Constants;
		
		// [TODO] Start a modal spinner
		// [TODO] Hide controls?

		services.Bi.GetHierarchy()
			.then(data => {
				//debugger;
				if (data.ResponseCode == constants.ResponseCode.Success) {
					// [TODO] Handle if the previously selected item is still valid
					model.Data.set("HierarchyId", 0);
					model.Lookups.HierarchySource.data(data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error getting Hierarchys.", data), CalloutType.Error);
				}
				// [TODO] Clear the modal spinner
			});
	}

	private PopulateIndustryTypes(): void {
		let mod = this;
		let model = mod.State.model.Selection;
		let services = mod.Services;
		let constants = services.Constants;

		if (model.Config.ReportTypeId && model.View.ShowIndustrySelection) {
			// [TODO] Start a modal spinner
			// [TODO] Hide the industry selector and other controls?

			services.Bi.GetIndustryTypes(model.Config.ReportTypeId)
				.then(data => {
					//debugger;
					if (data.ResponseCode == constants.ResponseCode.Success) {
						// [TODO] Handle if the previously selected item is still valid
						model.Data.set("IndustryTypeId", 0);

						//data.Data.unshift({ IndustryTypeId: 0, IndustryTypeName: "(Please select)" }); // Removed during conversion to multi-select
						model.Lookups.set("IndustryTypes", data.Data);
					} else {
						mod.ShowMessage(mod.GetServiceMessage("Error getting industry types.", data), CalloutType.Error);
					}
					// [TODO] Clear the modal spinner
				});

		} else {
			mod.ShowMessage("Unable to determine industry types for the selected report", CalloutType.Error);
		}
	}

	private InitViewModel(model: SelectionDetails): void {
		let mod = this;

		//Initialize the Data and View properties in model to thier default values
		model.set("Data", {
			//ReportTypeId: reportTypeId, // Moved to Config section of the model
			IndustryTypes: [],
			StartDate: new Date(),
			EndDate: new Date(),
			ProductCategoryTypes: [],
			ProductTypes: [],
			//Hierarchies: []
			HierarchyId: undefined
		});

		model.set("View", {
			ShowSubmit: false,
			ShowDateSelection: false,
			ShowIndustrySelection: false,
			ShowProductCategorySelection: false,
			ShowProductSelection: false,
			ShowHierarchySelection: false,
			ShowReportResults: false
		});
	}

	private FixTreeView(): void {
		let mod = this;

		// Add new options for binding not normally associated with the control
		// [TODO] Move to common polyfill location.
		// [TODO] Consider adding these to type definitions as well.
		kendo.ui.TreeView.fn.options["dataValueField"] = '';
		kendo.ui.TreeView.fn.options["dataValuePrimitive"] = false;

		// [TEST] Add a "fix" to the observable "get" method to handle field names as arrays
		// TreeView without the (new) dataValueField property will pull the dataTextField which is an array
		// This was not needed, but the code remains here commented out

		//kendo.data.ObservableObject.fn["get"] = function (field) {
		//	var that = this, result;
		//	if (field && typeof field === "object" && field.length && field.length > 0) field = field[0]; // NEW
		//	that.trigger("get", { field: field });
		//	if (field === 'this') {
		//		result = that;
		//	} else {
		//		result = kendo["getter"](field, true)(that);
		//	}
		//	return result;
		//}

		// Fix to add a "value()" method on the TreeView object
		// [TODO] Move to common polyfill location.
		// [TODO] Finish implementation (specfically "set" behavior and returning multiple selections)
		kendo.ui.TreeView.prototype["value"] = function (this: kendo.ui.TreeView, value: any) {
			//debugger;
			let treeView: kendo.ui.TreeView = this;

			// If the value is not defined/null, it means it is being requested, otherwise it is being set
			if (value == undefined || value == null) {
				let sel = treeView.select();
				if (!sel || sel.length == 0) {
					return null;
				} else {
					//debugger;
					// See if dataValuePrimitive is enabled
					let id = treeView.options["dataValuePrimitive"] ? (treeView.dataSource.options.schema.model.fn.idField || "id") : "";

					// Get the data item associated with the selection
					// [TODO] Handle multiple selections. Note: This is not retuned via the "select()" method
					let di = treeView.dataItem(sel);

					if (di) {
						if (treeView.options["dataValuePrimitive"]) {
							return di[id];
						} else
							return di;
					} else
						return undefined;
				}
			} else {
				//debugger;
				// [TODO] Handle assigning the selection
			}
		};
	}
}
