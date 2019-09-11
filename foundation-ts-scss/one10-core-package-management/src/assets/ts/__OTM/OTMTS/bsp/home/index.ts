/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

const UseCB = false; // [3158][TEST][TODO] Remove when no longer needed

import { ComponentModule, ComponentCollection } from 'cp/componentModule';
import { MenuItem } from 'cp/securityShared';
import { ServiceConstants, ServiceCollection } from 'cp/serviceShared';
//import { SecurityService } from 'bsp/services/mock/securityService';
import { SecurityService } from 'bsp/services/securityService';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';
//import { DashboardService } from 'bsp/services/mock/dashboardService';
import { DashboardService } from 'bsp/services/dashboardService';
import { GameService } from 'bsp/services/GameService';
import { WsGizmo, GizmoInfo, WsGizmoData } from 'bsp/services/models/dashboardModels';
import { MasonryManager } from 'masonry-layout';
//import { Config } from '~config';
import { KeyValueCollection } from 'cp/util';
import { RecognitionService, WsStat, WsRecognitionPerson, WsRecognitionLike, WsRecognitionFeedPerson, WsRecognitionComment} from 'bsp/services/recognitionService';
import { ClaimService } from 'bsp/services/claimService';

interface Gizmo extends WsGizmo, Observable { }
interface GizmoItemData extends WsGizmoData, Observable { }
interface GizmoData extends KeyValueCollection<GizmoItemData> { }

interface SectionData extends Observable {
  List: GizmoInfo[];
  Meta: KeyValueCollection<Gizmo>; // [TODO] Here or normal State? Doesn't need to be observable.
  Data: GizmoData;
}

// Optional: Service-bound models (converted to observables)
//interface Dashboard extends WsDashboardResult, Observable { }

interface SectionModel extends ComponentModel {
  Gizmos: SectionData;
  ParticipantName: string;
  ParticipantEmail: string;
}
interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
  divLoading: JQuery;
  gizmoList: JQuery;
}

interface SectionTemplates extends ComponentTemplates {
  gizmoList: Template;
}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
  @Inject() Dashboard: DashboardService = null;
  @Inject() Security: SecurityService = null;
  @Inject() Game: GameService = null;
  @Inject() Recognition: RecognitionService = null;
  @Inject() Claim: ClaimService = null;
}

interface SectionConfig extends ComponentConfig {
	GizmoDataSourceType: {
		Method: string;
		Uri: string;
	},
	Resources: {
		GizmoLoadError: string;
		GizmoDataSourceError: string;
	}
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;
	public Templates: SectionTemplates;
	public Config: SectionConfig;

	//@Inject() public Components: SectionComponents;

	constructor(ac: ApplicationContext, public Services: SectionServices, public Masonry: MasonryManager) {
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

		// Update config constants
		mod.Config.GizmoDataSourceType = { Method: 'M', Uri: 'U' };
		mod.Config.Resources = {
			GizmoLoadError: 'Pages:Home:Index:Message:GizmoLoadError',
			GizmoDataSourceError: 'Pages:Home:Index:Message:GizmoDataSourceError',
		};

		// Manually add resources
		// [TODO] 
		CpWeb.App.AddResources([ // [TODO] Use Resource from DB instead
			{ Key: mod.Config.Resources.GizmoLoadError, Content: "Error loading dashboard item '{0}'." },
			{ Key: mod.Config.Resources.GizmoDataSourceError, Content: "Unable to locate data source method '{0}'." }
		]);

		// [3158][TODO] Automate. Currently cannot self-register templates located in separate files (partials)
		CpWeb.App.RegisterTemplate('table--gizmo', 'callback');

		// Get control and template references; bind buttons
		mod.GetControls(["gizmoList"]);
		mod.GetTemplates(["gizmoList"]);

		// Instantiate Masonry
		// [TODO] Make configurable
		mod.Masonry.Instance = mod.Masonry.Create(
			//var msnry = new Masonry(
			'.main-content', {
				// options
				//itemSelector: '.gizmo',
				itemSelector: '.main-content>[class^="gizmo--"]',
				columnWidth: '.grid-sizer',
				gutter: 32,
				horizontalOrder: true
			});

		// Create the model
		let model = state.model = mod.CreateObservable(
			{
				Gizmos: {
					List: [],
					Meta: {},
					Data: {}
				}
			},
			["GizmoList"]
		);

		model.bind('change', e => {
			if (e.field && e.field == "IsLoaded") {
				//debugger;
				mod.Controls.gizmoList.html(mod.Templates.gizmoList({ Template: { context: mod, parentControlPath: '', controlPath: 'gizmos' }, Meta: model.Gizmos.Meta, Data: model.Gizmos.Data }));
				mod.ProcessBindList();
				mod.ReloadMasonry();
			}
		});

		// Additionally, the parent can listen for changes in the model and detect changes in the child.
		// [3158][TEST] Code removed because it no longer functions properly.
		//model.bind('change', (e) => {
		//	//debugger;

		//	// [TODO] Move to common handler?
		//	if (e.field) {
		//		let modelData: any;
		//		if (e.items) {
		//			modelData = e.items[0];
		//		} else {
		//			modelData = mod.State.model.get(e.field);
		//		}

		//		// Try to rebind the template, if applicable
		//		//mod.RebindTemplate(modelData);
		//		mod.RebindTemplate(modelData, (type) => {
		//			$(document).foundation(); // [TODO] Need a more targeted foundation re-application
		//			if (type == "gizmo") { // [TODO] Add meta-data to know when masonry or foundation need to be reloaded
		//				mod.ReloadMasonry();
		//			}
		//		});
		//	}

		//});

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();

		// Fetch initial data
		mod.LoadGizmos();
	}

