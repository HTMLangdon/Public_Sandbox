/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
import { ServiceConstants, ServiceCollection } from 'cp/serviceShared';
//import { OpsService } from 'svc/mock/opsService';
//import { OpsService } from 'svc/opsService';
import { OpsService } from 'bsp/ops/services/opsService'; // [TODO] Split diag so part is in ops and part in pub. 
//import { WsDiagAction } from 'svc/models/opsModels';
import { WsDiagAction } from 'bsp/ops/services/models/opsModels';

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() Ops: OpsService = null;
}

interface DiagAction extends WsDiagAction, Observable { }
interface SectionModel extends ComponentModel {
	Action: string;
	IsAuthenticated: boolean;
	Message: string;
	Actions: DiagAction[]
	IsProcessing: boolean;
}
interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
	results: JQuery;
}
interface SectionTemplates extends ComponentTemplates {
	resultsTemplate: Template;
}
//@Injectable() @DiscardBinding()
//class SectionComponents extends ComponentCollection { }
@Injectable()
export class PageComponent extends ComponentModule {
	//public Templates: SectionTemplates;
	public Controls: SectionControls;
	public State: SectionState;
	public Templates: SectionTemplates;
	//@Inject() public Components: SectionComponents;
	@Inject() public Services: SectionServices;

	constructor(ac: ApplicationContext) {
		super("Diag", ac);
	}

	Initialize(m?: any) {
		//debugger;
		let mod = this;
		let controls = mod.Controls;
		let services = mod.Services;
		let constants = services.Constants;
		let appConfig = mod.AppConfig;
		let util = mod.Util;

		// Call the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		services.Ops.ServiceDefaults.Timeout = 60000;  // Extend the timeout; milliseconds

		// Get controls & templates, bind buttons
		mod.GetControl("results");

		// Manual conversions and defaults
		if (util.IsNull(m.Action)) m.Action = "";
		if (!util.IsNullOrBlank(m.Timestamp)) m.Timestamp = Date.parse(m.Timestamp);
		m.IsProcessing = false;

		// Get the template
		// Normally this would not be conditional
		if (util.HasData(m.Actions))
			mod.GetTemplate("resultsTemplate");

		// Create the initial model
		m.action_change = (e) => {
			if (model.Action) {
				// Clear results and messages when starting a new action
				mod.ClearMessage();
				mod.Controls.results.html("");

				// Find the action
				// [TODO] Not sure why ValuePrimitive switch is not working
				let action: DiagAction = null;
				for (let i = 0; i < model.Actions.length; i++) {
					if (model.Actions[i].Value == model.Action) {
						action = model.Actions[i];
						break;
					}
				}

				if (action) {
					// Lock the page while processing
					model.set("IsProcessing", true);

					//mod.Services.Ops[action.EndPoint]()
					services.Ops.RunDiag(action.EndPoint)
						.then(data => {
							//debugger;
							if (data.ResponseCode == constants.ResponseCode.Success) {
								mod.ShowMessage(constants.ResponseMessage.Success, CalloutType.Success);

								// Show results, if present
								if (util.HasData(data.Data.Info)) {
									// Fill the results list
									mod.Controls.results.html(
										mod.Templates.resultsTemplate(data.Data.Info)
									);
								}

								model.set("Message", util.IsNullOrBlank(data.Data.AggregateResult) ? "" : ":: " + data.Data.AggregateResult + " ::");
							} else {
								mod.ShowMessage(mod.GetServiceMessage("Error executing action.", data), CalloutType.Error);
							}

							model.set("IsProcessing", false);
						});
				} else {
					mod.ShowMessage("Missing or invalid action specified.", CalloutType.Error);
				}
			}
		};
		let model = mod.State.model = <SectionModel>mod.CreateObservable(m);

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();
	}
}
