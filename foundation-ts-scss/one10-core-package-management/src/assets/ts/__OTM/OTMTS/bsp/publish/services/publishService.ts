/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ServiceModule, ServiceManager, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { WsStatusType, WsFeature, WsTitleTypeBasic, WsPublisherRequest, WsPublisher, WsPublisherBasic, WsTitleRequest, WsTitleResponse, WsAuthorRequest, WsAuthorResponse, WsTitleStatsRequest, TitleStats } from './models/publishModels';

/**
 * Service used to interact with common data and lookups.
 */
@Injectable(null, ScopeType.Singleton)
export class PublishService extends ServiceModule {
	constructor(sm: ServiceManager) {
		super("DashboardService", sm);
	}

	public GetPublishFeatures(): Promise<WsResponseData<WsFeature[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getPublishFeatures",
			Method: constants.Method.Get
		});
	}

	public GetStatusTypes(): Promise<WsResponseData<WsStatusType[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getStatusTypes",
			Method: constants.Method.Get
		});
	}

	public GetTitleTypes(status?: string): Promise<WsResponseData<WsTitleTypeBasic[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getTitleTypes" + (status ? '/' + status : ''),
			Method: constants.Method.Get
		});
	}

	public GetPublishers(req?: WsPublisherRequest): Promise<WsResponseData<WsPublisherBasic[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		let d = req == null
			? {
				PublisherName: '', Status: ''
			}
			: {
				PublisherName: req.PublisherName,
				Status: req.Status
			};

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getPublishers",
			Method: constants.Method.Post,
			Data: JSON.stringify(d),
			ParseDates: true
		});
	}

	public GetPublisher(publisherId: number): Promise<WsResponseData<WsPublisher>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getPublisher/" + publisherId.toString(),
			Method: constants.Method.Get,
			ParseDates: true
		});
	}

	public GetTitles(req: WsTitleRequest): Promise<WsResponseData<WsTitleResponse[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		let d = {
			PublisherId: req.PublisherId,
			TitleName: req.TitleName,
			TitleTypeId: req.TitleTypeId
		};

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getTitles",
			Method: constants.Method.Post,
			Data: JSON.stringify(d),
			ParseDates: true
		});
	}

	public GetTitle(titleId: number): Promise<WsResponseData<WsTitleResponse>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getTitle/" + titleId.toString(),
			Method: constants.Method.Get,
			ParseDates: true
		});
	}

	public GetTitleStats(req: WsTitleStatsRequest): Promise<WsResponseData<TitleStats>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		let d = req
			? {
				TitleTypeId: req.TitleTypeId > 0 ? req.TitleTypeId : null,
				PublisherId: req.PublisherId > 0 ? req.PublisherId : null
			}
			: { TitleTypeId: null, PublisherId: null };

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getTitleStats",
			Method: constants.Method.Post,
			Data: JSON.stringify(d),
			ParseDates: true
		});
	}
	
	public GetAuthors(req: WsAuthorRequest): Promise<WsResponseData<WsAuthorResponse[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;

		let d = {
			FirstName: req.FirstName,
			LastName: req.LastName,
			Status: req.Status
		};

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/publish/getAuthors",
			Method: constants.Method.Post,
			Data: JSON.stringify(d),
			ParseDates: true
		});
	}
}
