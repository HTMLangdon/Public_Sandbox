import { WsStatusType, WsFeature, WsPublisher, WsTitleType, WsTitle, WsAuthor, WsAuthorTitle, WsJobTypeBasic, WsJobType, TitleStats } from '../models/publishModels';

export var FeatureData: WsFeature[] = [
	{ Name: "Author Search", Path: "~/publish/author" },
	{ Name: "Title Search", Path: "~/publish/title" },
	{ Name: "Title Stats", Path: "~/publish/titleStats" }
	//{ Name: "Manage Publishers", Path: "#" }
];

export var StatusTypeData: WsStatusType[] = [
	{ Status: "A", StatusName: "Active" },
	{ Status: "I", StatusName: "Inactive" }
];

export var JobTypeData: WsJobType[] = [
	{ JobTypeId: 1, JobTypeName: "New Hire - Job not specified", ExtRefKey: "new", Status: "A", MinLevel: 10, MaxLevel: 10 },
	{ JobTypeId: 2, JobTypeName: "Chief Executive Officer", ExtRefKey: "ceo", Status: "A", MinLevel: 200, MaxLevel: 250 },
	{ JobTypeId: 3, JobTypeName: "Business Operations Manager", ExtRefKey: "bom", Status: "A", MinLevel: 175, MaxLevel: 225 },
	{ JobTypeId: 4, JobTypeName: "Chief Financial Officier", ExtRefKey: "cfo", Status: "A", MinLevel: 175, MaxLevel: 250 },
	{ JobTypeId: 5, JobTypeName: "Publisher", ExtRefKey: "pub", Status: "A", MinLevel: 150, MaxLevel: 250 },
	{ JobTypeId: 6, JobTypeName: "Managing Editor", ExtRefKey: "med", Status: "A", MinLevel: 140, MaxLevel: 225 },
	{ JobTypeId: 7, JobTypeName: "Marketing Manager", ExtRefKey: "mkm", Status: "A", MinLevel: 120, MaxLevel: 200 },
	{ JobTypeId: 8, JobTypeName: "Public Relations Manager", ExtRefKey: "prm", Status: "A", MinLevel: 100, MaxLevel: 175 },
	{ JobTypeId: 9, JobTypeName: "Acquisitions Manager", ExtRefKey: "acm", Status: "A", MinLevel: 75, MaxLevel: 175 },
	{ JobTypeId: 10, JobTypeName: "Productions Manager", ExtRefKey: "pdm", Status: "A", MinLevel: 75, MaxLevel: 165 },
	{ JobTypeId: 11, JobTypeName: "Operations Manager", ExtRefKey: "opm", Status: "A", MinLevel: 75, MaxLevel: 150 },
	{ JobTypeId: 12, JobTypeName: "Editor", ExtRefKey: "edt", Status: "A", MinLevel: 25, MaxLevel: 100 },
	{ JobTypeId: 13, JobTypeName: "Sales Representative", ExtRefKey: "srp", Status: "A", MinLevel: 25, MaxLevel: 100 },
	{ JobTypeId: 14, JobTypeName: "Designer", ExtRefKey: "des", Status: "A", MinLevel: 25, MaxLevel: 100 }
];

export var TitleTypeData: WsTitleType[] = [
	{ TitleTypeId: 1, ExtRefKey: "undecided", TitleTypeName: "Undecided", Status: "A" },
	{ TitleTypeId: 2, ExtRefKey: "business", TitleTypeName: "Business", Status: "A" },
	{ TitleTypeId: 3, ExtRefKey: "mod_cook", TitleTypeName: "Modern Cookbook", Status: "A" },
	{ TitleTypeId: 4, ExtRefKey: "popular_comp", TitleTypeName: "Popular Computing", Status: "A" },
	{ TitleTypeId: 5, ExtRefKey: "psychology", TitleTypeName: "Psychology", Status: "A" },
	{ TitleTypeId: 6, ExtRefKey: "trad_cook", TitleTypeName: "Traditional Cookbook", Status: "A" }
];

export var PublisherData: WsPublisher[] = [
	{
		PublisherId: 1,
		ExtRefKey: "0736",
		Status: "A",
		PublisherName: "New Moon Books",
		City: "Boston",
		StateProv: "MA",
		Country: "US"
	},
	{
		PublisherId: 2,
		ExtRefKey: "0877",
		Status: "A",
		PublisherName: "Binnet & Hardley",
		City: "Washington",
		StateProv: "DC",
		Country: "US"
	},
	{
		PublisherId: 3,
		ExtRefKey: "1389",
		Status: "A",
		PublisherName: "Algodata Infosystems",
		City: "Berkeley",
		StateProv: "CA",
		Country: "US"
	},
	{
		PublisherId: 4,
		ExtRefKey: "9952",
		Status: "A",
		PublisherName: "Scootney Books",
		City: "New York",
		StateProv: "NY",
		Country: "US"
	},
	{
		PublisherId: 5,
		ExtRefKey: "1622",
		Status: "A",
		PublisherName: "Five Lakes Publishing",
		City: "Chicago",
		StateProv: "IL",
		Country: "US"
	},
	{
		PublisherId: 6,
		ExtRefKey: "1756",
		Status: "A",
		PublisherName: "Ramona Publishers",
		City: "Dallas",
		StateProv: "TX",
		Country: "US"
	},
	{
		PublisherId: 7,
		ExtRefKey: "9901",
		Status: "A",
		PublisherName: "GGG&G",
		City: "Munchen",
		StateProv: null,
		Country: "DE"
	},
	{
		PublisherId: 8,
		ExtRefKey: "9999",
		Status: "A",
		PublisherName: "Lucerne Publishing",
		City: "Paris",
		StateProv: null,
		Country: "FR"
	}
];

