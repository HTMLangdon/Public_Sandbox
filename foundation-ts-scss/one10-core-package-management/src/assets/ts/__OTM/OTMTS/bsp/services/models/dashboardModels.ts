import { KeyValueCollection } from "cp/util";

/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

export interface WsGizmoItem {
	type: string;
	[key: string]: any;
}
export interface WsGizmoContent {
	items: WsGizmoItem[];
	[key: string]: any;
}
export interface WsGizmo {
	subtype: string;
	type: string;
	//dataSourceType: string; // Present in mock version only
	//dataSource: string; // Present in mock version only
	title?: string;
	modifier?: string;
	content: WsGizmoContent;
	[key: string]: any;
}

export interface WsUserGizmoResponse {
	structure: KeyValueCollection<WsGizmo>;
	gizmos: GizmoInfo[]; // [TODO] Reuse WsGizmoRequest or create new/common interface? Server-side object is called "GizmoInfo" (for both request and this item in response)
}

export interface GizmoInfo {
	gizmoId: number;
	id: string;
	subtype: string;
	dataSourceType: string;
	dataSource: string;
}

export interface WsGizmoData {
	id: string;
	subtype: string;
	[key: string]: any;
	resources?: ResourceInfo[];
}

export var GizmoStructure: KeyValueCollection<WsGizmo> = {
	general: {
		type: "gizmo",
		subtype: "general",
		modifier: "gizmo--general",
		dataSourceType: "U", dataSource: "~/api/v1/home/getGeneralContentGizmo", // Mock service only
		id: "",
		title: "General Content Card",
		image: "",
		content: {
			items: [
				{
					type: "content-body",
					data: "contentShort",
					dataKey: "text"
				}
			]
		}
	},
	claims: {
		type: "gizmo",
		subtype: "claims",
		modifier: "gizmo--promo",
		dataSourceType: "M", dataSource: "ClaimFeedGizmo", // Mock service only
		id: "",
		title: "",
		content: {
			items: [
				{
					type: "content-body",
					data: "contentShort",
					dataKey: "text"
				},
				{
					type: "table--default",
					data: "claimData",
					header: [
						{ field: "ClaimDate", text: "Claim Date", format: "d" },
						{ field: "CustomerName", text: "Customer Name" },
						{ field: "Status", text: "Status" }
					]
				},
				/*{
					type: "link",
					textKey: "Pages:Home:Index:Gizmo:Claim:Lablel:Details",
					text: "CLAIM DETAILS",
					url: "~/claim/SubmittedClaimReport",
					modifier: "float-right"
				},*/
				{
					type: "gizmo__actionbar",
					items: [
						{
							data: "claimlink",
							type: "link--data"
						}
					]
				},
				{
					type: "gizmo__actionbar",
					items: [
						{
							data: "claimbtn",
							type: "btn--normal"
						}
					]
				}
			]
		}
	},
	recognitionFeed: {
		type: "gizmo",
		subtype: "recognitionFeed",
		modifier: "gizmo--recognitionv1",
		dataSourceType: "M", dataSource: "RecognitionFeedGizmo", // Mock service only
		id: "",
		title: "",
		image: "",
		titledropdown: {
			items: [
				{
					type: "gizmo__dropdown",
					data: "titledropdown",
					repeat: { type: "gizmo__dropdown-link" }
				}
			]
		},
		content: {
			items: [
				{
					type: "gizmo__tabs",
					tab1title: "",
					tab2title: "",
					panels: {
						items: [
							{
								type: "gizmo__tabs-panel",
								modifier: "is-active",
								data: "panel1",
								repeat: { type: "recognition-row" },
								dateFormat: "M/dd/yy"
							},
							{
								type: "gizmo__tabs-panel",
								modifier: "",
								data: "panel2",
								repeat: { type: "recognition-row" },
								dateFormat: "M/dd/yy"
							}
						]
					}
					/*panel1: {
					  items: [
						{
						  type: "gizmo__tabs-panel",
						  data: "panel1",
						  repeat: { type: "employee-row" }
						}
					  ]
					},
					panel2: {
					  items: [
						{
						  type: "gizmo__tabs-panel",
						  data: "panel2",
						  repeat: { type: "employee-row" }
						}
					  ]
					}*/
				}
			]
		}
	},
	recognitionv1: {
		type: "gizmo",
		subtype: "recognitionv1",
		modifier: "gizmo--recognitionv1",
		dataSourceType: "M", dataSource: "RecognitionGizmo", // Mock service only
		id: "",
		title: "",
		image: "",
		titledropdown: {
			items: [
				{
					type: "gizmo__dropdown",
					data: "titledropdown",
					repeat: { type: "gizmo__dropdown-link" }
				}
			]
		},
		content: {
			items: [
				// [TODO] Split this (content and markup)
				{
					type: "gizmo--recognitionv1__stats",
					data: "stats",
					repeat: { type: "gizmo--recognitionv1__stats-cell" }
				},
				{
					type: "list",
					data: "toplinks",
					repeat: { type: "gizmo--recognitionv1__link" }
				},
				//{ type: "gizmo--recognitionv1__row", data: "data" },
				// [TODO] Allow resource keys in "content-body" or create new partial
				{ type: "content-body", text: "<h4 class=\"gizmo__contenttitle\">Top Recognizers - Past 30 Days</h4>\n" },
				{
					type: "list",
					data: "data",
					repeat: { type: "gizmo--recognitionv1__row" }
				}
				/*{ type: "content-body", text: "<h4 class=\"gizmo__contenttitle\"> Employees Celebrating a Service Month</h4>\n" },
				{
				  type: "list",
				  data: "twocols",
				  repeat: { type: "gizmo--recognitionv1__row2cols" }
				}*/
			]
		}
	},
	promo: {
		type: "gizmo",
		subtype: "promo",
		modifier: "gizmo--promo",
		dataSourceType: "U", dataSource: "~/api/v1/promo/getPromo", // Mock service only
		id: "",
		title: "",
		image: "",
		tag: {
			data: "tag",
			type: "gizmo__tag",
			modifierBase: "gizmo__tag--"
		},
		content: {
			items: [
				{
					type: "gizmo__content-left",
					items: [
						{ type: "gizmo__info", data: "info", dateFormat: "d", rulesText: "Download Rules", rulesUrl: "#" },
						{ type: "content-body", data: "contentShort", dataKey: "text" }, // [TODO] New "data" attribute for content-body
						{ type: "content-body", data: "contentLong", dataKey: "text" }
					]
				},
				{
					type: "gizmo__content-right",
					items: [
						//{ type: "progressbar", text: "to objective", percent: 41, hideOnExpanded: "text-xlarge--gray", hideOnSmall: 1, largeText: 1 },
						{ type: "progressbar", data: "progress.percent", dataKey: "percent", hideOnExpanded: "text-xlarge--gray", hideOnSmall: 1, largeText: 1, text: "to objective", format: "0%" },
						//{ type: "stats-text--right", stat: "$62,100", label: "sold" },
						{ type: "stats-text--right", data: "progress.sold", dataKey: "stat", format: "c0", label: "sold" },
						{ type: "stats-text--right", data: "progress.toGo", dataKey: "stat", format: "c0", label: "to go" },
						{ type: "stats-text--right", data: "progress.daysLeft", dataKey: "stat", format: "n0", label: "days left" },
						{ type: "stats-text--right", data: "progress.objective", dataKey: "stat", format: "c0", label: "annual objective" }
					]
				}
			]
		}
	},
	game: {
		type: "gizmo",
		subtype: "game",
		modifier: "gizmo--promo",
		dataSourceType: "M", dataSource: "GameGizmo", // Mock service only
		id: "",
		//title: "",
		title: "Gamification", // Title (for game gizmo) moved to Structure until globalization effort
		image: "",
		tag: {
			data: "tag",
			type: "gizmo__tag",
			modifierBase: "gizmo__tag--"
		},
		content: {
			items: [
				{
					type: "token-total",
					data: "dataTotal"
				},
				{
					type: "tabs-split",
					data: "data",
					repeat: { type: "game-row", tokensLabel: "Tokens Available", image: "~/assets/img/baseline-casino-24px.svg" }
				}
			]
		}
	},
	earningsCheck: {
		type: "gizmo",
		subtype: "earningsCheck",
		modifier: "gizmo--program-earnings",
		dataSourceType: "U", dataSource: "~/api/v1/earning/getEarningsCheckGizmo", // Mock service only
		id: "",
		title: "Program Earnings - Check",
		image: "",
		// [TODO] Create a new partial/wrapper to have Earnings parent and then Check, Dollars, Points child partials?
		content: {
			items: [
				{
					type: "data-row",
					items: [
						// [TODO] "text" renamed to "value"
						// [TODO] Handle time and timezone
						{ type: "data-row__cell", data: "summary.left", valueFormat: "|dollar_format", dateFormat: "MMM d, yyyy", modifier: null, label: "Estimated next check", datePrefix: "will be sent on" },
						// [TODO] Add last check sent date?
						{ type: "data-row__cell--right", data: "summary.middle", valueFormat: "|dollar_format", modifier: null, label: "Last check" },
						{ type: "data-row__cell--right--last", data: "summary.right", valueFormat: "|dollar_format", modifier: null, label: "Total Program Earnings" }
					]
				},
				{
					type: "gizmo__actionbar",
					items: [
						{ type: "btn--expand-arrow" },
						{ type: "btn--icon-show-expanded", text: "<i class=\"material-icons\">get_app</i> DOWNLOAD STATEMENT", url: "#" },
						// [TODO] Handle variable "X days"
						{ type: "content-body", text: "<p class=\"text--gray\">Activity shown is from all promotions you have participated in over the last 60 days. <span>To see older transactions, download the full statement.</span></p>\n" }
					]
				},
				{
					type: "gizmo__table",
					data: "pending",
					//title: "Estimated Next Check",
					title: "Pages:Home:Index:Gizmo:EarningsCheck:Label:Pending",
					datePrefix: "Updated",
					dateFormat: "MMM d, yyyy",

					content: {
						type: "table--gizmo",
						table: {
							data: "pendingData",
							header: [
								{ field: "Amount", text: "Amount", modifier: "text-center", format: "c2" },
								{ field: "Description", text: "Description", modifier: "text-left" },
								{ field: "EarnedDate", text: "Date Earned", modifier: "text-right", format: "MMM d, yyyy" },
								{ field: "ExpectedPayDate", text: "Expected Available", modifier: "text-right", format: "MMM d, yyyy" }
							],
							// [3158][TODO] POC metadata - Kendo-specific attributes and format strings for grids
							header2: [
								{ field: "Amount", title: "Amount", modifier: "text-center", format: "${0:n2}", type: "number" },
								{ field: "Description", title: "Description", modifier: "text-left", type: "string" },
								{ field: "EarnedDate", title: "Date Earned", modifier: "text-right", format: "{0:MMM d, yyyy}", type: "date" },
								{ field: "ExpectedPayDate", title: "Expected Available", modifier: "text-right", format: "{0:MMM d, yyyy}", type: "date" }
							],
							// [3158][TODO] POC metadata - Better overlap with kendo metadata
							header3: [
								{ field: "Amount", col: { title: "Amount", attributes: { class: "text-center" }, format: "${0:n2}" }, schema: { type: "number" } },
								{ field: "Description", col: { title: "Description", attributes: { class: "text-left" } }, schema: { type: "string" } },
								{ field: "EarnedDate", col: { title: "Date Earned", attributes: { class: "text-right" }, format: "{0:MMM d, yyyy}" }, schema: { type: "date" } },
								{ field: "ExpectedPayDate", col: { title: "Expected Available", attributes: { class: "text-right" }, format: "{0:MMM d, yyyy}" }, schema: { type: "date" } }
							]

						}
					}
				},
				{
					type: "gizmo__table",
					//data: "paid",
					//title: "Previous Checks",
					title: "Pages:Home:Index:Gizmo:EarningsCheck:Label:Paid",
					datePrefix: "",
					//dateFormat: "MMM d, yyyy",
					dateFormat: "",

					content: {
						type: "table--gizmo",
						table: {
							data: "paidData",
							header: [
								{ field: "Amount", text: "Amount", modifier: "text-center", format: "c2" },
								{ field: "Description", text: "Description", modifier: "text-left" },
								{ field: "PaidDate", text: "Sent", modifier: "text-right", format: "MMM d, yyyy" }
							]
						}
					}
				}
			]
		}
	},
	earningsDollars: {
		type: "gizmo",
		subtype: "earningsDollars",
		modifier: "gizmo--program-earnings",
		dataSourceType: "U", dataSource: "~/api/v1/earning/getEarningsDollarsGizmo", // Mock service only
		id: "",
		title: "Program Earnings - Dollars",
		image: "",
		content: {
			items: [
				{
					type: "data-row",
					items: [
						{ type: "data-row__cell", data: "summary.left", valueFormat: "|dollar_format", label: "Your card balance", datePrefix: "as of", dateFormat: "h:mm tt, MMM d, yyyy", modifier: null },
						{ type: "data-row__cell--right", data: "summary.middle", valueFormat: "|dollar_format", label: "Pending deposits", modifier: null },
						{ type: "data-row__cell--right--last", data: "summary.right", valueFormat: "|dollar_format", label: "Total program earnings", modifier: null }
					]
				},
				{
					type: "gizmo__actionbar",
					items: [
						{ type: "btn--expand-arrow" },
						{ type: "btn--icon-show-expanded-left", text: "<i class=\"material-icons\">open_in_new</i> MANAGE CARD", url: "#" },
						{ type: "btn--icon-show-expanded", text: "<i class=\"material-icons\">get_app</i> DEPOSIT HISTORY", url: "#" },
						{ type: "content-body", text: "<p class=\"text--gray\"><span>Activity shown is from all promotions you have participated in over the last 60 days. To see older transactions, download the deposit history or visit the card management site.<br /><br /></span> Pending deposits are earnings that have been sent to the card processor, but are not yet available to spend.</p>\n" }
					]
				},
				{
					type: "gizmo__table",
					data: "pending",
					//title: "Pending Deposits",
					title: "Pages:Home:Index:Gizmo:EarningsDollars:Label:Pending",
					datePrefix: "Updated",
					//dateFormat: "MMM d, yyyy",
					dateFormat: "d",

					content: {
						type: "table--gizmo",
						table: {
							data: "pendingData",
							header: [
								//{ field: "Amount", text: "Amount", modifier: "text-left", format: "$#,##0.00" },
								{ field: "Amount", text: "Amount", modifier: "text-left", format: "c2" },
								{ field: "Description", text: "Description", modifier: "text-left" },
								//{ field: "EarnedDate", text: "Date Earned", modifier: "text-right", format: "MMM d, yyyy" },
								{ field: "EarnedDate", text: "Date Earned", modifier: "text-right", format: "d" },
								//{ field: "ExpectedPayDate", text: "Expected Available", modifier: "text-right", format: "MMM d, yyyy" }
								{ field: "ExpectedPayDate", text: "Expected Available", modifier: "text-right", format: "d" }
							]
						}
					}
				},
				{
					type: "gizmo__table",
					//title: "Posted Deposits",
					title: "Pages:Home:Index:Gizmo:EarningsDollars:Label:Paid",
					//datePrefix: "Updated",
					//dateFormat: "MMM d, yyyy",

					content: {
						type: "table--gizmo",
						table: {
							data: "paidData",
							header: [
								//{ field: "Amount", text: "Amount", modifier: "text-left", format: "$#,##0.00" },
								{ field: "Amount", text: "Amount", modifier: "text-left", format: "c2" },
								{ field: "Description", text: "Description", modifier: "text-left" },
								//{ field: "PaidDate", text: "Date Deposited", modifier: "text-right", format: "MMM d, yyyy" }
								{ field: "PaidDate", text: "Date Deposited", modifier: "text-right", format: "d" }
							]
						}
					}
				}
			]
		}
	},
	earningsPoints: {
		type: "gizmo",
		subtype: "earningsPoints",
		modifier: "gizmo--program-earnings",
		dataSourceType: "U", dataSource: "~/api/v1/earning/getEarningsPointsGizmo", // Mock service only
		id: "",
		title: "Program Earnings - Points",
		image: "",
		content: {
			items: [
				{
					type: "data-row",
					items: [
						{ type: "data-row__cell", data: "summary.left", valueFormat: "n0", label: "Available Points", datePrefix: "as of", dateFormat: "MMM d, yyyy", timeFormat: "h:mm tt", TimeZoneCode: "EST", modifier: null } 
					]
				},
				{
					type: "gizmo__actionbar",
					items: [
						{ type: "btn--expand-arrow" },
						//{ type: "btn--bubble", text: "<i class=\"material-icons\">open_in_new</i> Go to Catalog", url: "~/pointbank/RedirectToeCatalog" },
						{ type: "btn--bubble", text: "Pages:Home:Index:Gizmo:EarningsPoints:GoToCatalog:Copy", url: "Pages:Home:Index:Gizmo:EarningsPoints:GoToCatalog:Url" },
						//{ type: "btn--icon-show-expanded", text: "<i class=\"material-icons\">get_app</i> DOWNLOAD STATEMENT", url: "#" },
						{ type: "btn--icon-show-expanded", text: "Pages:Home:Index:Gizmo:EarningsPoints:Label:DownloadStatement", url: "Pages:Home:Index:Gizmo:EarningsPoints:Label:DownloadStatement:Url" },
						{ type: "content-body", text: "<p class=\"text--gray\">Activity shown is from all promotions you have participated in over the last 60 days. <span>To see older transactions, download the full statement.</span></p>\n" }
					]
				},
				{
					type: "gizmo__table",
					data: "transactions",
					//title: "Recent Transactions",
					title: "Pages:Home:Index:Gizmo:EarningsPoints:Label:Paid",
					datePrefix: "Updated",
					dateFormat: "d",

					content: {
						type: "table--gizmo",
						table: {
							data: "transactionData",
							header: [
								// [TODO] New "valueSuffix"? Or put in format?
								{ field: "Amount", text: "Amount", modifier: "text-left" },
								{ field: "Description", text: "Description", modifier: "text-left" },
								{ field: "TransactionType", text: "Type", modifier: "text-left" },
								{ field: "TransactionDate", text: "Date", modifier: "text-right", format: "MM/dd/yy" }
							]
						}
					}
				}
			]
		}
	},
	announcements: {
		type: "gizmo",
		subtype: "announcements",
		modifier: "gizmo--announcements",
		dataSourceType: "U", dataSource: "~/api/v1/cms/getAnnouncements", // Mock service only
		id: "",
		title: "Announcements",
		image: "",
		content: {
			//data: "data",
			//repeat: { type: "desc-row" }
			items: [
				{
					type: "list",
					data: "data",
					repeat: { type: "desc-row" }
				}
			]
		}
	},
	leaderboard: {
		type: "gizmo",
		subtype: "leaderboard",
		modifier: "gizmo--leaderboard",
		dataSourceType: "U", dataSource: "~/api/v1/bi/getLeaderboard", // Mock service only
		id: "",
		title: "Leaderboard",
		image: "",
		content: {
			items: [
				{
					type: "tabs-split",
					data: "data",
					repeat: { type: "leaderboard-row", valueFormat: "n0" }
				}
			]
		}
	},
	messages: {
		type: "gizmo",
		subtype: "messages",
		modifier: "gizmo--messages",
		dataSourceType: "U", dataSource: "~/api/v1/comms/getMessages", // Mock service only
		id: "",
		title: "Messages",
		image: "",
		content: {
			items: [
				//{ type: "mail-row", date: "today", subject: "Subject line of most recent unread message", text: "One or two-line preview of the message. Will be truncated after the first n number of char...", url: "#", id: 1234 },
				{
					type: "list",
					data: "data",
					repeat: { type: "mail-row", baseUrl: "#" }
				},

				{ type: "link", text: "VIEW ALL UNREAD MESSAGES", url: "#", modifier: "gizmo--messages__view-all" }
			],
			noitems: "You have no unread messages"
		}
	}
	//recognition: {
	//  type: "gizmo",
	//  subtype: "recognition",
	//  modifier: "gizmo--employee-recognition",
	//  id: "",
	//  title: "Employee Recognition",
	//  image: "",
	//  content: {
	//    items: [
	//      // [TODO] Split this (content and markup)
	//      { type: "content-body", text: "<h4 class=\"gizmo__contenttitle\">RECENT RECOGNITION</h4>\n" },

	//      {
	//        type: "list",
	//        data: "data",
	//        repeat: { type: "employee-row" }
	//      },
	//      //{ type: "employee-row", name: "David James", profileImage: "~/assets/img/profile-img/david-james.png", title: "Innovation", comment: "Great job introducing the new sales presentation format today!" },
	//      // ...

	//      { type: "employee-row--more", name: "<a class=\"see-more\" href=\"#\">See More</a>", profileImage: "", title: "", comment: "" },

	//      // [TODO] Split this: content & markup + title & content
	//      { type: "content-body", text: "<h4 class=\"gizmo__contenttitle\">GIVE SOMEONE A PAT ON THE BACK</h4>\n<p>Quickly recognize your colleagues for living the Our Company mission:</p>\n" },
	//      { type: "forms--input", text: "What else would you like to say? (optional)" },
	//      //{ type: "forms--search", text: "Who did a great job?" },
	//      {
	//        type: "icon-row",
	//        items: [
	//          { image: "~/assets/img/employee-rec-icon/innovation.png", title: "Innovation", type: "btn--icon-large", url: "#" },
	//          { image: "~/assets/img/employee-rec-icon/communication.png", title: "Communication", type: "btn--icon-large", url: "#" },
	//          { image: "~/assets/img/employee-rec-icon/superior-service.png", title: "Superior Service", type: "btn--icon-large", url: "#" },
	//          { image: "~/assets/img/employee-rec-icon/teamwork.png", title: "Teamwork", type: "btn--icon-large", url: "#" }
	//        ]
	//      },
	//      { type: "forms--input", text: "What else would you like to say? (optional)" },
	//      { type: "btn--bubble", text: "Send It!", url: "#" }
	//    ]
	//  }
	//}
};
