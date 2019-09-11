export interface ReportParameters {
	RptID: string;
	RptGroupID?: string;
	StartDate?: Date;
	EndDate?: Date;
	StartMonth?: number;
	EndMonth?: number;
	StartYear?: number;
	EndYear?: number;	
	Brands?: string;
	Products?: string;
	SearchType?: string;
	SearchValue?: string;
	Program?: string;
	StartQtr?: string;
	EndQtr?: string;
	PromotionId?: string;
	ParticipantId?: number;
	UserName?: string;
	StatusCd?: string;
	GameId?: string;
}

export interface AuditClaimParameters{
	ClaimId: string;
	ClaimStatus: string;
	SoldCompanyName: string;
	SubmitterName: string;
	SubmitterCompanyName: string;
	ClaimStartDate: string;
	ClaimEndDate: string;
	SalesStartDate: string;
	SalesEndDate: string;
	BulkAuditComment: string;
	BulkClaimStatus: string;
}

export interface UpdateAuditClaimParameters {
	ClaimId: number;
	ClaimLineId: number;
	ContactId: number;
	PromoId: number;
	ClaimStatus: string;
	AuditorComment: string;
}

export interface ClaimRowXML {
	XMLData: string;
}

export interface ReportHeader {
	HeaderGroupID?: number;
	RptId?: number;
	isHidden?: boolean;
	GroupName?: string;
	GroupLevel?: string;
	ParentHeaderGroupID?: number;
	GroupSubId?: number;
	GroupSortOrder?: number;
	ColDesc?: string;
	HdrStyle?: string;
	ColumnStyle?: string;
	DataType?: string;
	Format?: string;
	Width?: string;
	Footer?: string;
	Template?: string;
	title?: string;
	id?: string;
	command?: Command;
	headerTemplate?: string;
	change?: Command;
	selectable?: string|boolean;
}

export interface Command {
	text: string;
	click: string|Function;
}
