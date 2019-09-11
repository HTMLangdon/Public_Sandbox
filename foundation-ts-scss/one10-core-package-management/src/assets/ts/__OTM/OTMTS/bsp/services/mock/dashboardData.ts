import { WsGizmo, WsGizmoData } from '../models/dashboardModels';
import { KeyValueCollection } from 'cp/util';

// Data used for merging
export var GizmoData: WsGizmoData[] = [
	{
		gizmoId: 12,
		id: "general",
		refKey: 1,
		subtype: "general",
		contentShort: "<p>Lorem ipsum dolor sit amet, <strong>consectetur</strong> adipiscing elit.</p>\n"
	},
	{
		gizmoId: 11,
		id: "claims",
		subtype: "claims",
		title: "Claims",
		contentShort:
			"<p class=\"gizmo__hide-on-expanded\">Check the Incentive's Promotion Detail for eligibility rules and then click the button below to submit your sales claims — it's that easy! Claims must be submitted within 60 days of the customer sales date, so don't delay!</p>\n",
		claimlink: {
			url: "~/claim/SubmittedClaimReport",
			text: "CLAIM DETAILS",
			modifier: "float-right"
		},
		claimbtn: {
			url: "#",
			text: "Submit Claim"
		},
		claimData: [
			{ ClaimDate: new Date("2019-04-31"), CustomerName: "Alison", Status: "Pending Audit" },
			{ ClaimDate: new Date("2019-04-29"), CustomerName: "Alison", Status: "Pending Audit" },
			{ ClaimDate: new Date("2019-04-28"), CustomerName: "Alison", Status: "Pending Audit" }
		]
	},
	{
		gizmoId: 7,
		id: "promo2",
		subtype: "promo",
		title: "Spring Sales Event",
		image: "~/assets/img/card-headers/spring-sales.jpg",
		contentShort:
			"<p class=\"gizmo__hide-on-expanded\">The Spring Sales Event is on! Earn reward points for every custom wheel sold this quarter. The more you sell, the more you earn.</p>\n",
		contentLong:
			"<h4 class=\"gizmo__contenttitle\">Eligibility</h4>\n<ul>\n  <li>Parts Counter Representatives at all US dealerships</li>\n  <li>Service Managers at all US dealerships</li>\n  <li>Participants must read and accept the <a href=\"#\" title=\"Click for Terms and Conditions\">Terms and Conditions</a> to be eligible for rewards.</li>\n</ul>\n<h4 class=\"gizmo__contenttitle\">Enrollment</h4>\n<p>All participants must be enrolled via the program website and in good standing to earn rewards.</p>\n<h4 class=\"gizmo__contenttitle\">Accessing Your Points and Ordering Rewards</h4>\n<ul>\n  <li>All earned points will be deposited into your Point Bank Account no later than July 15, 2018.</li>\n  <li>Points are not transferable.</li>\n  <li>Points are redeemable for merchandise and gift cards via the online catalog of awards.</li>\n  <li>All orders are shipped to the address you specify. Estimated shipping information will be provided at the time of your order. Electronic gift card orders will be fulfilled within roughly one hour of receiving your order.</li>\n  <li>Returns - Please contact Reward Headquarters within 30 days of receipt of your order, should you wish to return an item. Gift cards cannot be returned, so please make your selection carefully.</li>\n</ul>\n<h4 class=\"gizmo__contenttitle\">Have Questions?</h4>\n<p class=\"no-btm-space\">Contact Customer Service by phone or email.</p>\n<ul class=\"contact-list\">\n  <li><span class=\"bold\">Phone</span> - <a href=\"tel:+18008968946\" title=\"Click to Call\">800-896-8946</a>, M-F, 8am - 5pm Eastern Time</li>\n  <li><span class=\"bold\">Email</span> - <a href=\"mailto:RewardHeadquarters@one10marketing.com\" title=\"Click to Email Us Directly\">Rewardheadquarters@one10marketing.com</a></li>\n</ul>\n",
		tag: {
			tagType: "new", // Translates to modifier/class "gizmo__tag--new"
			image: "~/assets/img/badge-new.png"
		},
		info: {
			datePrefix: "Ends",
			date: new Date("2019-06-30")
		},
		progress: {
			//visible: true,
			percent: 0.41,
			sold: 62100,
			toGo: 87900,
			daysLeft: 243,
			objective: 150000
		}
	},
	{
		gizmoId: 4,
		id: "earningsPoints",
		subtype: "earningsPoints",
		resources: [
			{ Key: "Pages:Home:Index:Gizmo:EarningsPoints:Label:Title", Content: "Program - Earnings - Points" },
			{ Key: "Pages:Home:Index:Gizmo:EarningsPoints:Label:Paid", Content: "Recent - Transactions" },
			{ Key: "Pages:Home:Index:Gizmo:EarningsPoints:GoToCatalog:Copy", Content: "<i class=\"material-icons\">open_in_new</i> Go to Catalog" },
			{ Key: "Pages:Home:Index:Gizmo:EarningsPoints:GoToCatalog:Url", Content: "~/catalog/RedirectToECatalog" }
		],
		summary: {
			left: { value: 10099, date: new Date("2002-05-01T19:59:00"), TimeZoneCode: "EST" }
			// No middle or right for points
		},
		transactions: {
			date: new Date("1999-01-02") 
		},
		transactionData: [
			{ Amount: -50, TransactionDate: new Date("2019-03-03"), TransactionType: "Redemption", Description: "Order# B00023452" },
			{ Amount: 3000, TransactionDate: new Date("2019-02-05"), TransactionType: "Deposit", Description: "Holiday Sales Spectacular" },
			{ Amount: -250, TransactionDate: new Date("2019-01-20"), TransactionType: "Redemption", Description: "Order# B00345288" }
		]
	},
	{
		gizmoId: 5,
		id: "announcements1",
		subtype: "announcements",
		data: [
			//{ title: "Service Works!", text: "Access your learning and sustainment content by going to the Service Works Application", image: "~/assets/img/announcements/crowd.png" },
			{ title: "Learning", text: "Access your eligible learning and sustainment content.", image: "~/assets/img/announcements/crowd.png" },
			{ title: "Webinar Now Available", text: "If you were not able to participate this month's webinar live, the recording is now available for download.", image: null },
			{ title: "Service Anniversary", text: "Congratulate Dorothy Howard on her 5th year with Our Company.", image: "~/assets/img/announcements/dorthy.png" },
			{ title: "New Items Added to Rewards Catalog", text: "Points burning a hole in your pocket? New merchandise is added to the Rewards Catalog every week. Come see what's new.", image: "~/assets/img/announcements/headphones.png" },
			{ title: "Spring Sales Event deadline approaching", text: "The Spring Sales promotion ends on 4/30/18. Don't forget to submit your claims.", image: null }
		]
	},
	{
		gizmoId: 7,
		id: "promo5",
		subtype: "promo",
		title: "2019 Achiever's Club: Magical Maui",
		image: "~/assets/img/card-headers/maui.jpg",
		contentShort: "<p class=\"gizmo__hide-on-expanded\">Achieve and exceed your 2019 objectives and you can earn your ticket to paradise!</p><div class=\"progressbar gizmo__hide-on-expanded text-right\"><span class=\"text--medium--gray \">41%</span><div class=\"gizmo__progress\" role=\"progressbar\" tabindex=\"0\" aria-valuenow=\"41%\" aria-valuemin=\"0\" aria-valuetext=\"41%\" aria-valuemax=\"1\"><div class=\"gizmo__progress-meter\" style=\"width: 41%;\"></div></div></div>\n",
		contentLong: "\n<p>Membership in the Achiever's Club is reserved for the best-of-the-best in Our Company's sales organization. It's designed to recognize those sales representatives who have achieved the highest level of sales excellence. Your sales performance over the next 12 months will determine if you become a member of this elite group. The top performers in each region, based on percent attainment of annual sales objectives, will earn membership in the Achiever's Club and a trip for two to this year's extraordinary destination - Maui, Hawaii.</p><h4 class=\"gizmo__contenttitle\">PICTURE YOURSELF IN PARADISE</h4>\n<p>Green valleys, lush mountains and pristine beaches set the stage for the 2019 Achiever's Club in Magical Maui. Here, you and your guest can spend your days soaring above the majestic Haleakala Crater on a helicopter tour of this natural wonder, or sailing across sparkling blue waters for an enchanting afternoon of snorkeling at Molokini Reef. There's also deep-sea fishing, or strolling the verdant fairways of Maui's premier links, or simply relaxing on a sun-drenched beach. Whatever your pleasures, you're sure to be able to indulge them in this tranquil paradise.</p><h4 class=\"gizmo__contenttitle\">PROMOTION DATES</h4>\n<p>January 1 - December 31, 2019</p><h4 class=\"gizmo__contenttitle\">Eligibility</h4>\n<ul>\n<li>All eligible participants are assigned an annual performance objective for the program</li>\n  <li>Participants are ranked based on their percent achievement of their assigned objective</li>\n<li>The top participants in each region will earn membership to the Achiever's Club and an all-expense-paid trip for two to Maui</li><ul><li>Each region is assigned a set number of membership seats</li><li>The number of winners in each region cannot exceed number of seats assigned</li><li>In the case of a tie, the participant with the highest overall sales volume will prevail</li><li>Winning participants must achieve a minimum of 100% of their assigned program objective to be eligible</li></ul>\n</ul>\n",
		info: {
			datePrefix: "Ends",
			date: new Date("2019-12-31T12:34:56")
		},
		progress: {
			percent: 0.41,
			sold: 62100,
			toGo: 87900,
			daysLeft: 243,
			objective: 150000
		}
	},
	{
		gizmoId: 6,
		id: "leaderboard1",
		subtype: "leaderboard",
		data: [
			//{ image: "~/assets/img/leader-board-profile/leaderboard-Tom-Brenton.jpg", position: 15, name: "Tom Benton", points: 1450 },
			{ image: "~/assets/img/leader-board-profile/leaderboard-Jessica-Thompson.jpg", position: 1, name: "Jessica Thompson", points: 8340 },
			{ image: "~/assets/img/leader-board-profile/leaderboard-anonymous.png", position: 2, name: "Anonymous", points: 3390 },
			{ image: "~/assets/img/leader-board-profile/leaderboard-Scott-Wells.jpg", position: 3, name: "Scott Wells", points: 3305 },
			{ image: "~/assets/img/leader-board-profile/leaderboard-Jacqueline-Mendoza.jpg", position: 4, name: "Jacqueline Mendoza", points: 3250 },
			{ image: "~/assets/img/leader-board-profile/leaderboard-John-Weaver.jpg", position: 5, name: "John Weaver", points: 3215 }
		]
	},
	{
		gizmoId: 2,
		id: "recognitionv1",
		subtype: "recognitionv1",
		title: "Recognition", // [TODO] Move to resources (but need to do for ALL gizmos)
		titledropdown: [
			{ text: "Peer-to-Peer Customer Service", url: "#", modifier: "gizmo__dropdown-link" },
			{ text: "Recognition Drafts", url: "#", modifier: "gizmo__dropdown-link--border" },
			{ text: "Assign Proxy", url: "#", modifier: "gizmo__dropdown-link" },
			{ text: "Distribution Lists", url: "#", modifier: "gizmo__dropdown-link" },
			{ text: "Recognition Approval", url: "#", modifier: "gizmo__dropdown-link" },
			{ text: "Employee of the Month", url: "#", modifier: "gizmo__dropdown-link" }
		],
		stats: [
			{ number: "0", label: "Issued Today" },
			{ number: "182", label: "By Employees" },
			{ number: "530", label: "By Managers" }
		],
		data: [
			{ icon: "person", rank: "1", name: "Robert Brown", amount: "7" }, // [TODO] Convert amount to actual number and add format
			{ icon: "person", rank: "2", name: "Jacqueline Mendoza", amount: "4" },
			{ icon: "person", rank: "3", name: "Scott Wells", amount: "3" },
			{ icon: "person", rank: "4", name: "Jessica Thompson", amount: "1" }
		],
		toplinks: [
			// [TODO] Move link text to resources or data
			{ type: "link", text: "Manager Recognition", url: "#", modifier: "gizmo--recognitionv1__link" },
			{ type: "link", text: "Test Promotion", url: "#", modifier: "gizmo--recognitionv1__link" }
		],
		twocols: [
			{ label: "This Month", number: "0", index: 0 }, // [TODO] Convert number to actual number and add format
			{ label: "Combined Years of Experience", number: "0", index: 1 } // [TODO] Convert number to actual number and add format
		]
	},
	{
		gizmoId: 7,
		id: "promo1",
		subtype: "promo",
		title: "Make Every Second Count",
		image: "~/assets/img/card-headers/every-second.jpg",
		//contentShort: "<p class=\"gizmo__hide-on-expanded\">Time is precious. And so are the rewards, when you focus on selling our 2019 line of luxury timepieces.</p>\n",
		contentShort: "<p class=\"gizmo__hide-on-expanded\">Time is precious. And so are the rewards, when you focus on selling our 2019 line of luxury timepieces.</p>\n<p class=\"gizmo__hide-on-expanded\"><img src=\"~/assets/img/arrow-tiers-3.png\" /></p>\n",
		contentLong: "<h4 class=\"gizmo__contenttitle\">Eligibility</h4>\n<ul>\n  <li>Retail Sales Consultants located in the US</li>\n  <li>Store Managers located in the US</li>\n  <li>Participants must read and accept the <a href=\"#\" title=\"Click for Terms and Conditions\">Terms and Conditions</a> to be eligible for rewards</li>\n</ul>\n\n<h4 class=\"gizmo__contenttitle\">Enrollment</h4>\n<p>All participants must be enrolled via the program website and in good standing to earn rewards.</p>\n\n<h4 class=\"gizmo__contenttitle\">Accessing Your Points and Ordering Rewards</h4>\n<ul>\n  <li>All earned points will be deposited into your Point Bank Account no later than April 15, 2019.</li>\n  <li>Points are not transferable.</li>\n  <li>Points are redeemable for merchandise and gift cards via the online catalog of awards.</li>\n  <li>All orders are shipped to the address you specify. Estimated shipping information will be provided at the time of your order. Electronic gift card orders will be fulfilled within roughly one hour of receiving your order.</li>\n  <li>Returns - Please contact Reward Headquarters within 30 days of receipt of your order, should you wish to return an item. Gift cards cannot be returned, so please make your selection carefully.</li>\n</ul>\n\n<h4 class=\"gizmo__contenttitle\">Have Questions?</h4>\n<p class=\"no-btm-space\">Contact Customer Service by phone or email.</p>\n<ul class=\"contact-list\">\n  <li><span class=\"bold\">Phone</span> - <a href=\"tel:+18008968946\" title=\"Click to Call\">800-896-8946</a>, M-F, 8am - 5pm Eastern Time</li>\n  <li><span class=\"bold\">Email</span> - <a href=\"mailto:RewardHeadquarters@one10marketing.com\" title=\"Click to Email Us Directly\">Rewardheadquarters@one10marketing.com</a></li>\n</ul>\n",
		info: {
			datePrefix: "Ends",
			date: new Date("2019-12-31")
		},
		progress: {
			percent: 0.41,
			sold: 62100,
			toGo: 87900,
			daysLeft: 243,
			objective: 150000
		}
	},
	{
		gizmoId: 8,
		type: "gizmo",
		//id: "game",
		id: "game1",
		subtype: "game"
		// Initial data replaced with a real service call. The gizmo does need to exist in the Gizmo_Data collection so that the page knows to load it, but the object can be mostly empty.

		//title: "Gamification",
		//dataTotal: {
		//  value: "14", //TSA [Review] Change this to 0
		//  label: "Tokens Available"
		//},
		//data: [],
		//content: {
		//  /*items: [{
		//    //type: "token-total",
		//    text: "14",
		//    label: "Tokens Available"
		//  },
		//  {
		//    //type: "tabs-split",
		//    items: [{
		//      //type: "game-row",
		//      image: "/assets/img/baseline-casino-24px.svg",
		//      gameurl: "#",
		//      name: "WhrilWin Demo",
		//      //tokenslabel: "Tokens Available",
		//      tokens: 3
		//    }, {
		//      //type: "game-row",
		//      image: "/assets/img/baseline-casino-24px.svg",
		//      gameurl: "#",
		//      name: "ITCHIN' to WIN",
		//      //tokenslabel: "Tokens Available",
		//      tokens: 8
		//    }, {
		//      //type: "game-row",
		//      image: "/assets/img/baseline-casino-24px.svg",
		//      gameurl: "#",
		//      name: "IN IT to WIN IT",
		//      //tokenslabel: "Tokens Available",
		//      tokens: 3
		//    }]
		//  }]*/
		//}
	},
	{
		gizmoId: 1,
		id: "recognitionFeed",
		subtype: "recognitionFeed",
		title: "Recognition Feed",
		titledropdown: [
			{
				text: "Sent Recognitions",
				url: "#",
				modifier: "gizmo__dropdown-link"
			},
			{
				text: "Received Recognitions",
				url: "#",
				modifier: "gizmo__dropdown-link--border"
			},
			{
				text: "Success Stories",
				url: "#",
				modifier: "gizmo__dropdown-link"
			},
			{
				text: "Peer-to-Peer Launch",
				url: "#",
				modifier: "gizmo__dropdown-link"
			},
			{
				text: "Sales Content Winners",
				url: "#",
				modifier: "gizmo__dropdown-link"
			}
		],
		tab1title: "All",
		tab2title: "Me",
		panel1: [
			{
				recognitionReceiverId: 1234,
				profileImage: "~/assets/img/profile-img/david-james.png",
				toname: "David James",
				fromname: "Sara Alexander",
				title: "Innovation",
				comment: "Great job introducing the new sales presentation format today!",
				likeurl: "#",
				likecount: 3,
				likes: [
					{
						type: "recognition-row--like",
						LikerProfileImage: "/assets/img/leader-board-profile/leaderboard-anonymous.png",
						LikerName: "John Doe",
						AddedDate: "12/12/18"
					},
					{
						type: "recognition-row--like",
						LikerProfileImage: "/assets/img/leader-board-profile/leaderboard-anonymous.png",
						LikerName: "John Doe",
						AddedDate: "12/12/18"
					},
					{
						type: "recognition-row--like",
						LikerProfileImage: "/assets/img/leader-board-profile/leaderboard-anonymous.png",
						LikerName: "John Doe",
						date: "12/12/18"
					}
				],
				commenturl: "#",
				commentcount: 2,
				comments: [
					{
						type: "recognition-row--likecomment",
						Img: "/assets/img/leader-board-profile/leaderboard-anonymous.png",
						Commenter: "John Doe",
						Comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut tincidunt velit. Phasellus sodales tellus sed orci pellentesque, a scelerisque neque vulputate.",
						AddedDate: "12/12/18"
					},
					{
						type: "recognition-row--likecomment",
						Img: "/assets/img/leader-board-profile/leaderboard-anonymous.png",
						Commenter: "John Doe",
						Comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ut tincidunt velit. Phasellus sodales tellus sed orci pellentesque, a scelerisque neque vulputate.",
						AddedDate: "12/12/18"
					}
				],
				daysago: 2
			},
			{
				recognitionReceiverId: 1234,
				profileImage: "~/assets/img/profile-img/sara-alexander.png",
				toname: "Sara Alexander",
				fromname: "Sean Lee",
				title: "Superior Service",
				comment: "You did a killer job on the learning modules!",
				likeurl: "#",
				likecount: 0,
				commenturl: "#",
				commentcount: 0,
				daysago: 2
			},
			{
				recognitionReceiverId: 1234,
				profileImage: "~/assets/img/profile-img/sean-lee.png",
				toname: "Sean Lee",
				fromname: "David James",
				title: "Teamwork",
				comment: "Thanks for bringing those girl scout cookies to the planning meeting, Sean.",
				likeurl: "#",
				likecount: 0,
				commenturl: "#",
				commentcount: 0,
				daysago: 2
			}
		],
		panel2: [
			{
				icon: "tag_faces",
				fromname: "Sara Alexander",
				title: "Superior Service",
				comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				likeurl: "#",
				likecount: 1,
				commenturl: "#",
				commentcount: 0,
				daysago: 2
			},
			{
				icon: "tag_faces",
				fromname: "Sean Lee",
				title: "Teamwork",
				comment: "Sed justo neque, porta ut metus a, dictum pulvinar neque.",
				likeurl: "#",
				likecount: 1,
				commenturl: "#",
				commentcount: 0,
				daysago: 2
			},
			{
				icon: "tag_faces",
				fromname: "David James",
				title: "Innovation",
				comment: "Mauris semper nibh at libero tempus malesuada.",
				likeurl: "#",
				likecount: 1,
				commenturl: "#",
				commentcount: 0,
				daysago: 2
			}
		]
	},
	{
		gizmoId: 7,
		id: "promo4",
		subtype: "promo",
		title: "Pump Up the Volume!",
		image: "~/assets/img/card-headers/pump-up-volume.jpg",
		contentShort: "<p class=\"gizmo__hide-on-expanded\">Claim your sales of our top-rated products - and claim your share of fantastic merchandise and gift cards in our catalog of rewards.\n<br>\n<br>\nTop achievers earn 5000 bonus points!</p>\n",
		contentLong: "<span class=\"text-medium--gray--bold gizmo__hide-on-expanded\">1,200 <span style=\"font-size: 12px\">points earned</span></span>                  \n<h4 class=\"gizmo__contenttitle\">Eligibility</h4>\n<ul>\n  <li>Reseller and dealer sales reps located in the US</li>\n  <li>Reseller and dealer sales managers located in the US</li>\n</ul>\n<h4 class=\"gizmo__contenttitle\">Enrollment</h4>\n<p>All participants must be enrolled via the program website and in good standing to earn rewards.</p>\n<h4 class=\"gizmo__contenttitle\">How to Claim Your Sales</h4>\n<p>All claims require proof of sale to be awarded, and sales must be claimed within 60 days of the customer invoice to earn points. Have an image or PDF of your customer invoice available, then go to the Sales Claim Tool to get started.</p>\n<p>Please allow two business days for your claim to be processed and for points to be deposited to your account. Note that all sales claims are subject to audit as outlined below.</p>\n<h4 class=\"gizmo__contenttitle\">Audit Process</h4>\n<p>All sales claims are subject to random audit. If your claim is selected for audit, you may be contacted to provide additional sales information, and your point award will be considered pending during the audit process. Please note that point deposits for claims selected for audit may require an additional 2-5 business days to complete; therefore, if you submit multiple claims on the same day, it is possible that points may be issued on different dates.</p>\n<h4 class=\"gizmo__contenttitle\">Have Questions?</h4>\n<p class=\"no-btm-space\">Contact Customer Service by phone or email.</p>\n<ul class=\"contact-list\">\n  <li><span class=\"bold\">Phone</span> - <a href=\"tel:+18008968946\" title=\"Click to Call\">800-896-8946</a>, M-F, 8am - 5pm Eastern Time</li>\n  <li><span class=\"bold\">Email</span> - <a href=\"mailto:RewardHeadquarters@one10marketing.com\" title=\"Click to Email Us Directly\">Rewardheadquarters@one10marketing.com</a></li>\n</ul>\n",
		info: {
			datePrefix: "Ends",
			date: new Date("2019-12-31")
		},
		progress: {
			percent: 0.41,
			sold: 62100,
			toGo: 87900,
			daysLeft: 243,
			objective: 150000
		}
	},
	{
		gizmoId: 9,
		id: "earningsDollars",
		subtype: "earningsDollars",
		resources: [
			{ Key: "Pages:Home:Index:Gizmo:EarningsDollars:Title", Content: "Program Earnings - Dollars" },
			{ Key: "Pages:Home:Index:Gizmo:EarningsDollars:Label:Pending", Content: "Pending Deposits" },
			{ Key: "Pages:Home:Index:Gizmo:EarningsDollars:Label:Paid", Content: "Posted Deposits" }
		],
		summary: {
			left: { value: 2503.27, date: new Date("2019-05-01T14:34:00") },
			middle: { value: 1500 },
			right: { value: 4507.52 }
		},
		pending: {
			date: new Date("2019-01-06")
		},
		pendingData: [
			{ Amount: 1000, EarnedDate: new Date("2019-04-31"), ExpectedPayDate: new Date("2019-05-14"), Description: "Earning – Winter Holiday Sales Spectacular" },
			{ Amount: 500, EarnedDate: new Date("2019-03-05"), ExpectedPayDate: new Date("2019-03-14"), Description: "Earning – Long Title of Last Year's Big Q4 Promotion" },
			{ Amount: -25, EarnedDate: new Date("2019-02-05"), ExpectedPayDate: new Date("2019-02-14"), Description: "Adjustment – Cancelled contract Winter Sales Spectacular" }
		],
		//paid: {
		//},
		paidData: [
			{ Amount: 1100, PaidDate: new Date("2018-01-07"), Description: "December 2018 earnings" },
			{ Amount: 1000, PaidDate: new Date("2018-12-14"), Description: "November 2018 earnings" },
			{ Amount: 900, PaidDate: new Date("2019-01-14"), Description: "Q1 2019 earnings" },
			{ Amount: 2121.12, PaidDate: new Date("2019-02-21"), Description: "Q1 2019 earnings" },
			{ Amount: 1050, PaidDate: new Date("2019-04-14"), Description: "Q2 2019 earnings" }
		]
	},
	{
		gizmoId: 7,
		id: "promo3",
		subtype: "promo",
		title: "Quest 4 Success",
		image: "~/assets/img/card-headers/quest-success.jpg",
		contentShort: "<p class=\"gizmo__hide-on-expanded\">Q1 has never meant more!  Blast past your quarterly goal and choose from thousands of fantastic rewards!</p>\n",
		contentLong: "<h4 class=\"gizmo__contenttitle\">Eligibility</h4>\n<ul>\n  <li>Reseller and dealer sales reps located in the US</li>\n  <li>Participants must read and accept the <a href=\"#\" title=\"Click for Terms and Conditions\">Terms and Conditions</a> to be eligible for rewards</li>\n</ul>\n<h4 class=\"gizmo__contenttitle\">Enrollment</h4>\n<p>All participants must be enrolled via the program website and in good standing to earn rewards.</p>\n<h4 class=\"gizmo__contenttitle\">Accessing Your Points and Ordering Rewards</h4>\n<ul>\n  <li>All earned points will be deposited into your Point Bank Account no later than January 15, 2019.</li>\n  <li>Points are not transferable.</li>\n  <li>Points are redeemable for merchandise and gift cards via the online catalog of awards.</li>\n  <li>All orders are shipped to the address you specify. Estimated shipping information will be provided at the time of your order. Electronic gift card orders will be fulfilled within roughly one hour of receiving your order.</li>\n  <li>Returns - Please contact Reward Headquarters within 30 days of receipt of your order, should you wish to return an item. Gift cards cannot be returned, so please make your selection carefully.</li>\n</ul>\n<h4 class=\"gizmo__contenttitle\">Have Questions?</h4>\n<p class=\"no-btm-space\">Contact Customer Service by phone or email.</p>\n<ul class=\"contact-list\">\n  <li><span class=\"bold\">Phone</span> - <a href=\"tel:+18008968946\" title=\"Click to Call\">800-896-8946</a>, M-F, 8am - 5pm Eastern Time</li>\n  <li><span class=\"bold\">Email</span> - <a href=\"mailto:RewardHeadquarters@one10marketing.com\" title=\"Click to Email Us Directly\">Rewardheadquarters@one10marketing.com</a></li>\n</ul>\n",
		tag: {
			tagType: "coming-soon", // translates to modifier/class "gizmo__tag--coming-soon"
			image: "~/assets/img/comingsoon.png"
		},
		info: {
			datePrefix: "Begins",
			date: new Date("2019-01-01")
		}
		// No progress bad for future promo
	}
	/*{
	  gizmoId: 3,
	  id: "earningsCheck",
	  subtype: "earningsCheck",
	  resources: [
		{ Key: "Pages:Home:Index:Gizmo:EarningsCheck:Title", Content: "Program Earnings - Check" },
		{ Key: "Pages:Home:Index:Gizmo:EarningsCheck:Label:Pending", Content: "Estimated Next Check" },
		{ Key: "Pages:Home:Index:Gizmo:EarningsCheck:Label:Paid", Content: "Previous Checks" }
	  ],
	  summary: {
		left: { value: 250, date: new Date("2019-02-07") },
		middle: { value: 2001.58 },
		right: { value: 4507.52 }
  
	  },
	  pending: {
		date: new Date("2019-01-06")
	  },
	  pendingData: [
		// [TODO] Get from common mock service. Can't do yet because all data for all gizmos obtained in one call (for now). Make sure changes here are reflected in the mock service data below
		{ TransactionId: 111, Amount: -25, EarnedDate: new Date("2019-02-02"), ExpectedPayDate: new Date("2019-01-14"), Description: "Adjustment – Cancelled contract Winter Sales Spectacular" },
		{ TransactionId: 110, Amount: 200, EarnedDate: new Date("2019-01-05"), ExpectedPayDate: new Date("2019-01-14"), Description: "Earning – Long Title of Last Year's Big Q4 Promotion" },
		{ TransactionId: 109, Amount: 75, EarnedDate: new Date("2018-12-31"), ExpectedPayDate: new Date("2019-01-14"), Description: "Earning – Winter Holiday Sales Spectacular" }
	  ],
	  paid: {
		// No date
	  },
	  paidData: [
		// [TODO] Consider splitting check # and description
		{ Amount: 123.44, PaidDate: new Date("2019-01-07"), Description: "Check #2054 – Dec 2018 earnings" },
		{ Amount: 234.56, PaidDate: new Date("2018-12-14"), Description: "Check #2023 – Nov 2018 earnings" },
		{ Amount: 101.23, PaidDate: new Date("2018-11-14"), Description: "Check #2020 – Oct 2018 earnings" },
		{ Amount: 321.01, PaidDate: new Date("2018-10-21"), Description: "Check #2012 – Q2 2018 earnings" },
		{ Amount: 98.76, PaidDate: new Date("2018-10-14"), Description: "Check #2002 – Sep 2018 earnings" }
	  ]
	},*/


	/*{
	  gizmoId: 999,
	  id: "recognition1",
	  subtype: "recognition",
	  data: [
		{ name: "David James", profileImage: "~/assets/img/profile-img/david-james.png", title: "Innovation", comment: "Great job introducing the new sales presentation format today!" },
		{ name: "Sara Alexander", profileImage: "~/assets/img/profile-img/sara-alexander.png", title: "Superior Service", comment: "Sara, you did a killer job on the learning modules!" },
		{ name: "Sean Lee", profileImage: "~/assets/img/profile-img/sean-lee.png", title: "Teamwork", comment: "Thanks for bringing those girl scout cookies to the planning meeting, Sean." }
	  ]
	},*/
];

