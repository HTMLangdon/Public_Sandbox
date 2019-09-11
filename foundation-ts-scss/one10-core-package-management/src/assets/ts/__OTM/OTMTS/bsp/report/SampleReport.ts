/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { ServiceConstants } from 'cp/serviceShared';
import { ReportService } from 'bsp/services/reportService';
import { ReportParameters } from 'bsp/services/models/reportModels';

interface SectionModel extends ComponentModel {
  Params: ReportParameters;
}

interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
  btnValidate: JQuery;
}

@Injectable()
export class PageComponent extends ComponentModule {
  public Controls: SectionControls;
  public State: SectionState;

  public Services = {
    Constants: ServiceConstants,
    ReportSvc: <ReportService>null
  };

  constructor(ac: ApplicationContext, rs: ReportService) {
    // Call the parent
    super("Page", ac);

    let mod = this;
    mod.Services.ReportSvc = rs;
  }

  Initialize() {
    let mod = this;
    let state = mod.State;
    let util = mod.Util;

    // Call the parent
    super.Initialize();
    let params: ReportParameters;
    let model: SectionModel = state.model = mod.CreateObservable({
      Params: params
    });
    mod.BindModel(null, model);
    //@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
    model.set("Params.RptID", "samplereport");
    mod.BindReport();
  }

  BindReport() {
    let mod = this;
    var rptTitle = "SampleReport"; //@@@ Pending work, Replace with results from a service call
    var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call

    mod.Services.ReportSvc.GetSampleReportData(mod.State.model.Params)
      .then(data => {
        if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
          if (data.Data.ReportData != null) {
            let cols: any[] = data.Data.ColumnHeader;
            var element = $("#grid").kendoGrid({
              dataSource: {
                serverPaging: false,
                serverSorting: false,
                serverFiltering: false,
                data: data.Data.ReportData,
                pageSize: 500
              },
              noRecords: true,
              messages: {
                noRecords: "There is no data for this selection."
              },
              columns:cols,
              sortable: false,
              pageable: true
       
            });
          }
        }
      });
  }
}
