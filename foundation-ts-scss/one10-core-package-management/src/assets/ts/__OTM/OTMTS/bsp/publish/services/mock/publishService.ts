/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { MockServiceModule, WsResponseData, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { WsStatusType, WsFeature, WsTitleTypeBasic, WsPublisher, WsPublisherRequest, WsPublisherBasic, WsTitle, WsAuthor, WsTitleRequest, WsTitleResponse, WsAuthorRequest, WsAuthorResponse, WsTitleStatsRequest, TitleStats } from '../models/publishModels';
import { StatusTypeData, FeatureData, TitleTypeData, PublisherData, AuthorData, TitleData, AuthorTitleData } from './publishData';

@Injectable(null, ScopeType.Singleton) // [TODO] Use DI AutoInit
export class PublishService extends MockServiceModule {
	constructor() {
		super("PublishService");
	}

	public GetPublishFeatures(): Promise<WsResponseData<WsFeature[]>> {
		let mod = this;
		return mod.GetMockData(FeatureData, false, true);
	}

	public GetStatusTypes(): Promise<WsResponseData<WsStatusType[]>> {
		let mod = this;
		return mod.GetMockData(StatusTypeData, false, true);
	}

	public GetTitleTypes(): Promise<WsResponseData<WsTitleTypeBasic[]>> {
		let mod = this;
		return mod.GetMockData(TitleTypeData, true, false);
	}

	public GetPublishers(req?: WsPublisherRequest): Promise<WsResponseData<WsPublisherBasic[]>> {
		let mod = this;
		// [TODO] Implement "req" usage
		return mod.GetMockData(PublisherData, true, false);
	}

	public GetPublisher(publisherId: number): Promise<WsResponseData<WsPublisher>> {
		let mod = this;
		return mod.GetMockFirstData(PublisherData, item => item.PublisherId == publisherId, null, true, false);
	}

	private SortAuthors(a: WsAuthor, b: WsAuthor): number {
		let mod = this;

		if (a.LastName > b.LastName) return 1;
		if (a.LastName < b.LastName) return -1;

		if (a.FirstName > b.FirstName) return 1;
		if (a.FirstName < b.FirstName) return -1;
		return 0;
	}

	public GetTitles(req: WsTitleRequest): Promise<WsResponseData<WsTitleResponse[]>> {
		let mod = this;

		let titleName = req.TitleName ? req.TitleName.toLowerCase() : "";

		// [TODO] Add helpers to accomplish all of this (filtering, filling in name values from lookups, filtering outside of a promise)
		let titles = TitleData.where(item =>
			(req.TitleTypeId > 0 ? item.TitleTypeId == req.TitleTypeId : true)
				&& (req.PublisherId > 0 ? item.PublisherId == req.PublisherId : true)
				&& (req.TitleName ? item.TitleName.toLowerCase().indexOf(titleName) >= 0 : true)
		);

		let items: WsTitleResponse[] = [];

		titles.forEach((value, index, arr) => {
			items.push(mod.ConvertTitle(value));
		});

		return new Promise<WsResponseData<WsTitleResponse[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<WsTitleResponse[]>(items));
		});
	}

	public GetTitle(titleId: number): Promise<WsResponseData<WsTitleResponse>> {
		//debugger;
		let mod = this;

		// [TODO] Add helpers to accomplish all of this (filtering, filling in name values from lookups, filtering outside of a promise)
		let titles = TitleData.where(item => item.TitleId == titleId);

		//let item: WsTitleResponse = null;
		//let ad = AuthorData;

		return new Promise<WsResponseData<WsTitleResponse>>((resolve, reject) => {
			if (titles && titles.length > 0) {
				resolve(WsResponseData.SuccessData<WsTitleResponse>(mod.ConvertTitle(titles[0])));
			} else {
				resolve(new WsResponseData<WsTitleResponse>(null, ServiceConstants.ResponseCode.NotFound, ServiceConstants.ResponseMessage.NotFound));
			}
		});
	}

	private ConvertTitle(value: WsTitle): WsTitleResponse {
		let mod = this;

		let authorNames = '';
		let authorIds = AuthorTitleData.where(a => a.TitleId == value.TitleId);
		let authors = AuthorData.where(a => authorIds.first(i => i.AuthorId == a.AuthorId) != null);
		if (authors.length > 0) {
			authors = authors.sort(mod.SortAuthors);
			authors.forEach((value, index, arr) => { if (authorNames.length > 0) authorNames += "; "; authorNames += value.LastName + ', ' + value.FirstName });
		}

		return <WsTitleResponse>$.extend(true, {
			StatusName: value.Status == "A" ? "Active" : "Inactive",
			PublisherName: PublisherData.first(p => p.PublisherId == value.PublisherId).PublisherName,
			TitleTypeName: TitleTypeData.first(t => t.TitleTypeId == value.TitleTypeId).TitleTypeName,
			AuthorNames: authorNames
		}, value);
	}

	public GetTitleStats(req: WsTitleStatsRequest): Promise<WsResponseData<TitleStats>> {
		let mod = this;

		// Get the titles that match the filter criteria
		let titles = TitleData.where(item =>
			(req.TitleTypeId && req.TitleTypeId > 0 ? item.TitleTypeId == req.TitleTypeId : true)
			&& (req.PublisherId && req.PublisherId > 0 ? item.PublisherId == req.PublisherId : true)
			);

		let stats: TitleStats = { TitleTypes: [], Publishers: [] };

		// See if there were any matches
		if (titles && titles.length > 0) {
			let ttl: KeyValueCollection<number> = {};
			let pl: KeyValueCollection<number> = {};

			// Go through the data and aggregate the counts
			for (let i = 0; i < titles.length; i++) {
				let t = titles[i];

				let ttid = t.TitleTypeId.toString();
				let pid = t.PublisherId.toString();
				if (ttl[ttid])
					ttl[ttid] += t.YtdSales;
				else
					ttl[ttid] = t.YtdSales;

				if (pl[pid])
					pl[pid] += t.YtdSales;
				else
					pl[pid] = t.YtdSales;
			}

			// Resolve the IDs into ID + Name
			for (let key in ttl) {
				let ttid = parseInt(key);
				let tt = TitleTypeData.where(item => item.TitleTypeId == ttid);
				if (tt && tt.length > 0)
					stats.TitleTypes.push({ TitleTypeId: tt[0].TitleTypeId, TitleTypeName: tt[0].TitleTypeName, YtdSales: ttl[key] });
				// [TODO] Handle else (not found)
			}
			for (let key in pl) {
				let pid = parseInt(key);
				let p = PublisherData.where(item => item.PublisherId == pid);
				if (p && p.length > 0)
					stats.Publishers.push({ PublisherId: p[0].PublisherId, PublisherName: p[0].PublisherName, YtdSales: pl[key] });
				// [TODO] Handle else (not found)
			}

			// Sort the lists alphabetically
			stats.TitleTypes = stats.TitleTypes.sort((a, b) => a.TitleTypeName > b.TitleTypeName ? 1 : -1);
			stats.Publishers = stats.Publishers.sort((a, b) => a.PublisherName > b.PublisherName ? 1 : -1);
		}

		// Return the data
		return new Promise<WsResponseData<TitleStats>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<TitleStats>(stats));
		});
	}

	public GetAuthors(req: WsAuthorRequest): Promise<WsResponseData<WsAuthorResponse[]>> {
		let mod = this;

		let firstName = req.FirstName ? req.FirstName.toLowerCase() : "";
		let lastName = req.LastName ? req.LastName.toLowerCase() : "";

		// [TODO] Add helpers to accomplish all of this (filtering, filling in name values from lookups, filtering outside of a promise)
		let authors = AuthorData.where(item =>
			(req.Status != '' ? item.Status == req.Status : true)
			&& (req.FirstName ? item.FirstName.toLowerCase().indexOf(firstName) >= 0 : true)
			&& (req.LastName ? item.LastName.toLowerCase().indexOf(lastName) >= 0 : true)
		);

		let items: WsAuthorResponse[] = [];
		let ad = AuthorData;

		authors.forEach((value, index, arr) => {
			let item: WsAuthorResponse = $.extend(true, {
				StatusName: value.Status == "A" ? "Active" : "Inactive"
			}, value);
			items.push(item);
		});

		return new Promise<WsResponseData<WsAuthorResponse[]>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<WsAuthorResponse[]>(items));
		});
	}
}
