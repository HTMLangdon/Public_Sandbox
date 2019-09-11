/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule, ComponentCollection } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';

// Load services
import { ServiceCollection } from 'cp/serviceShared';
//import { ManualProgramService } from 'bsp/promo/services/mock/manualProgramService';
import { ManualProgramService } from 'bsp/promo/services/manualProgramService';
//import { BiService } from 'bi/services/mock/biService';
import { WsProgramType, WsJobTitle, WsDateRange, WsManualForm, WsLookupData, WsFile, WsSimilarProgramCheckRequest, WsProgramData, WsBackupUser } from 'bsp/promo/services/models/manualProgramModels';
import { ServerControl } from 'cp/util';


interface DateRange extends WsDateRange, Observable { }
interface FormData extends WsManualForm, Observable {
  ProgramDates: DateRange;
}
interface LookupData extends WsLookupData, Observable { }

interface ViewData extends Observable {
  ShowDupProgs: boolean;
}

interface SectionModel extends ComponentModel {
  Form: FormData;
  Lookups: LookupData;
  DupProgs: WsProgramData[];
  View: ViewData;
}

interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
  pageMain: JQuery;
  //btnSubmit: JQuery;
}

interface SectionTemplates extends ComponentTemplates {
  //Page: Template;
}

interface SectionConfig extends ComponentConfig {
  AccountDup: number;
}

@Injectable() @DiscardBinding()
class SectionServices extends ServiceCollection {
  @Inject() ManualProgram: ManualProgramService = null;
}

@Injectable()
export class PageComponent extends ComponentModule {
  public Controls: SectionControls;
  public State: SectionState;
  public Templates: SectionTemplates;
  public Config: SectionConfig;
  //@Inject() public Components: SectionComponents;

  constructor(ac: ApplicationContext, public Services: SectionServices) {
    super("Page", ac);
    //let mod = this;
  }
  public readers: any[] = [];

