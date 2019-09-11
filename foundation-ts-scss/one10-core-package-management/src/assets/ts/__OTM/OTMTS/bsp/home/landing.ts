/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule } from 'cp/componentModule';
//import { MenuItem } from 'cp/securityShared';
//import { ServiceConstants, ServiceCollection } from 'cp/serviceShared';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject } from 'cp/di';
import { MasonryManager } from 'masonry-layout';

interface SectionModel extends ComponentModel { }
interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls { }

//interface SectionTemplates extends ComponentTemplates { }

@Injectable()
export class PageComponent extends ComponentModule {
	public Controls: SectionControls;
	public State: SectionState;
	//public Templates: SectionTemplates;
	@Inject() public Masonry: MasonryManager;

	constructor(ac: ApplicationContext) {
		super("Page", ac);
		//let mod = this;
	}

	Initialize() {
		//debugger;
		let mod = this;
		let state = mod.State;
		let util = mod.Util;

		// Initialize the parent
		super.Initialize();

		mod.WriteLog("Initialize.");

		// Instantiate Masonry
		// [TODO] Make configurable
		mod.Masonry.Instance = mod.Masonry.Create(
			'.main-content', {
				// options
				//itemSelector: '.gizmo',
				itemSelector: '.main-content>[class^="gizmo--"]',
				columnWidth: '.grid-sizer',
				gutter: 32,
				horizontalOrder: true
			});

		// Create the model
		let model = state.model = mod.CreateObservable({

		}//,
			// Optional: Service flags
			//["Data1", "Data2"]
		);

		// Bind the model to the page
		mod.BindModel(null, model);

		// Initialize sub-components
		// Do this AFTER binding and starting the service watcher
		mod.InitializeComponents();
	}
}
