
import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ReportParameters } from './models/reportModels';

//export interface ReportParameters {
//	RptID: string;
//	StartDate: Date;
//  EndDate: Date;
//  StartMonth: number;
//  EndMonth: number;
//  StartYear: number;
//  EndYear: number;
//  PromotionId: string;
//  Brands: string;
//  Products: string;
//  SearchType: string;
//  SearchValue: string;
//  GameId: string;
//  ParticipantId: number;
//  StatusCd: string;
//	UserName: string;
//	PromotionIdList: any[];
//StatusCdList: any[];
//}

export interface WSReportResponse {
  ReportId: string;
  Title: string;
  Description: string;
  Header: string;
  Footer: string;
  ColumnHeader: any[];
  ReportData: any[]; 
}

export interface WsPromotion {
	PromotionId : string;
	PromotionDesc: string;

}

export interface WsStatus {
	StatusCd: string;
	StatusDesc: string;

}


export interface WsStringData {
  StringData: string;
}

@Injectable(null, ScopeType.Singleton)
//export class PromoService_Mock extends MockServiceModule {
export class EarningService extends ServiceModule {
  constructor(sm: ServiceManager) {
    // Call the parent
    super("PromoService", sm);

    //debugger;
    let mod = this;

    // Initialize
    mod.Initialize();
  }

  Initialize() {
    // Call the parent
    super.Initialize();

    //debugger;
    let mod = this;
    let util = mod.Util;

    mod.WriteLog("Initialize.");
  }

	GetEarningManagementReport(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/report/EarningManagement",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});

	}

	GetDistinctEarningPromotions(): Promise<WsResponseData<WsPromotion[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/report/GetDistinctEarningPromotions",
			Method: constants.Method.Post
		});

	}

	GetEarningStatusCd(): Promise<WsResponseData<WsStatus[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/report/GetEarningStatusCodes",
			Method: constants.Method.Post
		});

	}

}