  Initialize() {
    //debugger;
    let mod = this;
    let state = mod.State;
    let util = mod.Util;

    // Initialize the parent
    super.Initialize();
    mod.Config.AccountDup = 100;

    mod.WriteLog("Initialize.");

    // [TODO] Allow coming in with parameters already set?
    //let id = util.ToSafeInteger(util.GetParameterByName("id"));

    // [TODO] Handle missing or invalid params

    // Get control and template references; bind buttons
    mod.GetControl("pageMain");
    mod.GetTemplates(["Page"]);
    //mod.BindButtons(["btnSubmit"]); // Can't do this here because it hasn't been rendered via the template yet
    
    // Create the model
    let model = state.model = mod.CreateObservable({
      Form: {
        //ProgramName: 'Test Program',
        //ProgramType: { ProgramTypeId: 0 },
        //ProgramContactName: 'Test Contact',
        //ProgramContactPhone: '3135551234',
        ////ProgramDates: { start: new Date(), end: new Date() }, // This is for the program start and end date.  DateRangePicker is not observable, so this won't be reflected in the form
        ////ProgramDates: { start: '4/1/2019', end: '5/31/2019' },
        //ProgramDates: { start: undefined, end: undefined },
        //AccountNumber: '10.209531.1140.000.00.000',
        //MaximumPayment: 150,
        ////EligibleTitles: [{ JobTitleId: 0, Description: 'All'}],
        //EligibleTitles: ['Dealer Salesperson', 'Dealer Sales Manager'],
        ////EligibleTitles: [],
        //ProgramAnnouncements: [],
        ProgramName: '',
        ProgramType: { ProgramTypeId: 0 },
        ProgramContactName: '',
        ProgramContactPhone: '',
        BackupUser: { BackupUserId: 0 },
        //ProgramDates: { start: new Date(), end: new Date() }, // This is for the program start and end date.  DateRangePicker is not observable, so this won't be reflected in the form
        //ProgramDates: { start: '4/1/2019', end: '5/31/2019' },
        ProgramDates: { start: undefined, end: undefined },
        AccountNumber: '',
        MaximumPayment: 0,
        EligibleTitles: [],
        ProgramAnnouncements: [],

        onFileSelect: (e) => { // TODO: Strongly type "e"
          let files: any[] = e.files;
          mod.AddFilesToModel(files.length, e.files);
        },
        onFileRemove: (e) => { // TODO: Strongly type "e"
          let files: any[] = e.files; // until e is strongly typed, this makes TS happy

          //Each item of the array is an object with the following properties:
          //name - The name of a selected file, including its extension.
          //extension - The file extension of a selected file, including the leading dot.For example, .jpg, .png, and so on.
          //size - The size of a selected file in bytes.If not available, the value is null.
          //rawFile - An in -memory representation of a selected file.
          //uid - The unique identifier of the file or batch of files.

          files.forEach((value, index, arr) => { // ts way -> this is preferred.  Need to let TS know that files is an array
          //$.each(e.files, function (index, value) { // jQuery way
            // get a copy of the array excluding the item being removed
            let programAnnouncements = model.Form.ProgramAnnouncements.filter(f => f.Uid != value.uid);
            // update the model with the updated array
            model.Form.set("ProgramAnnouncements", programAnnouncements);
          });
        },
        onFileClear: (e) => {
          // remove all program announcements from the model
          console.log("Clearing " + model.Form.ProgramAnnouncements.length + " ProgramAnnouncements");
          //model.Form.ProgramAnnouncements = []; // doesn't trigger observable
          model.Form.set("ProgramAnnouncements", []);          
          console.log("ProgramAnnouncements cleared (" + model.Form.ProgramAnnouncements.length + ")");        
        },
        onDateRangePickerChange: (e) => {
          // need to validate that start date < end date
          let range = e.sender.range();
          console.log(range);
          model.Form.set("ProgramDates", range);
        },
        onAccountNumberChange: (e) => {
          // This fires when the user leaves the autocomplete textbox
          let sender = e.sender;
          var found = false;
          var value = sender.value();
          var data = sender.dataSource.view();

          for (var idx = 0, length = data.length; idx < length; idx++) {
            if (data[idx].AccountNumber === value) {
              found = true;
              break;
            }
          }

          if (!found) {
            model.Form.set("AddAccountNumber", true);
            if (!mod.IsValidAccountNumber(value)) {              
              mod.ShowMessage("Account number must be in the format XX.XXXXXX.XXXX.XXX.XX.XXX", CalloutType.Error);
            }
          } else {
            model.Form.set("AddAccountNumber", false);
          }       
        }
      },
      Lookups: {
        ProgramTypes: [],
        JobTitles: [],
        AccountNumbers: [],
        BackupUsers: []
      },
      DupProgs: [],
      //// [TODO] Consider auto wire-up. Add method to observable model and auto-bind to matching component method.
      //Events: {
      //  ReportType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.ReportType_Change.call(mod, e); },
      //  IndustryType_Change: (e: kendo.ui.ComboBoxChangeEvent) => { mod.IndustryType_Change.call(mod, e); },
      //  //btnSubmit_click: (e: any) => { mod.btnSubmit_click.call(mod, e); }, // MVVM pass-through
      //},
      View: {
        ShowDupProgs: false
        //ShowDateSelection: false,
        //ShowIndustrySelection: false,
        //ShowProductCategorySelection: false,
        //ShowProductSelection: false,
        //ShowHierarchySelection: false,
        //ShowSubmit: false
      }
    },
      ["ProgramTypes", "JobTitles", "AccountNumbers", "BackupUsers"]      
    );

    // Bind the model to the page
    // Note: This may have no effect if the bound elements are inside the template (which has not yet been executed)
    mod.BindModel(null, model);

    // Initialize sub-components
    // Do this AFTER binding and starting the service watcher
    mod.InitializeComponents();

    // [TODO] Should the page info come from an async service?
    //mod.Services.Promo.GetPageInfo('Index')
    //	.then(data => {
    //		debugger;
    //		let pc = mod.Templates.Page(data.Data);
    //		$("#pageMain").html(pc);
    //	});

    // Render the main page template
    mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: '', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);

    // Bind buttons and get controls contained within templates AFTER we render the main template (or use MVVM)
    mod.BindButton('btnCreate');
    mod.BindButton('btnCreateAnyway');

    // [TODO] Do we need to call this for blocks that are being re-built and re-bound?
    // Not necessarily here, but anywhere?
    //kendo.unbind(..)


