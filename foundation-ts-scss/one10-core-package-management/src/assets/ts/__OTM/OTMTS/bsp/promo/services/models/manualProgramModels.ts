/****************************************************************************
Copyright (c) 2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

export interface WsProgramType {
	ProgramTypeId: number;
	ProgramTypeName: string;
}

export interface WsJobTitle {
  JobTitleId: number;
  Description: string;  
}

export interface WsDateRange {
  //StartDate: Date;
  //EndDate: Date;
  start: Date;
  end: Date;
}

export interface WsManualForm  {
  ProgramName: string;
  ProgramType: WsProgramType;
  ProgramContactName: string;
  ProgramContactPhone: string;
  ProgramCreatorUserId: number;
  BackupUser: WsBackupUser;
  ProgramStartDate: Date;
  ProgramEndDate: Date;
  ProgramDates: WsDateRange;
  AccountNumber: string;
  MaximumPayment: number;
  EligibleTitles: WsJobTitle[];
  ProgramAnnouncements: WsFile[];
}

//interface ViewData extends Observable {
//	//Flag1: boolean;
//}

export interface WsLookupData {
  ProgramTypes: WsProgramType[];
  JobTitles: WsJobTitle[];
}

export interface WsProgramData {
  ProgramName: string;
  ProgramType: WsProgramType;
  ProgramStartDate: Date;
  ProgramEndDate: Date;
  AccountNumber: string;
}

export interface WsFile {
  Name: string;
  Extension: string;
  Size: number;
  MimeType: string;
  Content: any;
  Uid: string;
}

export interface WsAccountNumber {
  AccountNumber: string;
}

export interface WsBackupUser {
  BackupUserId: number;
  Description: string;
}

export interface WsSimilarProgramCheckRequest {
  ProgramDates: WsDateRange;
  AccountNumber: string;
}
