/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { Injectable, ScopeType } from 'cp/di';

//var MasonryConstructor: Constructor<Masonry> = window["Masonry"];
//var MasonryInstance: Masonry = window["MasonryInstance"];

/**
 * Application configuration.
 */
@Injectable(null, ScopeType.Singleton)
export class MasonryManager {
	private _constructor: Constructor<Masonry> = null;
	private _instance: Masonry = null;

	constructor() {
		//let mod = this;
	}

	public Create(selectorString: string, options: any): Masonry {
		let mod = this;
		if (!mod._constructor)
			mod.GetMasonry();

		return new mod._constructor(selectorString, options);
	}
	public get Instance(): Masonry {
		let mod = this;
		if (!mod._instance)
			mod.GetMasonry();
		return mod._instance;
	}
	public set Instance(instance: Masonry) {
		let mod = this;
		mod._instance = instance;
	}
	private GetMasonry(): void {
		let mod = this;
		mod._constructor = window["Masonry"];
		let i = window["MasonryInstance"];
		if (i)
			mod._instance = i;
	}
}
