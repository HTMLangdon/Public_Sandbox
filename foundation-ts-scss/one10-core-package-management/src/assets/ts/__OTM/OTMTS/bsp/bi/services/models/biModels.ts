/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

//export interface WsReportType { // Combined with WsReportViewConfig
//	ReportTypeId: number;
//	ReportTypeName: string;
//}

export interface WsReportViewConfig {
	ReportTypeId: number;
	ReportTypeName: string,
	ShowDateSelection: boolean,
	ShowIndustrySelection: boolean,
	ShowProductCategorySelection: boolean,
	ShowProductSelection: boolean,
	ShowHierarchySelection: boolean
}

export interface WsIndustryType {
	IndustryTypeId: number;
	IndustryTypeName: string;
}

export interface WsProductCategoryType {
	ProductCategoryTypeId: number;
	ProductCategoryTypeName: string;
}

export interface WsProductType {
	ProductTypeId: number;
	ProductTypeName: string;
}

export interface WsReportRequest {
	// [TODO] Fill in other filter parameters
	ReportId: number;
	IndustryTypes?: number[];
	StartDate?: Date;
	EndDate?: Date;
	ProductCategoryTypes?: number[];
	ProductTypes?: number[];
	//HierarchyIds?: number[]; // FUTURE?
	HierarchyId?: number;
	// (etc.) ...
}

export interface WsReportResponse {
	ReportId: number;
	ReportName: string;
	Items: any[];
}

export interface WsHierarchyType {
	HierarchyId: number;
	HierarchyName: string;
	Children: WsHierarchyType[];
}
