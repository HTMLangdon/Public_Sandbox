
import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';

export interface ReportParameters {
	RptID: string;
	StartDate: Date;
  EndDate: Date;
  StartMonth: number;
  EndMonth: number;
  StartYear: number;
  EndYear: number;
  PromotionId: string;
  Brands: string;
  Products: string;
  SearchType: string;
  SearchValue: string;
  GameId: string;
}

export interface WSReportResponse {
  ReportId: string;
  Title: string;
  Description: string;
  Header: string;
  Footer: string;
  ColumnHeader: any[];
  ReportData: any[]; 
}

export interface WsGameData {
  GameId: string;
  GameName: string;
  PromotionId: string
}

@Injectable(null, ScopeType.Singleton)
//export class PromoService_Mock extends MockServiceModule {
export class GamificationService extends ServiceModule {
  constructor(sm: ServiceManager) {
    // Call the parent
    super("GamificationService", sm);

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

  GetAllGames(data: ReportParameters): Promise<WsResponseData<WsGameData[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Gamification/getAllGames",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

  GetSpinnWinParticipantDetailsReportData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/Gamification/runSpinnWInParticipantDetailsreport",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

}
