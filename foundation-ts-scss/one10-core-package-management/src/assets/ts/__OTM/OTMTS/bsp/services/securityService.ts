/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { UserInfo, MenuItem, LoginResponse, LogoffResponse } from 'cp/securityShared';
import { ServiceModule, ServiceManager, WsResponse, WsResponseData, ICallInfo } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';

export interface WsLoginRequest {
	Username: string;
	Password: string;
}

export interface WsLoginResponse {
	UserId: number;
	Username: string;
	FirstName: string;
	LastName: string;
	Email: string;
	Roles: number[];
	Privileges: number[];
	ParticipantId: number
}
export interface WsRegistrationStartRequest {
	//Username: string;
	Email: string;
}
export interface WsRegistrationStartResponse {
	//Username: string;
	Email: string;
	UserId: number;
	ParticipantId: number;
	IsRegistered: boolean;
	NeedW9: boolean;
}
export interface WsRegistrationRequest {
	UserId: number;
	Email: string;
	Questions: IUserSecurityQuestion[];
	NewPassword: string;
}
export interface WsRegistrationResponse {
	UserId: number;
}
export interface ISecurityQuestionType {
	SecurityQuestionId: number;
	SecurityQuestionDescription: string;
}
export interface IUserSecurityQuestion {
	UserSecurityQuestionId?: number;
	UserId: number;
	SecurityQuestionId: number;
	Answer: string;
}
export interface WsSecurityQuestionRequest {
	UserId: number;
	UserQuestions: IUserSecurityQuestion[];
}
export interface WsSecurityQuestionResponse {
	UserId: number;
}
export interface WsPasswordUpdateRequest {
	UserId: number;
	OldPassword: string;
	NewPassword: string;
	//ConfirmPassword: string; // Not needed
}
export interface WsPasswordUpdateResponse { }
export interface WsProfileRequest extends WsSecurityQuestionRequest, WsPasswordUpdateRequest { }
export interface WsProfileResponse extends WsSecurityQuestionResponse { }

@Injectable(null, ScopeType.Singleton)
export class SecurityService extends ServiceModule {
	constructor(sm: ServiceManager) {
		// Call the parent
		super("SecurityService", sm);

		//debugger;
		let mod = this;

		// Initialize
		mod.Initialize();
	}

	public GetMainNav(): Promise<MenuItem[]> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d: MenuItem[] = window["CPMenuData"];
		return new Promise<MenuItem[]>((resolve, reject) => { resolve(d); });

