/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { MenuItem } from 'cp/securityShared';
import { SecurityService } from 'bsp/services/mock/securityService';
//import { SecurityService } from 'bsp/services/securityService';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
import { UserChangedEvent } from 'util';
import { ServiceConstants, ServiceCollection, WsResponseData } from 'cp/serviceShared';
import { Config } from '../lib/cp/config_plugin';
import { BotWebChatService } from 'bsp/services/botWebChatService';

interface SectionModel extends ComponentModel {
	Messages: any[]; // [TODO] Strongly type
	MainNavData: MenuItem[];
	RightNavData: MenuItem[];
	MobileNavData: MenuItem[];
	User: IUserInfo;
}

//temporary model to hold hardcoded job titles, to be removed later when Profile is flushed out
interface JobTitleModel {
	UserName: String
	JobTitle: String
}

interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
	menuBarLeft: JQuery;
	menuBarRight: JQuery;
	menuBarMobile: JQuery;
	btnLogOut: JQuery;
	imp: JQuery;
	navBar: JQuery;
	navBarChildren: JQuery;
	openChatbutton: JQuery;
	webChat: JQuery;
	webChatWrapper: JQuery;
}

interface SectionTemplates extends ComponentTemplates {
	menuBarLeftTemplate: Template;
	menuBarRightTemplate: Template;
	menuBarMobileTemplate: Template;
}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() BotWebChatClient: BotWebChatService = null;
}

