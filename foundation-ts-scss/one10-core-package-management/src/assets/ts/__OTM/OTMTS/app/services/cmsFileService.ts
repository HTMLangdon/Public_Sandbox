
import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager, MockServiceModule, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
import { WsResponseData } from 'cp/serviceShared';

export interface IBool {
	BoolValue: boolean;
	BoolName: string;
}
export interface IStatusType {
	Status: string;
	StatusName: string;
}
export interface IResourceType {
	ResourceTypeId: string;
	ResourceTypeName: string;
}
export interface IPrivilegeType {
	PrivilegeId: string;
	PrivilegeName: string;
}
export interface IBrand {
	BrandCode: string;
	BrandName: string;
}

export interface IResource {
	ResourceId: number;
	ResourceTypeId: string;
	ResourceTypeName: string;
	ParentResourceId?: number;
	Ord: number;
	IsVisible: string;
	Status: string;
	ResourceKey: string;
	BrandCode?: string;
	ResourceName: string;
	ResourcePath?: string;
	ResourceTarget?: string;
	CustomLogic?: string;
	Children?: IResource[];
	Content?: string;
	Privileges?: number[];
}

@Injectable(null, ScopeType.Singleton)
export class CmsService_Mock extends MockServiceModule {
	private _resources: IResource[];

