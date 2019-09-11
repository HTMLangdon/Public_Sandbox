/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
// Load services
import { ServiceCollection, ServiceConstants, WsResponseData } from 'cp/serviceShared';
//import { PromoService } from 'bsp/promo/services/mock/promoService';
import { PromoService } from 'bsp/promo/services/promoService';
import * as promoModel  from 'bsp/promo/services/models/promoModels';


interface ProgramModel extends Observable {
	Stage1: promoModel.WsPromoStage1Details;
	Stage2: promoModel.WsPromoStage2Details;
}

interface LookupsModel extends Observable {
	SalesAgreementCodes: promoModel.WsPromoSalesAgreementCode;
	CustomerDetails: promoModel.WsPromoAccountDetails[];
	StateProvDetails: promoModel.WsPromoStateProvince[];
	HierarchyTypes: promoModel.WsHierarchyType[];
	PromoEntityIDResponse: promoModel.WsPromoEntityIdResponse;
}

interface ViewModel extends Observable {
	 ShowPrograms: boolean;
	ShowDetails: boolean;
	ShowOrderPrefix: boolean;
}


interface SectionModel extends ComponentModel {
	Program: ProgramModel;
	Lookups: LookupsModel;
	View: ViewModel;
}


interface SectionState extends ComponentState<SectionModel> {
}

interface SectionControls extends ComponentControls {
	pageMain: JQuery;
	customValidator: ComplexControl<kendo.ui.Validator>;
	multiSelectAccount: ComplexControl<kendo.ui.MultiSelect>;
	treeview: ComplexControl<kendo.ui.TreeView>;
	gridParticipants: ComplexControl<kendo.ui.Grid>;
}


interface SectionTemplates extends ComponentTemplates {
}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() PromoSvc: PromoService = null;
}



@Injectable()
export class PageComponent extends ComponentModule {

	public Controls: SectionControls;
	public Templates: SectionTemplates;
	public State: SectionState;

	constructor(ac: ApplicationContext, public Services: SectionServices) {
		super("Page", ac);
	}

	Initialize() {
		//debugger;
		let mod = this;
		let state = mod.State;
		let util = mod.Util;


		// Initialize the parent
		super.Initialize();
		mod.WriteLog("Initialize.");
		mod.AppConfig.Core.ServiceTimeout = 30000;
		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetTemplates(["Page"]);

		// Create the model
		let model = state.model = mod.CreateObservable({
			Program: {
				Stage1: {},
				Stage2: {} 
			},
			Lookups: {
				SalesAgreementCodes: [],
				CustomerDetails: [],
				StateProvDetails: [],
				HierarchyTypes: [],
				PromoEntityIDResponse:0
			},
			View: { ShowPrograms: true, ShowDetails: false, ShowOrderPrefix:false },
			OnEditFilterClick: () => { mod.btnEditFilter_click.call(mod); },
			OnDeferredRebateTypeChange: () => {
				if (mod.State.model.Program.Stage1.PromoType == "Campaign") { mod.State.model.View.set("ShowOrderPrefix", true); }
				else { mod.State.model.View.set("ShowOrderPrefix", false);}
			}

			//OnAccountNumberChange: (e: kendo.ui.MultiSelectFilteringEvent) => { mod.OnAccountNumberChange.call(mod, e); },
			//mod.
			//mod.State.model.Program.disableFlg = mod.GetValidator().validate()

		},
			//["SalesAgreementCodes", "CustomerDetails", "StateProvDetails","HierarchyTypes"]
		);

		// Bind the model to the page
		mod.BindModel(null, model);

		//Bind the validator

		//let bv = mod.BindValidator();


		//bv.setOptions({
		//	rules: {
		//		validateProgramName: function (input) {
		//			if (input.is("[name=ProgramName]") && input.val() != "") {
		//				console.log("test1");
		//				//return false;
		//				return (mod.State.model.Program.ProgramName.length > 5);
		//			}
		//			else {
		//				return true;
		//			}
		//		},
		//		validateProgramCategory: function (input) {
		//			if (input.is("[name=ProgramCategory]") && input.val() != "") {
		//				console.log("test2");
		//				//return false;
		//				return (mod.State.model.Program.ProgramCategory.length > 5);
		//			}
		//			else {
		//				return true;
		//			}
		//		}
		//	}

		//});




		//let v = mod.GetValidator();
		//console.log(v..validate());

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();

		// Render the main page template
		// [TODO] Is giving the parent as "pageMain" ok? It is already bound (but should have no effect since it is empty)
		// Alternate fix is to have a container within the PageTemplate template and bind to that (by specifying the "Parent" below)

		mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: 'pageMain', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);


