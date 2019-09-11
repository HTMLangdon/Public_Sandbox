/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { IKeyValueCollection } from 'bsp/services/commonService'; // [TODO] Relocate to a better place.

export interface IErrorDetails {
	ErrorId: string;
	Timestamp: Date;
	Message: string;
	Type: string;
	Source: string;
	Server: string;
	Path: string;
	Referrer?: string;
	UserId: number;
	Username: string;

	Detail: string;

	Collections?: IKeyValueCollection[];
}

export interface WsProcessLogSearchRequest {
	StartDate: Date;
	EndDate: Date;
	ProcessTypeId?: number;
	ProcessStatusTypeId?: string;
	RunId?: string;
}

export interface WsProcessLogStep {
	Name: string;
	Type: string;
	Result: boolean;
	StartTime: Date;
	EndTime?: Date;
	Duration: number;
	Items: WsProcessLogStepItem[];
}

export interface WsProcessLogStepItem {
	Type: string;
	InfoType: string;
	Key: string;
	Value: string;
	Source: string;
	Trace: string;
}

export interface WsProcessFeedLogRequest {
	ProcessLogId: number;
}

export interface WsProcessLog {
	ProcessLogId: number;
	ProcessTypeId: number;
	ProcessTypeName: string;
	ProcessStatusTypeName: string;
	ProcessStatusTypeId: string;
	RunId: string;
	StartTime: Date;
	EndTime?: Date;
	Duration: number;
	ProcessUserId: number;  // Will match in DB: CPSec.UserData.UserId
	ProcessUsername: string;
	LogInfo: string;
	ProcessFeedLogs: WsProcessFeedLog[];
	Steps: WsProcessLogStep[];
}

export interface WsProcessFeedLog {
	ProcessFeedLogId: number;
	ProcessLogId: number;
	FeedTypeId: number;
	FeedTypeName: string;
	ProcessStatusTypeId: string;
	ProcessStatusTypeName: string;
	FeedFilename: string;
}

export interface WsProcessType {
	ProcessTypeId: number;
	ProcessTypeName: string;
}

export interface WsProcessStatusType {
	ProcessStatusTypeId: string;
	ProcessStatusTypeName: string;
}

export interface WsDiagAction {
	Text: string;
	Value: string;
	EndPoint: string;
}
export interface WsDiagModel {
	IsAuthenticated: boolean;
	ShowActions: boolean;
	Message: string;
	Timestamp: Date;
	Actions: WsDiagAction[];
}
export interface WsDiagItem {
	Type: number;
	Key: string;
	Value: string;
	Result: boolean;
}
export interface WsDiagResult {
	Action: string;
	IsHealthy: boolean;
	AggregateResult: string;
	Info: WsDiagItem[];
}