	constructor() {
		super("Cms");

		let mod = this;

		mod._resources = [
			{
				// [TODO] NOTE: Renamed "None" to "Root Container". ResourceTypeId will be changed to "R".
				ResourceId: 1, ResourceTypeId: "N", ResourceTypeName: "Root Container", ResourceKey: "Page", ResourceName: "Page Container", IsVisible: "N", Status: "A", Ord: 1, Children: [
					{
						ResourceId: 10, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:Home", BrandCode: null, ResourceName: "Home", ResourcePath: "~/", IsVisible: "Y", Status: "A", Ord: 1, Privileges: [1], Children: [
							{ ResourceId: 100, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:Login", BrandCode: null, ResourceName: "Login", ResourcePath: "~/Account/Login", IsVisible: "Y", Status: "A", Ord: 1, Privileges: [1] },
							{
								ResourceId: 300, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:IncentiveProgram", BrandCode: null, ResourceName: "Incentive Program", ResourcePath: "~/Programs/PromotionOverview", IsVisible: "Y", Status: "A", Ord: 12, Privileges: [2,3], Children: [
									{ ResourceId: 310, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:PromotionDetails", BrandCode: null, ResourceName: "Program Details", ResourcePath: "~/Programs/PromotionOverview", IsVisible: "N", Status: "A", Ord: 1, Privileges: [3] }
								]
							},
							{
								ResourceId: 400, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:Reports", BrandCode: null, ResourceName: "Reports", ResourcePath: "#", IsVisible: "Y", Status: "A", Ord: 13, Privileges: [1], Children: [
									{ ResourceId: 411, ResourceTypeId: "P", ResourceTypeName: "Page", ResourceKey: "Page:Penetration", BrandCode: null, ResourceName: "Penetration Reports", ResourcePath: "~/aspx/reports/ReportSelection.aspx?reportGroupID=PR", IsVisible: "Y", Status: "A", Ord: 1, Privileges: [1] }
								]
							}
						]
					}
				]
			},
			{
				ResourceId: 10000, ResourceTypeId: "N", ResourceTypeName: "Root Container", ResourceKey: "Message", ResourceName: "Message Container", IsVisible: "N", Status: "A", Ord: 2, Children: [
					{
						ResourceId: 10001, ResourceTypeId: "G", ResourceTypeName: "Group", ResourceKey: "Message:Err", ResourceName: "Error Messages", IsVisible: "N", Status: "A", Ord: 1, Children: [
							{ ResourceId: 10002, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Err1", ResourceName: "Message:Err1", IsVisible: "N", Status: "A", Ord: 1, Content: "Message - Err1" },
							{ ResourceId: 10003, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Err2", ResourceName: "Message:Err2", IsVisible: "N", Status: "A", Ord: 2, Content: "Message - Err2" },
							{ ResourceId: 10004, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Err3", ResourceName: "Message:Err3", IsVisible: "N", Status: "A", Ord: 3, Content: "Message - Err3" }
						]
					},
					{
						ResourceId: 10005, ResourceTypeId: "G", ResourceTypeName: "Group", ResourceKey: "Message:Ln", ResourceName: "Login Messages", IsVisible: "N", Status: "A", Ord: 2, Privileges: [1], Children: [
							{ ResourceId: 10006, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Ln1", ResourceName: "Message:Ln1", IsVisible: "N", Status: "A", Ord: 1, Privileges: [1], Content: "Message - Ln1" },
							{ ResourceId: 10007, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Ln2", ResourceName: "Message:Ln2", IsVisible: "N", Status: "A", Ord: 2, Privileges: [1], Content: "Message - Ln2" },
							{ ResourceId: 10008, ResourceTypeId: "M", ResourceTypeName: "Message", ResourceKey: "Message:Ln3", ResourceName: "Message:Ln3", IsVisible: "N", Status: "A", Ord: 3, Privileges: [1], Content: "Message - Ln3" }
						]
					}
				]
			},
			{
				ResourceId: 20000, ResourceTypeId: "N", ResourceTypeName: "Root Container", ResourceKey: "Content", ResourceName: "Content Container", IsVisible: "N", Status: "A", Ord: 3, Children: [
					{
						ResourceId: 20001, ResourceTypeId: "G", ResourceTypeName: "Group", ResourceKey: "Content:Contact", ResourceName: "Contact Info", IsVisible: "N", Status: "A", Ord: 1, Children: [
							{ ResourceId: 20002, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Contact:Email", BrandCode: "vw", ResourceName: "Content:Contact:Email", IsVisible: "N", Status: "A", Ord: 1, Content: "Contact - Email - VW" },
							{ ResourceId: 20003, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Contact:Email", BrandCode: "au", ResourceName: "Content:Contact:Email", IsVisible: "N", Status: "A", Ord: 1, Content: "Contact - Email - AU" },
							{ ResourceId: 20004, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Contact:Hours", BrandCode: "vw", ResourceName: "Content:Contact:Hours", IsVisible: "N", Status: "A", Ord: 2, Content: "Contact - Hours - VW" },
							{ ResourceId: 20005, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Contact:Hours", BrandCode: "au", ResourceName: "Content:Contact:Hours", IsVisible: "N", Status: "A", Ord: 2, Content: "Contact - Hours - AU" }
						]
					},
					{
						ResourceId: 20006, ResourceTypeId: "G", ResourceTypeName: "Group", ResourceKey: "Content:Footer", ResourceName: "Footer Content", IsVisible: "N", Status: "A", Ord: 2, Children: [
							{ ResourceId: 20007, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Footer:TM", BrandCode: "vw", ResourceName: "Content:Footer:TM", IsVisible: "N", Status: "A", Ord: 1, Content: "Footer - TM - VW" },
							{ ResourceId: 20008, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Footer:TM", BrandCode: "au", ResourceName: "Content:Footer:TM", IsVisible: "N", Status: "A", Ord: 1, Content: "Footer - TM - AU" },
							{ ResourceId: 20009, ResourceTypeId: "C", ResourceTypeName: "Content", ResourceKey: "Content:Footer:Perm", ResourceName: "Content:Footer:Perm", IsVisible: "N", Status: "A", Ord: 2, Content: "Footer - Permission" }
						]
					}
				]
			}
		];
		
		// Replace with the flattened version
		// [TODO] Remove if not needed; or restructure data population
		//debugger;
		let d = []; mod.FlattenData(mod._resources, d, null);
		mod._resources = d;
	}

	private FlattenData(src: IResource[], dest: IResource[], parentId?: number): void {
		let mod = this;

		for (let i = 0; i < src.length; i++) {
			let r = src[i];
			r.ParentResourceId = parentId;
			dest.push(r);

			if (r.Children && r.Children.length > 0) {
				// Flatten the child collection and then remove it
				mod.FlattenData(r.Children, dest, r.ResourceId);
				r.Children = null;
			}
		}
	}

	BuildResourceDataSource(opt: kendo.data.DataSourceOptions): kendo.data.TreeListDataSource { return CmsServiceHelper.BuildResourceDataSource(opt); }

	GetResources(): Promise<WsResponseData<IResource[]>> {
		let mod = this;

		let d = new WsResponseData<IResource[]>();
		d.ResponseCode = ServiceConstants.ResponseCode.Success;
		d.ResponseMessage = ServiceConstants.ResponseMessage.Success;
		d.StatusCode = ServiceConstants.ServiceStatusCode.Success;
		d.Status = ServiceConstants.ServiceStatusMessage.Success;

		let r = mod._resources;
		d.Data = r;

		return new Promise<WsResponseData<IResource[]>>((resolve, reject) => { resolve(d); });
	}
}

class CmsServiceHelper {
	public static BuildResourceDataSource(opt: kendo.data.DataSourceOptions): kendo.data.TreeListDataSource { return new kendo.data.TreeListDataSource(this.ConfigureResourceDataSource(opt)); }
	public static ConfigureResourceDataSource(opt: kendo.data.DataSourceOptions): kendo.data.DataSourceOptions {
		$.extend(true, opt, {
			schema: <kendo.data.DataSourceSchema>{ // By using the casts, we can strongly type
				model: <kendo.data.DataSourceSchemaModelWithFieldsObject>{
					id: "ResourceId",
					parentId: "ParentResourceId",
					fields: {
						ResourceId: { type: "number", nullable: false },
						ParentResourceId: { type: "number", nullable: true },
						ResourceTypeId: { type: "string" },
						ResourceTypeName: { type: "string" },
						Ord: { type: "number" },
						IsVisible: { type: "string" },
						Status: { type: "string" },
						ResourceKey: { type: "string" },
						BrandCode: { type: "string" },
						ResourceName: { type: "string" },
						ResourcePath: { type: "string" },
						ResourceTarget: { type: "string" },
						CustomLogic: { type: "string" },
						Content: { type: "string" }
					}
				}
			}
		});

		return opt;
	}
}


export class cmsFileDeleteModel {
	FileId: string;
}
export class cmsFilePrivilegeRequestModel {
	FileId: string;
}
export class cmsFileSearchModel {
	FileDescription: string;
	FileName: string;
	FileCategoryId: string;
}
export class cmsFileUploadModel extends cmsFileSearchModel {
	//Filename: string;
	File?: any; // Use "any" for now since we're using it with the upload control, which returns an object; [TODO] Rename this property
	//FileDescription: string;
	FileId: string;
	//FileName: string;
	//FileCategoryId: string;
	MimeType: string;
	FileSize: number;
	showResults?: boolean; // [EJD] Needed? Made optional to prevent TS errors.
	hideControl?: boolean; // [EJD] Needed? Made optional to prevent TS errors.
	dataSpan?: any; // [EJD] Needed? Made optional to prevent TS errors.
	FileContent: any;
	selectedType?: string; // [EJD] Needed? Made optional to prevent TS errors.
	ProgramDate: Date;
  lstOfPrivilegeTypes: number[];
	ContainerName?: string;
	LocaleId: string;
}
export class cmsFileUploadResponse {
	isValid: boolean;
    Filename: string;
	FileData: any;
	CmsFileData: any;
}

export class cmsFileCategory {
	Id: number;
	Name: string;
}

export class cmsConfig {
	Key: string;
	Value: string;
}


@Injectable(null, ScopeType.Singleton)
export class CmsFileService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("CmsFileService", sm);

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

	UploadFile(data: cmsFileUploadModel): Promise<WsResponseData<cmsFileUploadResponse>> {
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/cmsFileUpload",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}


	GetSearchResult(data: cmsFileSearchModel): Promise<WsResponseData<cmsFileUploadResponse>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/cmsFileSearch",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetCategories(): Promise<WsResponseData< cmsFileCategory[] >> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/cmsFileCategories",
			Method: constants.Method.Post,
			Data: ""//JSON.stringify(data)
		});
	}


	GetPrivilegeTypes(): Promise<WsResponseData<cmsFileCategory[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/getPrivilegeTypes",
			Method: constants.Method.Post,
			Data: ""
		});
	}

	GetLocaleTypes(): Promise<WsResponseData<cmsFileCategory[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/getLocaleTypes",
			Method: constants.Method.Post,
			Data: ""
		});
	}

	GetFilePrivileges(data: cmsFilePrivilegeRequestModel): Promise<WsResponseData<number[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/getFilePrivileges",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	deleteCmsFile(data: cmsFileDeleteModel): Promise<WsResponseData<string>> { // [TODO] Fix inconsistent naming convention.
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/deleteCmsFile",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	downloadFile(data: cmsFileUploadModel): Promise<WsResponseData<string>> { // [TODO] Fix inconsistent naming convention.
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/downloadFile",
			Method: constants.Method.Post,
			Data: JSON.stringify(data)
		});
	}

	GetConfigs(): Promise<WsResponseData<cmsConfig[]>> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let constants = mod.Constants;
		let appConfig = mod.AppConfig;

		// Make the service call
		return services.MakeServiceCall({
			EndPoint: appConfig.Core.WSRoot + "/cms/cmsConfiguration",
			Method: constants.Method.Post,
			Data: ""
		});
	}


}

