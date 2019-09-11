/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { MenuItem } from 'cp/securityShared';
import { ServiceConstants } from 'cp/serviceShared';
//import { SecurityService } from 'bsp/services/mock/securityService';
import { SecurityService } from 'bsp/services/securityService';
import { ApplicationContext } from 'cp/appShared';
import { ScopeType, Injectable } from 'cp/di';
import { CookieMgr } from 'cp/cookies'
import { LoginMeta } from 'bsp/services/models/accountModels';

interface SectionModel extends ComponentModel {
	//Meta: MetaItem[];
	//Data: LoginData;
	Meta: any[];
	Data: any;
	UserId: string;
	Password: string;
	loginType: string;
}
interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
	pageMain: JQuery;
	btnLogin: JQuery;
	divLoading: JQuery;
	remember: JQuery;
	unmask_eye: JQuery;
	msgBanner: JQuery;
	icnUmask: JQuery;
	txtUsername: JQuery;
	txtPassword: JQuery;
}

@Injectable()
export class LoginComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;

	// @Inject() public Cookies: CookieMgr;

	public Services = {
		Constants: ServiceConstants,
		Security: <SecurityService>null
	};

	constructor(ac: ApplicationContext, ss: SecurityService) {
		super("Login", ac);

		let mod = this;
		mod.Services.Security = ss;

		// Hide the menu
		mod.Config.Ui.MenuDisplay = MenuDisplayType.Hidden;

		mod.Config.MessageContainer = "#msgBanner";
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

		// Clean paths in the metadata
		mod.CleanPaths(LoginMeta);

		// Get controls
		mod.GetControl("pageMain");

		// Convert the model to an observable		
		model = state.model = mod.CreateObservable({
			Meta: LoginMeta,
			Data: {},
			// [TODO] The rest of the properties should be moved inside of Data
			UserId: "",
			Password: "",
			loginType: "Email Address"
		});

		// Watch for IsLoaded to change
		// [TODO] Replace with common page load indicator
		model.bind('change', (e) => {
			//debugger;
			if (e.field && e.field == "IsLoaded" && model.IsLoaded) {
				//debugger;
				mod.HideProgress();
			}
		});

		// Bind the model
		// Normally we would use a control reference, but this is a one-time event on a control we don't need to reference
		mod.BindModel(null, model);

		if (mod.AppContext.Params.Get("register").toLowerCase() == "y")
			mod.ShowMessage("You have successfully signed up. Please log in to access the site.", CalloutType.Success); // [TODO] Use CMS.

		mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: 'pageMain', ChildKey: '', Meta: model.Meta, Data: model.Data }, mod.Controls.pageMain);

		$(document).foundation();

		let credCookie = CookieMgr.getCookie("credCookie");
		if (credCookie && credCookie.length > 0) {
			mod.Controls.remember.prop("checked", true);
			model.set("UserId", credCookie);
		}

		// Get controls after the template has been applied
		mod.BindButtons(["btnLogin"]);
		mod.GetControls(["divLoading", "remember", "msgBanner", "txtUsername", "txtPassword"]);
		mod.BindControls(["icnUmask"], ["click"]);

		// Special: Respond to enter key for both textboxes
		mod.Controls.txtUsername.keyup(keyEvent => {
			if (keyEvent.keyCode === 13) { keyEvent.preventDefault(); mod.btnLogin_click(); }
		});
		mod.Controls.txtPassword.keyup(keyEvent => {
			if (keyEvent.keyCode === 13) { keyEvent.preventDefault(); mod.btnLogin_click(); }
		});

		// If there are no service watchers then IsLoaded is true right away
		// [TODO] Make more generic and self-handling
		if (model.IsLoaded)
			mod.HideProgress();
	}

	icnUmask_click(e) {
		let mod = this;
		let state = mod.State;
		let model = state.model;

		let umask = mod.Controls.icnUmask;

		umask.toggleClass("input-password--label-under__eye-off input-password--label-under__eye-on");

		let txtpw = mod.Controls.txtPassword;

		if (txtpw.attr("type") == "password") {
			txtpw.attr("type", "text");
		} else {
			txtpw.attr("type", "password");
		}

	}

	btnLogin_click() {
		let mod = this;
		let state = mod.State;
		let model = state.model;
		let services = mod.Services;
		let config = mod.Config;
		let util = mod.Util;

		mod.ClearMessage();

		mod.Controls.divLoading.show();
		services.Security.Login(model.UserId, model.Password)
			.then((data) => {
				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					// See if URL contains original path. If so, redirect to that instead of SiteRoot
					// Do not allow redirects that contain ":" since those could be hack attempts to redirect offsite
					let source = mod.AppContext.Params.Values["source"];
					if (util.IsNullOrBlank(source) || source.indexOf(":") >= 0)
						location.href = mod.AppConfig.Core.SiteRoot;
					else {
						let p = mod.AppContext.Params.Values["params"];
						if (util.IsNullOrBlank(p))
							location.href = source;
						else
							location.href = source + "?" + p;
					}

					// Save User ID if slider is on
					if (mod.Controls.remember.prop("checked") && model.UserId.length > 0) {
						CookieMgr.setCookie("credCookie", model.UserId);
					}
					else {
						CookieMgr.deleteCookie("credCookie");
					}

				} else {
					//mod.Controls.divLoading.hide();
					// @@@ Clean up ShowMessage
					//public ShowMessage(message: string, messageType: CalloutType, control ?: JQuery): void {

					//let ctrl = $("#-rserror");

					//mod.ShowMessage(mod.GetServiceMessage(config.Messages.FetchError, data), CalloutType.Error );					
					mod.ShowMessage(data.ResponseMessage, CalloutType.Error);
					//$("#-error").text(data.ResponseMessage);
					//$("#-error").removeClass("form-error");
					///////// NEW COMMON CONTROL ALERTS ///////
					//if(!$("#pageMessage").is(':visible')){
					//	$("#pageMessage").addClass('alert');
					//	$("#pageMessage").show();
					//}

				}
				return data;
			});
	}
}