export var AuthorData: WsAuthor[] = [
	{
		AuthorId: 1,
		ExtRefKey: "409-56-7008",
		Status: "A",
		LastName: "Bennet",
		FirstName: "Abraham",
		Phone: "415 658-9932",
		Address1: "6223 Bateman St.",
		City: "Berkeley",
		StateProv: "CA",
		PostalCode: "94705",
		IsContract: true
	},
	{
		AuthorId: 2,
		ExtRefKey: "213-46-8915",
		Status: "A",
		LastName: "Green",
		FirstName: "Marjorie",
		Phone: "415 986-7020",
		Address1: "309 63rd St. #411",
		City: "Oakland",
		StateProv: "CA",
		PostalCode: "94618",
		IsContract: true
	},
	{
		AuthorId: 3,
		ExtRefKey: "238-95-7766",
		Status: "A",
		LastName: "Carson",
		FirstName: "Cheryl",
		Phone: "415 548-7723",
		Address1: "589 Darwin Ln.",
		City: "Berkeley",
		StateProv: "CA",
		PostalCode: "94705",
		IsContract: true
	},
	{
		AuthorId: 4,
		ExtRefKey: "998-72-3567",
		Status: "A",
		LastName: "Ringer",
		FirstName: "Albert",
		Phone: "801 826-0752",
		Address1: "67 Seventh Av.",
		City: "Salt Lake City",
		StateProv: "UT",
		PostalCode: "84152",
		IsContract: true
	},
	{
		AuthorId: 5,
		ExtRefKey: "899-46-2035",
		Status: "A",
		LastName: "Ringer",
		FirstName: "Anne",
		Phone: "801 826-0752",
		Address1: "67 Seventh Av.",
		City: "Salt Lake City",
		StateProv: "UT",
		PostalCode: "84152",
		IsContract: true
	},
	{
		AuthorId: 6,
		ExtRefKey: "722-51-5454",
		Status: "A",
		LastName: "DeFrance",
		FirstName: "Michel",
		Phone: "219 547-9982",
		Address1: "3 Balding Pl.",
		City: "Gary",
		StateProv: "IN",
		PostalCode: "46403",
		IsContract: true
	},
	{
		AuthorId: 7,
		ExtRefKey: "807-91-6654",
		Status: "A",
		LastName: "Panteley",
		FirstName: "Sylvia",
		Phone: "301 946-8853",
		Address1: "1956 Arlington Pl.",
		City: "Rockville",
		StateProv: "MD",
		PostalCode: "20853",
		IsContract: true
	},
	{
		AuthorId: 8,
		ExtRefKey: "893-72-1158",
		Status: "A",
		LastName: "McBadden",
		FirstName: "Heather",
		Phone: "707 448-4982",
		Address1: "301 Putnam",
		City: "Vacaville",
		StateProv: "CA",
		PostalCode: "95688",
		IsContract: false
	},
	{
		AuthorId: 9,
		ExtRefKey: "724-08-9931",
		Status: "A",
		LastName: "Stringer",
		FirstName: "Dirk",
		Phone: "415 843-2991",
		Address1: "5420 Telegraph Av.",
		City: "Oakland",
		StateProv: "CA",
		PostalCode: "94609",
		IsContract: false
	},
	{
		AuthorId: 10,
		ExtRefKey: "274-80-9391",
		Status: "A",
		LastName: "Straight",
		FirstName: "Dean",
		Phone: "415 834-2919",
		Address1: "5420 College Av.",
		City: "Oakland",
		StateProv: "CA",
		PostalCode: "94609",
		IsContract: true
	},
	{
		AuthorId: 11,
		ExtRefKey: "756-30-7391",
		Status: "A",
		LastName: "Karsen",
		FirstName: "Livia",
		Phone: "415 534-9219",
		Address1: "5720 McAuley St.",
		City: "Oakland",
		StateProv: "CA",
		PostalCode: "94609",
		IsContract: true
	},
	{
		AuthorId: 12,
		ExtRefKey: "724-80-9391",
		Status: "A",
		LastName: "MacFeather",
		FirstName: "Stearns",
		Phone: "415 354-7128",
		Address1: "44 Upland Hts.",
		City: "Oakland",
		StateProv: "CA",
		PostalCode: "94612",
		IsContract: true
	},
	{
		AuthorId: 13,
		ExtRefKey: "427-17-2319",
		Status: "A",
		LastName: "Dull",
		FirstName: "Ann",
		Phone: "415 836-7128",
		Address1: "3410 Blonde St.",
		City: "Palo Alto",
		StateProv: "CA",
		PostalCode: "94301",
		IsContract: true
	},
	{
		AuthorId: 14,
		ExtRefKey: "672-71-3249",
		Status: "A",
		LastName: "Yokomoto",
		FirstName: "Akiko",
		Phone: "415 935-4228",
		Address1: "3 Silver Ct.",
		City: "Walnut Creek",
		StateProv: "CA",
		PostalCode: "94595",
		IsContract: true
	},
	{
		AuthorId: 15,
		ExtRefKey: "267-41-2394",
		Status: "A",
		LastName: "O'Leary",
		FirstName: "Michael",
		Phone: "408 286-2428",
		Address1: "22 Cleveland Av. #14",
		City: "San Jose",
		StateProv: "CA",
		PostalCode: "95128",
		IsContract: true
	},
	{
		AuthorId: 16,
		ExtRefKey: "472-27-2349",
		Status: "A",
		LastName: "Gringlesby",
		FirstName: "Burt",
		Phone: "707 938-6445",
		Address1: "PO Box 792",
		City: "Covelo",
		StateProv: "CA",
		PostalCode: "95428",
		IsContract: true
	},
	{
		AuthorId: 17,
		ExtRefKey: "527-72-3246",
		Status: "A",
		LastName: "Greene",
		FirstName: "Morningstar",
		Phone: "615 297-2723",
		Address1: "22 Graybar House Rd.",
		City: "Nashville",
		StateProv: "TN",
		PostalCode: "37215",
		IsContract: false
	},
	{
		AuthorId: 18,
		ExtRefKey: "172-32-1176",
		Status: "A",
		LastName: "White",
		FirstName: "Johnson",
		Phone: "408 496-7223",
		Address1: "10932 Bigge Rd.",
		City: "Menlo Park",
		StateProv: "CA",
		PostalCode: "94025",
		IsContract: true
	},
	{
		AuthorId: 19,
		ExtRefKey: "712-45-1867",
		Status: "A",
		LastName: "del Castillo",
		FirstName: "Innes",
		Phone: "615 996-8275",
		Address1: "2286 Cram Pl. #86",
		City: "Ann Arbor",
		StateProv: "MI",
		PostalCode: "48105",
		IsContract: true
	},
	{
		AuthorId: 20,
		ExtRefKey: "846-92-7186",
		Status: "A",
		LastName: "Hunter",
		FirstName: "Sheryl",
		Phone: "415 836-7128",
		Address1: "3410 Blonde St.",
		City: "Palo Alto",
		StateProv: "CA",
		PostalCode: "94301",
		IsContract: true
	},
	{
		AuthorId: 21,
		ExtRefKey: "486-29-1786",
		Status: "A",
		LastName: "Locksley",
		FirstName: "Charlene",
		Phone: "415 585-4620",
		Address1: "18 Broadway Av.",
		City: "San Francisco",
		StateProv: "CA",
		PostalCode: "94130",
		IsContract: true
	},
	{
		AuthorId: 22,
		ExtRefKey: "648-92-1872",
		Status: "A",
		LastName: "Blotchet-Halls",
		FirstName: "Reginald",
		Phone: "503 745-6402",
		Address1: "55 Hillsdale Bl.",
		City: "Corvallis",
		StateProv: "OR",
		PostalCode: "97330",
		IsContract: true
	},
	{
		AuthorId: 23,
		ExtRefKey: "341-22-1782",
		Status: "A",
		LastName: "Smith",
		FirstName: "Meander",
		Phone: "913 843-0462",
		Address1: "10 Mississippi Dr.",
		City: "Lawrence",
		StateProv: "KS",
		PostalCode: "66044",
		IsContract: false
	}
];

