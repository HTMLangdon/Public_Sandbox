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
import { WsPromotionStatus, WsParticipantType, WsParticipantSelectionType, WsAwardType, WsFulfillmentType, WsPromotionDetails } from 'bsp/promo/services/models/promoModels';
import { KeyValueCollection, Utility } from 'cp/util';

interface PromoViewData extends Observable {
	//Flag1: boolean;
	ShowParticipantSelection: boolean;
	//ShowPartSelectSubType: boolean;
	ShowPartSelectHierarchy: boolean;
	ShowPartSelectSearch: boolean;
	ShowPartSelectManual: boolean;
	ShowPartSelectUpload: boolean;
	ShowFulfillmentType: boolean;
}

interface PromoLookupData extends Observable {
	ParticipantTypes: WsParticipantType[];
	ParticipantSelectionTypes: WsParticipantSelectionType[];
	AwardTypes: WsAwardType[];
	FulfillmentTypes: WsFulfillmentType[];
}
interface PromotionDetails extends WsPromotionDetails, Observable {
	Lookups: PromoLookupData;
	View: PromoViewData;
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
	//Data: SectionData;
	//Data: PromotionDetails;
	Promo: PromotionDetails;
	//View: ViewData;
	//Lookups: LookupData;

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
	//Page: Template;
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




// [TODO] Move to separate file.
//type EngineCallback = (key: string, value: any) => void;
interface EngineWatcher {
	//Key: string;
	Context: any; // [TODO] Strongly type context, if possible
	Callback: EngineCallback;
}
// [TODO] Move to separate file.
type EngineCallback = (key: string, value: any) => void;

// [TODO] Move to separate file.
@Injectable()
class Engine {
	private _state: Observable;
	private _watchers: KeyValueCollection<EngineWatcher[]> = {};

	constructor() {
		let mod = this;
		mod._state = Utility.CreateObservable({});
	}

	public AddListener(context: any, key: string, callback: EngineCallback): void { // [TODO] Strongly type context, if possible
		let mod = this;
		let watchers = mod._watchers;

		let kw = watchers[key];
		if (!kw) {
			kw = watchers[key] = [];
		}
		//kw.push(callback);
		kw.push({ Context: context, Callback: callback });
	}

	// [TODO] Implement this. Need to know where it came from to know which to remove.
	//public RemoveListener()

	public Set(key: string, value: any): void {
		//debugger;
		let mod = this;
		let state = mod._state;
		let watchers = mod._watchers;

		state.set(key.replace(':', '_'), value); // Change delimiters to underscores so observable doesn't think there are paths

		let kw = watchers[key];
		if (kw && kw.length > 0) {
			for (let i = 0; i < kw.length; i++) {
				//kw[i](key, value);
				var w = kw[i];
				w.Callback.call(w.Context, key, value);
			}
		}
	}
}




@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;
	public Templates: SectionTemplates;
	@Inject() public Services: SectionServices;
	//@Inject() public Components: SectionComponents;
	@Inject() public Engine: Engine;

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

		let id = util.ToSafeInteger(util.GetParameterByName("id"));

		// [TODO] Handle missing or invalid params
		
		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetTemplates(["Page"]);
		//mod.BindButtons(["btnSearch"]); // Can't do this here because it hasn't been rendered yet

