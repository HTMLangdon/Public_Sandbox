/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { UserInfo, MenuItem, LoginResponse, LogoffResponse } from 'cp/securityShared';
import { MockServiceModule, WsResponse, WsResponseData, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { Pages, PromotionStatuses, Promotions, ParticipantTypes, ParticipantSelectionTypes, AwardTypes, FulfillmentTypes, FulfillmentTypeMap } from './promoData';
import { WsPromotionStatus, WsParticipantType, WsParticipantSelectionType, WsAwardType, WsFulfillmentType, WsPromotionDetails, WsPromotionSearchRequest } from '../models/promoModels';

@Injectable(null, ScopeType.Singleton)
export class PromoService extends MockServiceModule {
	constructor() {
		super("PromoService");
	}

	public GetPageInfo(id: string): Promise<WsResponseData<any>> {
		//debugger;
		let mod = this;

		var page = Pages[id];
		mod.CleanPaths(page);

		return new Promise<WsResponseData<any>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<any>(page));
		});
	}
	public GetPromotionStatuses(): Promise<WsResponseData<WsPromotionStatus[]>> {
		let mod = this;
		return mod.GetMockData(PromotionStatuses, true, false);
	}
	public GetParticipantTypes(): Promise<WsResponseData<WsParticipantType[]>> {
		let mod = this;
		return mod.GetMockData(ParticipantTypes, true, false);
	}
	public GetParticipantSelectionTypes(): Promise<WsResponseData<WsParticipantSelectionType[]>> {
		let mod = this;
		return mod.GetMockData(ParticipantSelectionTypes, true, false);
	}
	public GetAwardTypes(): Promise<WsResponseData<WsAwardType[]>> {
		let mod = this;
		return mod.GetMockData(AwardTypes, true, false);
	}
	public GetFulfillmentTypes(awardTypeId: number): Promise<WsResponseData<WsFulfillmentType[]>> {
		let mod = this;

		return mod.GetMockMapList(FulfillmentTypeMap, FulfillmentTypes, awardTypeId, "FulfillmentTypeId");
	}
	public GetPromotions(req: WsPromotionSearchRequest): Promise<WsResponseData<WsPromotionDetails[]>> {
		let mod = this;
		return mod.GetMockData(Promotions, true, true);
	}
	public GetPromotion(promotionId: number): Promise<WsResponseData<WsPromotionDetails>> {
		//debugger;
		let mod = this;

		return mod.GetMockFirstData(Promotions, item => item.PromotionId == promotionId, null, true, true);
	}
}