export var TitleData: WsTitle[] = [
	{
		TitleId: 1,
		ExtRefKey: "PC8888",
		Status: "A",
		TitleName: "Secrets of Silicon Valley",
		TitleTypeId: 4,
		PublisherId: 3,
		Price: 20.0000,
		Advance: 8000.0000,
		Royalty: 10,
		YtdSales: 4095,
		Notes: "Muckraking reporting on the world's largest computer hardware and software manufacturers.",
		PublishDate: new Date("2014-06-12")
	},
	{
		TitleId: 2,
		ExtRefKey: "BU1032",
		Status: "A",
		TitleName: "The Busy Executive's Database Guide",
		TitleTypeId: 2,
		PublisherId: 3,
		Price: 19.9900,
		Advance: 5000.0000,
		Royalty: 10,
		YtdSales: 4095,
		Notes: "An overview of available database systems with emphasis on common business applications. Illustrated.",
		PublishDate: new Date("2011-06-12")
	},
	{
		TitleId: 3,
		ExtRefKey: "PS7777",
		Status: "A",
		TitleName: "Emotional Security: A New Algorithm",
		TitleTypeId: 5,
		PublisherId: 1,
		Price: 7.9900,
		Advance: 4000.0000,
		Royalty: 10,
		YtdSales: 3336,
		Notes: "Protecting yourself and your loved ones from undue emotional stress in the modern world. Use of computer and nutritional aids emphasized.",
		PublishDate: new Date("2011-06-12")
	},
	{
		TitleId: 4,
		ExtRefKey: "PS3333",
		Status: "A",
		TitleName: "Prolonged Data Deprivation: Four Case Studies",
		TitleTypeId: 5,
		PublisherId: 1,
		Price: 19.9900,
		Advance: 2000.0000,
		Royalty: 10,
		YtdSales: 4072,
		Notes: "What happens when the data runs dry?  Searching evaluations of information-shortage effects.",
		PublishDate: new Date("2011-06-12")
	},
	{
		TitleId: 5,
		ExtRefKey: "BU1111",
		Status: "A",
		TitleName: "Cooking with Computers: Surreptitious Balance Sheets",
		TitleTypeId: 2,
		PublisherId: 3,
		Price: 11.9500,
		Advance: 5000.0000,
		Royalty: 10,
		YtdSales: 3876,
		Notes: "Helpful hints on how to use your electronic resources to the best advantage.",
		PublishDate: new Date("2011-06-09")
	},
	{
		TitleId: 6,
		ExtRefKey: "MC2222",
		Status: "A",
		TitleName: "Silicon Valley Gastronomic Treats",
		TitleTypeId: 3,
		PublisherId: 2,
		Price: 19.9900,
		Advance: 0.0000,
		Royalty: 12,
		YtdSales: 2032,
		Notes: "Favorite recipes for quick, easy, and elegant meals.",
		PublishDate: new Date("2011-06-09")
	},
	{
		TitleId: 7,
		ExtRefKey: "TC7777",
		Status: "A",
		TitleName: "Sushi, Anyone?",
		TitleTypeId: 6,
		PublisherId: 2,
		Price: 14.9900,
		Advance: 8000.0000,
		Royalty: 10,
		YtdSales: 4095,
		Notes: "Detailed instructions on how to make authentic Japanese sushi in your spare time.",
		PublishDate: new Date("2011-06-12")
	},
	{
		TitleId: 8,
		ExtRefKey: "TC4203",
		Status: "A",
		TitleName: "Fifty Years in Buckingham Palace Kitchens",
		TitleTypeId: 6,
		PublisherId: 2,
		Price: 11.9500,
		Advance: 4000.0000,
		Royalty: 14,
		YtdSales: 15096,
		Notes: "More anecdotes from the Queen's favorite cook describing life among English royalty. Recipes, techniques, tender vignettes.",
		PublishDate: new Date("2011-06-12")
	},
	{
		TitleId: 9,
		ExtRefKey: "PC1035",
		Status: "A",
		TitleName: "But Is It User Friendly?",
		TitleTypeId: 4,
		PublisherId: 3,
		Price: 22.9500,
		Advance: 7000.0000,
		Royalty: 16,
		YtdSales: 8780,
		Notes: "A survey of software for the naive user, focusing on the 'friendliness' of each.",
		PublishDate: new Date("2011-06-30")
	},
	{
		TitleId: 10,
		ExtRefKey: "BU2075",
		Status: "A",
		TitleName: "You Can Combat Computer Stress!",
		TitleTypeId: 2,
		PublisherId: 1,
		Price: 2.9900,
		Advance: 10125.0000,
		Royalty: 24,
		YtdSales: 18722,
		Notes: "The latest medical and psychological techniques for living with the electronic office. Easy-to-understand explanations.",
		PublishDate: new Date("2011-06-30")
	},
	{
		TitleId: 11,
		ExtRefKey: "PS2091",
		Status: "A",
		TitleName: "Is Anger the Enemy?",
		TitleTypeId: 5,
		PublisherId: 1,
		Price: 10.9500,
		Advance: 2275.0000,
		Royalty: 12,
		YtdSales: 2045,
		Notes: "Carefully researched study of the effects of strong emotions on the body. Metabolic charts included.",
		PublishDate: new Date("2011-06-15")
	},
	{
		TitleId: 12,
		ExtRefKey: "PS2106",
		Status: "A",
		TitleName: "Life Without Fear",
		TitleTypeId: 5,
		PublisherId: 1,
		Price: 7.0000,
		Advance: 6000.0000,
		Royalty: 10,
		YtdSales: 111,
		Notes: "New exercise, meditation, and nutritional techniques that can reduce the shock of daily interactions. Popular audience. Sample menus included, exercise video available separately.",
		PublishDate: new Date("2011-10-05")
	},
	{
		TitleId: 13,
		ExtRefKey: "MC3021",
		Status: "A",
		TitleName: "The Gourmet Microwave",
		TitleTypeId: 3,
		PublisherId: 2,
		Price: 2.9900,
		Advance: 15000.0000,
		Royalty: 24,
		YtdSales: 22246,
		Notes: "Traditional French gourmet recipes adapted for modern microwave cooking.",
		PublishDate: new Date("2011-06-18")
	},
	{
		TitleId: 14,
		ExtRefKey: "TC3218",
		Status: "A",
		TitleName: "Onions, Leeks, and Garlic: Cooking Secrets of the Mediterranean",
		TitleTypeId: 6,
		PublisherId: 2,
		Price: 20.9500,
		Advance: 7000.0000,
		Royalty: 10,
		YtdSales: 375,
		Notes: "Profusely illustrated in color, this makes a wonderful gift book for a cuisine-oriented friend.",
		PublishDate: new Date("2011-10-21")
	},
	{
		TitleId: 15,
		ExtRefKey: "MC3026",
		Status: "A",
		TitleName: "The Psychology of Computer Cooking",
		TitleTypeId: 1,
		PublisherId: 2,
		PublishDate: new Date("2011-05-15")
	},
	{
		TitleId: 16,
		ExtRefKey: "BU7832",
		Status: "A",
		TitleName: "Straight Talk About Computers",
		TitleTypeId: 2,
		PublisherId: 3,
		Price: 19.9900,
		Advance: 5000.0000,
		Royalty: 10,
		YtdSales: 4095,
		Notes: "Annotated analysis of what computers can do for you: a no-hype guide for the critical user.",
		PublishDate: new Date("2011-06-22")
	},
	{
		TitleId: 17,
		ExtRefKey: "PS1372",
		Status: "A",
		TitleName: "Computer Phobic AND Non-Phobic Individuals: Behavior Variations",
		TitleTypeId: 5,
		PublisherId: 2,
		Price: 21.5900,
		Advance: 7000.0000,
		Royalty: 10,
		YtdSales: 375,
		Notes: "A must for the specialist, this book examines the difference between those who hate and fear computers and those who don't.",
		PublishDate: new Date("2011-10-21")
	},
	{
		TitleId: 18,
		ExtRefKey: "PC9999",
		Status: "A",
		TitleName: "Net Etiquette",
		TitleTypeId: 4,
		PublisherId: 3,
		Notes: "A must-read for computer conferencing.",
		PublishDate: new Date("2011-09-01")
	}
];

