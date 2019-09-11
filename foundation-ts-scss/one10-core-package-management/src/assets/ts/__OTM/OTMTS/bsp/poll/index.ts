/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/****************************************************************************
Notes / To Do
- Improve UX. (It is pretty ugly.)
- Unload/Reload
	- Currently displays warning if leaving the page while in a poll.
		- Any way to differentiate leaving vs. reload?
		- Note: Custom text not displayed in all browsers.
- Any way to make infinity symbol in value axis be right-aligned?
	- categoryAxis.labels.align does not exist.
- Handle name ("id") change?
	- Only really needed if they have already Joined.
	- This will not prevent reloading the page getting a new connection ID.
	- Server-side, store the ID along with the connection ID.
- Add option to sort user-value grid by score instead of ID?
- Add more options for score types.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';

interface KeyValuePair<TV> {
	key: string;
	value: TV;
}
interface TextValuePair {
	value: number;
	text: string;
}
interface InitRequest {
	source?: string;
}
interface ActionRequest extends InitRequest {
	action: string;
	value?: string;
}
interface Vote {
	value: string;
	count: number;
}
interface ScoreInfo {
	Index: number;
	Label: string;
	Button: string;
	Tooltip: string;
}

interface ActionResponse {
	action: string;
	status: string;
	statusMessage: string;

	state: string;
	stateMessage: string;
	pollState: string;

	isOwner: boolean;
	isRevealed: boolean;

	numConnected: number;
	numResponded: number;
	totalScore: number;
	averageScore: number;
	medianScore: number;
	results: Vote[];
	votes: KeyValuePair<string>[]; // Note: Not always populated
	myVote: string;
	myVoteIndex: number;

	scores: ScoreInfo[]; // Note: Not always populated
}
interface InitResponse extends ActionResponse {
	inPoll: boolean;
}

interface HubServer {
	/** Generic broadcast method. */
	send(name: string, value: string): void;
	/** Initialize the page and communication channel. */
	init(info: InitRequest): void;
	/** Perform a polling action. */
	action(info: ActionRequest): void;
}
interface HubClient {
	broadcastMessage(name: string, value: string): void;
	broadcastAction(resp: ActionResponse): void;
	initResponse(resp: InitResponse): void;
}
interface Hub {
	client: HubClient;
	server: HubServer;
}
interface RootHub {
	start(): any; // @@@ need return type (promise-like) and args
	stop(): any; // @@@ need return type and args
}
interface HubConnection {
	pollHub: Hub;
	hub: RootHub;
}

interface SectionModel extends Observable {
	IsLoaded: boolean;

	pollType: number;
	includeZero: boolean;
	includeInfinity: boolean;
	includeUnknown: boolean;
	pollTypes: TextValuePair[];

	stateMessage: string;
	pollState: string;
	pollStateStyle: string;
	scores: ScoreInfo[];

	isAdmin: boolean;
	canStart: boolean;
	canStop: boolean;
	canReset: boolean;
	canClose: boolean;
	canOpen: boolean;
	canReveal: boolean;
	canHide: boolean;

	hasPoll: boolean;
	inPoll: boolean;
	canJoin: boolean;
	//showJoin: boolean;
	canLeave: boolean;
	//showLeave: boolean;
	canVote: boolean;
	anyConnected: boolean;

	showResults: boolean;
	showChart: boolean;

	numConnected: number;
	numResponded: number;
	percentResponded: number;
	totalScore: number;
	averageScore: number;
	medianScore: number;
	responses: number[];
	voteList: KeyValuePair<string>[];
	myVote: string;
	myVoteIndex: number;

	ServiceFlags: string[];
}
interface SectionState extends ComponentState<SectionModel> {
	conn: HubConnection;
	hub: Hub;
	source: string;
	isAdmin: boolean;
}
interface SectionControls extends ComponentControls {
	chart: ComplexControl<kendo.dataviz.ui.Chart>;
}

@Injectable()
export class PageComponent extends ComponentModule {
	Controls: SectionControls;
	State: SectionState;

	constructor(ac: ApplicationContext) {
		// Call the parent
		super("Poll", ac);
	}