    // @@@ Not sure where or what is the best way to do this.  Trying to combine an Autocomplete with MaskedTextBox
    //debugger;
    //let textAccountNumber = $("#textAccountNumber").getKendoAutoComplete();
    //textAccountNumber.noDataTemplate = $("#noDataTemplate").html();

    //textAccountNumber.kendoAutoComplete({
    //  noDataTemplate: $("#noDataTemplate").html()
    //});

    ////textAccountNumber.removeClass("k-textbox");
    //textAccountNumber.kendoMaskedTextBox({
    //  mask: "AA.AAAAAA.AAAA.AAA.AA.AAA"
    //});
    //textAccountNumber.removeClass("k-textbox");



    // Load the page data
    mod.LoadData();
  }

  public LoadData(): void {
    let mod = this;
    let model = mod.State.model;
    let constants = mod.Services.Constants;
    let services = mod.Services;

    services.ManualProgram.GetProgramTypes()
      .then(data => {
        if (data.ResponseCode == constants.ResponseCode.Success) {        
          data.Data.unshift({ ProgramTypeId: 0, ProgramTypeName: "(Please select)" });
          model.Lookups.set("ProgramTypes", data.Data);
        } else {
          mod.ShowMessage(mod.GetServiceMessage("Error loading program types.", data), CalloutType.Error);
        }

        mod.SetServiceFlag("ProgramTypes");
      });

    services.ManualProgram.GetJobTitles()
      .then(data => {
        if (data.ResponseCode == constants.ResponseCode.Success) {
          //data.Data.unshift({ JobTitleId: 0, JobTitle: "(Please select)" });
          model.Lookups.set("JobTitles", data.Data);
        } else {
          mod.ShowMessage(mod.GetServiceMessage("Error loading job titles.", data), CalloutType.Error);
        }

        mod.SetServiceFlag("JobTitles");
      });

    services.ManualProgram.GetAccountNumbers()
      .then(data => {
        if (data.ResponseCode == constants.ResponseCode.Success) {
          //data.Data.unshift({ JobTitleId: 0, JobTitle: "(Please select)" });
          model.Lookups.set("AccountNumbers", data.Data);
        } else {
          mod.ShowMessage(mod.GetServiceMessage("Error loading account numbers.", data), CalloutType.Error);
        }

        mod.SetServiceFlag("AccountNumbers");
      });

    let user = mod.GetUser().then(u => {
      let userId = u.UserId;
      debugger;
      model.Form.set("ProgramCreatorUserId", userId);
      services.ManualProgram.GetBackupUsers(userId) //@@@ What to do with this?  Can we cast this to an int?
        .then(data => {
          if (data.ResponseCode == constants.ResponseCode.Success) {
            data.Data.unshift({ BackupUserId: 0, Description: "(Please select)" });
            debugger;
            if (data.Data) {
              model.Lookups.set("BackupUsers", data.Data);
            }
          } else {
            mod.ShowMessage(mod.GetServiceMessage("Error loading backup users.", data), CalloutType.Error);
          }

          mod.SetServiceFlag("BackupUsers");
        });
    });    
  }

  private CreateProgram() {
    let mod = this;
    let model = mod.State.model;
    let services = mod.Services;

    services.ManualProgram.CreateManualProgram(model.Form).then(r => {
      if (r.ResponseCode == services.Constants.ResponseCode.Success) {        
        model.View.set("ShowDupProgs", false);
        mod.ShowMessage("Manual program created", CalloutType.Success);
      }
    });
  }

  public async btnCreateAnyway_click() {
    this.CreateProgram();
  }

  public async btnCreate_click() {
    let mod = this;
    let state = mod.State;
    let util = mod.Util;
    let model = state.model;
    let services = mod.Services;

    // TODO: validate form
    if (this.IsModelValid(model.Form)) {
      // TODO: check for similar programs
      // Are there similar programs(based on start date, end date, and account number ?)
      // Yes
      //    Return response to allow user to confirm or cancel save
      // No
      //    Save manual program
      //    Save attachments

      services.ManualProgram.CheckForSimilarPrograms({ ProgramDates: model.Form.ProgramDates, AccountNumber: model.Form.AccountNumber })
        .then(r => {
          if (r.ResponseCode == services.Constants.ResponseCode.Success) { // r.ResponseMessage
            if (r.Data.length > 0) {
              model.set("DupProgs", r.Data);
              model.View.set("ShowDupProgs", true);              
            }
            else {              
              // no matches found
              this.CreateProgram();
            }
          }
          else {
            mod.ShowMessage("Something bad happened", CalloutType.Error);
            //services.ManualProgram.CreateManualProgram(model.Form).then();
            // maybe use await to avoid too many thens.  Can you mix these?  Maybe try it with then and see how ugly it is
          }
        });      
    }
  }

  private AddFilesToModel(fileCount: number, files: any[]) {
    // got the idea from here
    // https://stackoverflow.com/questions/37538093/reading-multiple-files-synchronously-in-javascript-using-filereader
    let mod = this;
    let model = mod.State.model;    

    if (fileCount > 0) {
      let file = files[--fileCount];
      if (file.extension == ".pdf") {
        let reader = new FileReader();
        reader.onload = function (e) {
          let f = file;
          console.log(f);

          let fileContent: any = (<FileReader>e.target).result;
          let buffer = Array["from"](new Uint8Array(fileContent));

          //let buffer: any = Array["from"](new Uint8Array((<FileReader>e.target).result));

          let uploadedFile: WsFile = {
            Name: f.name,
            Size: f.size,
            Extension: f.extension,
            MimeType: f.rawFile.type,
            //Content: (<FileReader>e.target).result,
            Content: buffer, //@@ Removing for now - I think this is making our request too big
            Uid: f.uid
          }

          model.Form.ProgramAnnouncements.push(uploadedFile);
          //console.log("from UploadMe, fileName := " + f2.name + ", byteLength := " + e.target.result.byteLength);
          //add to Map here
          mod.AddFilesToModel(fileCount, files);
        }
        reader.readAsArrayBuffer(file.rawFile);
      }
      else {
        mod.ShowMessage("Program announcements must be PDF files.", CalloutType.Error);
      }
    }
  }

  private IsModelValid(model: WsManualForm): boolean {
    let mod = this;
    let msg: string[] = [];

    if (model.ProgramName.length == 0) {
      msg.push("Program Name is required");
    }

    if (model.ProgramType.ProgramTypeId == 0) {
      msg.push("Program Type is required");
    }

    if (model.ProgramContactName.length == 0) {
      msg.push("Program Contact Name is required");
    }

    if (model.ProgramContactPhone.length == 0) {
      msg.push("Program Contact Phone is required");
    }
    // TODO: need to validate the phone number is in the correct format

    if (model.BackupUser.BackupUserId == 0) {
      msg.push("Program Backup Contact is required");
    }

    if (!(model.ProgramDates.start && model.ProgramDates.end)) {
      msg.push("Program Start and End dates are required");
    }

    if (model.ProgramDates.start && model.ProgramDates.end && model.ProgramDates.start > model.ProgramDates.end) {
      msg.push("Program end date must be greater than or equal to the program start date.")
    }
    
    if (!mod.IsValidAccountNumber(model.AccountNumber)) {
      msg.push("Account Number is required and must be in the format XX.XXXXXX.XXXX.XXX.XX.XXX");
    }
    // TODO: validate account number format

    if (model.MaximumPayment == 0) {
      msg.push("Maximum Payment Allowed is required");
    }
    // TODO: validate MaxPayment >= MinimumPayment

    if (model.EligibleTitles.length == 0) {
      msg.push("At least one title must be chosen");      
    }

    if (model.ProgramAnnouncements.length == 0) {
      msg.push("At least one Program Announcement must be added");
    }

    if (msg.length > 0) {
      let errorMsg = msg.join("<br />");
      mod.ShowMessage(errorMsg, CalloutType.Error);
    }

    return (msg.length == 0);
  }

  private IsValidAccountNumber(accountNumber: string): boolean {
    //Validate that the account number is in the format AA.AAAAAA.AAAA.AAA.AA.AAA, where A is alphanumeric
    let regexAccountNumber =
      new RegExp('[a-zA-Z0-9]{2}[\.][a-zA-Z0-9]{6}[\.][a-zA-Z0-9]{4}[\.][a-zA-Z0-9]{3}[\.][a-zA-Z0-9]{2}[\.][a-zA-Z0-9]{3}');

    return regexAccountNumber.test(accountNumber);    
  }
}