@Injectable()
export class TemplateComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;
	public Templates: SectionTemplates;

	constructor(ac: ApplicationContext, public Services: SectionServices) {
		// Call the parent
		super("Template", ac);
	}

	UserChanged(e: UserChangedEvent): void {
		//debugger;
		let mod = this;
		let model = mod.State.model;

		model.set("User", e.data);

		// See if we can locate the page component and then check its MenuDisplay setting
		// Need to do this after Initialize

		let displayMenu = MenuDisplayType.Visible;
		if (window["PageComponent"] && window["PageComponent"].Config.Ui.MenuDisplay)
			displayMenu = window["PageComponent"].Config.Ui.MenuDisplay;

		// Show/hide the menu bar based on whether or not the user is authenticated plus the force-hide (HideMenu)
		// It should be hidden by default
		if (displayMenu == MenuDisplayType.Hidden)
			mod.Controls.navBar.hide();
		else {
			mod.Controls.navBar.show();
			if (!e.data.IsValid || displayMenu == MenuDisplayType.Empty) {
				mod.Controls.navBarChildren.hide();
			} else {
				mod.Controls.navBarChildren.show();
			}
		}
	}

	Initialize(model?: SectionModel) {
		//debugger;		
		let mod = this;
		let controls = mod.Controls;
		let state = mod.State;
		let util = mod.Util;

		// Call the parent
		super.Initialize(model);

		//mod.WriteLog("Initialize.");


		let JobTitleCollection: JobTitleModel[];
		JobTitleCollection = [
			// [TODO] Move to mock service
			{ JobTitle: "VP, Technology", UserName: "gina.drewek@One10Marketing.com" },
			{ JobTitle: "Sr. Project Manager", UserName: "brian.carl@one10marketing.com" },
			{ JobTitle: "Business Analyst", UserName: "alison.bedker@one10marketing.com" },
			{ JobTitle: "Manager, Solutions Architecture", UserName: "eric.dobrzelewski@One10Marketing.com" },
			{ JobTitle: "Sr. Solutions Architect", UserName: "giri.sayeenathan@one10marketing.com" },
			{ JobTitle: "UX Architect", UserName: "tim.armato@One10Marketing.com" },
			{ JobTitle: "UX Developer", UserName: "brian.berris@one10marketing.com" },
			{ JobTitle: "Product Owner", UserName: "richelle.taylor@one10marketing.com" },
			{ JobTitle: "Delivery Manager", UserName: "tina.Ferguson@One10Marketing.com" }
		];

		// Convert the model to an observable
		model = state.model = mod.CreateObservable({
			//Messages: [],
			Messages: [
				//{ type: "mail-row--menu", id: 1234, date: "today", subject: "Subject line of first unread message", text: "One or two-line preview of the message.Will be truncated after the first n number of char...", url: "#" },
				//{ type: "mail-row--menu", id: 1235, date: "today", subject: "Subject line of most recent unread message", text: "One or two-line preview of the message.Will be truncated after the first n number of char...", url: "#" },
				//{ type: "mail-row--menu", id: 1236, date: "today", subject: "Subject line of most recent unread message", text: "One or two-line preview of the message.Will be truncated after the first n number of char...", url: "#" }
			],
			MainNavData: [],
			RightNavData: [],
			MobileNavData: [],
			User: mod.AppContext.User,
			UserFullName: function () {
				return this.get("User.FirstName") + " " + this.get("User.LastName");
			},
			UserJobTitle: function () { // [TODO] Add this to the object/data
				// [TODO] Ignore case (if not replaced)
				let selectedJobtitle = JobTitleCollection.filter(b => b.UserName == mod.AppContext.User.Username)
				if (selectedJobtitle == null || selectedJobtitle.length == 0)
					return "One10 PerformX Team Member"
				else
					return selectedJobtitle[0].JobTitle;
			},
			LogoutClick: function (e) {
				mod.ProcessLogout.call(mod, e, this);
			},
			BotHelpClick: function (e) {
				mod.ProcessBotHelpClick.call(mod, e, this);
			}

		});
		//console.log(mod.AppContext.User);



		// Get control references and build templates
		mod.GetControls(["menuBarLeft", "menuBarRight", "navBar", "menuBarMobile", "openChatbutton", "webChat", "webChatWrapper"]);
		//console.log(mod.Controls);
		mod.Controls.navBarChildren = mod.Controls.navBar.find(".hide-anonymous");
		mod.GetTemplates(["menuBarLeftTemplate", "menuBarRightTemplate", "menuBarMobileTemplate"]);
		mod.AppContext.UserChanged.bind('changed', (e) => { mod.UserChanged.call(mod, e); });

		// Bind the change event, after observable created and form bound (if needed)
		// Watch for menu data changes
		// Hopefully this will eventually go away if/when menu supports true data sources
		state.model.bind("change", function (e) {
			//debugger;
			if (e.field == "MainNavData") {
				let md = model.MainNavData;
				let data = { items: [] };
				var menuItemLimit = md.length;
				for (let i = 0; i < menuItemLimit; i++) {
					let item = md[i];
					if (item && item['megamenuID']) item['megamenuID'] = item['megamenuID'].replaceAll('/', '_');
					data.items.push(item);
				}

				controls.menuBarLeft.html(mod.Templates.menuBarLeftTemplate({ Template: { context: mod, parentControlPath: "template", controlPath: "template_menuLeft" }, Meta: null, Data: data }));
				//if (window["usefdncallback"])
				{
					mod.Controls.menuBarLeft.foundation();
				}

				// Re-apply foundation actions
				//mod.Controls.menuBarLeft.foundation();
				//mod.Controls.navBar.foundation();
			} else if (e.field == "RightNavData") {
				let md = model.RightNavData;
				let data = { items: [] };
				var menuItemLimit = md.length;
				for (let i = 0; i < menuItemLimit; i++) {
					let item = md[i];
					if (item && item['megamenuID']) item['megamenuID'] = item['megamenuID'].replaceAll('/', '_');
					data.items.push(item);
				}

				controls.menuBarRight.html(mod.Templates.menuBarRightTemplate({ Template: { context: mod, parentControlPath: "template", controlPath: "template_menuRight" }, Meta: null, Data: data }));
				//if (window["usefdncallback"])
				{
					mod.Controls.menuBarRight.foundation();
				}


				// Fetch the data. Can consider pre-fetching (or parallel fetching) but need to wait for the template to bind
				// [TODO] Something like this:
				//mod.Services.Messaging.GetMessages(mod.AppContext.User.UserId).then(...)
				new Promise<WsResponseData<any[]>>((resolve, reject) => {
					resolve(WsResponseData.SuccessData<any[]>([
						{ type: "mail-row--menu", id: 1234, date: "today", subject: "Jump into the Spring Sales Event!", text: "Earn reward points for every custom wheel sold this quarter. The more you sell, the more you earn.", url: "#" },
						{ type: "mail-row--menu", id: 1235, date: "yesterday", subject: "We are our values.", text: "Have you caught one of your colleagues living out a core value?  If so, be sure to recognize them.", url: "#" },
						{ type: "mail-row--menu", id: 1236, date: "Last week", subject: "There is still time to Pump It Up.", text: "Claim your sales of our top-rated products - and claim your share of fantastic rewards.", url: "#" }
					]));
				})
					.then(md => {
						//debugger;
						if (md.ResponseCode == ServiceConstants.ResponseCode.Success) { // [TODO] Replace ServiceConstants with mod.Services.Constants once a service is attached to the main component
							model.set("Messages", md.Data);
						} else {
							mod.ShowMessage(mod.GetServiceMessage("Error getting user messages.", md), CalloutType.Error);
						}
					});



				// Re-apply foundation actions
				//mod.Controls.menuBarRight.foundation();
				// Bind it with model after Right nav has rendered all templates				
			} else if (e.field == "Messages") {
				//debugger;
				// [TODO] Automate. Replace JQuery
				let template = CpWeb.App.GetTemplate("mail-menu-list");
				let c = template.Template({ Template: { context: mod, parentControlPath: "template", controlPath: "template_messages" }, Meta: null, Data: model.Messages });
				$("#Messages").html(c);
			} else if (e.field == "MobileNavData") {
				let md = model.MobileNavData;
				let data = { items: [] };
				var menuItemLimit = md.length;

				// Pull name and title from the main user model
				let ud = md[0].items[0];
				ud["name"] = model.User.FirstName + ' ' + model.User.LastName;
				ud["title"] = model["UserJobTitle"]();

				for (let i = 0; i < menuItemLimit; i++) {
					let item = md[i];
					if (item && item['megamenuID']) item['megamenuID'] = item['megamenuID'].replaceAll('/', '_');
					data.items.push(item);
				}
				if (mod.AppConfig.Core.BotConfig.EnableBot == 1 && mod.Controls.webChatWrapper.length >0) {
					let userInitials = model.User.Username.substring(0, 2);
					mod.Controls.webChatWrapper.show();
					if (model.User.LastName != null && model.User.LastName.length > 1 && model.User.FirstName != null && model.User.FirstName.length > 1)
						userInitials = model.User.FirstName.charAt(0) + '' + model.User.LastName.charAt(0);
					mod.Services.BotWebChatClient.RenderWebChat(mod.Controls.webChat[0], model.User.UserId.toString(), model.User.Username, userInitials).catch(err => console.error(err));
				}
				else
					mod.Controls.webChatWrapper.hide();

				controls.menuBarMobile.html(mod.Templates.menuBarMobileTemplate({ Template: { context: mod, parentControlPath: "template", controlPath: "template_menuMobile" }, Meta: null, Data: data }));
				//if (window["usefdncallback"])
				{
					mod.Controls.menuBarMobile.foundation();
				}
			}


			// [TODO] This should NOT be done on each model change!!!
			util.BindModel(mod.Controls.navBar, model);
			util.BindModel(mod.Controls.webChatWrapper, model);
		});

		// Bind the model
		// Normally we would use a control reference, but this is a one-time event on a control we don't need to reference
		//util.BindModel(mod.Controls.navBar, model);

		// Load the menu data
		// [TODO] Possibly convert to event subscriber/obervable listener so we can detect when a user change (so we can re-fetch the menu)
		mod.Security.GetMainNav()
			.then(data => {
				model.set("MainNavData", data);
			});

		mod.Security.GetMobileNav()
			.then(data => {
				model.set("MobileNavData", data);
				$(".navigation--mobile").foundation();
			});

		mod.Security.GetRightNav()
			.then(data => {
				model.set("RightNavData", data);
			});

		//Chatbot code

	}

	ProcessLogout(e: Event) {
		let mod = this;
		let config = mod.Config;
		let constants = mod.Security.Constants;

		let user = mod.AppContext.User
		if (user.IsImp) {
			mod.Security.EndImpersonation()
				.then((data) => {
					if (data.ResponseCode == constants.ResponseCode.Success) {
						document.location.href = mod.AppConfig.Core.SiteRoot;
					} else {
						mod.ShowMessage(mod.GetServiceMessage("Error logging out.", data), CalloutType.Error); // [TODO] Use constant or message code.
					}
				});
		} else {
			mod.Security.Logoff()
				.then((data) => {
					if (data.ResponseCode == constants.ResponseCode.Success) {
						// [TODO] Revisit using PostLogoutPath
						// It might be the same as LoginPath, but might also be different
						document.location.href = mod.AppConfig.Core.LoginPath;
					} else {
						mod.ShowMessage(mod.GetServiceMessage("Error logging out.", data), CalloutType.Error); // [TODO] Use constant or message code.
					}
					return data;
				});
		}
	}

	ProcessBotHelpClick(e: Event) {
		let mod = this;
		mod.Controls.openChatbutton.text(mod.Controls.openChatbutton.text() == 'Help?' ? 'Close' : 'Help?');
		mod.Controls.webChat.toggle('scale');
	}
}




