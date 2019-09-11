/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable } from 'cp/di';
import { CmsFileService } from 'svc/cmsFileService';
import { ServiceConstants } from 'cp/serviceShared';

interface SectionModel extends ComponentModel {
	//Filename: string;
	File: any; // Use "any" for now since we're using it with the upload control, which returns an object; Rename this property
	FileId: string;
	FileDescription: string;
	FileName: string;
	FileCategoryId: string;
	FileCategoryName: string;
	MimeType: string;
	FileSize: number;
	FileContent: any;
	SearchFileCategoryId: string;
	SearchFileName: string;
	SearchFileDescription: string;
	lstOfPrivilegeTypes: number[];
	fileCategory: any[];
	fileCategoryALL: any[];
	FileSizeLimit: number,
	FilesNotAllowed: string,

	showSearchPanel: boolean;
	showSpinnerOverlay: boolean;
	showUpdatePanel: boolean;
	selectedType: string;
	ProgramDate: Date;
	LocaleId: string;
}
interface SectionState extends ComponentState<SectionModel> { }
interface IFile {
	FileId?: string;
	FileDescription?: string;
	FileName?: string;
	MimeType?: string;
	FileCategoryId?: number;
	FileSize?: number;
	LocaleId?: string;
}
interface SectionControls extends ComponentControls {
	btnReset: JQuery;
	fileGrid: ComplexControl<kendo.ui.Grid>;
	FileName: ComplexControl<kendo.ui.Upload>;
	monthPicker: ComplexControl<kendo.ui.DatePicker>;
}

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;

	public Services = {
		Constants: ServiceConstants,
		Cms: <CmsFileService>null
	};

	constructor(ac: ApplicationContext, ps: CmsFileService) {
		// Call the parent
		super("Page", ac);

		let mod = this;
		mod.Services.Cms = ps;
	}

	Initialize() {
		let mod = this;
		let state = mod.State;
		let util = mod.Util;
		let controls = mod.Controls;

		let services = mod.Services;

		// Call the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		// Convert the model to an observable
		// [TODO] Split up model into sub-objects (search, lookups, view management, editing)
		let model: SectionModel = state.model = <SectionModel>mod.CreateObservable({
			File: null,
			showResults: false,
			hideControl: true,
			FileId: "",
			FileDescription: "",
			FileName: "",
			MimeType: "",
			FileSize: 0,
			FileContent: null,
			FileCategoryId: "",
			SearchFileCategoryId: "0",
			SearchFileName: "",
			SearchFileDescription: "",
			FileSizeLimit: "",
			FilesNotAllowed: "",

			lstOfPrivilegeTypes: [],
			showUpdatePanel: false,
			showSearchPanel: true,
			showSpinnerOverlay: false,
			LocaleId: "",
			onFileSelect: (e) => { // To-do: Stronly type "e"
				//debugger;
				// If we know there is only one file, we could put "e.files[0]" in the model
				e.data.set("File", e.files[0]);

				let file: any = e.files[0];
				let reader = new FileReader();
				reader.readAsArrayBuffer(file.rawFile);
				reader.onload = function (e) {
					model.set("FileContent", (<FileReader>e.target).result);
					model.set("FileName", file.name);
					model.set("MimeType", file.rawFile.type);
					model.set("FileSize", file.size);

				}
			},
			onSaveClick: function () {
				//debugger;
				var temp = $(".k-upload-files.k-reset");
				var extName = model.FileName.slice((model.FileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
				var validationResponse = "";

				if (temp.length == 0) {
					model.set("FileContent", null);
				}

				var filesAllowedArray = model.FilesNotAllowed.split(",");

				//debugger;
				if ((model.FileName == "") || (model.FileDescription == "") || ((model.MimeType == "")) || (model.FileSize == 0) || (model.FileContent == null && model.FileId == "") || (model.FileCategoryId == "") || (model.FileCategoryId == null) || (model.LocaleId == "") || (model.LocaleId == null)) {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("File Data is missing");
				}

				else {
					if (model.FileSizeLimit < model.FileSize) {
						validationResponse = "File Size must not be more than : " + model.FileSizeLimit + " bytes";
					}
					if (!filesAllowedArray.some(x => x == extName)) {
						validationResponse = validationResponse + "\nSelected File type is not allowed  ";
					}

					if (validationResponse.length > 0) {
						// [TODO] Replace with standard message display. Get text from resources.
						alert(validationResponse);
					}
					else {
						mod.ShowProgress();

						// Start the processing delayed. This gives the DOM a moment to catch up and show the progress indicator.
						setTimeout(() => { mod.ProcessData.call(mod); }, 50);
						//mod.ProcessData();
					}
				}
			},
			onSearchClick: function () {
				mod.SearchOverlayOn();
				//setTimeout(() => { mod.GetSearch.call(mod); }, 2000); // [TEST] Intentional delay for testing the progress indictor
				mod.GetSearch();
			},
			removeSpinner: function () {
				// [TODO] Implement or remove
				//console.log('removeSpinner');
			},
			onCancelClick: function () {
				mod.State.model.set("showSearchPanel", true);
				mod.State.model.set("showUpdatePanel", false);
				mod.ClearModel();
			},
			onNewClick: function () {
				mod.State.model.set("showSearchPanel", false);
				mod.State.model.set("showUpdatePanel", true);
				mod.ClearModel();
			},
			onPrivilegeTypeChange: function () { // [TODO] Implement or remove
			},
			onCategoryChange: function () { // [TODO] Implement or remove
			},
			onSearchCategoryChange: function () { // [TODO] Implement or remove
			},
			onLocaleTypeChange: function () { // [TODO] Implement or remove
			},

			fileCategory: [],
			fileCategoryALL: [],
			privilegeTypes: [],
			localeType: [],
		},
			["Privileges", "Categories", "Configs", "LocaleTypes"]
		);

		// Watch for IsLoaded to change
		// [TODO] Replace with common page load indicator
		model.bind('change', (e) => {
			if (e.field && e.field == "IsLoaded" && model.IsLoaded) {
				mod.HideProgress();
			}
		});

		mod.BindModel(null, model);
		mod.ShowGrid();
		mod.LoadData();
	}

	LoadData(): void {
		let mod = this;
		let services = mod.Services;
		let model = mod.State.model;

		services.Cms.GetPrivilegeTypes()
			.then((data) => {
				//debugger;
				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					model.set("privilegeTypes", data.Data);
				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("Error fetching privileges.");
				}
				mod.SetServiceFlag("Privileges");
			});

		services.Cms.GetCategories()
			.then((data) => {
				//debugger;

				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					model.set("fileCategoryALL", data.Data);
					model.set("fileCategory", data.Data);

					//remove first element from array (ALL)
					mod.State.model.fileCategory.splice(0, 1);

				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("Error fetching categories.");
				}
				mod.SetServiceFlag("Categories");
			});

		services.Cms.GetConfigs()
			.then((data) => {
				//debugger;
				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					//model.set("configList", data.Data);
					model.set("FileSizeLimit", data.Data[0].Value);
					model.set("FilesNotAllowed", data.Data[1].Value);

					// alert(mod.State.model.FileSizeLimit + " " + mod.State.model.FilesNotAllowed);

				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("Error fetching configuration.");
				}
				mod.SetServiceFlag("Configs");
			});
		services.Cms.GetLocaleTypes()
			.then((data) => {
				//debugger;
				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					model.set("localeType", data.Data);
				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("Error fetching locales.");
				}
				mod.SetServiceFlag("LocaleTypes");
			});
	}

	ShowGrid(records?: any) {
		//	debugger;

		let mod = this;
		let controls = mod.Controls;
		let state = mod.State.model;

		if ($("#fileGrid").data("kendoGrid")) {
			var grid = $("#fileGrid").data("kendoGrid");
			// detach events
			grid.destroy();
		}

		$("#fileGrid").kendoGrid({
			//controls.fileGrid.item.kendoGrid({
			//mod.Controls.fileGrid.control.kendoGrid({
			dataSource: {

				serverFiltering: false,
				//serverPaging: true,
				data: records,

				schema: {
					model: {
						fields: {
							FileId: { type: "string" },
							FileName: { type: "string" },
							FileDescription: { type: "string" },
							FileSize: { type: "number" },
							MimeType: { type: "string" },
							CategoryId: { type: "string" },
							CategoryName: { type: "string" },
							VSPOptin: { type: "string" },
							Comments: { type: "string" },
						}
					}
				},
			},
			height: 600,
			groupable: true,
			sortable: true,
			pageable: {
				refresh: true,
				pageSizes: true,
				pageSize: 20,
				buttonCount: 5
			},
			columns: [{ field: "FileId", title: "Id", width: 65 },
			{ field: "FileDescription", title: "Description", width: 200 },
			{ field: "FileName", title: "File Name", width: 160 },
			{ field: "MimeType", title: "Mime Type", width: 90 },
			{ field: "FileSize", title: "Size", width: 75 },
			{ field: "FileCategoryId", title: "Category ID", width: 0 },
			{ field: "FileCategoryName", title: "Category Name", width: 130 },
			{ field: "LocaleId", title: "Locale", width: 100 }//,

				, {
				command: [{
					name: "Edit", className: "btn btn-default", click:
						(e) => {
							mod.showDetails.call(mod, e);
						}
				},
				{
					name: "Delete", className: "btn btn-default", click:
						(e) => {

							var dataItem = <IFile>$("#fileGrid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr")); // [EJD] Use of "Any" not ideal.

							// [TODO] Replace with common confirmation modal. Get text from resources.
							//$.when(mod.showConfirmationWindow('Are you sure to delete the record with File Id  :'+  dataItem.FileId  )).then(function (confirmed) {
							if (confirm('Are you sure to delete the record with File Id  :' + dataItem.FileId)) {
								mod.deleteCmsFile.call(mod, e);

								// [TODO] Replace with standard message display. Get text from resources.
								alert('OK');
							}
							else {
								// [TODO] Replace with standard message display. Get text from resources.
								alert('Cancel');
							}
						}
				},
				{
					name: "Download", className: "btn btn-default", click:
						(e) => {
							mod.downloadFile.call(mod, e);
						}
				}
				],

				title: " ",
				width: "250px"
			}
			]
		});
	}

	showConfirmationWindow(message) {
		let mod = this;
		//let state = mod.State.model;
		return mod.showWindow("#confirmationTemplate", message)
	};

	showWindow(template, message) {

		let d = "Deferred"; // [EJD] Temporary to get around type-def inconsistency.
		var dfd = $[d]();
		var result = false;

		$("<div id='popupWindow'></div>")
			.appendTo("body")
			.kendoWindow({
				width: "300px",
				modal: true,
				title: "",
				visible: false,
				close: function (e) {
					this.destroy();
					dfd.resolve(result);
				}
			}).data('kendoWindow').content($(template).html()).center().open();
		//}).data('kendoWindow').content($(template).html()).open();

		$('.popupMessage').html(message);

		$('#popupWindow .confirm_yes').val('OK');
		$('#popupWindow .confirm_no').val('Cancel');

		$('#popupWindow .confirm_no').click(function () {
			$('#popupWindow').data('kendoWindow').close();
		});

		$('#popupWindow .confirm_yes').click(function () {
			result = true;
			$('#popupWindow').data('kendoWindow').close();
		});

		return dfd.promise();
	};

	showDetails(e) {
		//debugger;

		let mod = this;
		let state = mod.State.model;
		e.preventDefault();
		var dataItem: IFile;
		//Select current data Item
		dataItem = <IFile>$("#fileGrid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr")); // [EJD] Use of "Any" not ideal.

		mod.State.model.set("FileId", dataItem.FileId);
		mod.State.model.set("FileDescription", dataItem.FileDescription);
		mod.State.model.set("FileName", dataItem.FileName);
		mod.State.model.set("MimeType", dataItem.MimeType);
		mod.State.model.set("FileCategoryId", dataItem.FileCategoryId);
		mod.State.model.set("FileSize", dataItem.FileSize);
		mod.State.model.set("LocaleId", dataItem.LocaleId);

		mod.Services.Cms.GetFilePrivileges({ FileId: dataItem.FileId })
			.then((data) => {

				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					//set data to model object
					mod.State.model.set("lstOfPrivilegeTypes", data.Data);
					mod.State.model.set("showUpdatePanel", true);
					mod.State.model.set("showSearchPanel", false);
				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("SERVER ERROR");
				}
			});
	}

	downloadFile(e) {
		//debugger;

		let mod = this;
		let state = mod.State.model;
		e.preventDefault();

		let appConfig = mod.AppConfig;
		let rp = appConfig.Core.SiteRoot;

		var dataItem = <IFile>$("#fileGrid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr")); // [EJD] Use of "Any" not ideal.
		let fileUrl = rp + "cms/downloadFile?FileId=" + dataItem.FileId;
		//rp = rp + fileUrl;
		//var fileURL = fileUrl;
		window.location.href = fileUrl;
	}

	deleteCmsFile(e) {
		//debugger;

		let mod = this;
		let state = mod.State.model;
		e.preventDefault();

		let t = e.sender;
		//Select current data Item
		var dataItem = <IFile>$("#fileGrid").data("kendoGrid").dataItem($(e.currentTarget).closest("tr")); // [EJD] Use of "Any" not ideal.

		mod.Services.Cms.deleteCmsFile({ FileId: dataItem.FileId })
			.then((data) => {

				if (data.ResponseCode == mod.Services.Constants.ResponseCode.Success) {
					mod.GetSearch();

				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("SERVER ERROR");
				}
			});
	}

	ProcessData(): void {
		// debugger;

		let mod = this;
		let model = mod.State.model;
		let services = mod.Services;

		let buffer = mod.State.model.FileContent;
		buffer = Array["from"](new Uint8Array(buffer));

		// Call the service
		services.Cms.UploadFile({ FileId: model.FileId, FileName: model.FileName, FileDescription: mod.State.model.FileDescription, FileContent: buffer, MimeType: mod.State.model.MimeType, FileSize: mod.State.model.FileSize, FileCategoryId: mod.State.model.FileCategoryId, ProgramDate: mod.State.model.ProgramDate, lstOfPrivilegeTypes: mod.State.model.lstOfPrivilegeTypes, LocaleId: mod.State.model.LocaleId })
			.then((data) => {
				//debugger;
				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					mod.GetSearch();
					mod.ClearModel();

					// [TODO] Replace with standard message display. Get text from resources.
					alert("Data Updated..");

					mod.State.model.set("showUpdatePanel", false);
					mod.State.model.set("showSearchPanel", true);

				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("Failed to load the file");
				}
				mod.HideProgress();
			});
	}

	GetSearch(): void {
		//debugger;

		let mod = this;
		let model = mod.State.model;
		let services = mod.Services;

		// Call the service
		services.Cms.GetSearchResult({ FileName: mod.State.model.SearchFileName, FileDescription: mod.State.model.SearchFileDescription, FileCategoryId: mod.State.model.SearchFileCategoryId })
			.then((data) => {
				//debugger;

				if (data.ResponseCode == services.Constants.ResponseCode.Success) {
					mod.ShowGrid(data.Data.CmsFileData);
					//var fileGrid = document.getElementById('fileGrid');
				} else {
					// [TODO] Replace with standard message display. Get text from resources.
					alert("SERVER ERROR");
				}

				mod.SearchOverlayOff();
			});
	}

	ClearModel(): void {
		//debugger;

		let mod = this;
		let model = mod.State.model;
		let services = mod.Services;

		mod.State.model.set("lstOfPrivilegeTypes", []);
		mod.State.model.set("FileId", "");
		mod.State.model.set("FileName", "");
		mod.State.model.set("MimeType", "");
		mod.State.model.set("FileSize", "");
		mod.State.model.set("FileDescription", "");
		mod.State.model.set("FileCategoryId", null);
		mod.State.model.set("LocaleId", null);

		$(".k-upload-files.k-reset").find("li").parent().remove();
	}

	SearchOverlayOn() {
		// Enables overlay via JQuery
		// [TODO] Use mod.Controls and add wrapper function to abstract JQuery
		$('#fileGrid').addClass('spinnerOverlay');
	}
	SearchOverlayOff() {
		// Disables overlay via JQuery
		// [TODO] Use mod.Controls and add wrapper function to abstract JQuery
		$('#fileGrid').removeClass('spinnerOverlay');
	}
}
