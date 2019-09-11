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
//import { PromoService, WsPromoListResult } from 'svc/promoService';
//import { PromoService } from 'svc/mock/promoService';
import { PromoService } from 'bsp/promo/services/mock/promoService';
//import { WsPromotionStatus, WsPromotionDetails } from 'svc/models/promoModels';
import { WsPromotionStatus, WsPromotionDetails } from 'bsp/promo/services/models/promoModels';

interface PromotionDetails extends WsPromotionDetails, Observable { }

// Load components
//import { YyyComponent, YyyModel } from './components/Yyy';

//interface SectionData extends Observable {
//	//Value1: string;
//}

interface ViewData extends Observable {
	//Flag1: boolean;
}

//interface LookupData extends Observable {
//	PromotionStatuses: WsPromotionStatus[];
//}

// Optional: Service-bound models (converted to observables)
//interface Xxx extends WsXxxResult, Observable { }

interface SectionModel extends ComponentModel {
	//Data: SectionData;
	Data: PromotionDetails;
	View: ViewData;
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

		let id = util.ToSafeInteger(util.GetParameterByName("id"));
		
		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetTemplates(["Page"]);
		//mod.BindButtons(["btnSearch"]); // Can't do this here because it hasn't been rendered yet

		// Create the model
		let model = state.model = mod.CreateObservable({
			Data: {
				PromotionId: id, ShortName: '', LongName: '', PromotionStatusId: null, PromotionStatusName: '',
				ParticipantTypeId: 0, ParticipantTypeName: '',
				ParticipantSelectionTypeId: 0, ParticipantSelectionTypeName: '',
				DataStart: null, DataEnd: null
			},
			View: {
				//Flag1: false
			}//,
			//Lookups: {
			//	PromotionStatuses: []
			//}
		},
			["Promotion"]
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

		mod.BindButtons(["btnEditPromo"]);

		// Load the page data
		mod.LoadData();
	}

	public LoadData() {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		services.Promo.GetPromotion(model.Data.PromotionId)
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
					mod.UpdateModelChildren(model.Data, data.Data);

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

	btnEditPromo_click(e): void {
		//debugger;
		let mod = this;

		// Get an absolute path to the root
		// [TODO] Make SiteRoot consistent or have a path helper
		let sr = mod.AppConfig.Core.SiteRoot;
		if (sr.charAt(sr.length - 1) != '/')
			sr += '/';

		location.href = sr + "promo/edit?id=" + mod.State.model.Data.PromotionId.toString();
	}

}
