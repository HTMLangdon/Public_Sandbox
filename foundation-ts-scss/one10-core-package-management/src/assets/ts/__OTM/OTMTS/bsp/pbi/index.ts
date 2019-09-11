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
import { PBIService, WsPBIResponse } from 'bsp/services/powerBIService';


interface SectionModel extends ComponentModel {
	ReportName: string;
	AllowedReportsTabData: kendo.data.DataSource;
	SelectedReportTabDisplayName: string;
}
interface ReportSelectionTabData {
	Text: string;
	RedirectUrl: string;
}
interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
	pageMain: JQuery;
	pbiContainer: JQuery;
	tabStrip: JQuery;
}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
	@Inject() PBIService: PBIService = null;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;

	constructor(ac: ApplicationContext, public Services: SectionServices) {
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

		// Get control and template references; bind buttons
		mod.GetControl("pageMain");
		mod.GetControl("pbiContainer");

		// Create the model
		let model = state.model = mod.CreateObservable({
			ReportName: "",
			TabDataSource: {},
			SelectedTab: "",
			FullScreen_click: (e: any) => { mod.FullScreen.call(mod, e); },
			PrintReport_click: (e: any) => { mod.PrintReport.call(mod, e); }
		});

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();

		let pageUrl = window.location.href;
		if (pageUrl.slice(-1) == '/')
			pageUrl = pageUrl.substr(pageUrl.length - 1);
		let urlReportName = pageUrl.substr(pageUrl.lastIndexOf('/') + 1);
		if (urlReportName && urlReportName.length > 1) {

			if (mod.isNumber(urlReportName.substr(0, 1)))
				model.set("ReportName", urlReportName);
		}
		mod.LoadData();

	}

	public async LoadData(): Promise<void> {
		let mod = this;
		let model = mod.State.model;
		let constants = mod.Services.Constants;
		let services = mod.Services;

		let data = await services.PBIService.GetReport(model.ReportName);

		if (data.ResponseCode == constants.ResponseCode.Success) {
			var tabStripData = data.Data.AllowedReports;

			if (data.Data.AllowedReports != null && data.Data.AllowedReports.length > 0) {
				let tabData: ReportSelectionTabData[] = [];
				data.Data.AllowedReports.forEach(
					(element) => {
						tabData.push({ Text: element.ReportDisplayName, RedirectUrl: element.NavUrl });
					});

				let ds: kendo.data.DataSource = new kendo.data.DataSource();
				ds.data(tabData);
				model.set("AllowedReportsTabData", ds);
				model.set("SelectedReportTabDisplayName", data.Data.SelectedReportDisplayName);
			}
			if (data.Data.EmbedToken)
				mod.BindReport(data.Data);
		}
		else {
			mod.ShowMessage(mod.GetServiceMessage("Error loading report.", data), CalloutType.Error);
		}

	}

	public BindReport(configData: WsPBIResponse): void {
		let mod = this;
		let model = mod.State.model;
		let powerbiClient = window["powerbi"];
		let pbimodels = window['powerbi-client'].models;
		let config = {
			type: 'report',
			tokenType: pbimodels.TokenType.Embed,
			accessToken: configData.EmbedToken,
			embedUrl: configData.EmbedUrl,
			id: configData.Id,
			permissions: pbimodels.Permissions.All,
			settings: {
				filterPaneEnabled: true,
				navContentPaneEnabled: true,
				background: pbimodels.BackgroundType.Transparent
			}
		};

		// Get a reference to the embedded report HTML element
		let reportContainer = mod.Controls.pbiContainer[0];

		// Embed the report and display it within the div container.
		var report = powerbiClient.embed(reportContainer, config);
	}


	public FullScreen(e: any): void {
		let mod = this;
		// Get a reference to the embedded report HTML element
		let reportContainer = mod.Controls.pbiContainer[0];
		let powerbiClient = window["powerbi"];
		var report = powerbiClient.get(reportContainer);
		report.fullscreen();
	}

	public PrintReport(e: any): void {
		let mod = this;
		// Get a reference to the embedded report HTML element
		let reportContainer = mod.Controls.pbiContainer[0];
		let powerbiClient = window["powerbi"];
		var report = powerbiClient.get(reportContainer);
		report.print();
	}
	private isNumber(value: string | number): boolean {
		return ((value != null) && !isNaN(Number(value.toString())));
	}

}
