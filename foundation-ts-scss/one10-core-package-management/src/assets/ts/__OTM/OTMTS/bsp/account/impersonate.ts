/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { MenuItem } from 'cp/securityShared';
import { ServiceConstants } from 'cp/serviceShared';
import { SecurityService } from 'bsp/services/securityService';
import { ApplicationContext } from 'cp/appShared';
import { ScopeType, Injectable } from 'cp/di';

interface SectionModel extends ComponentModel {
  UserId: string;
}
interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
  impersonateBtn: JQuery;
}

@Injectable()
export class PageComponent extends ComponentModule {
  public Controls: SectionControls;
  public State: SectionState;

  public Services = {
    Constants: ServiceConstants,
    Security: <SecurityService>null
  };

  constructor(ac: ApplicationContext, ss: SecurityService) {
    super("Page", ac);

    let mod = this;
    mod.Services.Security = ss;
  }

  Initialize(model?: SectionModel) {
    //debugger;

    let mod = this;
    let controls = mod.Controls;
    let state = mod.State;
    let util = mod.Util;

    // Call the parent
    super.Initialize(model);

    mod.WriteLog("Initialize.");

    // Bind buttons
    mod.BindButtons(["impersonateBtn"]);

    // Convert the model to an observable
    model = state.model = mod.CreateObservable({
      UserId: ""
    });

    // Bind the model
    // Normally we would use a control reference, but this is a one-time event on a control we don't need to reference
    mod.BindModel(null, model);
  }

  impersonateBtn_click(e) {
    //debugger;
    let mod = this;
    let state = mod.State;
    let model = state.model;
    let services = mod.Services;
    let config = mod.Config;

    mod.ClearMessage();

    services.Security.BeginImpersonation(model.UserId)
      .then((data) => {
        //debugger;
        if (data.ResponseCode == services.Constants.ResponseCode.Success) {
          location.href = mod.AppConfig.Core.SiteRoot;
        } else
          //mod.ShowMessage(data.ResponseMessage, CalloutType.Error);
          mod.ShowMessage(mod.GetServiceMessage("Error during impersonation", data), CalloutType.Error);
      });
  }
}
