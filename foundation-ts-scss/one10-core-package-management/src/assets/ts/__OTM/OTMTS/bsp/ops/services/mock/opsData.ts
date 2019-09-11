import { IErrorDetails, WsDiagAction, WsDiagItem, WsDiagModel, WsDiagResult, WsProcessFeedLog, WsProcessFeedLogRequest, WsProcessLog, WsProcessLogSearchRequest, WsProcessLogStep, WsProcessLogStepItem, WsProcessStatusType, WsProcessType } from '../models/opsModels';

export var Errors = [
	{
		ErrorId: "37fa51ae-2873-4c48-9269-1d0afa14e1d6", Timestamp: new Date("2018-02-28 06:02:00"), Message: "Error 1", Type: "System.Exception", Source: "Code Module 1", UserId: 111, Username: "test@test.com",
		Server: "one10platform.dev.one10marketing.com",
		Path: "/aspx/reports/ReportSelection.aspx",
		Referrer: "~/aspx/reports/ReportSelection.aspx?reportGroupID=PR",
		Detail: "Error in module 1: CP.Web.ABC(string p1, int p2)\r\nCP.Core.XYZ()",
		Collections: [
			{
				Name: "Server Variables", Items: [
					{ Key: "CONTENT_TYPE", Value: "application/x-www-form-urlencoded; charset=utf-8" },
					{ Key: "CONTENT_LENGTH", Value: "627894" },
					{ Key: "PATH_INFO", Value: "/aspx/Admin/UserAdmin.aspx" },
					{ Key: "HTTP_USER_AGENT", Value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063" }
				]
			},
			{
				Name: "Cookies", Items: [
					{ Key: "ASP.NET_SessionId", Value: "20wah5dj2hwqmujs1yo4bhil" },
					{ Key: "__Auth", Value: "576DFEF340F6AC9F42F4AABCF0DFA4600B542700AF4E92809745911F1BC9AA6912E51645CBED7256EF0F56DC5F56DD3A80ACB1B0460DC1307797D38BF6DED35C612214A1421D554D4AA511FA37CC786AE081823E5DB81152C054B06B83299776" }
				]
			}
		]
	},
	{
		ErrorId: "97dd4f0d-e433-4faf-92f1-d99584fef44b", Timestamp: new Date("2018-02-28 05:13:00"), Message: "Error 1", Type: "System.Exception", Source: "Code Module 1", UserId: 111, Username: "test@test.com",
		Server: "one10platform.dev.one10marketing.com",
		Path: "/Programs/PromotionAllocation",
		Referrer: "~/Programs/PromotionAllocation",
		Detail: "Error in module 1: CP.Web.ABC(string p1, int p2)\r\nCP.Core.XYZ()"
	}
];

export var ProcessFeedLogs: WsProcessFeedLog[] = [
	{

		ProcessFeedLogId: 1,
		ProcessLogId: 1,
		FeedTypeId: 1,
		FeedTypeName: "Dealer Load",
		ProcessStatusTypeId: "S",
		ProcessStatusTypeName: "Success",
		FeedFilename: "dealer_2.xml"
	},
	{
		ProcessFeedLogId: 2,
		ProcessLogId: 1,
		FeedTypeId: 1,
		FeedTypeName: "Dealer Load",
		ProcessStatusTypeId: "S",
		ProcessStatusTypeName: "Success",
		FeedFilename: "dealer_3.xml"
	}
];

export var ProcessLogs: WsProcessLog[] = [
	{
		ProcessTypeName: "Product Sales Load",
		ProcessStatusTypeName: "Success",
		ProcessLogId: 99,
		ProcessTypeId: 2,
		ProcessStatusTypeId: "S",
		RunId: "2E36B44C-19B9-4600-8FF5-42C9E8FF8A23",
		StartTime: new Date("2018-05-01 07:02:00"),
		EndTime: new Date("2018-05-01 07:04:00"),
		Duration: 120,
		ProcessUserId: 1,  // Will match in DB: CPSec.UserData.UserId
		ProcessUsername: "System",
		LogInfo: "<job\r\n  version=\"3\">\r\n  <process>\r\n    <processName>GPS Payment Process</processName>\r\n    <processResult>True</processResult>\r\n    <processStartTime>10/2/2018 7:55:28 AM</processStartTime>\r\n    <processStopTime>10/2/2018 7:55:28 AM</processStopTime>\r\n    <processDuration>0.03</processDuration>\r\n    <runID>D988485D-9FD2-419E-854A-0920D6DD8DA5</runID>\r\n    <failedMessage />\r\n    <failedStep />\r\n  </process>\r\n  <steps>\r\n    <step>\r\n      <stepName>Apply Settings</stepName>\r\n      <stepType>Manager</stepType>\r\n      <stepResult>True</stepResult>\r\n      <stepStartTime>10/2/2018 7:55:28 AM</stepStartTime>\r\n      <stepEndTime>10/2/2018 7:55:28 AM</stepEndTime>\r\n      <stepDuration>0.00</stepDuration>\r\n      <stepItems>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Start Task</Key>\r\n          <Value>Log to DB</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>End Task</Key>\r\n          <Value>Log to DB</Value>\r\n        </stepItem>\r\n      </stepItems>\r\n    </step>\r\n    <step>\r\n      <stepName>Initialize and Validate</stepName>\r\n      <stepType>Job</stepType>\r\n      <stepResult>True</stepResult>\r\n      <stepStartTime>10/2/2018 7:55:28 AM</stepStartTime>\r\n      <stepEndTime>10/2/2018 7:55:28 AM</stepEndTime>\r\n      <stepDuration>0.00</stepDuration>\r\n      <stepItems>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Default Environment</Key>\r\n          <Value>Dev</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Default Connection</Key>\r\n          <Value>SQLMain</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemMessage\"\r\n          infoType=\"RuntimeValue\">Connection 'SQLMain': 'S605181DL2SW611\DEVSQL' - 'DMEOne10Platform'.</stepItem>\r\n      </stepItems>\r\n    </step>\r\n  </steps>\r\n</job>",
		ProcessFeedLogs: [],
		Steps: [ // [TODO] Fill in with test data
			{ Name: "Step 1", Type: "Initialize", Result: true, StartTime: new Date("2018-05-01 07:02:00"), EndTime: new Date("2018-05-01 07:02:03"), Duration: 3, Items: [] },
			{ Name: "Step 2", Type: "Process", Result: true, StartTime: new Date("2018-05-01 07:02:03"), EndTime: new Date("2018-05-01 07:03:59"), Duration: 116, Items: [] },
			{ Name: "Step 3", Type: "Persist", Result: true, StartTime: new Date("2018-05-01 07:03:59"), EndTime: new Date("2018-05-01 07:04:00"), Duration: 1, Items: [] }
		]
	},
	{
		ProcessTypeName: "Dealer Load",
		ProcessStatusTypeName: "Failed",
		ProcessLogId: 39,
		ProcessTypeId: 1,
		ProcessStatusTypeId: "F",
		RunId: "8AA81762-25EE-4D0E-9EBC-F65717D269DD",
		StartTime: new Date("2018-05-01 06:02:00"),
		EndTime: new Date("2018-05-01 06:03:00"),
		Duration: 60,
		ProcessUserId: 1,
		ProcessUsername: "System",
		LogInfo: "<job\r\n  version=\"3\">\r\n  <process>\r\n    <processName>GPS Payment Process</processName>\r\n    <processResult>True</processResult>\r\n    <processStartTime>10/2/2018 7:55:28 AM</processStartTime>\r\n    <processStopTime>10/2/2018 7:55:28 AM</processStopTime>\r\n    <processDuration>0.03</processDuration>\r\n    <runID>D988485D-9FD2-419E-854A-0920D6DD8DA5</runID>\r\n    <failedMessage />\r\n    <failedStep />\r\n  </process>\r\n  <steps>\r\n    <step>\r\n      <stepName>Apply Settings</stepName>\r\n      <stepType>Manager</stepType>\r\n      <stepResult>True</stepResult>\r\n      <stepStartTime>10/2/2018 7:55:28 AM</stepStartTime>\r\n      <stepEndTime>10/2/2018 7:55:28 AM</stepEndTime>\r\n      <stepDuration>0.00</stepDuration>\r\n      <stepItems>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Start Task</Key>\r\n          <Value>Log to DB</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>End Task</Key>\r\n          <Value>Log to DB</Value>\r\n        </stepItem>\r\n      </stepItems>\r\n    </step>\r\n    <step>\r\n      <stepName>Initialize and Validate</stepName>\r\n      <stepType>Job</stepType>\r\n      <stepResult>True</stepResult>\r\n      <stepStartTime>10/2/2018 7:55:28 AM</stepStartTime>\r\n      <stepEndTime>10/2/2018 7:55:28 AM</stepEndTime>\r\n      <stepDuration>0.00</stepDuration>\r\n      <stepItems>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Default Environment</Key>\r\n          <Value>Dev</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemKeyValue\"\r\n          infoType=\"RuntimeValue\">\r\n          <Key>Default Connection</Key>\r\n          <Value>SQLMain</Value>\r\n        </stepItem>\r\n        <stepItem\r\n          type=\"StepItemMessage\"\r\n          infoType=\"RuntimeValue\">Connection 'SQLMain': 'S605181DL2SW611\DEVSQL' - 'DMEOne10Platform'.</stepItem>\r\n      </stepItems>\r\n    </step>\r\n  </steps>\r\n</job>",
		ProcessFeedLogs: [],
		Steps: [
			{ Name: "Step 1", Type: "Initialize", Result: true, StartTime: new Date("2018-05-01 06:02:00"), EndTime: new Date("2018-05-01 06:02:03"), Duration: 3, Items: [] },
			{ Name: "Step 2", Type: "Process", Result: true, StartTime: new Date("2018-05-01 06:02:03"), EndTime: new Date("2018-05-01 06:02:59"), Duration: 56, Items: [] },
			{ Name: "Step 3", Type: "Persist", Result: true, StartTime: new Date("2018-05-01 06:02:59"), EndTime: new Date("2018-05-01 06:03:00"), Duration: 1, Items: [] }
		]
	}
];

export var ProcessStatusTypes = [
	{ ProcessStatusTypeId: 'F', ProcessStatusTypeName: "Failed" },
	{ ProcessStatusTypeId: 'I', ProcessStatusTypeName: "In-Process" },
	{ ProcessStatusTypeId: 'R', ProcessStatusTypeName: "Rolled Back" },
	{ ProcessStatusTypeId: 'S', ProcessStatusTypeName: "Success" }
];

export var ProcessTypes = [
	{ ProcessTypeId: 1, ProcessTypeName: "Dealer Load" },
	{ ProcessTypeId: 2, ProcessTypeName: "Sales Load" }
];

export var DiagResults: IKeyValueCollection<WsDiagResult> = {
	health: {
		"Action": "health",
		"IsHealthy": false,
		"AggregateResult": "Failed",
		"Info": [
			{ "Type": 3, "Key": "General Info", "Value": null, "Result": false },
			{ "Type": 1, "Key": "Environment", "Value": "local", "Result": false },
			{ "Type": 1, "Key": "App Version", "Value": "1.0.6848.25487", "Result": false },
			{ "Type": 1, "Key": "v2.0.50727", "Value": "2.0.50727.5420 SP2", "Result": false },
			{ "Type": 1, "Key": "v3.0", "Value": "3.0.30729.5420 SP2", "Result": false },
			{ "Type": 1, "Key": "v3.5", "Value": "3.5.30729.5420 SP1", "Result": false },
			{ "Type": 1, "Key": "v4 Client", "Value": "4.6.01055", "Result": false },
			{ "Type": 1, "Key": "v4 Full", "Value": "4.6.01055 -> 4.6.1", "Result": false },
			{ "Type": 1, "Key": "v4.0 Client", "Value": "4.0.0.0", "Result": false },
			{ "Type": 1, "Key": "App State", "Value": "Active", "Result": false },
			{ "Type": 1, "Key": "Server Time - Local", "Value": new Date().toISOString(), "Result": false },
			{ "Type": 1, "Key": "Server Time - UTC", "Value": new Date().toISOString(), "Result": false },
			{ "Type": 3, "Key": "Database", "Value": null, "Result": false },
			{ "Type": 2, "Key": "DB Status", "Value": "Fetch Data", "Result": false }
		]
	},
	version: {
		"Action": "version",
		"IsHealthy": false,
		"AggregateResult": null,
		"Info": [
			{ "Type": 1, "Key": "Environment", "Value": "local", "Result": false },
			{ "Type": 1, "Key": "App Version", "Value": "1.0.6848.25487", "Result": false },
			{ "Type": 1, "Key": "v2.0.50727", "Value": "2.0.50727.5420 SP2", "Result": false },
			{ "Type": 1, "Key": "v3.0", "Value": "3.0.30729.5420 SP2", "Result": false },
			{ "Type": 1, "Key": "v3.5", "Value": "3.5.30729.5420 SP1", "Result": false },
			{ "Type": 1, "Key": "v4 Client", "Value": "4.6.01055", "Result": false },
			{ "Type": 1, "Key": "v4 Full", "Value": "4.6.01055 -> 4.6.1", "Result": false },
			{ "Type": 1, "Key": "v4.0 Client", "Value": "4.0.0.0", "Result": false }
		]
	},
	time: {
		"Action": "time",
		"IsHealthy": false,
		"AggregateResult": null,
		"Info": [
			{ "Type": 1, "Key": "Server Time - Local", "Value": new Date().toISOString(), "Result": false },
			{ "Type": 1, "Key": "Server Time - UTC", "Value": new Date().toISOString(), "Result": false }
		]

	},
	error: {
		Action: "error",
		IsHealthy: true,
		AggregateResult: null,
		Info: []
	},
	clearCache: {
		"Action": "clearCache",
		"IsHealthy": false,
		"AggregateResult": "Cache Cleared",
		"Info": [
			{ "Type": 1, "Key": "Clear Cache", "Value": "Completed", "Result": false }
		]
	},
	reloadConfig: {
		"Action": "reloadConfig",
		"IsHealthy": false,
		"AggregateResult": "Configuration Reloaded",
		"Info": [
			{ "Type": 1, "Key": "Config Reload", "Value": "Completed", "Result": false }
		]
	},
	config: {
		"Action": "config",
		"IsHealthy": false,
		"AggregateResult": null,
		"Info": [
			{ "Type": 3, "Key": "Configuration", "Value": null, "Result": false },
			{ "Type": 1, "Key": "Brand:BrandInfo:brandx:BrandCode", "Value": "brandx", "Result": false },
			{ "Type": 1, "Key": "Brand:BrandInfo:brandx:BrandId", "Value": "1", "Result": false },
			{ "Type": 1, "Key": "Brand:BrandInfo:brandx:BrandName", "Value": "Brand X", "Result": false },
			{ "Type": 1, "Key": "Brand:BrandInfo:brandx:Expression", "Value": "one10platform", "Result": false },
			{ "Type": 1, "Key": "Brand:Brands", "Value": "brandx", "Result": false },
			{ "Type": 1, "Key": "Brand:Default", "Value": "brandx", "Result": false },
			{ "Type": 1, "Key": "Cache:Configuration:AbsoluteTime", "Value": "01:00", "Result": false },
			{ "Type": 1, "Key": "Cms:FileSize", "Value": "100000000", "Result": false },
			{ "Type": 1, "Key": "Cms:FileTypes", "Value": "txt,jpg,pdf", "Result": false },
			{ "Type": 1, "Key": "Config:FileOverride", "Value": "", "Result": false },
			{ "Type": 1, "Key": "Config:SessionOverride", "Value": "True", "Result": false },
			{ "Type": 1, "Key": "Data:Default:CommandTimeout", "Value": "120", "Result": false },
			{ "Type": 1, "Key": "Email:From", "Value": "no-reply@one10marketing.com", "Result": false },
			{ "Type": 1, "Key": "Email:Smtp", "Value": "smtpgate.gblmktg.com", "Result": false },
			{ "Type": 1, "Key": "Email:Subject", "Value": "PerformX - Website Error - {env}", "Result": false },
			{ "Type": 1, "Key": "Email:To", "Value": "performx.operations@one10marketing.com", "Result": false },
			{ "Type": 1, "Key": "Environment:Active", "Value": "true", "Result": false },
			{ "Type": 1, "Key": "Environment:Name", "Value": "Dev", "Result": false },
			{ "Type": 1, "Key": "Environment:UseDB", "Value": "True", "Result": false },
			{ "Type": 1, "Key": "Security:Authentication:DefaultPath", "Value": "~/", "Result": false },
			{ "Type": 1, "Key": "Security:Authentication:LoginPath", "Value": "~/Account/Login", "Result": false },
			{ "Type": 1, "Key": "Security:Lockout:MaxFailedAccessAttempts", "Value": "5", "Result": false },
			{ "Type": 1, "Key": "Security:Password:Expiration", "Value": "15.00:00", "Result": false },
			{ "Type": 1, "Key": "Security:Password:MinimumReuse", "Value": "5", "Result": false },
			{ "Type": 1, "Key": "Security:Password:RequireUppercase", "Value": "1", "Result": false },
			{ "Type": 1, "Key": "Website:ErrorPath", "Value": "~/Pub/Error", "Result": false },
			{ "Type": 1, "Key": "Website:LoginPath", "Value": "~/Account/Login", "Result": false }
		]
	}
}
