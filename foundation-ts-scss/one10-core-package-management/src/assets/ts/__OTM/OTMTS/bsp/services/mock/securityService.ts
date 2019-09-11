/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Module } from 'cp/moduleShared';
import { UserInfo, MenuItem, LoginResponse, LogoffResponse } from 'cp/securityShared';
import { MockServiceModule, WsResponse, WsResponseData } from 'cp/serviceShared';
import { ScopeType, Injectable } from 'cp/di';
//import { Questions, UserQuestions, MaxUserSecurityQuestionId } from './securityData';
import { Questions, UserQuestions } from './securityData';

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
export class SecurityService extends MockServiceModule {
	//Constants: ServiceConstants;

	private Questions: ISecurityQuestionType[];
	private UserQuestions: IUserSecurityQuestion[];
	private MaxUserSecurityQuestionId: number;

	constructor() {
		super("SecurityService");

		let mod = this;
		mod.Questions = Questions;
		mod.UserQuestions = UserQuestions;
		mod.MaxUserSecurityQuestionId = mod.UserQuestions.length > 0 ? mod.UserQuestions[mod.UserQuestions.length - 1].UserSecurityQuestionId : 0;
		//mod.Questions = [
		//	{ SecurityQuestionId: 1, SecurityQuestionDescription: "What town were you born in?" },
		//	{ SecurityQuestionId: 2, SecurityQuestionDescription: "What is Your Dog's Name?" },
		//	{ SecurityQuestionId: 3, SecurityQuestionDescription: "What is the name of your favorite pet? " },
		//	{ SecurityQuestionId: 4, SecurityQuestionDescription: "What elementary school did you attend?" },
		//	{ SecurityQuestionId: 5, SecurityQuestionDescription: "What is your favorite sport?" }
		//];
		//mod.UserQuestions = [
		//	{ UserSecurityQuestionId: 11, UserId: 1887, SecurityQuestionId: 2, Answer: "Lorem ipsum" },
		//	{ UserSecurityQuestionId: 22, UserId: 1887, SecurityQuestionId: 4, Answer: "Ipsum lorem" }
		//];
		//mod.MaxUserSecurityQuestionId = 22; // Set to the max # above
	}

