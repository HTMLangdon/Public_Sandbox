/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Shared security components.
 * @module cp/securityShared
 */

import { IServiceModule } from './serviceShared';
import { ObservableDataEvent } from './util';

/**
 * Response from a log off request.
 */
export class LogoffResponse {
	/** Numeric result code. */
	ResultCode: number;
	/** Result message. */
	ResultMessage: string;
}

/**
 * Response from a login request.
 */
export class LoginResponse {
	/** Numeric result code. */
	ResultCode: number;
	/** Result message. */
	ResultMessage: string;
	/** User ID. */
	UserId: number;
	/** Username. */
	Username: string;
	/** First name. */
	FirstName: string;
	/** Last name. */
	LastName: string;
	/** Email address. */
	Email: string;
	/** Collection of role IDs. */
	Roles: number[] = [];
	/** Collection of privilege IDs. */
	Privileges: number[] = [];

	ParticipantId: number;
	IsImp?: boolean;
}

/**
 * User information.
 */
export class UserInfo implements IUserInfo {
	/** Flag indicating if user if valid (logged in). */
	IsValid: boolean = false;
	/** Numeric User ID. */
	UserId: number = 0;
	/** Username. */
	Username: string = "";
	/** First name. */
	FirstName: string;
	/** Last name. */
	LastName: string;
	/** Email address. */
	Email: string;
	/** Collection of role IDs. */
	Roles: number[] = [];
	/** Collection of privilege IDs. */
	Privileges: number[] = [];

	ParticipantId: number;
	IsImp: boolean;
}

/**
 * Menu information.
 */
export class MenuItem {
	/** Text to be displayed. */
	text: string;
	/** URL to the page or resource. */
	url: string;
	/** CSS class applied to the item. */
	cssClass: string;
	/** Flag indicating if the text is encoded. */
	encoded: boolean;
	/** Content within the item. */
	content: string;
	/** Optional menu item URL. */
	imageUrl: string;
	/** Optional sprite CSS class. */
	spriteCssClass: string;
	/** Optional collection of sub-items. */
	items: MenuItem[];

	/** Flag indicating if child sub-items exist. */
	hasChildren: boolean;

	constructor(text: string, url?: string, target?: string, items?: MenuItem[]) {
		let mod = this;

		mod.text = text;
		mod.url = url === undefined || url == null ? "" : url;
		//mod.Target = target === undefined || target == null ? "" : target; // @@@ Not supported in Kendo menu
		mod.items = items;
		if (items != null && items.length > 0)
			//mod.HasChildren = true;
			mod.hasChildren = true;
		//mod.UrlType = mod.GetUrlType();
	};

	//private GetUrlType(): string {
	//	let mod = this;
	//	if (mod.Url == '' || mod.Url == null) return "link";
	//	if (mod.Url.substring(0, 1) == '/') return "route";
	//	return "link";
	//};
}

/**
 * Base interface used to define login criteria.
 */
export interface ILoginInfo { }

/**
 * Login information using username and password.
 */
export class PasswordLoginInfo implements ILoginInfo {
	/** Username */
	public username: string;
	/** Clear-text password. */
	public password: string;
}

/**
 * Information for a user change event.
 */
export class UserChangedEvent extends ObservableDataEvent<IUserInfo> {
	
}