export var StoreData = [
	{ StoreId: 1, ExtRefKey: "7066", Status: "A", StoreName: "Barnum's", Address1: "567 Pasadena Ave.", City: "Tustin", StateProv: "CA", PostalCode: "92789" },
	{ StoreId: 2, ExtRefKey: "7067", Status: "A", StoreName: "News & Brews", Address1: "577 First St.", City: "Los Gatos", StateProv: "CA", PostalCode: "96745" },
	{ StoreId: 3, ExtRefKey: "7131", Status: "A", StoreName: "Doc-U-Mat: Quality Laundry and Books", Address1: "24-A Avogadro Way", City: "Remulade", StateProv: "WA", PostalCode: "98014" },
	{ StoreId: 4, ExtRefKey: "8042", Status: "A", StoreName: "Bookbeat", Address1: "679 Carson St.", City: "Portland", StateProv: "OR", PostalCode: "89076" },
	{ StoreId: 5, ExtRefKey: "6380", Status: "A", StoreName: "Eric the Read Books", Address1: "788 Catamaugus Ave.", City: "Seattle", StateProv: "WA", PostalCode: "98056" },
	{ StoreId: 6, ExtRefKey: "7896", Status: "A", StoreName: "Fricative Bookshop", Address1: "89 Madison St.", City: "Fremont", StateProv: "CA", PostalCode: "90019" }
];

export var AuthorTitleData: WsAuthorTitle[] = [
	{
		AuthorId: 13,
		TitleId: 1,
		AuthorOrd: 1,
		RoyaltyPer: 50
	},
	{
		AuthorId: 20,
		TitleId: 1,
		AuthorOrd: 2,
		RoyaltyPer: 50
	},
	{
		AuthorId: 1,
		TitleId: 2,
		AuthorOrd: 1,
		RoyaltyPer: 60
	},
	{
		AuthorId: 2,
		TitleId: 2,
		AuthorOrd: 2,
		RoyaltyPer: 40
	},
	{
		AuthorId: 21,
		TitleId: 3,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 18,
		TitleId: 4,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 12,
		TitleId: 5,
		AuthorOrd: 1,
		RoyaltyPer: 60
	},
	{
		AuthorId: 15,
		TitleId: 5,
		AuthorOrd: 2,
		RoyaltyPer: 40
	},
	{
		AuthorId: 19,
		TitleId: 6,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 14,
		TitleId: 7,
		AuthorOrd: 1,
		RoyaltyPer: 40
	},
	{
		AuthorId: 15,
		TitleId: 7,
		AuthorOrd: 2,
		RoyaltyPer: 30
	},
	{
		AuthorId: 16,
		TitleId: 7,
		AuthorOrd: 3,
		RoyaltyPer: 30
	},
	{
		AuthorId: 22,
		TitleId: 8,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 3,
		TitleId: 9,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 2,
		TitleId: 10,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 4,
		TitleId: 11,
		AuthorOrd: 1,
		RoyaltyPer: 50
	},
	{
		AuthorId: 5,
		TitleId: 11,
		AuthorOrd: 2,
		RoyaltyPer: 50
	},
	{
		AuthorId: 4,
		TitleId: 12,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 5,
		TitleId: 13,
		AuthorOrd: 2,
		RoyaltyPer: 25
	},
	{
		AuthorId: 6,
		TitleId: 13,
		AuthorOrd: 1,
		RoyaltyPer: 75
	},
	{
		AuthorId: 7,
		TitleId: 14,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 10,
		TitleId: 16,
		AuthorOrd: 1,
		RoyaltyPer: 100
	},
	{
		AuthorId: 11,
		TitleId: 17,
		AuthorOrd: 1,
		RoyaltyPer: 75
	},
	{
		AuthorId: 12,
		TitleId: 17,
		AuthorOrd: 2,
		RoyaltyPer: 25
	},
	{
		AuthorId: 21,
		TitleId: 18,
		AuthorOrd: 1,
		RoyaltyPer: 100
	}
];

