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
import { ReportService, WsStringData } from 'bsp/services/reportService';
import { ReportParameters } from 'bsp/services/models/reportModels';

interface SectionModel extends ComponentModel {
  Params: ReportParameters;
  EnrolledStatusCodes: WsStringData[];
  YearList: number[];
  UserName: string;
}

interface SectionState extends ComponentState<SectionModel> { }
interface SectionControls extends ComponentControls {
  btnValidate: JQuery;
  ddlStatus: JQuery;
  //btnSubmit: JQuery;
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

  Initialize(m?: ReportParameters) {
    let mod = this;
    let state = mod.State;
    let util = mod.Util;

    // Call the parent
    super.Initialize();
	  let params: ReportParameters = {} as any;
    let model: SectionModel = state.model = mod.CreateObservable({
		
		Params: params,
      UserName:"",
      btnSubmit_Click: (e: any) => { mod.btnSubmit_Click.call(mod, e); }
    });

   // mod.BindButtons(["btnSubmit"]);
    
    mod.BindModel(null, model);
    //@@@ Pending work, this will need to be dynamic and other parameters(dates , promotion id  will need to be bound at button click event
    model.set("Params.RptID", "MyOrgSummaryReport");
    if (!util.IsNull(m.ParticipantId)) {
      model.set("Params.ParticipantId", m.ParticipantId);
      model.set("Params.StatusCd", m.StatusCd);
      model.set("Params.StartYear", m.StartYear);
      model.set("UserName", m.UserName + "'s Staff");

    }

    mod.Controls.RootElement.foundation();    


    mod.BindYearList();
    mod.BindStatusDropdown();
    mod.BindReport();
  }


  BindStatusDropdown() {
    let mod = this;
    let model = mod.State.model;

    mod.Services.ReportSvc.GetEnrolledStatusCodes()
      .then(d => {
        if (d.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
          if (d.Data != null) {
            model.set("EnrolledStatusCodes", d.Data);
            //model.set("StringData", model.Params.StatusCd)

          }
        }
      });


  }

  BindYearList() {
    let mod = this;
    let model = mod.State.model;

    let curyear = new Date().getFullYear();

    var years = new Array();

    for (var y = 0; y < 11; y++) {

      //var yearString = { WsStringData: { StringData: curyear.toString() } };
      var yearString = { StringData: curyear.toString() } ;

      //years.push(yearString);
      years.push(curyear);
      --curyear;
    }

    model.set("YearList", years);
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
	  
    mod.Services.ReportSvc.GetMyOrgSummaryData(mod.State.model.Params)
		.then(data => {
		if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
          if (data.Data.ReportData != null) {
            let cols: any[] = data.Data.ColumnHeader;
            this.removeGrid($("#rgrid"));
			  var element = $("#rgrid").kendoGrid({
				  toolbar: ["excel"],
				  excel: {
					  fileName: "MyOrgSummary.xlsx",
					  filterable: true,
					  allPages: true
				  },
				  excelExport: function (e) {
					  var rows = e.workbook.sheets[0].rows;

					  for (var ri = 0; ri < rows.length; ri++) {
						  var row = rows[ri];

						  for (var ci = 0; ci < row.cells.length; ci++) {
							  var cell = row.cells[ci];
							  if (cell.value && cell.value != "") {
								  // Use jQuery.fn.text to remove the HTML and get only the text
								  cell.value = $($.parseHTML(cell.value.toString())).text();
								  // Set the alignment
								  cell.hAlign = "right";
							  }
						  }
					  }
				  },
				  dataSource: {
					  data: data.Data.ReportData,
					  pageSize: 10,
					  aggregate: [
						  { field: "recSent_YTD", aggregate: "sum" },
						  { field: "recReceived_YTD", aggregate: "sum" }]
				  },
				 
		      noRecords: true,
              messages: {
                noRecords: "There is no data for this selection."
              },
			  columns: cols,
			  sortable: true,
              pageable: true,
              filterable: true

            });
          }
        }
      });
  }
}
