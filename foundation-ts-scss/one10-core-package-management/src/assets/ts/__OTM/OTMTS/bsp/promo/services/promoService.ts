/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, WsResponseData, MockServiceModule, ICallInfo } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import * as promoModel from './models/promoModels';
import { WsAccountNumber } from './models/manualProgramModels';
//import { WsXxx, WsYyyRequest, WsYyy } from '../models/manualProgramServiceModels';

@Injectable(null, ScopeType.Singleton)
export class PromoService extends ServiceModule {
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

	public GetSalesCodes(): Promise<WsResponseData<promoModel.WsPromoSalesAgreementCode>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    //debugger;
    return services.MakeServiceCall({
		EndPoint: appConfig.Core.WSRoot + "/Promo/GetSalesCodes",
		Method: constants.Method.Post,
		ParseDates: true
    });
  }


	public GetStateProvince(): Promise<WsResponseData<promoModel.WsPromoStateProvince[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    //debugger;
    return services.MakeServiceCall({
		EndPoint: appConfig.Core.WSRoot + "/Promo/GetStateProvince",
		Method: constants.Method.Get,
		ParseDates: true
    });
  }

	public GetPromoAccountDetails(req: promoModel.WsAccountRequest): Promise<WsResponseData<promoModel.WsPromoAccountDetails[]>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.AppConfig;
    //debugger;
    return services.MakeServiceCall({
		EndPoint: appConfig.Core.WSRoot + "/Promo/GetPromoAccountDetails",
		Method: constants.Method.Post,
		Data: JSON.stringify(req),
		ParseDates: true
    });
	}

	public GetPromoHierarchy(req: promoModel.WsHierarchyTypeRequest): Promise<WsResponseData<promoModel.WsHierarchyType[]>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;
		//debugger;
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/Promo/GetPromoHierarchy",
			Method: constants.Method.Post,
			Data: JSON.stringify(req),
			ParseDates: true
		});
	}

	public SavePromoData(req: promoModel.WsProgramConfigRequest): Promise<WsResponseData<promoModel.WsPromoEntityIdResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;
		//debugger;
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/Promo/SavePromoConfigProgram",
			Method: constants.Method.Post,
			Data: JSON.stringify(req),
			ParseDates: true
		});
	}
	 
}