		// [TEST] Add lag
		//return new Promise<MenuItem[]>((resolve, reject) => {
		//	setTimeout(() => { resolve(d); }, 4000)
		//});
	}

  public GetMobileNav(): Promise<MenuItem[]> {
    //debugger;
    let mod = this;
    let services = mod.Services;
    let appConfig = mod.AppConfig;
    let constants = mod.Constants;
    let util = mod.Util;

    //let u = window["CPUserData"].Data;

    let mm = [
      {
        "type": "mobile-menu__top",
        "image": "~/assets/img/logo-temp.png",
        "items": [
          {
            "type": "menu-mobile__userinfo",
            "name": "Test McTesterson",
            //name: u.FirstName + ' ' + u.LastName,
            "icon": "person",
            "title": "Sales Specialist"
          }
        ]
      },
      {
        "type": "menu-mobile__links",
        "items": [
          {
            "type": "menu-mobile__link",
            "modifier": null,
            "url": "#",
            "icon": "home",
            "text": "Overview"
          },
          {
            "type": "menu-mobile__link",
            "modifier": null,
            "url": "#",
            "icon": "account_balance",
            "text": "Earnings"
          },
          {
            "type": "menu-mobile__link",
            "modifier": null,
            "url": "#",
            "icon": "store",
            "text": "Catalog"
          },
          {
            "type": "menu-mobile__links--nested",
            "modifier": null,
            "url": "#",
            "icon": "assessment",
            "text": "Reporting",
            "items": [
              {
                "type": "menu-mobile__link",
                "modifier": null,
                "url": "#",
                "icon": null,
                "text": "Item1"
              },
              {
                "type": "menu-mobile__link",
                "modifier": null,
                "url": "#",
                "icon": null,
                "text": "Item2"
              }
            ]
          },
          {
            "type": "menu-mobile__link",
            "modifier": "menu-mobile__topborder",
            "url": "#",
            "icon": "inbox",
            "text": "Messages"
          },
          {
            "type": "menu-mobile__link",
            "modifier": null,
            "url": "#",
            "icon": "person",
            "text": "Profile"
          },
          {
            "type": "menu-mobile__link",
            "modifier": "menu-mobile__topborder",
            "url": "#",
            "icon": "exit_to_app",
            "text": "Log out"
          }
        ]
      }
    ];
    for (let i = 0; i < mm.length; i++) {
      mod.CleanPaths(mm[i]);
    }
    window["CPMobileMenuData"] = mm;


    let d: MenuItem[] = window["CPMobileMenuData"];
    return new Promise<MenuItem[]>((resolve, reject) => { resolve(d); });
  }

	public GetRightNav(): Promise<MenuItem[]> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d: MenuItem[] = window["CPRightMenuData"];
		return new Promise<MenuItem[]>((resolve, reject) => { resolve(d); });

		// [TEST] Add lag
		//return new Promise<MenuItem[]>((resolve, reject) => {
		//	setTimeout(() => { resolve(d); }, 2000)
		//});
	}

	public Login(username: string, password: string): Promise<WsResponseData<LoginResponse>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let body = JSON.stringify({ Username: username, Password: password });

		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/login",
			Method: constants.Method.Post,
			Data: body
		});
	}

	public Logoff(): Promise<WsResponseData<LogoffResponse>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/logoff",
			Method: constants.Method.Post,
			Data: null
		});
	}

	public GetUserForRegistration(email: string): Promise<WsResponseData<WsRegistrationStartResponse>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { Email: email };

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/getUserForRegistration",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public UpdatePassword(userId: number, oldPassword: string, newPassword: string): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { UserId: userId, OldPassword: oldPassword, NewPassword: newPassword };

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/updatePassword",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public GetSecurityQuestions(): Promise<WsResponseData<ISecurityQuestionType[]>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/getSecurityQuestions",
			Method: constants.Method.Get,
			Data: null
		});
	}

	public GetUserSecurityQuestions(userId: number): Promise<WsResponseData<WsSecurityQuestionRequest>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/getUserSecurityQuestions/" + userId.toString(),
			Method: constants.Method.Get,
			Data: null
		});
	}

	public UpdateUserSecurityQuestions(userId: number, questions: IUserSecurityQuestion[]): Promise<WsResponseData<WsSecurityQuestionResponse>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { UserId: userId, UserQuestions: questions };

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/updateUserSecurityQuestions",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}
	
	public UpdateUserSecurityQuestion(userQuestion: IUserSecurityQuestion): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = userQuestion;

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/updateUserSecurityQuestion",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}
	
	public DeleteUserSecurityQuestion(userQuestion: IUserSecurityQuestion): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = userQuestion;

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/deleteUserSecurityQuestion",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public RegisterUser(userId: number, email: string, questions: IUserSecurityQuestion[], newPassword: string): Promise<WsResponseData<WsSecurityQuestionResponse>> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { UserId: userId, Email: email, Questions: questions, NewPassword: newPassword };

		// Call the service
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/registerUser",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public StartPasswordReset(username: string): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { Username: username };
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/startPasswordReset",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public ValidateToken(tokenValue: string): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { TokenValue: tokenValue };
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/validateToken",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	public ResetPassword(tokenValue: string, newPassword: string, autoLogIn: boolean): Promise<WsResponse> {
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { TokenValue: tokenValue, NewPassword: newPassword, AutoLogIn: autoLogIn };
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/resetPassword",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}

	private _user: IUserInfo = null;
	private _userP: Promise<IUserInfo> = null;

	private convertUser(data: WsResponseData<LoginResponse>): IUserInfo {
		let mod = this;
		let constants = mod.Constants;
		let util = mod.Util;

		let user = new UserInfo();
		if (data.ResponseCode == constants.ResponseCode.Success && !util.IsNull(data.Data) && data.Data.UserId > 0) {
			let u = data.Data;
			user.IsValid = true;
			user.UserId = u.UserId;
			user.Username = u.Username;
			user.FirstName = u.FirstName;
			user.LastName = u.LastName;
			user.Email = u.Email;
			user.Roles = u.Roles;
			user.Privileges = u.Privileges;
			user.ParticipantId = u.ParticipantId;
			user.IsImp = u.IsImp;
		}
		return user;
	}

	public CurrentUser(forceFetch: boolean = false): Promise<IUserInfo> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		if (forceFetch) {
			// If there is not already a promise, fetch the info
			// If a promise already exists, return that (to prevent multiple service calls)
			if (util.IsNull(mod._userP)) {
				// Call the service
				mod._userP = services.MakeServiceCall(<ICallInfo>{
					EndPoint: appConfig.Core.WSRoot + "/account/currentLogin",
					Method: constants.Method.Get,
					Data: null
				})
					.then((data: WsResponseData<LoginResponse>) => {
						// Save the data and clear the promise handle
						mod._user = mod.convertUser(data);
						mod._userP = null;
						return mod._user;
					});
			}

			return mod._userP;
		} else {
			if (util.IsNull(mod._user)) {
				// Convert the embedded object into the right format
				// [TODO] Use constant/make configurable
				mod._user = mod.convertUser(window["CPUserData"]);
			}
			return new Promise<IUserInfo>((resolve, reject) => { resolve(mod._user); });
		}
	}

	public BeginImpersonation(userId: string): Promise<WsResponse> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		let d = { User: userId };
		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/beginImpersonation",
			Method: constants.Method.Post,
			Data: JSON.stringify(d)
		});
	}
	public EndImpersonation(): Promise<WsResponse> {
		//debugger;
		let mod = this;
		let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		return services.MakeServiceCall(<ICallInfo>{
			EndPoint: appConfig.Core.WSRoot + "/account/endImpersonation",
			Method: constants.Method.Get,
			Data: null
		});
	}
}