export var DiscountTypeData = [
	{
		DiscountTypeId: 1,
		DiscountTypeName: "Initial Customer",
		DiscountAmount: 10.50
	},
	{
		DiscountTypeId: 2,
		DiscountTypeName: "Volume Discount",
		MinAmount: 100,
		MaxAmount: 1000,
		DiscountAmount: 6.70
	},
	{
		DiscountTypeId: 3,
		DiscountTypeName: "Customer Discount",
		StoreId: 4,
		DiscountAmount: 5.00
	}
];

export var RoyaltyScheduleData = [
	{
		TitleId: 1,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 1,
		MinAmount: 5001,
		MaxAmount: 10000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 1,
		MinAmount: 10001,
		MaxAmount: 15000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 1,
		MinAmount: 15001,
		MaxAmount: 50000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 2,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 2,
		MinAmount: 5001,
		MaxAmount: 50000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 3,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 3,
		MinAmount: 5001,
		MaxAmount: 50000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 4,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 4,
		MinAmount: 5001,
		MaxAmount: 10000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 4,
		MinAmount: 10001,
		MaxAmount: 15000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 4,
		MinAmount: 15001,
		MaxAmount: 50000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 5,
		MinAmount: 0,
		MaxAmount: 4000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 5,
		MinAmount: 4001,
		MaxAmount: 8000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 5,
		MinAmount: 8001,
		MaxAmount: 10000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 5,
		MinAmount: 12001,
		MaxAmount: 16000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 5,
		MinAmount: 16001,
		MaxAmount: 20000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 5,
		MinAmount: 20001,
		MaxAmount: 24000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 5,
		MinAmount: 24001,
		MaxAmount: 28000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 5,
		MinAmount: 28001,
		MaxAmount: 50000,
		RoyaltyAmount: 24
	},
	{
		TitleId: 6,
		MinAmount: 0,
		MaxAmount: 2000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 6,
		MinAmount: 2001,
		MaxAmount: 4000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 6,
		MinAmount: 4001,
		MaxAmount: 8000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 6,
		MinAmount: 8001,
		MaxAmount: 12000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 6,
		MinAmount: 12001,
		MaxAmount: 20000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 6,
		MinAmount: 20001,
		MaxAmount: 50000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 7,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 7,
		MinAmount: 5001,
		MaxAmount: 15000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 7,
		MinAmount: 15001,
		MaxAmount: 50000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 8,
		MinAmount: 0,
		MaxAmount: 2000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 8,
		MinAmount: 2001,
		MaxAmount: 8000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 8,
		MinAmount: 8001,
		MaxAmount: 16000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 8,
		MinAmount: 16001,
		MaxAmount: 24000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 8,
		MinAmount: 24001,
		MaxAmount: 32000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 8,
		MinAmount: 32001,
		MaxAmount: 40000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 8,
		MinAmount: 40001,
		MaxAmount: 50000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 9,
		MinAmount: 0,
		MaxAmount: 2000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 9,
		MinAmount: 2001,
		MaxAmount: 3000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 9,
		MinAmount: 3001,
		MaxAmount: 4000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 9,
		MinAmount: 4001,
		MaxAmount: 10000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 9,
		MinAmount: 10001,
		MaxAmount: 50000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 10,
		MinAmount: 0,
		MaxAmount: 1000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 10,
		MinAmount: 1001,
		MaxAmount: 3000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 10,
		MinAmount: 3001,
		MaxAmount: 5000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 10,
		MinAmount: 5001,
		MaxAmount: 7000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 10,
		MinAmount: 7001,
		MaxAmount: 10000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 10,
		MinAmount: 10001,
		MaxAmount: 12000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 10,
		MinAmount: 12001,
		MaxAmount: 14000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 10,
		MinAmount: 14001,
		MaxAmount: 50000,
		RoyaltyAmount: 24
	},
	{
		TitleId: 11,
		MinAmount: 0,
		MaxAmount: 1000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 11,
		MinAmount: 1001,
		MaxAmount: 5000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 11,
		MinAmount: 5001,
		MaxAmount: 10000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 11,
		MinAmount: 10001,
		MaxAmount: 50000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 12,
		MinAmount: 0,
		MaxAmount: 2000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 12,
		MinAmount: 2001,
		MaxAmount: 5000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 12,
		MinAmount: 5001,
		MaxAmount: 10000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 12,
		MinAmount: 10001,
		MaxAmount: 50000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 13,
		MinAmount: 0,
		MaxAmount: 1000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 13,
		MinAmount: 1001,
		MaxAmount: 2000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 13,
		MinAmount: 2001,
		MaxAmount: 4000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 13,
		MinAmount: 4001,
		MaxAmount: 6000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 13,
		MinAmount: 6001,
		MaxAmount: 8000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 13,
		MinAmount: 8001,
		MaxAmount: 10000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 13,
		MinAmount: 10001,
		MaxAmount: 12000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 13,
		MinAmount: 12001,
		MaxAmount: 50000,
		RoyaltyAmount: 24
	},
	{
		TitleId: 14,
		MinAmount: 0,
		MaxAmount: 2000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 14,
		MinAmount: 2001,
		MaxAmount: 4000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 14,
		MinAmount: 4001,
		MaxAmount: 6000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 14,
		MinAmount: 6001,
		MaxAmount: 8000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 14,
		MinAmount: 8001,
		MaxAmount: 10000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 14,
		MinAmount: 10001,
		MaxAmount: 12000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 14,
		MinAmount: 12001,
		MaxAmount: 14000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 14,
		MinAmount: 14001,
		MaxAmount: 50000,
		RoyaltyAmount: 24
	},
	{
		TitleId: 16,
		MinAmount: 0,
		MaxAmount: 5000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 16,
		MinAmount: 5001,
		MaxAmount: 10000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 16,
		MinAmount: 10001,
		MaxAmount: 15000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 16,
		MinAmount: 15001,
		MaxAmount: 20000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 16,
		MinAmount: 20001,
		MaxAmount: 25000,
		RoyaltyAmount: 18
	},
	{
		TitleId: 16,
		MinAmount: 25001,
		MaxAmount: 30000,
		RoyaltyAmount: 20
	},
	{
		TitleId: 16,
		MinAmount: 30001,
		MaxAmount: 35000,
		RoyaltyAmount: 22
	},
	{
		TitleId: 16,
		MinAmount: 35001,
		MaxAmount: 50000,
		RoyaltyAmount: 24
	},
	{
		TitleId: 17,
		MinAmount: 0,
		MaxAmount: 10000,
		RoyaltyAmount: 10
	},
	{
		TitleId: 17,
		MinAmount: 10001,
		MaxAmount: 20000,
		RoyaltyAmount: 12
	},
	{
		TitleId: 17,
		MinAmount: 20001,
		MaxAmount: 30000,
		RoyaltyAmount: 14
	},
	{
		TitleId: 17,
		MinAmount: 30001,
		MaxAmount: 40000,
		RoyaltyAmount: 16
	},
	{
		TitleId: 17,
		MinAmount: 40001,
		MaxAmount: 50000,
		RoyaltyAmount: 18
	}
];