	public async LoadGizmos() {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;
		let model = mod.State.model.Gizmos;

		services.Dashboard.GetUserGizmos()
			.then(data => {
				if (data.ResponseCode == constants.ResponseCode.Success) {
					// Save the list
					model.set("Meta", data.Data.structure);
					model.set("List", data.Data.gizmos); // [TODO] IS THIS NEEDED? Can't we use the pre-populated "Data" object?

					// Add placeholders in the data structure
					let serviceFlags = [];
					if (model.List != null && model.List.length > 0) {

						model.List.forEach((value, index, arr) => {
							serviceFlags.push("gizmo_" + value.id);
							model.set("Data." + value.id, { subtype: value.subtype, id: value.id, content: [] });
						});

						// Reset the service flags list based on the expected gizmos
						mod.WatchServiceFlags(serviceFlags, true, undefined, "ServiceFlags"); // [TODO] Create wrapper

						// Begin fetching gizmo data
						model.List.forEach((value, index, arr) => {
							mod.LoadGizmo(value, model.Meta[value.subtype]);
						});
					}

				} else {
					mod.ShowMessage(mod.GetServiceMessage("Error fetching dashboard list.", data), CalloutType.Error);
				}
			});
	}

	public BindGizmoList(structure: any, gizmoData: any) {
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;

		mod.Controls.gizmoList.html(mod.Templates.gizmoList({ Template: { context: mod, parentControlPath: '', controlPath: 'gizmos' }, Meta: structure, Data: gizmoData }));
		mod.ProcessBindList();
		mod.ReloadMasonry();
	}

	public btnShowMore_click(e) {
		//debugger;
		let mod = this;
		let services = mod.Services.Dashboard;
		let constants = mod.Services.Constants;
		let model = mod.State.model.Gizmos.Data;

		let control = $(e);
		let subtype = control.data("subtype");
		// earnings-check

		let targetName = control.data("controlTarget");
		// gizmos_1_2_content

		// [3158][TODO] Not needed for kendo (callback) version. Can remove "parent" data attribute in markup
		let parentTargetName = control.data("parentControlTarget");
		// gizmos_1_2

		// [3158][TODO] Hard-coded in markup; need to make dynamic and safer (if not found)
		let metaPath = control.data("metaPath");
		let meta = eval('mod.State.model.Gizmos.Meta.' + metaPath);

		let modelTarget = meta.content.table.data;
		// pendingData

		let sourceType = meta.data;
		// pending

		// Get the gizmo information
		let gizmoId = control.data("gizmoId");
		let pageSize = meta.pageSize || 3;
		let gizmoData = model[gizmoId];

		// See if there is a service (function) for the specific gizmo
		// [TODO] Add the service method to Meta?
		let mn = "Get_" + subtype + "_" + sourceType;
		let df = services[mn];
		if (df && typeof df === "function") {
			services[mn](pageSize, gizmoData[modelTarget].length) // Can't invoke "df" without losing context. Would need to use "call" prototype method.
				.then(data => {
					mod.renderData(gizmoData, parentTargetName, targetName, modelTarget, meta, data);
				});
		} else {
			// [TODO] Clean up (better feedback mechanism; use resources)
			alert("Unable to fetch data for type '" + subtype + "', source '" + sourceType + "'.");
		}

		return false;
	}

