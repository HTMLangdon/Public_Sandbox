
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
export class ReportService extends ServiceModule {
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


  GetSampleReportData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/report/runsamplereport",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });
  }

    GetMyOrgSummaryData(data: ReportParameters): Promise < WsResponseData < WSReportResponse >> {
      let mod = this;
      let services = mod.Services;
      let constants = mod.Constants;
      let appConfig = mod.AppConfig;

      // Make the service call
      return services.MakeServiceCall({
        EndPoint: appConfig.Core.WSRoot + "/recognition/runMyOrgSummaryReport",
        Method: constants.Method.Post,
        Data: JSON.stringify(data)
      });


  }

    GetMyDirectReportsData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
      let mod = this;
      let services = mod.Services;
      let constants = mod.Constants;
      let appConfig = mod.AppConfig;

      // Make the service call
      return services.MakeServiceCall({
        EndPoint: appConfig.Core.WSRoot + "/recognition/runMyDirectReportsreport",
        Method: constants.Method.Post,
        Data: JSON.stringify(data)
      });


    }
    GetEnrolledStatusCodes(): Promise<WsResponseData<WsStringData[]>> {

      let mod = this;
      let services = mod.Services;
      let constants = mod.Constants;
      let appConfig = mod.AppConfig;

      // Make the service call
      return services.MakeServiceCall({
        EndPoint: appConfig.Core.WSRoot + "/recognition/getEnrolledStatusCodes",
        Method: constants.Method.Post
      });

	}

}