		mod.BindButton("btnSave");
		mod.BindButton("btnSave1");
		mod.BindButton("btnLoadPart");

		// Bind the model to the page
		//mod.BindModel($('body'), model);
		//mod.GetComplexControl("customValidator", "kendoValidator");

		mod.GetComplexControl("multiSelectAccount", "kendoMultiSelect");
		mod.GetComplexControl("treeview", "kendoTreeView"); 
		mod.GetComplexControl("gridParticipants", "kendoGrid"); 

		//mod.Controls.customValidator.item.kendoValidator({
		//	rules: {
		//		validateprogram: (input) => {
		//			return false;
		//		}
		//	}

		//});

		//model.bind("change", () => {
		//	mod.State.model.Program.set("disableFlg", !bv.validate());
		//}

		//);

		mod.Controls.treeview.item.kendoTreeView({
			checkboxes: {
				checkChildren: true
			},
			dataSource: [],
			dataTextField: "HierarchyName",
			//dataSpriteCssClassField: "HierarchyName",
			loadOnDemand: false, 
		}
			

		)
		
		mod.Controls.multiSelectAccount.item.kendoMultiSelect({
			dataTextField: 'EntityRefKey',
			dataValueField: 'EntityRefKey',
			valuePrimitive: false,
			
			placeholder: "Type to search",
			//value: model.Program.Stage2.AccountNumber,
			autoBind: false,		
			tagMode:"multiple",
			minLength: 5,
			filter: "startswith",
		
			enforceMinLength: true,
			filtering: function (e) {
				var filter = e.filter;

				if (!filter || !filter.value) {
					//prevent filtering if the filter does not have value
					e.preventDefault();
				}
			},
			dataSource: {
				
				serverFiltering: true, // <-- this is important to enable server filtering
								
				transport: {
					
					read: function (options) {
						var value = mod.Controls.multiSelectAccount.control.input.val();
						var acct: promoModel.WsAccountRequest = { AccountLevel: model.Program.Stage2.AccountLevel, AccountNumber: value, EntityId: 0 }
						//console.log(value);
						
						mod.Services.PromoSvc.GetPromoAccountDetails(acct)
							.then(data => {
								if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
									model.Lookups.set("CustomerDetails", data.Data);
									mod.Controls.multiSelectAccount.control.dataSource.data(model.Lookups.CustomerDetails);
									options.success(data.Data);
									//debugger;
								} else {
									mod.ShowMessage(mod.GetServiceMessage("Error loading Account details.", data), CalloutType.Error);
								}


								mod.SetServiceFlag("CustomerDetails");
							});

							//.then(function (result) {
							//	// notify the data source that the request succeeded
							//	options.success("Success");
							//});
						
						
					}			
					
				}
			}
			//change: (e: kendo.ui.MultiSelectChangeEvent) => { mod.OnAccountNumberChange.call(mod, e); },
			//dataSource:[]
		});






		// Load the page data
		mod.LoadData();


		// [TEST] Fix the TreeView control
		mod.FixTreeView();

	

	}

	public btnEditFilter_click(e): void {

		//debugger;
		let mod = this;
		let model = mod.State.model;
		let program = model.Program;
		let services = mod.Services;
		let constants = services.Constants;

		model.View.set("ShowPrograms", true);
		model.View.set("ShowDetails", false);

	}

	public btnStartOver_click(e): void {

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

	public OnAccountNumberChange(): void {

		let mod = this; 
		let util = mod.Util;
		let model = mod.State.model;
		let program = model.Program;
		let services = mod.Services;
		let constants = mod.Services.Constants;
		//let constants = services.Constants;
		//console.log(mod);
		//console.log(program.SelectedProgramType);

		// Reset the Data and View objects in model to clear out prior selection values
		//mod.InitViewModel(model);
		


		// This fires when the user leaves the autocomplete textbox
		//let sender = e.sender;
		////var found = false;
		//var value = sender.value();
		//var data = sender.dataSource.view();

		//for (var idx = 0, length = data.length; idx < length; idx++) {
		//	if (data[idx].AccountNumber === value) {
		//		found = true;
		//		break;
		//	}
		//}

		var value = mod.Controls.multiSelectAccount.control.value();
		//if (!found) {
		//	model.Form.set("AddAccountNumber", true);
		//	if (!mod.IsValidAccountNumber(value)) {
		//		mod.ShowMessage("Account number must be in the format XX.XXXXXX.XXXX.XXX.XX.XXX", CalloutType.Error);
		//	}
		//} else {
		//	model.Form.set("AddAccountNumber", false);
		//}
		var acct: promoModel.WsAccountRequest = { AccountLevel: model.Program.Stage2.AccountLevel, AccountNumber: value, EntityId:0 }

		services.PromoSvc.GetPromoAccountDetails(acct)
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) { 
					model.Lookups.set("CustomerDetails", data.Data);
					mod.Controls.multiSelectAccount.control.dataSource.data(model.Lookups.CustomerDetails);
					//debugger;
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading Account details.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("CustomerDetails");
			});

	}

	public btnSave_click(e): void {

		//debugger;
		let mod = this;
		let model = mod.State.model;
		let program = model.Program;
		let services = mod.Services;
		let constants = services.Constants;

		console.log(JSON.stringify(model.Program.Stage2));
		//console.log(mod.Controls.ddProgramCat.item.val()); 
		 

	}

	public btnSave1_click(e): void {

		//debugger;
		let mod = this;
		let model = mod.State.model;
		let program = model.Program;
		let services = mod.Services;
		let constants = services.Constants;

		
		console.log(JSON.stringify(model.Program.Stage1));
		
		//console.log(mod.Controls.ddProgramCat.item.val());

		var promostage1: promoModel.WsProgramConfigRequest = {
			EntityID: 0,
			ProcessStep: "promostage1",
			Role: "Admin",
			UserID: "N519663",
			PromoName: "TEST UI",
			PromoAttributes: JSON.stringify(model.Program.Stage1)
		}

		services.PromoSvc.SavePromoData(promostage1)
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					model.Lookups.set("PromoEntityIDResponse", data.Data);
					console.log(model.Lookups.PromoEntityIDResponse);
					//debugger;
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error saving promo details.", data), CalloutType.Error);
				}

				//mod.SetServiceFlag("CustomerDetails");
			});


	}

	public btnLoadPart_click(e): void {

		//debugger;
		let mod = this;
		let model = mod.State.model;
		let program = model.Program;
		let services = mod.Services;
		let constants = services.Constants;
		 
		model.View.set("ShowPrograms", false);
		model.View.set("ShowDetails", true);

		//bind click event to the checkbox
		mod.Controls.gridParticipants.item.on("click", ".checkbox", mod.checkAll);

		mod.Controls.gridParticipants.item.kendoGrid({
			dataSource: {pageSize:10},

			columns: [

				//{ template: "<input type='checkbox' class='checkbox' checked />" },
				{
					field: "Discontinued", width: 120, template: "<input type='checkbox' type='checkbox' data-bind='checked:Discontinued' />"
					, headerTemplate: "<input id='checkAll' type='checkbox'  />"
				},
				
				{ field: "EntityRefKey" },
				{ field: "FullLegalName" },
				{ field: "Address" },
				
				
			]
			, noRecords: true
			, pageable: true
			 
			 


			//(e: kendo.ui.GridDataBoundEvent) => { mod.ondatabinding.call(e); } 
		});

		// Update the grid's data
		mod.Controls.gridParticipants.control.dataSource.data(model.Program.Stage2.AccountNumber);


	}

	public checkAll() {
		let mod = this
		var grid = mod.Controls.gridParticipants.control;
		var items = grid.items();
		console.log(items);
		//items.each(function () {
		//	var dataItem = grid.dataItem(this);
		//	dataItem.set("Discontinued", true);
			 
		//})
	}

	public LoadData(): void {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.PromoSvc.GetSalesCodes()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					//data.Data.unshift({ SalesCodeId: 0, SalesCodeAgreement: "Type or Select from List" });
					//debugger;
					//console.log(data.Data);
					model.Lookups.set("SalesAgreementCodes", data.Data.SCTypes);
				} else {
					//console.log(data.Data);
					mod.ShowMessage(mod.GetServiceMessage("Error loading Sales Codes.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("SalesAgreementCodes");
			});

		services.PromoSvc.GetStateProvince()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					//data.Data.unshift({ StateProvId: -1, StateProvName: "Type or Select from List" });
					model.Lookups.set("StateProvDetails", data.Data);

					//model.Program.set("Stage2.StateProvince", { StateProvId: -1, StateProvName: "Type or Select from List" });
					//debugger;
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading State Provinces.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("StateProvDetails");
			});


		var hier: promoModel.WsHierarchyTypeRequest = { HierarchyType:"TerritoryHier" }

		services.PromoSvc.GetPromoHierarchy(hier)
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					//console.log(data.Data);
					model.Lookups.set("HierarchyTypes", data.Data);
					var inlineDefault = new kendo.data.HierarchicalDataSource({
						data: model.Lookups.HierarchyTypes,						 
						schema: {
							model: {
								children: "Children"
							}
						}
					})
					mod.Controls.treeview.control.setDataSource(inlineDefault);
					//debugger;
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading Hierarcy details.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("HierarchyTypes");
			});

	}

}
