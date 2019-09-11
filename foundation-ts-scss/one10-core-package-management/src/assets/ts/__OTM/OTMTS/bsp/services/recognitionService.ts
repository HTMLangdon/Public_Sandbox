import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { ReportParameters } from 'bsp/services/models/reportModels';


export interface WsRecognitionData {
  TopRecogniziers: WsRecognitionPerson[];
  Menu: WsRecogitionMenu[];
  Stats: WsStat[];
}

export interface WsRecogitionMenu {
  Text: string;
  Url: string;
}

export interface WsStat {
  Number: string;
  Label: string;
}

export interface WsRecognitionPerson {
  Icon: string;
  Rank: string;
  Name: string;
  Amount: string;
}

export interface RecognitionParameters {
  StartDate: Date;
  EndDate: Date;
}

export interface WsRecognitionFeedData {
  RecognitionAll: WsRecognitionFeedPerson[];
  RecognitionMe: WsRecognitionFeedPerson[];
  Menu: WsRecogitionMenu[];
}

export interface WsRecognitionFeedPerson {
  RecognitionId: number;
  RecognitionReceiverId: number;
  ProfileImage: string; //also to be used as Icon 
  ToName: string;
  FromName: string;
  Title: string;
  Comment: string;
  LikeUrl: string;
  LikeCount: string;
  CommentUrl: string;
  CommentCount: string;
  DaysAgo: number;
  Comments: WsRecognitionComment[];
  Likes: WsRecognitionLike[];
}

export interface WsRecognitionComment {
  RecognitionId: number;
  RecognitionReceiverID: number;
  RecognitionSenderID: number;
  CommentID: number;
  RecognitionSender: string;
  RecognitionReceiver: string;
  Comment: string;
  Commenter: string;
  AddedDate: Date;
  type: string;
  Img: string;
  CanDelete: boolean;
}

export interface WsRecognitionLike {
  LikeReceiverID: number;
  LikeSenderID: number;
  LikeID: number;
  LikerName: string;
  LikerProfileImage: string;
  LikeCount: number;
  AddedDate: Date;
  LocalDate: string;
  TimestampEntity: string;
  TimestampValue: string;
  RNO: number;
  type: string;
}

export interface WsMyRecognitionReport {
	ReportId: string;
	PromotionId: string;
	Title: string;
	Description: string;
	Header: string;
	Footer: string;
	ColumnHeader: any[];
	ReportData: any[];
}

export interface WsStatus {
	StatusCd: string;
	StatusDesc: string;

}

export interface WsGenericKVP {
	Code: string;
	Description: string;
}

export interface ProgramDataReportParameters {
	RecognitionId: number[];
	RecognitionStatus: string[];
	RecognitionReceiverStatus: string;
	ReceiverStatus: string[];
	ReceiverReportingLevel2: string;
	IncludePointLoad: boolean;
	StartDate?: Date;
	EndDate?: Date;
}

@Injectable(null, ScopeType.Singleton)
export class RecognitionService extends ServiceModule {

  constructor(sm: ServiceManager) {
    
    super("RecognitionService", sm); // Call the parent

    let mod = this;
    mod.Initialize();
  }

  Initialize() {
    
    super.Initialize(); // Call the parent

	let mod = this;
	let util = mod.Util;

    //mod.WriteLog("Initialize Recognition Service.");
  }

