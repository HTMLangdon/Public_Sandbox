// TSA [Review] Move this to the Game Folder
import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';

//TSA [Review]Move Models to a separate file
export class WsPBIResponse {
	Id: string;
	EmbedUrl: string;
	EmbedToken: string;
	UserId: number;
	SelectedReportDisplayName: string;
	AllowedReports: WsPBIReport[]
}
export class WsPBIReport {
	ReportDisplayName: string;
	ReportName: string;
	NavUrl: string;
}

@Injectable(null, ScopeType.Singleton)
//export class PromoService_Mock extends MockServiceModule {
export class PBIService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("PowerBIService", sm);

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


	public async GetReport(reportName: string): Promise<WsResponseData<WsPBIResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/pbi/getConfig/" + reportName,
			Method: constants.Method.Get
		});

	}

}