	Initialize(model?: SectionModel) {
		let mod = this;
		let state = mod.State;
		let util = mod.Util;

		// Call the parent
		super.Initialize(model);

		mod.WriteLog("Initialize.");

		// Get the session ID
		let source = mod.AppContext.Params.Get("id");
		if (util.IsNullOrBlank(source)) {
			let nu: string = "";

			// Ask for an ID
			// Keep looping until we get one
			do {
				nu = prompt("Please enter your name. Only letters and numbers are allowed.");
				//} while (nu.length == 0);
				//} while (!/^[a-z0-9][a-z0-9 ]+[a-z0-9]$/.test(nu));
			} while (!/^[a-zA-Z0-9]+$/.test(nu));

			location.href = location.pathname + "?id=" + nu;

			// Assign a random one
			//location.href = location.pathname + "?id=" + kendo.toString((Math.random() * 1000000), "0");
			return;
		}
		state.source = source;
		state.isAdmin = util.ToSafeBoolean(mod.AppContext.Params.Get("admin"));

		// Get controls
		mod.GetComplexControl("chart", "kendoChart");

		mod.BindAll();

		mod.BindSignalR();

		$(window).on('beforeunload', () => {
			//debugger;
			if (mod.State.model.inPoll)
				// Note: Most newer browsers have removed support for custom text, but a confirm will still be prompted.
				return "You are still in a poll!";
		});
	}

	InitializeServer(): void {
		let mod = this;
		let state = mod.State;
		let hub = state.hub;

		// Call the server
		hub.server.init({ source: state.source });
	}

	SendToServer(e: ActionRequest): void {
		//debugger;
		let mod = this;
		let state = mod.State;
		let hub = state.hub;

		// Add the source/session
		e.source = state.source;

		// Call the server
		hub.server.action(e);
	}
	ServerBroadcastCallback(mod: PageComponent, name: string, value: string) {
		let state = mod.State;
		let hub = state.hub;

		console.log("[" + state.source + "] Signal: " + name + " - " + value);
	}
	InitServerCallback(mod: PageComponent, resp: InitResponse) {
		let state = mod.State;
		let model = state.model
		let hub = state.hub;
		let controls = mod.Controls;
		let util = mod.Util;

		//debugger;

		// @@@ status, statusMessage, state, stateMessage

		if (model.isAdmin) {
			model.set("canStart", resp.state == "none");
			model.set("canStop", resp.state != "none");
			model.set("canReset", resp.numResponded > 0);
			model.set("canClose", resp.state == "open" && resp.numResponded > 0);
			model.set("canOpen", resp.state == "closed");
			model.set("canReveal", resp.state == "open" && resp.numResponded > 0 && !resp.isRevealed);
			model.set("canHide", resp.isRevealed);
		}

		// If poll started, save the scores list
		if (resp.state != "none")
			model.set("scores", resp.scores);

		model.set("isOwner", resp.isOwner);
		model.set("showChart", resp.isRevealed);
		model.set("hasPoll", resp.state != "none");
		model.set("inPoll", resp.inPoll);
		model.set("canJoin", resp.state == "open" && !resp.inPoll);
		//model.set("showJoin", !resp.inPoll);
		model.set("canLeave", resp.state == "open" && resp.inPoll);
		//model.set("showLeave", resp.inPoll);
		model.set("canVote", resp.state == "open" && resp.inPoll);

		model.set("anyConnected", resp.numConnected > 0);
		model.set("numConnected", resp.numConnected);
		model.set("numResponded", resp.numResponded);
		model.set("percentResponded", resp.numConnected = 0 ? 0 : resp.numResponded / resp.numConnected);
		model.set("totalScore", resp.totalScore);
		model.set("averageScore", resp.averageScore);
		model.set("medianScore", resp.medianScore);
		//model.set("myVote", resp.myVote != "0" ? resp.myVote : "None");
		model.set("myVote", resp.myVote != "" ? resp.myVote : "None");
		//model.set("myVoteIndex", resp.myVote != "" ? resp.myVoteIndex : 0);
		//if (resp.myVote != "")
		//	model.set("myVoteIndex", resp.myVoteIndex);
		model.set("voteList", resp.votes);

		if (resp.myVote != "") {
			let vi = resp.myVoteIndex;
			model.set("myVoteIndex", vi);

			// Highlight the correct vote button
			//let nb = $("input[name='vote'][data-vote='" + vi.toString() + "']");
			//nb.addClass("vote_current");
			mod.HighlightVote(-1, vi);
		}

		model.set("showResults", resp.state != "none");
		model.set("showChart", resp.isRevealed);

		if (resp.state == "none") {
			model.set("stateMessage", "Waiting for poll to start.");
			//model.set("pollState", "None");
			model.set("pollState", "Not Started");
		} else if (resp.state == "closed") {
			model.set("stateMessage", "");
			model.set("pollState", "Closed");
		} else {
			model.set("stateMessage", "");
			model.set("pollState", "Open");
		}
		model.set("pollStateStyle", "poll_" + model.pollState.toLowerCase().replace(" ", ""));

		mod.ShowChart(resp.results);

		mod.ClearMessage();
		model.set("IsLoaded", true);
	}

