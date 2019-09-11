/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/


import { Module } from 'cp/moduleShared';
import { ServiceModule, ServiceManager } from 'cp/serviceShared';
import { ScopeType, Injectable, AutoInit } from 'cp/di';

/**
 * Application configuration.
 */
@Injectable(null, ScopeType.Singleton)
export class BotWebChatService extends ServiceModule {
	//Constants: ServiceConstants;
	private _webchat: any = null;

	public get WebChat(): any {
		let mod = this;
		if (!mod._webchat)
			mod.GetWebChatClient();
		return mod._webchat;
	}
	public set WebChat(webchat: any) {
		let mod = this;
		mod._webchat = webchat;
	}

	constructor(sm: ServiceManager) {
		super("BotWebChatService", sm);
		//debugger;
		let mod = this;
		// Initialize
		mod.Initialize();
	}

	Initialize() {
		// Call the parent
		super.Initialize();

		//debugger;
		let mod = this;
		let util = mod.Util;

		mod.WriteLog("Initialize.");
	}


	public async RenderWebChat(elem: HTMLElement, userId: string, userName: string,
		userInitials: string) {
		let mod = this;
		let model = mod.State.model;
		const styleSet = mod.WebChat.createStyleSet({
			backgroundColor: '#eae9e9',
			subtle: 'rgb(0, 35, 57)',
			accent: '#0a0a0a',
			rootHeight: '100%',
			rootWidth: '100%',
			botAvatarInitials: mod.AppConfig.Core.BotConfig.AvatarInitials,
			userAvatarInitials: userInitials,
			hideUploadButton: true,
			bubbleFromUserBackground: '#6fcacb',
			paddingRegular: 10,
			paddingWide: 20,
			showSpokenText: false
		});

		mod.WebChat.renderWebChat({
			directLine: mod.WebChat.createDirectLine({ token: mod.AppConfig.Core.BotConfig.DirectLineTokenId }),
			webSpeechPonyfillFactory: await mod.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory({
				region: mod.AppConfig.Core.BotConfig.SpeechRegion,
				subscriptionKey: mod.AppConfig.Core.BotConfig.SubscriptionId
			}),
			userID: userId.toString(),
			username: userName,
			locale: mod.AppConfig.Core.Locale.CurrentLocaleId,
			styleSet
		}, elem);
	}

	private GetWebChatClient(): void {
		let mod = this;
		let i = (window as any).WebChat;
		if (i)
			mod._webchat = i;
	}

	private GetBotStyleSheet(userInitials: any): any {
		let mod = this;
		return mod.WebChat.createStyleSet({
			backgroundColor: '#eae9e9',
			subtle: 'rgb(0, 35, 57)',
			accent: '#0a0a0a',
			rootHeight: '100%',
			rootWidth: '100%',
			hideUploadButton: true,
			bubbleFromUserBackground: '#6fcacb',
			paddingRegular: 10,
			paddingWide: 20,
			showSpokenText: false,
			botAvatarInitials: mod.AppConfig.Core.BotConfig.AvatarInitials,
			userAvatarInitials: userInitials
		});
	}

}