	public CurrentUser(): Promise<IUserInfo> {
		let mod = this;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		return new Promise<IUserInfo>((resolve, reject) => {
			let u = new UserInfo();
			u.UserId = 1004;
			u.Username = "test";
			u.FirstName = "Test";
			u.LastName = "User";

			resolve(u);
		});
	}
	public GetMenu(ignoreCache?: boolean): Promise<MenuItem[]> {
		//debugger;
		let mod = this;
		//let services = mod.Services;
		let appConfig = mod.AppConfig;
		let constants = mod.Constants;
		let util = mod.Util;

		// Get the cached value
		// [TODO] Temporary? Consider a centralized page-based "service".
		// Like resources, but more unified and using less global namespace clutter.
		let d: MenuItem[] = window["CPMenuData"];

		if (ignoreCache || !util.HasData(d)) {
			d = [];
			d.push(new MenuItem("Home"));
			return new Promise<MenuItem[]>((resolve, reject) => {
				resolve(d);
			});
		}

		return new Promise<MenuItem[]>((resolve, reject) => { resolve(d); });
	}
	public GetUserForRegistration(email: string): Promise<WsResponseData<WsRegistrationStartResponse>> {
		let mod = this;
		let constants = mod.Constants;

		return new Promise<WsResponseData<WsRegistrationStartResponse>>((resolve, reject) => {
			//debugger;
			let r: WsRegistrationStartResponse = {
				Email: email, UserId: 0, ParticipantId: 0, IsRegistered: false,
				//NeedW9: true
				NeedW9: false
			};
			let ret = WsResponseData.SuccessData<WsRegistrationStartResponse>(r);
			if (email == "bad") { // ### TEST CASE
				ret.ResponseCode = constants.ResponseCode.NotFound;
				ret.ResponseMessage = constants.ResponseMessage.NotFound;
				r.NeedW9 = false;
			} else if (email == "reg") { // ### TEST CASE
				ret.ResponseCode = 100;
			} else {
				if (email.toLowerCase() == "w9") r.NeedW9 = true;

				//r.UserId = 1;
				r.UserId = 1887;
				r.ParticipantId = 54;
			}

			resolve(ret);
		});
	}
	public UpdatePassword(userId: number, oldPassword: string, newPassword: string): Promise<WsResponse> {
		let mod = this;
		let constants = mod.Constants;
		return new Promise<WsResponse>((resolve, reject) => {
			if (oldPassword == "bad" || newPassword == "bad") { // ### Hard-coded condition for testing
				let r = new WsResponse();
				r.ResponseCode = 100;
				r.ResponseMessage = "The specified password does not conform to complexity requirements.";
				resolve(r);
			} else
				resolve(WsResponse.Success());
		});
	}	
	public GetSecurityQuestions(): Promise<WsResponseData<ISecurityQuestionType[]>> {
		let mod = this;
		let r = WsResponseData.SuccessData<ISecurityQuestionType[]>(mod.Questions);
		return new Promise<WsResponseData<ISecurityQuestionType[]>>((resolve, reject) => resolve(r));
	}
	public GetUserSecurityQuestions(userId: number): Promise<WsResponseData<IUserSecurityQuestion[]>> {
		let mod = this;
		let r = WsResponseData.SuccessData<IUserSecurityQuestion[]>(mod.UserQuestions);
		return new Promise<WsResponseData<IUserSecurityQuestion[]>>((resolve, reject) => resolve(r));
	}
	public UpdateUserSecurityQuestions(userId: number, questions: IUserSecurityQuestion[]): Promise<WsResponseData<WsSecurityQuestionResponse>> {
		let mod = this;

		let ql: IUserSecurityQuestion[] = [];
		for (let i = 0; i < questions.length; i++) {
			let question = questions[i];
			let q = mod.updateUserSecurityQuestion(question);
			// Update the ID (really only needed if it was zero before)
			ql.push(q);
		}

		return new Promise<WsResponseData<WsSecurityQuestionResponse>>((resolve, reject) => {
			resolve(
				WsResponseData.SuccessData<WsSecurityQuestionResponse>({ UserId: userId })
			)
		});
	}
	private updateUserSecurityQuestion(userQuestion: IUserSecurityQuestion): IUserSecurityQuestion {
		let mod = this;

		let item: IUserSecurityQuestion = null;

		// [TODO] Validation

		if (userQuestion.UserSecurityQuestionId > 0) {
			let index = mod.FindUserQuestion(userQuestion.UserSecurityQuestionId);
			item = mod.UserQuestions[index];
			// [TODO] Validation/safety checks, messaging
			item.SecurityQuestionId = userQuestion.SecurityQuestionId;
			item.Answer = userQuestion.Answer;
		} else {
			item = { UserSecurityQuestionId: ++mod.MaxUserSecurityQuestionId, UserId: userQuestion.UserId, SecurityQuestionId: userQuestion.SecurityQuestionId, Answer: userQuestion.Answer };
			mod.UserQuestions.push(item);
		}

		// Return a copy
		return { UserSecurityQuestionId: item.UserSecurityQuestionId, UserId: item.UserId, SecurityQuestionId: item.SecurityQuestionId, Answer: item.Answer }
	}
	public UpdateUserSecurityQuestion(userQuestion: IUserSecurityQuestion): Promise<WsResponse> {
		let mod = this;
		mod.updateUserSecurityQuestion(userQuestion);
		return new Promise<WsResponse>((resolve, reject) => resolve(WsResponse.Success()));
	}
	private deleteUserSecurityQuestion(userQuestion: IUserSecurityQuestion) {
		let mod = this;

		// Find the item
		let index = mod.FindUserQuestion(userQuestion.UserSecurityQuestionId);

		// [TODO] Validation/safety checks, messaging

		// Remove it
		mod.UserQuestions.removeAt(mod.UserQuestions, index);
	}
	public DeleteUserSecurityQuestion(userQuestion: IUserSecurityQuestion): Promise<WsResponse> {
		let mod = this;
		mod.deleteUserSecurityQuestion(userQuestion);
		return new Promise<WsResponse>((resolve, reject) => resolve(WsResponse.Success()));
	}

	private FindUserQuestion(userSecurityQuestionId: number): number {
		let mod = this;
		for (let i = 0; i < mod.UserQuestions.length; i++) {
			if (mod.UserQuestions[i].UserSecurityQuestionId == userSecurityQuestionId)
				return i;
		}
		return -1;
	}

	public RegisterUser(userId: number, email: string, questions: IUserSecurityQuestion[], newPassword: string): Promise<WsResponseData<WsSecurityQuestionResponse>> {
		let mod = this;

		return new Promise<WsResponseData<WsSecurityQuestionResponse>>((resolve, reject) => {
			resolve(WsResponseData.SuccessData<WsSecurityQuestionResponse>({ UserId: userId }));
		});
	}
}
