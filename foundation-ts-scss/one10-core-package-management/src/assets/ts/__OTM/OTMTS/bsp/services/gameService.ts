// TSA [Review] Move this to the Game Folder
import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ReportParameters } from './models/reportModels';

//TSA [Review]Move Models to a separate file
export class WsGameCreditResponse {
  UserId: number;
  ParticipantId: number;
  TotalAvailableCredits: number;
  GameDetail: WsGameCreditDetailResponse[]
}
export class WsGameCreditDetailResponse {
  GameId: number;
  GameName: string;
  AvailableCredits: number;
  GameUrl: string;
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
export class GameService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
      super("GameService", sm);

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


  public async GetGamificationPendingCredits(): Promise<WsResponseData<WsGameCreditResponse>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;

    // Make the service call
    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/game/getpendingcredits",
      Method: constants.Method.Get
    });

  }

  GetAllGames(data: ReportParameters): Promise<WsResponseData<WsGameData[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/game/getAllGames",
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
      EndPoint: appConfig.Core.WSRoot + "/game/runSpinnWInParticipantDetailsreport",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });
  }

	GetSpinnWinGameDetailReportData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/game/runSpinnWinGameDetailReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}
}

