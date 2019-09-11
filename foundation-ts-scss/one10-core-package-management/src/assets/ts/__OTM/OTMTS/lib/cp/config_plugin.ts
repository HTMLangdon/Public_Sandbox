/****************************************************************************
Copyright (c) 2017 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

/**
 * Plugin used to import and bind shared configuration information.
 * @module cp/config_plugin
 */

import { Injectable, ScopeType } from 'cp/di';

var AppConfig: Config = window["CPConfig"];

/**
 * Application configuration.
 */
@Injectable(null, ScopeType.Singleton)
export class Config {
	public Core: CoreConfig;

	constructor() {
		$.extend(true, this, AppConfig);
	}
}