		// Create the model
		let model = state.model = mod.CreateObservable({
			Promo: {
				//PromotionId: null,
				PromotionId: id,
				ShortName: '', LongName: '', PromotionStatusId: null, PromotionStatusName: '',
				ParticipantTypeId: 0, ParticipantTypeName: '',
				ParticipantSelectionTypeId: 0, ParticipantSelectionTypeName: '',
				DataStart: null, DataEnd: null,
				AwardTypeId: 0, AwardTypeName: null,
				FulfillmentTypeId: 0, FulfillmentTypeName: null,
				Lookups: {
					ParticipantTypes: [],
					ParticipantSelectionTypes: [],
					AwardTypes: [],
					FulfillmentTypes: []
				},
				// [TODO] Consider auto wire-up. Add method to observable model and auto-bind to matching component method.
				ParticipantType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.ParticipantType_Change.call(mod, e); },
				ParticipantSelectionType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.ParticipantSelectionType_Change.call(mod, e); },
				AwardType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.AwardType_Change.call(mod, e); },
				FulfillmentType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.FulfillmentType_Change.call(mod, e); },
				View: {
					ShowParticipantSelection: false,
					//ShowPartSelectSubType: false,
					ShowPartSelectHierarchy: false,
					ShowPartSelectSearch: false,
					ShowPartSelectManual: false,
					ShowPartSelectUpload: false,
					ShowFulfillmentType: false
				}
			}//,
			//View: {
			//	//Flag1: false
			//}//,
			//Lookups: {
			//	PromotionStatuses: []
			//}
		},
			["ParticipantTypes", "ParticipantSelectionTypes", "AwardTypes" /*, "FulfillmentTypes"*/, "Promotion"]
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

		//mod.BindButtons(["btnSearch"]);

		// Add engine watchers
		// [TODO] Automate; clean up
		//mod.Engine.AddListener("Promo:ParticipantType", mod.Watch_Promo_ParticipantType);
		mod.Engine.AddListener(mod, "Promo:ParticipantType", mod.Watch_Promo_ParticipantType);
		mod.Engine.AddListener(mod, "Promo:ParticipantSelectionType", mod.Watch_Promo_ParticipantSelectionType);
		mod.Engine.AddListener(mod, "Promo:AwardType", mod.Watch_Promo_AwardType);

		// Load the page data
		mod.LoadData();
	}

	public LoadData() {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.Promo.GetParticipantTypes()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					data.Data.unshift({ ParticipantTypeId: 0, ParticipantTypeName: "(Please select)" });
					model.Promo.Lookups.set("ParticipantTypes", data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading participant types.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("ParticipantTypes");
			});

		services.Promo.GetAwardTypes()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					data.Data.unshift({ AwardTypeId: 0, AwardTypeName: "(Please select)" });
					model.Promo.Lookups.set("AwardTypes", data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading award types.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("AwardTypes");
			});

		services.Promo.GetParticipantSelectionTypes()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					data.Data.unshift({ ParticipantSelectionTypeId: 0, ParticipantSelectionTypeName: "(Please select)" });
					model.Promo.Lookups.set("ParticipantSelectionTypes", data.Data);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading participant selection types.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("ParticipantSelectionTypes");
			});

		services.Promo.GetPromotion(model.Promo.PromotionId)
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					//model.set("Data", data.Data); // This does not work with how the model was bound to the page

					// Setting each item works, but tedious
					//let p = data.Data;
					//model.Data.set("PromotionId", p.PromotionId);
					//model.Data.set("PromotionStatusId", p.PromotionStatusId);
					//model.Data.set("PromotionStatusName", p.PromotionStatusName);
					//model.Data.set("ShortName", p.ShortName);
					//model.Data.set("LongName", p.LongName);
					//model.Data.set("DataStart", p.DataStart);
					//model.Data.set("DataEnd", p.DataEnd);

					// Simple wrapper that iterates through the source object and looks for a matching property in the model
					// If found, it updates it through the proper "set" command
					mod.UpdateModelChildren(model.Promo, data.Data);

					// [TODO] Trigger "watch" notifications so the UI can adapt
					// [TODO] Automate
					mod.Engine.Set("Promo:ParticipantType", model.Promo.ParticipantTypeId);
					mod.Engine.Set("Promo:ParticipantSelectionType", model.Promo.ParticipantSelectionTypeId);
					mod.Engine.Set("Promo:AwardType", model.Promo.AwardTypeId); // [TODO] [BUG] This triggers a reset of FulfillmentTypeId

					// [TEMP] [TODO] Remove/replace
					model.Promo.set("FulfillmentTypeId", data.Data.FulfillmentTypeId);
					model.Promo.set("FulfillmentTypeName", data.Data.FulfillmentTypeName);
				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error loading promotion.", data), CalloutType.Error);
				}

				mod.SetServiceFlag("Promotion");
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
	private SetIfDifferent(model: Observable, key: string, value: any) {
		let mod = this;

		let old = model[key];
		if (old != value)
			model.set(key, value);
	}

	public ParticipantType_Change(e: kendo.ui.ComboBoxChangeEvent): void {
		// [TODO] Automate. Create standard wrappers, but allow for custom implementation.
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;

		model.set("ParticipantTypeName", e.sender.text()); // Needed/wanted?
		mod.Engine.Set("Promo:ParticipantType", model.ParticipantTypeId);
	}

	public ParticipantSelectionType_Change(e: kendo.ui.ComboBoxChangeEvent): void {
		// [TODO] Automate. Create standard wrappers, but allow for custom implementation.
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;

		model.set("ParticipantSelectionTypeName", e.sender.text()); // Needed/wanted?
		mod.Engine.Set("Promo:ParticipantSelectionType", model.ParticipantSelectionTypeId);
	}

	public Watch_Promo_ParticipantType(key: string, value: number): void {
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;
		model.View.set("ShowParticipantSelection", value > 0);
	}

	public Watch_Promo_ParticipantSelectionType(key: string, value: number): void {
		//debugger;
		let mod = this;
		let model = mod.State.model;
		let view = model.Promo.View;

		mod.SetIfDifferent(view, "ShowPartSelectSubType", value > 0);
		mod.SetIfDifferent(view, "ShowPartSelectHierarchy", value == 1);
		mod.SetIfDifferent(view, "ShowPartSelectSearch", value == 2);
		mod.SetIfDifferent(view, "ShowPartSelectManual", value == 3);
		mod.SetIfDifferent(view, "ShowPartSelectUpload", value == 4);
	}

	public AwardType_Change(e: kendo.ui.ComboBoxChangeEvent): void {
		// [TODO] Automate. Create standard wrappers, but allow for custom implementation.
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;

		model.set("AwardTypeName", e.sender.text()); // Needed/wanted?
		mod.Engine.Set("Promo:AwardType", model.AwardTypeId);
	}

	public Watch_Promo_AwardType(key: string, value: number): void {
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;

		// [TODO] Any way to have this reset only if the current value is not in the returned list?
		// [TODO] Any way to combine these? Should we even if we can?
		model.set("FulfillmentTypeId", 0);
		mod.Engine.Set("Promo:FulfillmentType", 0);

		if (model.AwardTypeId > 0) {
			// Get fulfillment types based on award
			// [TODO] Show spinner and hide when done
			// [TODO] Relocate to a common location?
			mod.Services.Promo.GetFulfillmentTypes(model.AwardTypeId)
				.then(data => {
					if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
						data.Data.unshift({ FulfillmentTypeId: 0, FulfillmentTypeName: "(Please select)" });
						model.Lookups.set("FulfillmentTypes", data.Data);
					} else {
						mod.ShowMessage(mod.GetServiceMessage("Error loading fulfillment types.", data), CalloutType.Error);
					}

					//mod.SetServiceFlag("FulfillmentTypes");

					model.View.set("ShowFulfillmentType", true);
				});
		} else {
			model.View.set("ShowFulfillmentType", false);
		}
	}

	public FulfillmentType_Change(e: kendo.ui.ComboBoxChangeEvent): void {
		// [TODO] Automate. Create standard wrappers, but allow for custom implementation.
		//debugger;
		let mod = this;
		let model = mod.State.model.Promo;

		model.set("FulfillmentTypeName", e.sender.text()); // Needed/wanted?
		mod.Engine.Set("Promo:FulfillmentType", model.FulfillmentTypeId);
	}

}
