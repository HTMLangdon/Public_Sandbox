/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { MockServiceModule, WsResponse, WsResponseData, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { WsIndustryType, WsReportRequest, WsReportResponse, WsReportViewConfig, WsProductCategoryType, WsProductType } from '../models/biModels';
import { ReportViewConfig, IndustryTypes, IndustryTypeMap, ProductCategoryTypes, ProductCategoryTypeMap, ProductTypes, ProductTypeMap, ReportData, HierarchySource } from './biData';

@Injectable(null, ScopeType.Singleton) // [TODO] Use DI AutoInit
export class BiService extends MockServiceModule {
	constructor() {
		super("BiService");
	}

	public GetReportTypes(): Promise<WsResponseData<WsReportViewConfig[]>> {
		let mod = this;
		return mod.GetMockData(ReportViewConfig, false, false);
	}

	public GetReportConfig(reportId: number): Promise<WsResponseData<WsReportViewConfig>> {
		let mod = this;
		let rptConfig = ReportViewConfig.first(item => item.ReportTypeId == reportId);
		if (rptConfig != null) {
			return mod.GetMockData(rptConfig, false, false);
		}
		else
			return new Promise<WsResponseData<WsReportViewConfig>>((resolve, reject) => {
				resolve(new WsResponseData<WsReportViewConfig>(
					null,
					ServiceConstants.ServiceStatusCode.Success, ServiceConstants.ServiceStatusMessage.Success,
					ServiceConstants.ResponseCode.NotFound, ServiceConstants.ResponseMessage.NotFound
				))
			});
	}

	public GetIndustryTypes(reportId: number): Promise<WsResponseData<WsIndustryType[]>> {
		let mod = this;

		return mod.GetMockMapList(IndustryTypeMap, IndustryTypes, reportId, "IndustryTypeId");
	}

	public GetProductCategoryTypes(industryTypes: number[]): Promise<WsResponseData<WsProductCategoryType[]>> {
		let mod = this;

		return mod.GetMockMapList(ProductCategoryTypeMap, ProductCategoryTypes, industryTypes, "ProductCategoryTypeId");
	}

	public GetProductTypes(productCategoryTypes: number[]): Promise<WsResponseData<WsProductType[]>> {
		let mod = this;

		return mod.GetMockMapList(ProductTypeMap, ProductTypes, productCategoryTypes, "ProductTypeId");
	}

	public GetHierarchy(): Promise<WsResponseData<any[]>> { // [TODO] Make returned array strongly-typed
		let mod = this;

		return mod.GetMockData(HierarchySource, false, false);
	}

	public GetReportData(req: WsReportRequest): Promise<WsResponseData<WsReportResponse>> {
		let mod = this;

		return mod.GetMockFirstData<WsReportResponse>(ReportData, item => item.ReportId == req.ReportId);
	}
}