  async GetRecognitionData(data: RecognitionParameters): Promise<WsResponseData<WsRecognitionData>> {
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionStats",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
	}).then(data => {
		data = mod.FormatStatsData(data);
		return data;
	});

  }

  async GetRecognitionFeedData(data: RecognitionParameters): Promise<WsResponseData<WsRecognitionFeedData>> {	  
    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionFeedData",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    }).then(data => {
      data = mod.FormatRecData(data);
      return data;
      });

  }

  async GetRecognitionComments(data: WsRecognitionComment): Promise<WsResponseData<WsRecognitionComment>> {

    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionComments",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    }).then(data => {
        return data;
      });
  }

  async SetRecognitionComments(data: WsRecognitionComment): Promise<WsResponseData<WsRecognitionComment>> {

    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/saveRecognitionComment",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

  async DeleteRecognitionComments(data: WsRecognitionComment): Promise<WsResponseData<WsRecognitionComment>> {

    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/deleteRecognitionComment",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

  async SetRecognitionLike(data: WsRecognitionLike): Promise<WsResponseData<WsRecognitionLike>> {

    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/saveRecognitionLikes",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

  async GetRecognitionLike(data: WsRecognitionComment): Promise<WsResponseData<WsRecognitionComment>> {

    let mod = this;
    let services = mod.Services;
    let constants = mod.Constants;
    let appConfig = mod.Services.AppConfig;

    // Make the service call
    return services.MakeServiceCall({
      EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionLike",
      Method: constants.Method.Post,
      Data: JSON.stringify(data)
    });

  }

	async GetMyRecognitionSentReport(data: ReportParameters): Promise<WsResponseData<WsMyRecognitionReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getMyRecognitionSentReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		}).then(data => {

			data = mod.FormatReportData(data);
			return data;
		});
	}

	async GetMyRecognitionReceviedReport(data: ReportParameters): Promise<WsResponseData<WsMyRecognitionReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getMyRecognitionReceviedReport",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		}).then(data => {

			data = mod.FormatReportData(data);
			return data;
		});
	}

	async GetProgramDataReport(data: ProgramDataReportParameters): Promise<WsResponseData<WsMyRecognitionReport>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/programdata",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetRecognitionProgramCd(): Promise<WsResponseData<WsGenericKVP[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionProgramCd",
			Method: constants.Method.Post
		});

	}

	GetRecognitionStatusCd(): Promise<WsResponseData<WsGenericKVP[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getRecognitionStatusCd",
			Method: constants.Method.Post
		});

	}

	GetReceiverRecognitionStatusCd(): Promise<WsResponseData<WsGenericKVP[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getReceiverRecognitionStatusCd",
			Method: constants.Method.Post
		});

	}

	GetReceiverStatusCd(): Promise<WsResponseData<WsGenericKVP[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getReceiverStatusCd",
			Method: constants.Method.Post
		});

	}

	GetExternalPointLoad(): Promise<WsResponseData<WsGenericKVP[]>> {

		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.Services.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/recognition/getExternalPointLoad",
			Method: constants.Method.Post
		});

	}

	private FormatReportData(data: any) {
		if (data.Data != null && data.Data.ReportData != null && data.Data.ReportData.length > 0) {			
			let mod = this;

			data.Data.ReportData.forEach(function (v1: any) {				
				if (v1.CertificateIssuance == "Y") {
					let siteURL = mod.AppConfig.Core.SiteRoot;

					if (siteURL.substr(-1) !== '/') //siteURL does NOT end in a slash, add it.  Prevent // situations
						siteURL = siteURL + '/';

					let url = siteURL + "Pages/Recognition/DisplayCertificatePDF.aspx?a=" + v1.RecognitionId + "&b=" + v1.receiver_contactId;
					v1.certUrl = "<a href='" + url + "' target='blank'>View Certificate</a>";
				} else {
					v1.certUrl = null;
				}
				
			});
		}

		return data;
	};

  private FormatRecData(data: any) {

	  if (data.Data != null) {

		  let mod = this;

		//clean up RecognitionAll
		  if (data.Data.RecognitionAll != null && data.Data.RecognitionAll.length > 0) {
			  data.Data.RecognitionAll.forEach(function (v1: WsRecognitionFeedPerson) {

				  if (v1.Comments != null && v1.Comments.length > 0) {
					  v1.Comments.forEach(function (d2: WsRecognitionComment) {

						  if (d2.AddedDate != null) {
							  let s: any = d2.AddedDate;
							  d2.AddedDate = new Date(s);
						  }

						  d2.type = "recognition-row--likecomment";
					  });
				  }

				  if (v1.Likes != null && v1.Likes.length > 0) {
					  v1.Likes.forEach(function (d2: WsRecognitionLike) {
						  if (d2.AddedDate != null) {
							  let s: any = d2.AddedDate;
							  d2.AddedDate = new Date(s);
						  }

						  d2.type = "recognition-row--like";
					  });
				  }
			  });
		  }
		  


		//clean up RecognitionMe
		  if (data.Data.RecognitionMe != null && data.Data.RecognitionMe.length > 0) {
			  data.Data.RecognitionMe.forEach(function (v1: WsRecognitionFeedPerson) {

				  if (v1.Comments != null && v1.Comments.length > 0) {
					  v1.Comments.forEach(function (d2: WsRecognitionComment) {
						  if (d2.AddedDate != null) {
							  let s: any = d2.AddedDate;
							  d2.AddedDate = new Date(s);
						  }

						  d2.type = "recognition-row--likecomment";
					  });
				  }

				  if (v1.Likes != null && v1.Likes.length > 0) {
					  v1.Likes.forEach(function (d2: WsRecognitionLike) {
						  if (d2.AddedDate != null) {
							  let s: any = d2.AddedDate;
							  d2.AddedDate = new Date(s);
						  }
						  d2.type = "recognition-row--like";
					  });
				  }

			  });
		  }


		//clean up Menu
		  if (data.Data.Menu != null && data.Data.Menu.length > 0) {
			  for (var x = 0; x < data.Data.Menu.length; x++) {
				  let recgnUrl: string = data.Data.Menu[x].Url;

				  if (recgnUrl && recgnUrl.length > 1 && recgnUrl.substring(0, 2) == '~/')
					  data.Data.Menu[x].Url = mod.AppConfig.Core.SiteRoot + recgnUrl.substring(2);
			  }
		  }
		

    }

    return data;
  }

	private FormatStatsData(data: any) {

		var mod = this;

		if (data.Data != null && data.Data.Menu != null && data.Data.Menu.length > 0) {
			for (var x = 0; x < data.Data.Menu.length; x++) {

				let recgnUrl: string = data.Data.Menu[x].Url;

				if (recgnUrl && recgnUrl.length > 1 && recgnUrl.substring(0, 2) == '~/')
					data.Data.Menu[x].Url = mod.AppConfig.Core.SiteRoot + recgnUrl.substring(2);

			}
		}
		
		return data;

	}

}