	public btnAddComment_click(e) {
		//debugger;
		let control = $(e);
		let id = control.attr("id");

		if (id) {

			let root = id.replace('-addcomment', '');

			// [TODO] Replace HTML DOM and direct JQuery usage
			let comment = <HTMLTextAreaElement>document.getElementById(root + "-newComment");
			let commentValue = comment.value;
			let recognitionId = control.data("recognitionid");
			let receiverId = control.data("receiverid");

			if (commentValue && recognitionId && receiverId) {

				let mod = this;
				let recComm = <WsRecognitionComment>{};

				recComm.Comment = commentValue;
				recComm.RecognitionId = recognitionId;
				recComm.RecognitionReceiverID = receiverId;

				mod.Services.Recognition.SetRecognitionComments(recComm).then(data => {
					window.location.reload();
				});
			}
		}
	}

	public btnAddLike_click(e) {
		//debugger;
		let control = $(e);
		let id = control.attr("id");

		if (id) {

			//let root = id.replace('-addlike', '');

			let receiverId = control.data("receiverid");

			if (receiverId) {

				let mod = this;
				let recComm = <WsRecognitionLike>{};

				recComm.LikeReceiverID = receiverId;

				mod.Services.Recognition.SetRecognitionLike(recComm).then(data => {
					window.location.reload();
				});
			}
		}
	}

	public btnDeleteComment_click(e) {
		//debugger;
		let control = $(e);
		let id = control.attr("id");

		if (id) {

			//let root = id.replace('-deletelike', '');

			let commentId = control.data("commentid");

			if (commentId) {

				let mod = this;
				let recComm = <WsRecognitionComment>{};

				//recComm.LikeSenderID = commentValue;
				recComm.CommentID = commentId;

				mod.Services.Recognition.DeleteRecognitionComments(recComm).then(data => {
					window.location.reload();
				});
			}
		}
	}

	private renderData(gizmoData: any, parentTargetName: any, targetName: any, modelTarget: any, meta: any, data: WsResponseData<any[]>): void {
		// debugger;
		let mod = this;

		// [TODO] Check service return status, etc.
		// [TODO] Create "incremental" template where the contents are added to the previous (would need a reset/clear method too)

		// Update the data
		gizmoData.set(modelTarget, data.Data);

		// Apply the template from the target spot down
		if (UseCB) {
			// Kendo grid version
			mod.tableGizmo_render(gizmoData);
		} else {
			// Static template version
			mod.RenderTemplate({ Context: mod, Name: meta.content.type, Meta: meta.content.table, Data: gizmoData, Parent: parentTargetName, ChildKey: "content" }, $("#" + targetName));

			// [TODO] Reapply foundation, masonry, etc. as needed
		}
	}

	/**
	 * Special formatting of dollar amounts.
	 * @param {number} value - Value to format.
	 */
	public dollar_format(value: number): string {
		// [TODO] Consider passing in meta data/options

		//debugger;
		let mod = this;

		// Format the number
		let fs = kendo.toString(value, "n2");

		// Find the decimal
		// It could be either a period or comma (once localized)
		let i = fs.length - 3;
		let dc = fs.substring(i, i+1);
		if (dc == '.' || dc == ',') {
			return '<sup>$</sup>' + fs.substring(0, i) + '<sub>' + fs.substring(i) + '</sub>';
		} else {
			return '<sup>$</sup>' + fs;
		}

		// [TODO] Alternative: Use RegEx. Then we could have the expression and format string in Meta
		//fs = fs.replace(/([0-9,]+)\.(\d\d)/, "<sup>$</sup>$1.<sub>$2</sub>");

	}