export var EmployeeData = [
	{
		EmployeeId: 1,
		ExtRefKey: "LAL21447M",
		Status: "A",
		FirstName: "Laurence",
		MiddleInitial: "A",
		LastName: "Lebihan",
		JobTypeId: 5,
		JobLevel: 175,
		PublisherId: 1,
		HireDate: new Date("2010-06-03")
	},
	{
		EmployeeId: 2,
		ExtRefKey: "MGK44605M",
		Status: "A",
		FirstName: "Matti",
		MiddleInitial: "G",
		LastName: "Karttunen",
		JobTypeId: 6,
		JobLevel: 220,
		PublisherId: 1,
		HireDate: new Date("2014-05-01")
	},
	{
		EmployeeId: 3,
		ExtRefKey: "PDI47470M",
		Status: "A",
		FirstName: "Palle",
		MiddleInitial: "D",
		LastName: "Ibsen",
		JobTypeId: 7,
		JobLevel: 195,
		PublisherId: 1,
		HireDate: new Date("2013-05-09")
	},
	{
		EmployeeId: 4,
		ExtRefKey: "MMS49649F",
		Status: "A",
		FirstName: "Mary",
		MiddleInitial: "M",
		LastName: "Saveley",
		JobTypeId: 8,
		JobLevel: 175,
		PublisherId: 1,
		HireDate: new Date("2013-06-29")
	},
	{
		EmployeeId: 5,
		ExtRefKey: "GHT50241M",
		Status: "A",
		FirstName: "Gary",
		MiddleInitial: "H",
		LastName: "Thomas",
		JobTypeId: 9,
		JobLevel: 170,
		PublisherId: 1,
		HireDate: new Date("2008-08-09")
	},
	{
		EmployeeId: 6,
		ExtRefKey: "MFS52347M",
		Status: "A",
		FirstName: "Martin",
		MiddleInitial: "F",
		LastName: "Sommer",
		JobTypeId: 10,
		JobLevel: 165,
		PublisherId: 1,
		HireDate: new Date("2010-04-13")
	},
	{
		EmployeeId: 7,
		ExtRefKey: "R-M53550M",
		Status: "A",
		FirstName: "Roland",
		MiddleInitial: " ",
		LastName: "Mendel",
		JobTypeId: 11,
		JobLevel: 150,
		PublisherId: 1,
		HireDate: new Date("2011-09-05")
	},
	{
		EmployeeId: 8,
		ExtRefKey: "HAS54740M",
		Status: "A",
		FirstName: "Howard",
		MiddleInitial: "A",
		LastName: "Snyder",
		JobTypeId: 12,
		JobLevel: 100,
		PublisherId: 1,
		HireDate: new Date("2008-11-19")
	},
	{
		EmployeeId: 9,
		ExtRefKey: "TPO55093M",
		Status: "A",
		FirstName: "Timothy",
		MiddleInitial: "P",
		LastName: "O'Rourke",
		JobTypeId: 13,
		JobLevel: 100,
		PublisherId: 1,
		HireDate: new Date("2008-06-19")
	},
	{
		EmployeeId: 10,
		ExtRefKey: "KFJ64308F",
		Status: "A",
		FirstName: "Karin",
		MiddleInitial: "F",
		LastName: "Josephs",
		JobTypeId: 14,
		JobLevel: 100,
		PublisherId: 1,
		HireDate: new Date("2012-10-17")
	},
	{
		EmployeeId: 11,
		ExtRefKey: "PXH22250M",
		Status: "A",
		FirstName: "Paul",
		MiddleInitial: "X",
		LastName: "Henriot",
		JobTypeId: 5,
		JobLevel: 159,
		PublisherId: 2,
		HireDate: new Date("2013-08-19")
	},
	{
		EmployeeId: 12,
		ExtRefKey: "VPA30890F",
		Status: "A",
		FirstName: "Victoria",
		MiddleInitial: "P",
		LastName: "Ashworth",
		JobTypeId: 6,
		JobLevel: 140,
		PublisherId: 2,
		HireDate: new Date("2010-09-13")
	},
	{
		EmployeeId: 13,
		ExtRefKey: "L-B31947F",
		Status: "A",
		FirstName: "Lesley",
		MiddleInitial: " ",
		LastName: "Brown",
		JobTypeId: 7,
		JobLevel: 120,
		PublisherId: 2,
		HireDate: new Date("2011-02-13")
	},
	{
		EmployeeId: 14,
		ExtRefKey: "ARD36773F",
		Status: "A",
		FirstName: "Anabela",
		MiddleInitial: "R",
		LastName: "Domingues",
		JobTypeId: 8,
		JobLevel: 100,
		PublisherId: 2,
		HireDate: new Date("2013-01-27")
	},
	{
		EmployeeId: 15,
		ExtRefKey: "M-R38834F",
		Status: "A",
		FirstName: "Martine",
		MiddleInitial: " ",
		LastName: "Rance",
		JobTypeId: 9,
		JobLevel: 75,
		PublisherId: 2,
		HireDate: new Date("2012-02-05")
	},
	{
		EmployeeId: 16,
		ExtRefKey: "PHF38899M",
		Status: "A",
		FirstName: "Peter",
		MiddleInitial: "H",
		LastName: "Franken",
		JobTypeId: 10,
		JobLevel: 75,
		PublisherId: 2,
		HireDate: new Date("2012-05-17")
	},
	{
		EmployeeId: 17,
		ExtRefKey: "DBT39435M",
		Status: "A",
		FirstName: "Daniel",
		MiddleInitial: "B",
		LastName: "Tonini",
		JobTypeId: 11,
		JobLevel: 75,
		PublisherId: 2,
		HireDate: new Date("2010-01-01")
	},
	{
		EmployeeId: 18,
		ExtRefKey: "H-B39728F",
		Status: "A",
		FirstName: "Helen",
		MiddleInitial: " ",
		LastName: "Bennett",
		JobTypeId: 12,
		JobLevel: 35,
		PublisherId: 2,
		HireDate: new Date("2009-09-21")
	},
	{
		EmployeeId: 19,
		ExtRefKey: "PMA42628M",
		Status: "A",
		FirstName: "Paolo",
		MiddleInitial: "M",
		LastName: "Accorti",
		JobTypeId: 13,
		JobLevel: 35,
		PublisherId: 2,
		HireDate: new Date("2012-08-27")
	},
	{
		EmployeeId: 20,
		ExtRefKey: "ENL44273F",
		Status: "A",
		FirstName: "Elizabeth",
		MiddleInitial: "N",
		LastName: "Lincoln",
		JobTypeId: 14,
		JobLevel: 35,
		PublisherId: 2,
		HireDate: new Date("2010-07-24")
	},
	{
		EmployeeId: 21,
		ExtRefKey: "SKO22412M",
		Status: "A",
		FirstName: "Sven",
		MiddleInitial: "K",
		LastName: "Ottlieb",
		JobTypeId: 5,
		JobLevel: 150,
		PublisherId: 3,
		HireDate: new Date("2011-04-05")
	},
	{
		EmployeeId: 22,
		ExtRefKey: "DWR65030M",
		Status: "A",
		FirstName: "Diego",
		MiddleInitial: "W",
		LastName: "Roel",
		JobTypeId: 6,
		JobLevel: 192,
		PublisherId: 3,
		HireDate: new Date("2011-12-16")
	},
	{
		EmployeeId: 23,
		ExtRefKey: "M-L67958F",
		Status: "A",
		FirstName: "Maria",
		MiddleInitial: " ",
		LastName: "Larsson",
		JobTypeId: 7,
		JobLevel: 135,
		PublisherId: 3,
		HireDate: new Date("2012-03-27")
	},
	{
		EmployeeId: 24,
		ExtRefKey: "PSP68661F",
		Status: "A",
		FirstName: "Paula",
		MiddleInitial: "S",
		LastName: "Parente",
		JobTypeId: 8,
		JobLevel: 125,
		PublisherId: 3,
		HireDate: new Date("2014-01-19")
	},
	{
		EmployeeId: 25,
		ExtRefKey: "MAS70474F",
		Status: "A",
		FirstName: "Margaret",
		MiddleInitial: "A",
		LastName: "Smith",
		JobTypeId: 9,
		JobLevel: 78,
		PublisherId: 3,
		HireDate: new Date("2008-09-29")
	},
	{
		EmployeeId: 26,
		ExtRefKey: "A-C71970F",
		Status: "A",
		FirstName: "Aria",
		MiddleInitial: " ",
		LastName: "Cruz",
		JobTypeId: 10,
		JobLevel: 87,
		PublisherId: 3,
		HireDate: new Date("2011-10-26")
	},
	{
		EmployeeId: 27,
		ExtRefKey: "MAP77183M",
		Status: "A",
		FirstName: "Miguel",
		MiddleInitial: "A",
		LastName: "Paolino",
		JobTypeId: 11,
		JobLevel: 112,
		PublisherId: 3,
		HireDate: new Date("2012-12-07")
	},
	{
		EmployeeId: 28,
		ExtRefKey: "Y-L77953M",
		Status: "A",
		FirstName: "Yoshi",
		MiddleInitial: " ",
		LastName: "Latimer",
		JobTypeId: 12,
		JobLevel: 32,
		PublisherId: 3,
		HireDate: new Date("2009-06-11")
	},
	{
		EmployeeId: 29,
		ExtRefKey: "CGS88322F",
		Status: "A",
		FirstName: "Carine",
		MiddleInitial: "G",
		LastName: "Schmitt",
		JobTypeId: 13,
		JobLevel: 64,
		PublisherId: 3,
		HireDate: new Date("2012-07-07")
	},
	{
		EmployeeId: 30,
		ExtRefKey: "PSA89086M",
		Status: "A",
		FirstName: "Pedro",
		MiddleInitial: "S",
		LastName: "Afonso",
		JobTypeId: 14,
		JobLevel: 89,
		PublisherId: 3,
		HireDate: new Date("2010-12-24")
	},
	{
		EmployeeId: 31,
		ExtRefKey: "PTC11962M",
		Status: "A",
		FirstName: "Philip",
		MiddleInitial: "T",
		LastName: "Cramer",
		JobTypeId: 2,
		JobLevel: 215,
		PublisherId: 4,
		HireDate: new Date("2009-11-11")
	},
	{
		EmployeeId: 32,
		ExtRefKey: "AMD15433F",
		Status: "A",
		FirstName: "Ann",
		MiddleInitial: "M",
		LastName: "Devon",
		JobTypeId: 3,
		JobLevel: 200,
		PublisherId: 4,
		HireDate: new Date("2011-07-16")
	},
	{
		EmployeeId: 33,
		ExtRefKey: "F-C16315M",
		Status: "A",
		FirstName: "Francisco",
		MiddleInitial: " ",
		LastName: "Chang",
		JobTypeId: 4,
		JobLevel: 227,
		PublisherId: 4,
		HireDate: new Date("2010-11-03")
	},
	{
		EmployeeId: 34,
		ExtRefKey: "RBM23061F",
		Status: "A",
		FirstName: "Rita",
		MiddleInitial: "B",
		LastName: "Muller",
		JobTypeId: 5,
		JobLevel: 198,
		PublisherId: 5,
		HireDate: new Date("2013-10-09")
	},
	{
		EmployeeId: 35,
		ExtRefKey: "MJP25939M",
		Status: "A",
		FirstName: "Maria",
		MiddleInitial: "J",
		LastName: "Pontes",
		JobTypeId: 5,
		JobLevel: 246,
		PublisherId: 6,
		HireDate: new Date("2009-03-01")
	},
	{
		EmployeeId: 36,
		ExtRefKey: "JYL26161F",
		Status: "A",
		FirstName: "Janine",
		MiddleInitial: "Y",
		LastName: "Labrune",
		JobTypeId: 5,
		JobLevel: 172,
		PublisherId: 7,
		HireDate: new Date("2011-05-26")
	},
	{
		EmployeeId: 37,
		ExtRefKey: "CFH28514M",
		Status: "A",
		FirstName: "Carlos",
		MiddleInitial: "F",
		LastName: "Hernadez",
		JobTypeId: 5,
		JobLevel: 211,
		PublisherId: 8,
		HireDate: new Date("2009-04-21")
	},
	{
		EmployeeId: 38,
		ExtRefKey: "A-R89858F",
		Status: "A",
		FirstName: "Annette",
		MiddleInitial: " ",
		LastName: "Roulet",
		JobTypeId: 6,
		JobLevel: 152,
		PublisherId: 8,
		HireDate: new Date("2010-02-21")
	},
	{
		EmployeeId: 39,
		ExtRefKey: "HAN90777M",
		Status: "A",
		FirstName: "Helvetius",
		MiddleInitial: "A",
		LastName: "Nagy",
		JobTypeId: 7,
		JobLevel: 120,
		PublisherId: 8,
		HireDate: new Date("2013-03-19")
	},
	{
		EmployeeId: 40,
		ExtRefKey: "M-P91209M",
		Status: "A",
		FirstName: "Manuel",
		MiddleInitial: " ",
		LastName: "Pereira",
		JobTypeId: 8,
		JobLevel: 101,
		PublisherId: 8,
		HireDate: new Date("2009-01-09")
	},
	{
		EmployeeId: 41,
		ExtRefKey: "KJJ92907F",
		Status: "A",
		FirstName: "Karla",
		MiddleInitial: "J",
		LastName: "Jablonski",
		JobTypeId: 9,
		JobLevel: 170,
		PublisherId: 8,
		HireDate: new Date("2014-03-11")
	},
	{
		EmployeeId: 42,
		ExtRefKey: "POK93028M",
		Status: "A",
		FirstName: "Pirkko",
		MiddleInitial: "O",
		LastName: "Koskitalo",
		JobTypeId: 10,
		JobLevel: 80,
		PublisherId: 8,
		HireDate: new Date("2013-11-29")
	},
	{
		EmployeeId: 43,
		ExtRefKey: "PCM98509F",
		Status: "A",
		FirstName: "Patricia",
		MiddleInitial: "C",
		LastName: "McKenna",
		JobTypeId: 11,
		JobLevel: 150,
		PublisherId: 8,
		HireDate: new Date("2009-08-01")
	}
];

