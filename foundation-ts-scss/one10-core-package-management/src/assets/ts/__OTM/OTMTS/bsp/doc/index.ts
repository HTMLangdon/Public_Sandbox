/****************************************************************************
Copyright (c) 2017-2019 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

import { ComponentModule, ComponentCollection } from 'cp/componentModule';
import { ApplicationContext } from 'cp/appShared';
import { Injectable, Inject, DiscardBinding } from 'cp/di';

// Load components
//import { YyyComponent, YyyModel } from './components/Yyy';

//interface SectionData extends Observable {
//	//Value1: string;
//}

//interface ViewData extends Observable {
//	//Flag1: boolean;
//}

//interface LookupData extends Observable {
//	PromotionStatuses: WsPromotionStatus[];
//}

// Optional: Service-bound models (converted to observables)
//interface Xxx extends WsXxxResult, Observable { }

interface SectionModel extends ComponentModel {
  
}

interface SectionState extends ComponentState<SectionModel> { }

interface SectionControls extends ComponentControls {
  pageMain: JQuery;
  //gridResults: JQuery;
  gridResults: ComplexControl<kendo.ui.Grid>;
}

interface SectionTemplates extends ComponentTemplates {
  //Page: Template;
}

// Optional: Child components
//@Injectable() @DiscardBinding()
//class SectionComponents extends ComponentCollection {
//	@Inject() Yyy: YyyComponent;
//}

//@Injectable() @DiscardBinding()
//class SectionServices extends ServiceCollection {
//  @Inject() Bi: BiService = null;
//}

@Injectable()
export class PageComponent extends ComponentModule {
  public Controls: SectionControls;
  public State: SectionState;
  public Templates: SectionTemplates;

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

    // Get control and template references; bind buttons
    mod.GetControl("pageMain");

    // Create the model
    let model = state.model = mod.CreateObservable({

    }//,
      //["data1"]
    );

    // Bind the model to the page
    mod.BindModel(null, model);

    // Initialize sub-components
    // Do this AFTER binding and starting the service watcher
    mod.InitializeComponents();

    // Render the main page template
    //mod.RenderTemplate({ Context: mod, Name: 'PageTemplate', Parent: '', ChildKey: '', Meta: null, Data: model }, mod.Controls.pageMain);

    // [TODO] Do we need to call this for blocks that are being re-built and re-bound?
    // Not necessarily here, but anywhere?
    //kendo.unbind(..)
  }
}