// [TEST] Used by mock service for "Show More" buttons. Make sure changes here are reflected in the main gizmo data above
// [TODO] Create unified test structure for all of the table data to make mock services easier to create and use
export var EarningsChecksPending = [
	{ TransactionId: 111, Amount: -25, EarnedDate: new Date("2019-02-02"), ExpectedPayDate: new Date("2019-01-14"), Description: "Adjustment – Cancelled contract Winter Sales Spectacular" },
	{ TransactionId: 110, Amount: 200, EarnedDate: new Date("2019-01-05"), ExpectedPayDate: new Date("2019-01-14"), Description: "Earning – Long Title of Last Year's Big Q4 Promotion" },
	{ TransactionId: 109, Amount: 75, EarnedDate: new Date("2018-12-31"), ExpectedPayDate: new Date("2019-01-14"), Description: "Earning – Winter Holiday Sales Spectacular" },
	{ TransactionId: 108, Amount: 201, EarnedDate: new Date("2018-12-30"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 1" },
	{ TransactionId: 107, Amount: 202, EarnedDate: new Date("2018-12-29"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 2" },
	{ TransactionId: 106, Amount: 203, EarnedDate: new Date("2018-12-28"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 3" },
	{ TransactionId: 105, Amount: 204, EarnedDate: new Date("2018-12-27"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 4" },
	{ TransactionId: 104, Amount: 205, EarnedDate: new Date("2018-12-26"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 5" },
	{ TransactionId: 103, Amount: 206, EarnedDate: new Date("2018-12-25"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 6" },
	{ TransactionId: 102, Amount: 207, EarnedDate: new Date("2018-12-24"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 7" },
	{ TransactionId: 101, Amount: 208, EarnedDate: new Date("2018-12-23"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 8" },
	{ TransactionId: 100, Amount: 209, EarnedDate: new Date("2018-12-22"), ExpectedPayDate: new Date("2019-01-14"), Description: "More earnings 9" }
];
export var EarningsChecksPaid = [
	{ TransactionId: 211, Amount: 123.44, PaidDate: new Date("2019-01-07"), Description: "Check #2054 – Dec 2018 earnings" },
	{ TransactionId: 210, Amount: 234.56, PaidDate: new Date("2018-12-14"), Description: "Check #2023 – Nov 2018 earnings" },
	{ TransactionId: 209, Amount: 101.23, PaidDate: new Date("2018-11-14"), Description: "Check #2020 – Oct 2018 earnings" },

	{ TransactionId: 208, Amount: 99.01, PaidDate: new Date("2018-10-13"), Description: "Check #2009 – More earnings 1" },
	{ TransactionId: 207, Amount: 98.01, PaidDate: new Date("2018-10-12"), Description: "Check #2008 – More earnings 2" },
	{ TransactionId: 206, Amount: 97.01, PaidDate: new Date("2018-10-11"), Description: "Check #2007 – More earnings 3" },
	{ TransactionId: 205, Amount: 96.01, PaidDate: new Date("2018-10-10"), Description: "Check #2006 – More earnings 4" },
	{ TransactionId: 204, Amount: 95.01, PaidDate: new Date("2018-10-09"), Description: "Check #2005 – More earnings 5" },
	{ TransactionId: 203, Amount: 94.01, PaidDate: new Date("2018-10-08"), Description: "Check #2004 – More earnings 6" },
	{ TransactionId: 202, Amount: 93.01, PaidDate: new Date("2018-10-07"), Description: "Check #2003 – More earnings 7" },
	{ TransactionId: 201, Amount: 92.01, PaidDate: new Date("2018-10-06"), Description: "Check #2002 – More earnings 8" },
	{ TransactionId: 200, Amount: 91.01, PaidDate: new Date("2018-10-05"), Description: "Check #2001 – More earnings 9" }
];
