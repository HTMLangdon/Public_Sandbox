/****************************************************************************
Copyright (c) 2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { MockServiceModule, WsResponse, WsResponseData, ServiceConstants } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';
import { WsProgramType, WsJobTitle, WsManualForm, WsProgramData, WsDateRange, WsAccountNumber, WsSimilarProgramCheckRequest, WsBackupUser } from '../models/manualProgramModels';
import { ProgramTypes, JobTitles, AccountNumbers, BackupUsers } from './manualProgramData';

@Injectable(null, ScopeType.Singleton) // [TODO] Use DI AutoInit
export class ManualProgramService extends MockServiceModule {
  constructor() {
    super("ManualProgramService");
  }

  public GetProgramTypes(): Promise<WsResponseData<WsProgramType[]>> {
    let mod = this;

    return mod.GetMockData(ProgramTypes, false, false);
  }

  public GetJobTitles(): Promise<WsResponseData<WsJobTitle[]>> {
    let mod = this;

    return mod.GetMockData(JobTitles, false, false);
  }

  public GetAccountNumbers(): Promise<WsResponseData<WsAccountNumber[]>> {
    let mod = this;

    return mod.GetMockData(AccountNumbers, false, false);
  }

  public GetBackupUsers(userId: number): Promise<WsResponseData<WsBackupUser[]>> {
    let mod = this;

    return mod.GetMockData(BackupUsers, false, false);
  }

  public CreateManualProgram(formData: WsManualForm) {
    let mod = this;
    debugger;
    console.log(formData);
    console.log(JSON.stringify(formData));    
  }

  //public CreateManualProgram(req: WsManualForm): Promise<WsResponseData<WsManualForm[]>> {
  //  let mod = this;
  //  let services = mod.Services;
  //  let constants = mod.Constants;
  //  let appConfig = mod.AppConfig;
  //  debugger;
  //  return services.MakeServiceCall({
  //    EndPoint: appConfig.Core.WSRoot + "/Promo/CreateManualProgram",
  //    Method: constants.Method.Post,
  //    Data: JSON.stringify(req)
  //  })
  //}

  public CheckForSimilarPrograms(req: WsSimilarProgramCheckRequest): Promise<WsResponseData<WsProgramData[]>> {
    let mod = this;
    let action = "error";
    debugger;

    let matchingPrograms: WsProgramData[] = [];

    return new Promise<WsResponseData<WsProgramData[]>>((resolve, reject) => {

      // possible matching programs
      if (req.ProgramDates.start.toLocaleDateString() == new Date('4/1/2019').toLocaleDateString()) {
        // for purposes of our mock service, similar programs exists

        let pType: WsProgramType = { ProgramTypeId: 100, ProgramTypeName: "Duplicate Program Type" };
        let pd: WsProgramData =
        {
          ProgramName: "Duplicate Program",
          ProgramType: pType,
          ProgramStartDate: req.ProgramDates.start,
          ProgramEndDate: req.ProgramDates.end,
          AccountNumber: "ASDFGHJKLZXVNMQWERTY123435"
        };
        // matchingPrograms.add(pd); // why doesn't this work?
        //matchingPrograms.add(matchingPrograms, pd);
        matchingPrograms.push(pd);
      }
      
      resolve(WsResponseData.SuccessData < WsProgramData[]>(matchingPrograms));
    });

    //return new Promise<WsResponseData<ProgramData>>((resolve, reject) => {
    //  if (action == "error")
    //    // [TODO] Can we make this look more like what the server returns?
    //    resolve(new WsResponseData<WsDiagResult>(null, constants.ServiceStatusCode.Success, constants.ServiceStatusMessage.Success, constants.ResponseCode.Error, constants.ResponseMessage.Error));
    //  else
    //    resolve(WsResponseData.SuccessData(result));
    //});

    //return WsResponseData.SuccessData(
    //  {
    //    ProgramName: "Duplicate Program",
    //    ProgramType: {ProgramTypeId: 100, ProgramTypeName: "Duplicate Program Type"},
    //    ProgramStartDate: new Date("1/1/2019"),
    //    ProgramEndDate: new Date("3/31/2019"),
    //    AccountNumber: "ASDFGHJKL"
    //  });
  }
}