export var SaleData = [
	{
		StoreId: 1,
		OrderNumber: "A2976",
		OrderDate: "2013-05-24",
		Quantity: 50,
		PayTerms: "Net 30",
		TitleId: 1
	},
	{
		StoreId: 1,
		OrderNumber: "QA7442.3",
		OrderDate: "2014-09-13",
		Quantity: 75,
		PayTerms: "ON invoice",
		TitleId: 11
	},
	{
		StoreId: 2,
		OrderNumber: "D4482",
		OrderDate: "2014-09-14",
		Quantity: 10,
		PayTerms: "Net 60",
		TitleId: 11
	},
	{
		StoreId: 2,
		OrderNumber: "P2121",
		OrderDate: "2012-06-15",
		Quantity: 20,
		PayTerms: "Net 30",
		TitleId: 7
	},
	{
		StoreId: 2,
		OrderNumber: "P2121",
		OrderDate: "2012-06-15",
		Quantity: 20,
		PayTerms: "Net 30",
		TitleId: 8
	},
	{
		StoreId: 2,
		OrderNumber: "P2121",
		OrderDate: "2012-06-15",
		Quantity: 40,
		PayTerms: "Net 30",
		TitleId: 14
	},
	{
		StoreId: 3,
		OrderNumber: "N914008",
		OrderDate: "2014-09-14",
		Quantity: 20,
		PayTerms: "Net 30",
		TitleId: 11
	},
	{
		StoreId: 3,
		OrderNumber: "N914014",
		OrderDate: "2014-09-14",
		Quantity: 25,
		PayTerms: "Net 30",
		TitleId: 13
	},
	{
		StoreId: 3,
		OrderNumber: "P3087a",
		OrderDate: "2013-05-29",
		Quantity: 25,
		PayTerms: "Net 60",
		TitleId: 3
	},
	{
		StoreId: 3,
		OrderNumber: "P3087a",
		OrderDate: "2013-05-29",
		Quantity: 15,
		PayTerms: "Net 60",
		TitleId: 4
	},
	{
		StoreId: 3,
		OrderNumber: "P3087a",
		OrderDate: "2013-05-29",
		Quantity: 25,
		PayTerms: "Net 60",
		TitleId: 12
	},
	{
		StoreId: 3,
		OrderNumber: "P3087a",
		OrderDate: "2013-05-29",
		Quantity: 20,
		PayTerms: "Net 60",
		TitleId: 17
	},
	{
		StoreId: 4,
		OrderNumber: "423LL922",
		OrderDate: "2014-09-14",
		Quantity: 15,
		PayTerms: "ON invoice",
		TitleId: 13
	},
	{
		StoreId: 4,
		OrderNumber: "423LL930",
		OrderDate: "2014-09-14",
		Quantity: 10,
		PayTerms: "ON invoice",
		TitleId: 2
	},
	{
		StoreId: 4,
		OrderNumber: "P723",
		OrderDate: "2013-03-11",
		Quantity: 25,
		PayTerms: "Net 30",
		TitleId: 5
	},
	{
		StoreId: 4,
		OrderNumber: "QA879.1",
		OrderDate: "2013-05-22",
		Quantity: 30,
		PayTerms: "Net 30",
		TitleId: 9
	},
	{
		StoreId: 5,
		OrderNumber: "6871",
		OrderDate: "2014-09-14",
		Quantity: 5,
		PayTerms: "Net 60",
		TitleId: 2
	},
	{
		StoreId: 5,
		OrderNumber: "722a",
		OrderDate: "2014-09-13",
		Quantity: 3,
		PayTerms: "Net 60",
		TitleId: 11
	},
	{
		StoreId: 6,
		OrderNumber: "QQ2299",
		OrderDate: "2013-10-28",
		Quantity: 15,
		PayTerms: "Net 60",
		TitleId: 16
	},
	{
		StoreId: 6,
		OrderNumber: "TQ456",
		OrderDate: "2013-12-12",
		Quantity: 10,
		PayTerms: "Net 60",
		TitleId: 6
	},
	{
		StoreId: 6,
		OrderNumber: "X999",
		OrderDate: "2013-02-21",
		Quantity: 35,
		PayTerms: "ON invoice",
		TitleId: 10
	}
];
