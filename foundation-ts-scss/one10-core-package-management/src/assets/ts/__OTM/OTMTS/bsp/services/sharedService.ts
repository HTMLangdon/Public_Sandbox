/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, WsResponseData, MockServiceModule, ICallInfo } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ServiceConstants } from 'cp/serviceShared';


interface WsUspsZip {
	ZipCode: string;
	City: string;
	StateCode: string;
	CountyName: string;
	AddressDisplay: string;
	
}
@Injectable(null, ScopeType.Singleton)
export class SharedService extends ServiceModule {
	//Constants: ServiceConstants;

	constructor(sm: ServiceManager) {
		super("SharedService", sm);
	}

	//public GetAddressWrapper(param: any): any {

	//	this.GetAddressRequest(param)
	//		.then((data) => {
	//			if (data.ResponseCode == ServiceConstants.ResponseCode.Success) {
	//				// Save the data
	//				debugger;
	//				var x = 1;
	//				return data.Data;
	//				//resolve();
	//			} else {
	//				//resolve();
	//			}
	//		});
	//}
	public GetAddressRequest(param: any):  Promise<WsResponseData<WsUspsZip[]>> {
	
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let zip = param.data.filter.filters[0].value;
		//let util = mod.Util;
		// Call the service
		var x = services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/form/getAddress/" + zip,
			Method: constants.Method.Get,
			Data: null
		});

		return x;
	}


}