	ServerCallback(mod: PageComponent, resp: ActionResponse) {
		let state = mod.State;
		let model = state.model
		let hub = state.hub;
		let controls = mod.Controls;
		let util = mod.Util;

		// Update these regardless of action or outcome
		model.set("anyConnected", resp.numConnected > 0);
		model.set("numConnected", resp.numConnected);
		model.set("numResponded", resp.numResponded);
		model.set("percentResponded", resp.numConnected = 0 ? 0 : resp.numResponded / resp.numConnected);
		model.set("totalScore", resp.totalScore);
		model.set("averageScore", resp.averageScore);
		model.set("medianScore", resp.medianScore);

		let isAdmin = model.isAdmin;
		let action = resp.action;

		if (resp.status == "ok") {
			mod.ClearMessage();

			if (action == "start") {
				//debugger;
				model.set("scores", resp.scores);

				model.set("hasPoll", true);
				//model.set("canJoin", true);
				//model.set("showJoin", true);
				model.set("showResults", true);
				model.set("stateMessage", "Waiting for participants to join.");
				model.set("pollState", "Open");

				if (isAdmin) {
					model.set("canStart", false);
					model.set("canStop", true);
				}

				// Make sure the first button is highlighted
				mod.HighlightVote(-1, 0);
			} else if (action == "stop") {
				// Reset vote highlight (before it gets cleared)
				mod.HighlightVote(model.myVoteIndex, 0);

				model.set("hasPoll", false);
				model.set("inPoll", false);
				//model.set("canJoin", false);
				//model.set("showJoin", false);
				//model.set("canLeave", false);
				//model.set("showLeave", false);
				model.set("canVote", false);
				model.set("showResults", false);
				model.set("showChart", false);
				model.set("stateMessage", "");
				//model.set("pollState", "None");
				model.set("pollState", "Not Started");
				model.set("myVote", "None");
				model.set("myVoteIndex", 0);

				if (isAdmin) {
					model.set("canStart", true);
					model.set("canStop", false);
					model.set("canReset", false);
					model.set("canClose", false);
					model.set("canOpen", false);
					model.set("canReveal", false);
					model.set("canHide", false);
				}
			} else if (action == "reset") {
				// Reset vote highlight (before it gets cleared)
				mod.HighlightVote(model.myVoteIndex, 0);

				model.set("myVote", "None");
				model.set("myVoteIndex", 0);
				model.set("canVote", model.inPoll);
			} else if (action == "join") {
				//model.set("canJoin", false);
				//model.set("canLeave", true);
				model.set("inPoll", true);
				model.set("canVote", resp.state == "open");
			} else if (action == "leave") {
				// Reset vote highlight (before it gets cleared)
				mod.HighlightVote(model.myVoteIndex, 0);

				//model.set("canJoin", true);
				//model.set("canLeave", false);
				model.set("inPoll", false);
				model.set("canVote", false);
				model.set("myVote", "None");
				model.set("myVoteIndex", 0);
			} else if (action == "update") {
				// (nothing, but need "else if" to prevent error)
			} else {
				// Invalid action (should not happen, but leave as extra check)
				//mod.ShowMessage("Invalid action '" + action + "'.", true);
				mod.ShowMessage("Invalid action '" + action + "'.", null);
				return
			}
		} else {
			//mod.ShowMessage(resp.statusMessage, true);
			mod.ShowMessage(resp.statusMessage, null);
			return
		}

		// Common to all actions ("update" and more)
		model.set("canJoin", !model.inPoll && resp.state == "open");
		//model.set("showJoin", !model.inPoll);
		model.set("canLeave", model.inPoll && resp.state == "open");
		//model.set("showLeave", model.inPoll);
		model.set("canVote", resp.state == "open");
		model.set("showChart", resp.isRevealed);

		if (resp.state == "none") {
			model.set("stateMessage", "Waiting for poll to start.");
			//model.set("pollState", "None");
			model.set("pollState", "Not Started");
		} else if (resp.state == "closed") {
			model.set("stateMessage", "");
			model.set("pollState", "Closed");
		} else {
			model.set("stateMessage", "");
			model.set("pollState", "Open");
		}
		model.set("pollStateStyle", "poll_" + model.pollState.toLowerCase().replace(" ", ""));

		if (isAdmin) {
			model.set("canReset", model.numResponded > 0);
			model.set("canClose", resp.state == "open" && model.numResponded > 0);
			model.set("canOpen", resp.state == "closed");
			model.set("canReveal", model.numResponded > 0 && !resp.isRevealed);
			//model.set("canHide", resp.state == "open" && resp.isRevealed);
			model.set("canHide", resp.isRevealed);
		}

		if (util.HasData(resp.votes))
			model.set("voteList", resp.votes);

		// Show the chart
		mod.ShowChart(resp.results);
	}

