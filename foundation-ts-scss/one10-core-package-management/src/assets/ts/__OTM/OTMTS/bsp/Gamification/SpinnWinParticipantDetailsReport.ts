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
import { GameService, WsGameData } from 'bsp/services/gameService';
import { ReportParameters } from 'bsp/services/models/reportModels';

interface SectionModel extends ComponentModel {
  Params: ReportParameters;
  GameData: WsGameData[];
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
    ReportSvc: <GameService>null
  };

  constructor(ac: ApplicationContext, rs: GameService) {
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
    let params: ReportParameters = {
      RptID: "",
      GameId: ""
    };



	let gameData: WsGameData[];
    let model: SectionModel = state.model = mod.CreateObservable({
      Params: params,
      GameData: gameData,
      btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); },
    });
    mod.BindModel(null, model);
    //@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
    model.set("Params.RptID", "ParticipantDtlReport");
    mod.BindGameDropdown();
    mod.Controls.RootElement.foundation();    
  }

  BindGameDropdown() {
    let mod = this;    
    let model = mod.State.model;

    mod.Services.ReportSvc.GetAllGames(mod.State.model.Params)
      .then(d => {
        if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
          if (d.Data != null) {
            d.Data.unshift({ GameId: "0", GameName: "(Please select a Game)", PromotionId: "" });
            model.set("Params.GameId", "0");
            model.set("GameData", d.Data);
          }
        }
      });
   
  }

  removeGrid(g) {
  var tmp = [];
  try {
    tmp = g.data("kendoGrid").dataSource.data();
  } catch (e) { }
  var container = g.parent();
  g.remove();
  container.append("<div id='" + g.attr("id") + "' class='" + g.attr("class") + "'></div>");
  return tmp;
}

  public btnSubmit_Click(e) {
    let mod = this;   
    mod.BindReport();
  }

  BindReport() {
    let mod = this;
    var rptTitle = "ParticipantDtlReport"; //@@@ Pending work, Replace with results from a service call
    var rptInfo = "HeaderInfo"; //@@@ Pending work,Replace with results from a service call
    
    mod.Services.ReportSvc.GetSpinnWinParticipantDetailsReportData(mod.State.model.Params)
      .then(data => {
		  debugger;
		  if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
          if (data.Data.ReportData != null) {
            let cols: any[] = data.Data.ColumnHeader;
            this.removeGrid($("#reportResults"));
            var element = $("#reportResults").kendoGrid({
              toolbar: ["excel"],
              excel: {
                fileName: "Participant Details Report.xlsx",
                filterable: true,
                allPages: true
				},
				dataSource: {
			    data: data.Data.ReportData,
                pageSize: 10
              },
              noRecords: true,
              messages: {
                noRecords: "There is no data for this selection."
              },
              columns:cols,
              pageable: true,
              sortable: true,
              filterable: true,
            });
          }
        }
      });
  }
}
