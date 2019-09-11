import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ReportParameters } from 'bsp/services/models/reportModels';


export interface WsMyClaimReport {
	ReportId: string;
	PromotionId: string;
	Title: string;
	Description: string;
	Header: string;
	Footer: string;
	ColumnHeader: any[];
	ReportData: any[];
}

export interface ClaimReportParameters {
	SalesDateFrom: Date;
	SalesDateTo: Date;
	ClaimDateFrom?: Date;
	ClaimDateTo?: Date;
	ContactId: number;
}

export interface WsGizmoClaimReport {
	ReportId: string;
	PromotionId: string;
	Title: string;
	Description: string;
	Header: string;
	Footer: string;
	ColumnHeader: any[]; // [TODO] use strongly typed model, not any
	ReportData: any[];  // [TODO] use strongly typed model, not any
}
export interface WsFileData {
	//StartDate: Date;
	//EndDate: Date;
	SearchType: string;
	SearchValue: string;
	//FILENAME: string

}

@Injectable(null, ScopeType.Singleton)
export class ClaimService extends ServiceModule {

	constructor(sm: ServiceManager) {

		super("ClaimService", sm); // Call the parent

		let mod = this;
		mod.Initialize();
	}

	Initialize() {

		super.Initialize(); // Call the parent

		let mod = this;
		let util = mod.Util;

		//mod.WriteLog("Initialize Recognition Service.");
	}

	async GetSubmittedClaimReport(data: ClaimReportParameters): Promise<WsResponseData<WsMyClaimReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/claim/SubmittedClaimReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});

	}

	async GetClaimGizmoData(data: ClaimReportParameters): Promise<WsResponseData<WsGizmoClaimReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/claim/GizmoClaimReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		}).then((data: WsResponseData<WsGizmoClaimReport>) => {
			let mod = this;
			mod.FormatGizmoData(data);
			return data;
		});

	}

	private FormatGizmoData(data: WsResponseData<WsGizmoClaimReport>) {
		//debugger;
		let mod = this;

		if (data.Data != null && data.Data.ReportData != null && data.Data.ReportData.length > 0) {
			
			data.Data.ReportData.forEach(function (v1: any) { // [TODO] use strongly typed model, not any
				if (v1.AddDt != null && v1.AddDt != "") {
					// Convert to a date since the service (JSON) left it as a string
					v1.AddDt = new Date(v1.AddDt);
				}
			});
		}
	}
	async GetSubmittedBulkClaimReport(data: ReportParameters): Promise<WsResponseData<WsMyClaimReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/claim/SubmittedClaimsBulkUpload",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});

	}
	GetAllFileNames(data: ReportParameters): Promise<WsResponseData<[WsFileData]>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/claim/getAllFileNames",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});

	}
}