	BindSignalR() {
		//debugger;
		let mod = this;
		let state = mod.State;
		let model = state.model;

		// Declare a proxy to reference the hub. 
		let conn: HubConnection = state.conn = $["connection"];
		let hub: Hub = state.hub = conn.pollHub;

		// Create functions that the hub can call within the client
		// Wrap them because "this" will change and we need a reference to the module
		hub.client.broadcastMessage = (name, value) => {
			mod.ServerBroadcastCallback(mod, name, value);
		}
		hub.client.initResponse = (resp) => {
			mod.InitServerCallback(mod, resp);
		}
		hub.client.broadcastAction = (resp) => {
			mod.ServerCallback(mod, resp);
		}

		let h = conn.hub;
		h.start().done(() => {
			// Request initialization from the server
			mod.InitializeServer();
		});
	}

	BindAll() {
		let mod = this;
		let controls = mod.Controls;
		let util = mod.Util;

		let model: SectionModel = util.CreateObservable({
			IsLoaded: false,

			pollType: 2, // Fibonacci 1-21
			includeZero: true,
			includeInfinity: true,
			includeUnknown: true,
			pollTypes: [
				{ value: 0, text: "Fibonacci 1-8" },
				{ value: 1, text: "Fibonacci 1-13" },
				{ value: 2, text: "Fibonacci 1-21" }
			],

			stateMessage: "Loading",
			//pollState: "None",
			pollState: "Not Started",
			pollStateStyle: "poll_NotStarted",
			scores: [],

			isAdmin: mod.State.isAdmin,
			canStart: false,
			canStop: false,
			canReset: false,
			canClose: false,
			canOpen: false,
			canReveal: false,
			canHide: false,

			hasPoll: false,
			inPoll: false,
			canJoin: false,
			canLeave: false,
			canVote: false,

			showResults: false,
			//showDetails: false,
			showChart: false,

			chartDisplay: function () {
				//debugger;
				// "this" context is different, so refer to by index+key
				return this["get"]("showChart") ? "inline-block" : "none";
			},

			numConnected: 0,
			numResponded: 0,
			percentResponded: 0,
			totalScore: 0,
			responses: [],
			voteList: [],
			myVote: "None",
			myVoteIndex: 0,

			start: (e) => {
				mod.ClearMessage();
				//let el = e.sender.element;
				let el = $(e.toElement);
				let v = el.val();

				let pt = model.pollType.toString() + ',' + model.includeZero.toString() + ',' + model.includeInfinity.toString() + ',' + model.includeUnknown.toString();
				mod.SendToServer({ action: v.toLowerCase(), value: pt });
			},
			action: (e) => {
				mod.ClearMessage();
				//let el = e.sender.element;
				let el = $(e.toElement);
				let v = el.val();
				mod.SendToServer({ action: v.toLowerCase() });
			},
			vote: (e) => {
				//debugger;
				mod.ClearMessage();
				//let el = e.sender.element;
				let el = $(e.toElement);

				// Get the vote value (label) and index
				let v = el.data("vote-label");
				let vi = el.data("vote");

				// Get the old vote
				let ov = model.myVoteIndex;
				if (ov == undefined) ov = 0;

				// See if the old and new votes are different
				if (ov != vi) {
					// Remove the old highlight
					let ob = $("input[name='vote'][data-vote='" + ov.toString() + "']");
					ob.removeClass("secondary");

					// Highlight the current one
					el.addClass("secondary");
				}

				model.set("myVote", v.toString());
				model.set("myVoteIndex", vi);
				mod.SendToServer({ action: "vote", value: vi });
			}
		});

		// Save the model
		mod.State.model = model;

		// Bind the model to the page
		mod.BindModel(null, model);
	}

	HighlightVote(oldVote: number, newVote: number): void {
		if (oldVote == newVote) return;

		let b = $("input[name='vote'][data-vote='" + newVote.toString() + "']");
		b.addClass("secondary");

		if (oldVote >= 0) {
			b = $("input[name='vote'][data-vote='" + oldVote.toString() + "']");
			b.removeClass("secondary");
		}
	}

	ShowChart(results): void {
		let mod = this;
		let controls = mod.Controls;
		let state = mod.State;
		let model = state.model;

		let chart = controls.chart;
		let ci = chart.item;

		if (model.showChart == true) {
			//debugger;
			model.set("results", results);

			if (model.showChart) {
				let c = chart.control;

				// Destroy the chart. More reliable than "setOptions"
				if (c && c.destroy)
					c.destroy();

				// Show the container before building the chart
				ci.show();

				ci.kendoChart({
					transitions: false,
					chartArea: {
						width: 250,
						height: 200
					},
					legend: { visible: false },
					title: { visible: false },
					valueAxis: [{
						majorUnit: 1,
						minorUnit: 0,
					}],
					series: [{
						type: "bar",
						field: "count",
						categoryField: "value",
						data: results,
						labels: {
							visible: true,
							position: "outsideEnd",
							template: "#: value > 0 ? value.toString() : ''#"
						}
					}]
				});
			}
		} else {
			ci.hide();
		}
	}
}