	public tableGizmo_render(model) {
		//debugger;
		let mod = this;
		//let model = mod.State.model.
		let cb = mod.Callbacks["tableGizmo_render"];

		let meta = eval('mod.State.meta.' + cb.MetaPath);

		// Get the grid control
		// [TODO] Create helper to abstract JQuery reference
		// Can possibly use a ComplexControl, but the ID could change and still need to handle instantiation
		let rc = $("#" + mod.Callbacks.tableGizmo_render.ControlPath);

		// Get the grid container
		let grid = rc.data("kendoGrid");

		// See if the grid has been instantiated yet
		if (grid) {
			// Update the data
			//grid.dataSource.data(model.Data);
			grid.dataSource.data(model[meta.content.table.data]);
			//grid.refresh();
		} else {
			// Create the grid
			// [TODO] Replace with reporting framework metadata

			let schemaFields = {};
			let gridColumns = [];

			// [3158][TODO] Rename or remove "header2" (temporary structure for callback-based template)
			for (let i = 0; i < meta.content.table.header2.length; i++) {
				let col = meta.content.table.header2[i];

				schemaFields[col.field] = { type: col.type || 'string' };

				// [3158][TODO] Need to pull multiple optional properties but not all properties; list? helper?
				let c: any = { field: col.field };
				if (col.title) c.title = col.title;
				if (col.format) c.format = col.format;
				if (col.width) c.width = col.width;
				if (col.modifier) {
					if (!c.attributes) c.attributes = {};
					c.attributes.class = col.modifier;
				}
				gridColumns.push(c);
			}

			rc.kendoGrid({
				noRecords: { template: "No results found" }, // [TODO] Use resource, constant, or meta
				dataSource: {
					data: model[meta.content.table.data],
					schema: {
						model: {
							//id: "", // [TODO] Pull from meta (optional)
							fields: schemaFields
						}
					}
				},
				resizable: true,
				sortable: true, // [TODO] Pull from meta
				columns: gridColumns
			});

			// Apply styling to the table
			// [TODO] Create helper to abstract JQuery reference
			$("#" + mod.Callbacks.tableGizmo_render.ControlPath + " table").addClass("table--gizmo responsive-card-table dataTable no-footer");
		}
	}

	// [TODO] Move to common location once finalized? Is this a shared component/feature?
	// Note: Masonry will eventually be removed entirely.
	public ReloadMasonry(): void {
		let mod = this;

		let msnry = mod.Masonry.Instance;
		msnry.reloadItems();
		msnry.layout();

		// [TODO] Any way to prevent multiple bindings on the same object?
		// [TODO] Consolidate this somewhere?
		$('.main-content>[class^="gizmo--"]').on('click', '.gizmo__title, .btn--expand-arrow', function () {
			if ($(this).parents('.main-content>[class^="gizmo--"]').hasClass('gizmo--expanded')) {
				$('.main-content>[class^="gizmo--"]').removeClass('gizmo--expanded');
			} else {
				$('.main-content>[class^="gizmo--"]').removeClass('gizmo--expanded');
				$(this).parents('.main-content>[class^="gizmo--"]').addClass('gizmo--expanded');
			}
			msnry.layout();
		});
		//if (!UseCB) {
		//	$('table').each(function () {
		//		$(this).DataTable({
		//			responsive: true,
		//			paging: false,
		//			filter: false,
		//			info: false
		//		});
		//	});
		//}
		mod.Controls.RootElement.foundation();
	}

