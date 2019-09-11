export interface WsFeature {
	Name: string;
	Path: string;
}

// Normally we would get this from a common location
export interface WsStatusType {
	Status: string;
	StatusName: string;
}

export interface WsTitleTypeBasic {
	TitleTypeId: number;
	TitleTypeName: string;
}
export interface WsTitleType extends WsTitleTypeBasic {
	ExtRefKey: string;
	Status: string;
}

export interface WsPublisherRequest {
	PublisherName?: string;
	Status?: string;
}
export interface WsPublisherBasic {
	PublisherId: number;
	PublisherName: string;
}
export interface WsPublisher extends WsPublisherBasic {
	ExtRefKey: string;
	Status: string;
	City: string;
	StateProv?: string;
	Country: string;
}

export interface WsTitleRequest {
	TitleTypeId: number;
	PublisherId: number;
	TitleName: string;
	//AuthorName: string;
}

export interface WsTitle {
	TitleId: number;
	TitleName: string;
	ExtRefKey: string;
	TitleTypeId: number;
	PublisherId: number;
	Price?: number;
	Advance?: number;
	Royalty?: number;
	YtdSales?: number;
	Notes?: string;
	PublishDate: Date;
	Status: string;
}

export interface WsTitleResponse extends WsTitle {
	PublisherName: string;
	TitleTypeName: string;
	StatusName: string;
	AuthorNames: string;
}

export interface WsAuthorBasic {
	AuthorId: number;
	FirstName: string;
	LastName: string;
}

export interface WsAuthor extends WsAuthorBasic {
	ExtRefKey: string;
	Status: string;
	Phone: string;
	Address1: string;
	City: string;
	StateProv: string;
	PostalCode: string;
	IsContract: boolean;
}

export interface WsAuthorRequest {
	Status?: string;
	FirstName?: string;
	LastName?: string;
}

export interface WsAuthorResponse extends WsAuthor {
	StatusName: string;
}

export interface WsAuthorTitle {
	AuthorId: number;
	TitleId: number;
	AuthorOrd: number;
	RoyaltyPer: number;
}

export interface WsJobTypeBasic {
	//JobTypeId: 1, JobTypeName: "New Hire - Job not specified", ExtRefKey: "new", Status: "A", MinLevel: 10, MaxLevel: 10
	JobTypeId: number;
	JobTypeName: string;
}

export interface WsJobType extends WsJobTypeBasic {
	ExtRefKey: string;
	Status: string;
	MinLevel: number;
	MaxLevel: number;
}

export interface WsTitleStatsRequest {
	TitleTypeId?: number;
	PublisherId?: number;
}
export interface TitleTypeStats {
	TitleTypeId: number;
	TitleTypeName: string;
	YtdSales: number;
}

export interface PublisherStats {
	PublisherId: number;
	PublisherName: string;
	YtdSales: number;
}

export interface TitleStats {
	TitleTypes: TitleTypeStats[];
	Publishers: PublisherStats[];
}
