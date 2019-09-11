/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

export interface WsPromotionStatus {
	PromotionStatusId: number;
	PromotionStatusName: string;
}

export interface WsParticipantType {
	ParticipantTypeId: number;
	ParticipantTypeName: string;
}

export interface WsParticipantSelectionType {
	ParticipantSelectionTypeId: number;
	ParticipantSelectionTypeName: string;
}

export interface WsAwardType {
	AwardTypeId: number;
	AwardTypeName: string;
}

export interface WsFulfillmentType {
	FulfillmentTypeId: number;
	FulfillmentTypeName: string;
}

export interface WsPromotionDetails {
	PromotionId: number;
	ShortName: string;
	LongName: string;
	PromotionStatusId: number;
	PromotionStatusName: string;

	ParticipantTypeId: number;
	ParticipantTypeName: string;
	ParticipantSelectionTypeId: number;
	ParticipantSelectionTypeName: string;

	//PromotionStatus: WsPromoStatus;
	//ViewStart: Date;
	//ViewEnd?: Date;
	DataStart: Date;
	DataEnd: Date;

	AwardTypeId: number;
	AwardTypeName: string;
	FulfillmentTypeId: number;
	FulfillmentTypeName: string;
}
export interface WsPromotionSearchRequest {
	PromotionId?: number;
	Name?: string;
	PromotionStatusId?: number;
}
//export interface WsPromotionSearchResponse {

//}

export interface PromoPayCode {
	PayCode:string
}

export interface PromoName {
	PromoName: string
}


export interface WsPromoStage1Details {
	PromoName: string;
	PromoDesc: string;
	PromoType: string;
	PayCodeType: string;
	PayCodeValue: PromoPayCode[];
	OrderStartDate: Date;
	OrderEndDate: Date;
	OrderPrefix: string;
	InvoiceStartDate: Date;
	InvoiceEndDate: Date;
	DisplayStartDate: Date;
	DisplayEndDate: Date;
	LastAcceptTrans: Date;

}

export interface WsPromoStage2Details {
	AccountLevel: string;
	AccountNumber: WsPromoAccountDetails;
	SalesAgreementCode: WsPromoSalesAgreementCode;
	HierarchyTypes: WsHierarchyType[];
	StateProvince: WsPromoStateProvince;
	WsAutoEnroll: boolean; 
}

export interface WsPromoStateProvince {
	StateProvId: number;
	StateProvKey?: string;
	StateProvName:string;
	CountryCode?: string; 
}

export interface SalesCodeTypes {
	SalesCodeId: number;
	SalesCodeAgreement: string;
	SalesCodeAgreementDesc?: string;
	SalesCodeAgreementDisplay?: string;
}

export interface WsPromoSalesAgreementCode {
	SCTypes: SalesCodeTypes[]; 
}

export interface WsPromoAccountDetails {

	EntityId:number;
	EntityRefKey:string;
	AccountLevel: string;
	FullLegalName: string;
	DBAName: string;
	Address: string;
	State: string;
	Country: string;
	Zip: string;
}

export interface WsAccountRequest {
	AccountLevel: string;
	AccountNumber: string;
	EntityId: number;

}

export interface  WsHierarchyTypeRequest {
	HierarchyType: string;
    }

export interface WsHierarchyType {

	HierarchyId: number;
	HierarchyName: string;
	Children: WsHierarchyType[];
}

export interface WsProgramConfigRequest {
	Role: string;
	UserID: string;
	EntityID: number;
	ProcessStep: string;
	PromoName: string;
	PromoAttributes: string;
}

export interface WsPromoEntityIdResponse {
	PromoEntityId: number;
}


export interface WsCheckPromoExistenceReq {
	PromoName: string;
    }

export interface WsCheckPromoExistenceResponse {
	PromoExists: boolean;
}