	private LoadGizmo(item: GizmoInfo, meta: WsGizmo): void {
		//debugger;
		let mod = this;
		let services = mod.Services.Dashboard;
		let constants = mod.Services.Constants;

		if (item.dataSourceType == mod.Config.GizmoDataSourceType.Method) {
			// See if the data source is actually a function
			let ds: (i: GizmoInfo, m: WsGizmo) => void = mod[item.dataSource];
			if (ds && mod.Util.IsFunction(ds)) {
				// Call the function
				// Note: In order to retain proper context, call the function via "mod", NOT variable "ds".
				// Not this way: ds(item, meta);
				mod[item.dataSource](item, meta);
			} else {
				//mod.ShowMessage("Unable to locate data source method " + item.dataSource + ".", CalloutType.Error); // [TODO] Show friendlier name. // [TODO] Get message from resources.
				mod.ShowMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoDataSourceError].Content, item.dataSource), CalloutType.Error);
				// [TODO] Leave invasive alert in place until proper message handling is implemented
				alert(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoDataSourceError].Content, item.dataSource));
			}
		} else {
			services.GetGizmoData(item)
				.then(data => {
					if (data.ResponseCode == constants.ResponseCode.Success) {
						// [TODO] Wrap/automate
						if (data.Data.resources && data.Data.resources.length > 0) {
							let rl = data.Data.resources;
							for (let i = 0; i < rl.length; i++) {
								mod.Resources[rl[i].Key] = rl[i];
							}
						}
						mod.State.model.Gizmos.set("Data." + item.id, data.Data);
					} else {
						// [TODO] Clean this up. ShowMessage is not ideal because there could be multiple data issues.
						//mod.ShowMessage(mod.GetServiceMessage("Error loading dashboard item '" + item.id + "'.", data), CalloutType.Error);
						mod.ShowMessage(mod.GetServiceMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoLoadError].Content, item.id), data), CalloutType.Error);
					}
					// Indicate completion
					mod.SetServiceFlag("gizmo_" + item.id);
				});
		}
	};

	private GameGizmo(item: GizmoInfo, meta: WsGizmo): void {
		let mod = this;

		mod.Services.Game.GetGamificationPendingCredits()
			.then(data => {
				let gameDataObj = mod.State.model.Gizmos.Data[item.id];

				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					if (data.Data != null) {
						gameDataObj.set("dataTotal", { label: "Tokens Available", value: data.Data.TotalAvailableCredits });
						let dl = [];
						if (data.Data.GameDetail != null && data.Data.GameDetail.length > 0) {
							data.Data.GameDetail.forEach(g => {
								let gameUrl: string = g.GameUrl;
								if (g.GameUrl && g.GameUrl.length > 1 && g.GameUrl.substring(0, 2) == '~/')
									gameUrl = mod.AppConfig.Core.SiteRoot + g.GameUrl.substring(2);
								dl.push({ gameUrl: gameUrl, name: g.GameName, tokens: g.AvailableCredits });
							});
						}
						gameDataObj.set("data", dl);
					}
				} else {
					// [TODO] Clean this up. ShowMessage is not ideal because there could be multiple data issues.
					//mod.ShowMessage(mod.GetServiceMessage("Error loading dashboard item '" + item.id + "'.", data), CalloutType.Error);
					mod.ShowMessage(mod.GetServiceMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoLoadError].Content, item.id), data), CalloutType.Error);
				}

				// Indicate completion
				mod.SetServiceFlag("gizmo_" + item.id);
			});
	}

	private RecognitionGizmo(item: GizmoInfo, meta: WsGizmo): void {
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;

		mod.Services.Recognition.GetRecognitionData(null).then(data => {
			//debugger;

			let recDataObj = mod.State.model.Gizmos.Data["recognitionv1"];

			//console.log(item);
			if (data.ResponseCode == constants.ResponseCode.Success) {
				if (data.Data != null) {

					let dl = [];

					if (data.Data.TopRecogniziers != null && data.Data.TopRecogniziers.length > 0) {
						data.Data.TopRecogniziers.forEach(function (v1: WsRecognitionPerson) {
							dl.push({ icon: v1.Icon, rank: v1.Rank, name: v1.Name, amount: v1.Amount });
						});
					}

					recDataObj.set("data", dl);

					dl = [];
					let dlTopLinks = [];

					if (data.Data.Menu != null && data.Data.Menu.length > 0) {
						for (var x = 0; x < data.Data.Menu.length; x++) {

							if (x < 2)
								dlTopLinks.push({ text: data.Data.Menu[x].Text, url: data.Data.Menu[x].Url, modifier: "gizmo--recognitionv1__link" });
							else
								dl.push({ text: data.Data.Menu[x].Text, url: data.Data.Menu[x].Url, modifier: "gizmo__dropdown-link" });
						}
					}

					// data.Data.Menu.forEach(function (v1: WsRecogitionMenu) {
					//   dl.push({ text: v1.Text, url: v1.Url, modifier: "gizmo__dropdown-link" });
					// });
					recDataObj.set("titledropdown", dl);
					recDataObj.set("toplinks", dlTopLinks);

					dl = [];
					if (data.Data.Stats != null && data.Data.Stats.length > 0) {
						data.Data.Stats.forEach(function (v1: WsStat) {
							dl.push({ number: v1.Number, label: v1.Label });
						});
					}

					recDataObj.set("stats", dl);

					dl = [
						/*{ label: "This Month", number: "0" },
						{ label: "Combined Years of Experience", number: "0" }*/
					]
					recDataObj.set("twocols", dl); //disabled, but still required as part of the structure

					recDataObj.set("title", "Recognition");

					//console.log(recDataObj);

				}
				//mod.State.model.Gizmos.set("Data." + item.id, data.Data);

			} else {

				// Passthrough
				let dl = [];
				recDataObj.set("data", dl);
				recDataObj.set("titledropdown", dl);
				recDataObj.set("toplinks", dl);
				recDataObj.set("data", dl);
				recDataObj.set("stats", dl);
				recDataObj.set("twocols", dl);
				recDataObj.set("title", "Recognition");

				// [TODO] Clean this up. ShowMessage is not ideal because there could be multiple data issues.
				//mod.ShowMessage(mod.GetServiceMessage("Error loading dashboard item '" + item.id + "'.", data), CalloutType.Error);
				mod.ShowMessage(mod.GetServiceMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoLoadError].Content, item.id), data), CalloutType.Error);
			}
			mod.SetServiceFlag("gizmo_" + item.id);
		});

	};

	private RecognitionFeedGizmo(item: GizmoInfo, meta: WsGizmo): void {
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;

		mod.Services.Recognition.GetRecognitionFeedData(null).then(data => {

			let recDataObj = mod.State.model.Gizmos.Data["recognitionFeed"];

			if (data.ResponseCode == constants.ResponseCode.Success) {
				if (data.Data != null) {

					//Panel #1 - ALL
					let dl = [];
					if (data.Data.RecognitionAll != null && data.Data.RecognitionAll.length > 0) {
						data.Data.RecognitionAll.forEach(function (v1: WsRecognitionFeedPerson) {
							dl.push({ recognitionid: v1.RecognitionId, recognitionReceiverId: v1.RecognitionReceiverId, profileImage: v1.ProfileImage, toname: v1.ToName, fromname: v1.FromName, title: v1.Title, comment: v1.Comment, likeurl: v1.LikeUrl, likecount: v1.LikeCount, commenturl: v1.CommentUrl, commentcount: v1.CommentCount, daysago: v1.DaysAgo, comments: v1.Comments, likes: v1.Likes });
						});
					}

					recDataObj.set("panel1", dl);

					//Panel #2 - ME
					dl = [];

					if (data.Data.RecognitionMe != null && data.Data.RecognitionMe.length > 0) {
						data.Data.RecognitionMe.forEach(function (v1: WsRecognitionFeedPerson) {
							dl.push({ recognitionReceiverId: v1.RecognitionReceiverId, profileImage: v1.ProfileImage, fromname: v1.FromName, title: v1.Title, comment: v1.Comment, likeurl: v1.LikeUrl, likecount: v1.LikeCount, commenturl: v1.CommentUrl, commentcount: v1.CommentCount, daysago: v1.DaysAgo, comments: v1.Comments, likes: v1.Likes });
						});
					}

					//if no data, use default data instead
					if (dl.length == 0) {
						dl.push({ recognitionReceiverId: "", icon: "", fromname: "", title: "", comment: "No current recognitions", likeurl: "", likecount: 0, commenturl: "", commentcount: 0, daysago: 0, comments: "", likes: "" });
					}
					recDataObj.set("panel2", dl);

					//Menu Drop Down
					dl = [];
					if (data.Data.Menu != null && data.Data.Menu.length > 0) {
						for (var x = 0; x < data.Data.Menu.length; x++) {
							dl.push({ text: data.Data.Menu[x].Text, url: data.Data.Menu[x].Url, modifier: "gizmo__dropdown-link" });
						}
					}
					recDataObj.set("titledropdown", dl);

					//Passthrough
					recDataObj.set("tab1title", "All");
					recDataObj.set("tab2title", "Me");
					recDataObj.set("title", "Recognition Feed");
				}
			} else {

				//Passthrough
				let dl = [];
				recDataObj.set("panel1", dl);
				recDataObj.set("tab1title", "All");
				recDataObj.set("tab2title", "Me");
				recDataObj.set("title", "Recognition Feed");
				recDataObj.set("titledropdown", dl);
				recDataObj.set("panel2", dl);

				// [TODO] Clean this up. ShowMessage is not ideal because there could be multiple data issues.
				//mod.ShowMessage(mod.GetServiceMessage("Error loading dashboard item '" + item.id + "'.", data), CalloutType.Error);
				mod.ShowMessage(mod.GetServiceMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoLoadError].Content, item.id), data), CalloutType.Error);
			}

			mod.SetServiceFlag("gizmo_" + item.id);
		});
	};

	private ClaimFeedGizmo(item: GizmoInfo, meta: WsGizmo): void {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = services.Constants;

		let recKey = 'Pages:Home:Index:Gizmo:Claim:Label:ContentShort';

		CpWeb.App.AddResources([ // [TODO] Use Resource from DB instead
			{ Key: 'Pages:Home:Index:Gizmo:Claim:Title', Content: 'Claims' },
			{ Key: 'Pages:Home:Index:Gizmo:Claim:Label:ContentShort', Content: '<p class=\"gizmo__hide-on-expanded\">Check the Incentive\'s Promotion Detail for eligibility rules and then click the button below to submit your sales claims — it\'s that easy! Claims must be submitted within 60 days of the customer sales date, so don\'t delay!</p>\n' },
			{ Key: 'Pages:Home:Index:Gizmo:Claim:Label:SubmitClaim', Content: 'Submit Claim' }
		]);

		mod.Services.Claim.GetClaimGizmoData(null).then(data => {

			let recDataObj = mod.State.model.Gizmos.Data["claims"];
			//var temp = mod.Resources['Pages:Home:Index:Gizmo:Claim:Lablel:Details'].Content;

			recDataObj.set("title", mod.Resources['Pages:Home:Index:Gizmo:Claim:Title'].Content);
			recDataObj.set("claimbtn", { text: mod.Resources['Pages:Home:Index:Gizmo:Claim:Label:SubmitClaim'].Content, url: mod.formatURL('~/Pages/Claim/AddClaim.aspx') });
			
			recDataObj.set("claimlink", { text: 'CLAIMS DETAIL', url: mod.formatURL('~/claim/SubmittedClaimReport'), modifier: "float-right" });

			if (data.ResponseCode == constants.ResponseCode.Success) {
				if (data.Data != null && data.Data.ReportData != null) {

					//Panel #1 - ALL
					let dl = [];
					if (data.Data.ReportData != null && data.Data.ReportData.length > 0) {

						data.Data.ReportData.forEach(function (v1: any) {
							dl.push({ ClaimDate: v1.AddDt, CustomerName: v1.CustomerName, Status: v1.StatusName });
						});

					};
					recDataObj.set("claimData", dl);

					recDataObj.set("contentShort", mod.Resources['Pages:Home:Index:Gizmo:Claim:Label:ContentShort'].Content);
				}
			} else {
				// Passthrough
				let dl = [];
				recDataObj.set("claimData", dl);
				recDataObj.set("contentShort", "");
				recDataObj.set("claimbtn", { text: '', url: mod.formatURL('#') });
				recDataObj.set("claimlink", { text: '', url: mod.formatURL('#') });
				// [TODO] Clean this up. ShowMessage is not ideal because there could be multiple data issues.
				mod.ShowMessage(mod.GetServiceMessage(mod.Util.FormatString(mod.Resources[mod.Config.Resources.GizmoLoadError].Content, item.id), data), CalloutType.Error);
			}

			mod.SetServiceFlag("gizmo_" + item.id);
		});
	};

	// [TODO] Make method name consistent (proper case)
	public formatURL(PageUrl: string): string {

		let mod = this;
		let siteURL = mod.AppConfig.Core.SiteRoot;

		if (siteURL.substr(-1) !== '/') //if siteURL does NOT end in a slash, add it.  Prevents // situations
			siteURL = siteURL + '/';

		if (PageUrl.substr(-2) !== '~/') //remove ~/
			PageUrl = PageUrl.substr(2);

		return siteURL + PageUrl;
	}
}
