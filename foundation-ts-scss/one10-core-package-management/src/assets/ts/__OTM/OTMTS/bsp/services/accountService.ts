import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ReportParameters, AuditClaimParameters, ClaimRowXML} from './models/reportModels';

//export interface ReportParameters {
//	RptID: string;
//	StartYear: string;
//	StartMonth: string;
//	SearchValue: string;
//	StatusCd: string;
	
//}

export interface WSReportResponse {
	ReportId: string;
	Title: string;
	Description: string;
	Header: string;
	Footer: string;
	ColumnHeader: any[];
	ReportData: any[];
	ReportDataPoints: any[];
	ColumnHeaderPoints: any[];
}

export interface WsAuditStatusData {
	StatusCode: string;
	StatusDescription: string;
}


@Injectable(null, ScopeType.Singleton)
//export class PromoService_Mock extends MockServiceModule {
export class AccountService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("AccountService", sm);

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


	GetIdentityManagementReportData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runIdentityManagementReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetLoginActivityData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runLoginActivityReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}


	GetLoginActivityDetailData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runLoginActivityDetailReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetEnrollmentDetailData(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runEnrollmentReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetEarningsStatement(data: ReportParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runEarningsStatement",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetAuditClaim(data: AuditClaimParameters): Promise<WsResponseData<WSReportResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/runAuditClaim",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		}).then(data => {
			data = mod.FormatAuditData(data);
			return data;
		});
	}

	GetAuditStatus(data: AuditClaimParameters): Promise<WsResponseData<WsAuditStatusData[]>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/getAllAuditStatus",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});

	}

	UpdateAuditClaim(XMLdata: ClaimRowXML): Promise<WsResponseData<WSReportResponse>> {

		//debugger;

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/account/updateAuditClaim",
			Method: constants.Method.Post,
			Data: JSON.stringify(XMLdata)
		});
	}


	private FormatAuditData(data: any) {

		if (data != null && data.Data != null && data.Data.ReportData != null) {

			//format date's here... required for excel export
			data.Data.ReportData.forEach(function (v1: any) {

				v1.SalesDate = v1.SalesDate != null ? new Date(v1.SalesDate).toLocaleDateString("en-US") : null;  //todo: globilization
				v1.ClaimSubmissionDate = v1.ClaimSubmissionDate != null ? new Date(v1.ClaimSubmissionDate).toLocaleDateString("en-US") : null;
				v1.AwardDt = v1.AwardDt != null ? new Date(v1.AwardDt).toLocaleDateString("en-US") : null;
				v1.ClaimAuditDate1 = v1.ClaimAuditDate1 != null ? new Date(v1.ClaimAuditDate1).toLocaleDateString("en-US") : null;
				v1.ClaimAuditDate2 = v1.ClaimAuditDate2 != null ? new Date(v1.ClaimAuditDate2).toLocaleDateString("en-US") : null;
				v1.ClaimAuditDate2 = v1.ClaimAuditDate2 != null ? new Date(v1.ClaimAuditDate2).toLocaleDateString("en-US") : null;
			});
		}

		return data;
	}

}
