/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { CmsService_Mock as CmsService, IResource, IBool, IStatusType, IResourceType, IPrivilegeType, IBrand } from 'svc/cmsFileService';
import { ServiceConstants } from 'cp/serviceShared';

interface IResourceAction {
	resource: IResource;
	type: string;
	subType?: string;
}

interface ISearchModel extends Observable {
	ResourceTypeId: number;
	ResourceKey: string;
	ResourceName: string;
}
interface IEditModel extends Observable {
	ResourceTypeId: string;
	ResourceTypeName: string;
	ResourceId: number;
	ResourceKey: string;
	BrandCode: string;
	ResourceName: string;
	ResourcePath: string;
	ResourceTarget: string;
	IsVisible: boolean;
	Status: string;
	CustomLogic: string;
	Content: string;
	Privileges: number[];
}
interface IViewModel extends Observable {
	ShowResults: boolean;
	ShowSearchPanel: boolean;
	ShowUpdatePanel: boolean;
	ShowBrand: boolean;
	ShowPathAndTarget: boolean;
	ShowVisible: boolean;
	ShowStatus: boolean;
	ShowCustomLogic: boolean;
	ShowContent: boolean;
	ShowPrivs: boolean;
	PrivsEnabled: boolean;
}
interface ILookups extends Observable {
	Booleans: IBool[];
	ResourceTypes: IResourceType[];
	BrandCodes: IBrand[];
	StatusTypes: IStatusType[];
	PrivilegeTypes: IPrivilegeType[];
}
interface IResultItem {
	ResourceId: number;
	ResourceTypeId: string;
	ResourceTypeName: string;
	ResourceKey: string;
	Children?: IResultItem[];
}
interface SectionModel extends ComponentModel {
	Results: IResultItem[];
	Model: IEditModel;
	Search: ISearchModel;
	View: IViewModel;
}
interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
	btnSearch: JQuery;
	btnSave: JQuery;
	btnCancel: JQuery;
	treeResults: ComplexControl<kendo.ui.TreeList>;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;

	public Services = {
		Constants: ServiceConstants,
		Cms: <CmsService>null
	};

	constructor(ac: ApplicationContext, cs: CmsService) {
		// Call the parent
		super("Page", ac);

		let mod = this;
		mod.Services.Cms = cs;
	}

	Initialize() {
		let mod = this;
		let state = mod.State;
		let util = mod.Util;
		let controls = mod.Controls;

		let services = mod.Services;

		// Call the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		mod.BindButtons(["btnSearch", "btnSave", "btnCancel"]);
		mod.GetComplexControl("treeResults", "kendoTreeList");

		let t = controls.treeResults.item.kendoTreeList({
			dataSource: services.Cms.BuildResourceDataSource({ // [TODO] Have Build* take in "DataSourceTransportWithFunctionOperations" but return "DataSourceTransport"?
				transport: <kendo.data.DataSourceTransport> {
					read: function (options: DataSourceReadHandlerOptions): void {
						//debugger;

						services.Cms.GetResources()
							.then((data: WsResponseData<IResource[]>) => {
								//debugger;

								// Add an empty array if one does not exist
								// Not sure why returning an empty list makes Events "undefined"
								if (!data.Data) data.Data = [];

								// [TODO] Check status/response code

								// Save the data and show the results pane, if needed
								options.success(data.Data);

								if (!model.View.ShowResults) {
									// Clear the loading message
									mod.ClearMessage();

									// Show the search results
									model.View.set("ShowResults", true);
								}
							});
					}
				}
			}),
			resizable: true,
			selectable: "row",
			editable: true,
			filterable: true,
			columns: [
				{ field: "ResourceKey", expandable: true, title: "Key" },
				{ field: "ResourceTypeName", title: "Type", width: 150 },
				{ field: "BrandCode", title: "Brand", width: 100 },
				{ field: "ResourceName", title: "Name" },
				{ template: $("#GridActionTemplate").html() } // [TODO] Use wrapper/template storage; [TODO] Possibly remove column and use context menu
			]
		});

		// Bind all buttons within the control
		t.on("click", "button", undefined, (e) => {
			//debugger;

			// Get the button, tree, and data item for the row
			let bn = e.currentTarget.attributes["name"].value;
			let tree = $(e.delegateTarget).data("kendoTreeList");
			let item: any = tree.dataItem(e.currentTarget);

			if (bn == "btnDelete") {
				mod.btnDelete_click.call(mod, { resource: item, type: "delete" });
			} else if (bn == "btnEdit") {
				mod.btnEdit_click.call(mod, { resource: item, type: "edit" });
			} else {
				mod.ShowMessage("UNKNOWN ACTION SPECIFIED.", CalloutType.Error);
			}
		});


		// Convert the model to an observable
		let model: SectionModel = state.model = <SectionModel>mod.CreateObservable({
			Results: [],
			Model: {
				ResourceTypeId: "",
				ResourceTypeName: "",
				ResourceId: 0,
				ResourceKey: "",
				BrandCode: "",
				ResourceName: "",
				ResourcePath: "",
				ResourceTarget: "",
				IsVisible: false,
				Status: "A",
				CustomLogic: "",
				Content: "",
				Privileges: []
			},
			View: {
				ShowResults: false,
				ShowUpdatePanel: false,
				ShowBrand: true,
				ShowPathAndTarget: true,
				ShowVisible: true,
				ShowStatus: true,
				ShowCustomLogic: true,
				ShowContent: true,
				ShowPrivs: true,
				PrivsEnabled: true
			},
			Search: {
				ResourceTypeId: "",
				ResourceKey: "",
				ResourceName: ""
			},
			Lookups: {
				Booleans: [ // [TODO] Move to service call
					{ BoolValue: 'N', BoolName: "No" },
					{ BoolValue: 'Y', BoolName: "Yes" }
				],
				ResourceTypes: [ // [TODO] Move to service call
					//{ ResourceTypeId: "", ResourceTypeName: "" },
					{ ResourceTypeId: "C", ResourceTypeName: "Content" },
					{ ResourceTypeId: "G", ResourceTypeName: "Group" },
					{ ResourceTypeId: "M", ResourceTypeName: "Message" },
					{ ResourceTypeId: "P", ResourceTypeName: "Page" }
				],
				BrandCodes: [ // [TODO] Move to service call
					//{ BrandCode: "", BrandName: "(None)" },
					{ BrandCode: "vw", BrandName: "Volkswagen" },
					{ BrandCode: "au", BrandName: "Audi" }
				],
				StatusTypes: [ // [TODO] Move to service call
					{ Status: "A", StatusName: "Active" },
					{ Status: "I", StatusName: "Inactive" }
				],
				PrivilegeTypes: [ // [TODO] Move to service call
					{ PrivilegeId: 1, PrivilegeName: "Priv A" },
					{ PrivilegeId: 2, PrivilegeName: "Priv B" },
					{ PrivilegeId: 3, PrivilegeName: "Priv C" }
				]
			}
		});

		mod.BindModel(null, model);

		//services.Cms.GetPrivilegeTypes() // [TODO] Enable
		//	.then((data) => {
		//		//debugger;
		//		if (data.ResponseCode == services.Constants.ResponseCode.Success) {
		//			model.set("privilegeTypes", data.Data);

		//		} else {
		//			alert("SERVER ERROR"); // [TODO] Use common error mechanism. Check response info.
		//		}
		//	});

		//services.Cms.GetCategories() // [TODO] Replace with GetResourceTypes, GetStatus (name?), GetBooleans, GetBrands
		//	.then((data) => {
		//		//debugger;

		//		if (data.ResponseCode == services.Constants.ResponseCode.Success) {
		//			model.set("fileCategoryALL", data.Data);
		//			model.set("fileCategory", data.Data);

		//			//remove first element from array (ALL)
		//			mod.State.model.fileCategory.splice(0, 1);

		//		} else {
		//			alert("SERVER ERROR"); // [TODO] Use common error mechanism. Check response info.
		//		}
		//	});

		// Clear the loading message
		//mod.ClearMessage();


		$("#GridMenuTemplate").kendoContextMenu({
			dataSource: [
				//{ text: "Edit", attr: { "data-action": "edit" } },
				{ text: "<span class='fi-pencil'> Edit</span>", encoded: false, attr: { "data-action": "edit" } },
				{ text: "<span class='fi-x'> Delete</span>", encoded: false, attr: { "data-action": "delete" } },
				{
					text: "Add", items: [
						{ text: "Group", attr: { "data-action": "addGroup" } },
						{ text: "Page", attr: { "data-action": "addPage" } },
						{ text: "Link", attr: { "data-action": "addLink" } },
						{ text: "Content", attr: { "data-action": "addContent" } },
						{ text: "Message", attr: { "data-action": "addMessage" } }
					]
				}
			],
			orientation: "vertical",
			target: "#treeResults",
			filter: "tbody tr",
			select: (e) => { mod.menu_click.call(mod, e); }

			// [TODO] When the menu opens, populate it (if we can). Be careful of child items firing "open" event too.
			//open: (e) => { debugger; }
		});


		// Show the search panel
		model.View.set("ShowSearchPanel", true);
	}


	ShowConfirmationWindow(message) {
		//let mod = this;

		////let state = mod.State.model;

		//return mod.ShowWindow("#confirmationTemplate", message) // [TODO] Make configurable. Use template wrapper.
	};

	ShowWindow(template, message) {

		//let d = "Deferred"; // Needed to get around type-def inconsistency.
		//let dfd = $[d]();
		//let result = false;

		// [TODO] Replace JQuery. Consider making more generic.
		//$("<div id='popupWindow'></div>")
		//	.appendTo("body")
		//	.kendoWindow({
		//		width: "300px",
		//		modal: true,
		//		title: "",
		//		visible: false,
		//		close: function (e) {
		//			this.destroy();
		//			dfd.resolve(result);
		//		}
		//	}).data('kendoWindow').content($(template).html()).center().open();
		////}).data('kendoWindow').content($(template).html()).open();

		//$('#popupMessage').html(message);

		//$('#popupWindow .confirm_yes').val('OK');
		//$('#popupWindow .confirm_no').val('Cancel');

		//$('#popupWindow .confirm_no').click(function () {
		//	$('#popupWindow').data('kendoWindow').close();
		//});

		//$('#popupWindow .confirm_yes').click(function () {
		//	result = true;
		//	$('#popupWindow').data('kendoWindow').close();
		//});

		//return dfd.promise();
	};

	btnSearch_click(e) {
		//debugger;

		let mod = this;
		mod.ClearMessage();

		// [TODO] Implement

		mod.ShowMessage("SEARCH NOT YET SUPPORTED.", CalloutType.Error);
	}
	btnSave_click(e) {
		//debugger;

		let mod = this;
		let model = mod.State.model;
		let dm = model.Model;

		mod.ClearMessage();

		// Validation
		// [TODO]

		// Call the service
		// [TODO]

		// Show a message and hide the panel
		// ([TODO] Move to service callback, not button event)
		mod.ShowMessage("Resource information for '" + dm.ResourceKey + "' saved.", CalloutType.Success);
		model.View.set("ShowUpdatePanel", false);
		mod.State.model.View.set("ShowSearchPanel", true);

		mod.ShowMessage("SERVER SIDE SAVE NOT YET SUPPORTED.", CalloutType.Error);
	}
	btnCancel_click(e) {
		//debugger;
		let mod = this;

		mod.ClearMessage();
		mod.State.model.View.set("ShowUpdatePanel", false);
		mod.State.model.View.set("ShowSearchPanel", true);
	}
	btnDelete_click(e: IResourceAction) {
		//debugger;
		let mod = this;

		// [TODO] Implement

		mod.ShowMessage("DELETE NOT YET SUPPORTED.", CalloutType.Error);
	}
	btnEdit_click(e: IResourceAction) {
		let mod = this;
		let model = mod.State.model;

		mod.ClearMessage();

		let resource = e.resource;
		let dm = model.Model;
		let vm = model.View;

		// Hide the panel, if it is already visible (so we don't have things jumping around)
		vm.set("ShowUpdatePanel", false);

		dm.set("ResourceTypeName", resource.ResourceTypeName);
		dm.set("ResourceId", resource.ResourceId);
		dm.set("ResourceKey", resource.ResourceKey);
		dm.set("BrandCode", resource.BrandCode);
		dm.set("ResourceName", resource.ResourceName);
		dm.set("ResourcePath", resource.ResourcePath);
		dm.set("ResourceTarget", resource.ResourceTarget);
		dm.set("IsVisible", resource.IsVisible);
		dm.set("Status", resource.Status);
		dm.set("CustomLogic", resource.CustomLogic);
		dm.set("Content", resource.Content);
		dm.set("Privileges", resource.Privileges);

		let t = resource.ResourceTypeId;
		switch (t) {
			case "N":
				vm.set("ShowBrand", false);
				vm.set("ShowPathAndTarget", false);
				vm.set("ShowVisible", false);
				vm.set("ShowStatus", false);
				vm.set("ShowCustomLogic", false);
				vm.set("ShowContent", false);
				vm.set("ShowPrivs", false);
				break;
			case "G":
				vm.set("ShowBrand", false);
				vm.set("ShowPathAndTarget", false);
				vm.set("ShowVisible", false);
				vm.set("ShowStatus", false);
				vm.set("ShowCustomLogic", false);
				vm.set("ShowContent", false);
				vm.set("ShowPrivs", false);
				break;
			case "P":
				vm.set("ShowBrand", true);
				vm.set("ShowPathAndTarget", true);
				vm.set("ShowVisible", true);
				vm.set("ShowStatus", true);
				vm.set("ShowCustomLogic", true);
				vm.set("ShowContent", false);
				vm.set("ShowPrivs", true);
				break;
			case "M":
			case "C":
				vm.set("ShowBrand", true);
				vm.set("ShowPathAndTarget", false);
				vm.set("ShowVisible", false);
				vm.set("ShowStatus", false);
				vm.set("ShowCustomLogic", true);
				vm.set("ShowContent", true);
				vm.set("ShowPrivs", true);
				break;
			default:
				mod.ShowMessage("Invalid resource type '" + resource.ResourceTypeName + "' specified.", CalloutType.Error);
				return;
		}

		vm.set("ShowUpdatePanel", true);
		vm.set("ShowSearchPanel", false);
	}

	btnAdd_click(e: IResourceAction) {
		//debugger;
		let mod = this;

		// Note: e.resource is the parent/target resource

		// [TODO] Implement

		mod.ShowMessage("ADD NOT YET SUPPORTED.", CalloutType.Error);
	}

	menu_click(e) {
		//debugger;
		let mod = this;

		// Get the tree control
		let t = mod.Controls.treeResults.control;

		// Get the data item corresponding with the target row
		let item: any = t.dataItem(e.target);

		// Get the menu item and its action
		// Some items won't have actions (parents to child lists)
		let mi = $(e.item);
		let action: string = mi.data("action");

		if (!action)
			return;

		if (action == "edit") {
			mod.btnEdit_click({ resource: item, type: "edit" });
		} else if (action == "delete") {
			mod.btnDelete_click({ resource: item, type: "delete" });
		} else if (action.substring(0, 3) == "add") {
			mod.btnAdd_click({ resource: item, type: "add", subType: action });
		}
	}

}
