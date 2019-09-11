/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { MockTypeMap } from 'cp/serviceShared';
import { WsIndustryType, WsProductCategoryType, WsProductType, WsReportResponse, WsReportViewConfig } from '../models/biModels';

//export var ReportTypes: WsReportType[] = [ // Combined with WsReportViewConfig
//	{ ReportTypeId: 1, ReportTypeName: 'Report A' },
//	{ ReportTypeId: 2, ReportTypeName: 'Report B' },
//	{ ReportTypeId: 3, ReportTypeName: 'Report C' },
//	{ ReportTypeId: 4, ReportTypeName: 'Report D' },
//];

export var ReportViewConfig: WsReportViewConfig[] = [
	{ ReportTypeId: 1, ReportTypeName: 'Report A', ShowDateSelection: true, ShowIndustrySelection: true, ShowProductCategorySelection: true, ShowProductSelection: true, ShowHierarchySelection: true },
	{ ReportTypeId: 2, ReportTypeName: 'Report B', ShowDateSelection: false, ShowIndustrySelection: true, ShowProductCategorySelection: true, ShowProductSelection: false, ShowHierarchySelection: false },
	{ ReportTypeId: 3, ReportTypeName: 'Report C', ShowDateSelection: true, ShowIndustrySelection: false, ShowProductCategorySelection: true, ShowProductSelection: false, ShowHierarchySelection: false },
];

export var IndustryTypes: WsIndustryType[] = [
	{ IndustryTypeId: 1, IndustryTypeName: 'Automotive' },
	{ IndustryTypeId: 2, IndustryTypeName: 'Electronics' },
	{ IndustryTypeId: 3, IndustryTypeName: 'Finance' }
];

export var IndustryTypeMap: MockTypeMap[] = [
	{ id: 1, values: [1, 2, 3] },
	{ id: 2, values: [2, 3] },
	{ id: 3, values: [1, 3] }
];

export var ProductCategoryTypes: WsProductCategoryType[] = [
	//{ ProductCategoryTypeId: 10, ProductCategoryTypeName: "Brakes", IndustryTypes: [1,2] }, // Something like this if we want to do client-side filtering
	{ ProductCategoryTypeId: 100, ProductCategoryTypeName: "Brakes" },
	{ ProductCategoryTypeId: 110, ProductCategoryTypeName: "Wipers" },
	{ ProductCategoryTypeId: 200, ProductCategoryTypeName: "Printers" },
	{ ProductCategoryTypeId: 210, ProductCategoryTypeName: "Monitors" },
	{ ProductCategoryTypeId: 300, ProductCategoryTypeName: "Maintenance Contracts" },
	{ ProductCategoryTypeId: 310, ProductCategoryTypeName: "Service Contracts" }
];

export var ProductCategoryTypeMap: MockTypeMap[] = [
	{ id: 1, values: [100, 110] },
	{ id: 2, values: [200, 210] },
	{ id: 3, values: [300, 310] }
];

export var ProductTypes: WsProductType[] = [
	{ ProductTypeId: 101, ProductTypeName: "Brakes 1" },
	{ ProductTypeId: 102, ProductTypeName: "Brakes 2" },
	{ ProductTypeId: 111, ProductTypeName: "Wipers 1" },
	{ ProductTypeId: 112, ProductTypeName: "Wipers 2" },
	{ ProductTypeId: 201, ProductTypeName: "Printers 1" },
	{ ProductTypeId: 202, ProductTypeName: "Printers 2" },
	{ ProductTypeId: 211, ProductTypeName: "Monitors 1" },
	{ ProductTypeId: 212, ProductTypeName: "Monitors 2" },
	{ ProductTypeId: 301, ProductTypeName: "Maintenance Contracts 1" },
	{ ProductTypeId: 302, ProductTypeName: "Maintenance Contracts 2" },
	{ ProductTypeId: 311, ProductTypeName: "Service Contracts 1" },
	{ ProductTypeId: 312, ProductTypeName: "Service Contracts 2" },
];

export var ProductTypeMap: MockTypeMap[] = [
	{ id: 100, values: [101, 102] },
	{ id: 110, values: [111, 112] },
	{ id: 200, values: [201, 202] },
	{ id: 210, values: [211, 212] },
	{ id: 300, values: [301, 302] },
	{ id: 310, values: [311, 312] }
];

export var ReportData: WsReportResponse[] = [
	{
		ReportId: 1, ReportName: "Personnel List", Items: [
			{ EntityId: 3117818, Username: 'pax-33', FirstName: 'James', LastName: 'Smith' },
			{ EntityId: 3117819, Username: 'pax-35', FirstName: 'Edward', LastName: 'Turner' },
			{ EntityId: 3117820, Username: 'pax-36', FirstName: 'John', LastName: 'Jones' },
			{ EntityId: 3117821, Username: 'pax-37', FirstName: 'Patricia', LastName: 'Anderson' },
			{ EntityId: 3117822, Username: 'pax-38', FirstName: 'Paul', LastName: 'Thomas' },
			{ EntityId: 3117823, Username: 'pax-40', FirstName: 'Kenneth', LastName: 'Green' },
			{ EntityId: 3117824, Username: 'pax-41', FirstName: 'Gary', LastName: 'Collins' },
			{ EntityId: 3117825, Username: 'pax-42', FirstName: 'Mark', LastName: 'Thompson' },
			{ EntityId: 3117826, Username: 'pax-43', FirstName: 'Joseph', LastName: 'Davis' },
			{ EntityId: 3117827, Username: 'pax-45', FirstName: 'Larry', LastName: 'Morrison' }
		]
	}
]

export var HierarchySource = [
	{
		id: 1,
		name: "Storage", items: [
			{ id: 11, name: "Wall Shelving" },
			{ id: 12, name: "Floor Shelving" },
			{ id: 13, name: "Kids Storage" }
		]
	},
	{
		id: 2,
		name: "Lights", items: [
			{ id: 21, name: "Ceiling" },
			{ id: 22, name: "Table" },
			{ id: 23, name: "Floor" }
		]
	}
];
