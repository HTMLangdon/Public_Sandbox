/****************************************************************************
Copyright (c) 2018 One10, LLC

Unauthorized use or copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.
All Rights Reserved.
****************************************************************************/

// Note: This file must be in a separate folder than the rest of the application and the folder must have a special tsconfig.json.
// The following "triple slash" directives are required.

/// <reference path="../../../typings/cp/cp-shared.d.ts" />
/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../../typings/google/ga.d.ts" />

namespace CpWeb {

	interface InitializeOptions {
		LauncherPath?: string;
		LauncherName?: string;
		AppGlobalReference?: string;
		StartPath?: string;
		StartName?: string;
		StartModel?: any;
		StartGlobalReference?: string;
		Config?: Config;
	}

	interface LoadOptions {
		Path: string;
		Name: string;
		Model?: any;
		GlobalReference?: string;
	}

	/**
	 * Web component information.
	 * NOTE: This is a separate copy from the one in 'cp/appShared'. It cannot be imported into a non-module TS file.
	 * If the classes are moved to a definition file, then they could be imported.
	 */
	class ComponentInfo {
		/** Component wrapper module from the loader. */
		Component: KeyValueCollection<Constructor<any>>;
		/** Component name. */
		Name: string;
		/** Optional model associated with the component. */
		Model?: any;
		/** Optional global (window-level) variable name for the component.. */
		GlobalReference?: string;
		/** Component file path. */
		Path: string;

		constructor(component: any, name: string, path: string, model?: any, globalReference?: string) {
			let mod = this;
			mod.Component = component;
			mod.Name = name;
			mod.Path = path;
			mod.Model = model;
			mod.GlobalReference = globalReference;
		}
	}

	/**
	 * Application launch options.
	 * NOTE: This is a separate copy from the one in 'cp/appShared'. It cannot be imported into a non-module TS file.
	 * If the classes are moved to a definition file, then they could be imported.
	 */
	class LaunchOptions {
		Components: ComponentInfo[];
		ManagerGlobalReference?: string;
		StartupComponent?: ComponentInfo;
		Config?: Config;

		constructor(components: ComponentInfo[], config?: Config, managerGlobalReference?: string, startupComponent?: ComponentInfo) {
			let mod = this;
			mod.Components = components;
			mod.Config = config;
			mod.ManagerGlobalReference = managerGlobalReference;
			mod.StartupComponent = startupComponent;
		}
	}

	class ResourceInfo {
		Key: string;
		Content: string;
	}
	class ResourceList {
		[index: string]: ResourceInfo;
	}
	interface TemplateBindOptions {
		Callback?: string;
		MetaPath?: string;
	}
	// [TODO] Consider renaming some of these interfaces. Names are not clear.
	interface TemplateBindInfo {
		ControlId: string;
		TemplateId: string;
		Type: string;
		//Type: [enum]; // [TODO] Use enum or constant.
		Data?: any;
		//ExtraInfo?: any;
		ExtraInfo?: TemplateBindOptions;
	}
	interface TemplateInfo {
		Name: string;
		Template?: Template;
		Type: string; // [TODO] Use enum
		ExtraInfo?: any;
	}
	interface TemplateRuntimeInfo {
		// [TODO] Consider making Proper Case
		name: string;
		parentControlPath: string;
		key: string;
		controlPath: string;
		metaPath: string;
		context: any; // [TODO] Strongly type? Problematic.
	}
	interface TemplateRuntimeModel {
		Template: TemplateRuntimeInfo;
		Meta: TemplateRunInfo;
		Data?: any;
	}

	class WebApp {
		private Components: ComponentInfo[] = [];
		private ComponentCount: number = 0;
		private ComponentsLoaded: number = 0;
		private PageReady: boolean = false;
		private HasStartup: boolean = false;
		private Config: Config;
		private Resources: ResourceList = {};
		private Templates: IKeyValueCollection<TemplateInfo> = {};

		public BindList: TemplateBindInfo[] = [];

		constructor() {
			//debugger;
			let mod = this;

			// Register docment ready handler
			// Need to do this inline (anonymous) to retain "mod" scope
			$(document).ready(() => {
				// Update the flag
				mod.PageReady = true;

				// Add timer (like 30 sec?) to let the user know not all modules loaded
				// Be sure to cancel it in CheckStatus
				// @@@

				// Check the load status
				mod.CheckStatus();
			});
		}

		public Initialize(opt: InitializeOptions) {
			//debugger;
			let mod = this;

			if (!opt) opt = {};

			// Get option values and defaults
			let lp = mod.GetString(opt.LauncherPath, "cp/appShared");
			let ln = mod.GetString(opt.LauncherName, "ApplicationLauncher");
			let ar = mod.GetString(opt.AppGlobalReference, "ApplicationManager");
			let sp = mod.GetString(opt.StartPath, null);
			let sn = mod.GetString(opt.StartName, null);
			let sr = mod.GetString(opt.StartGlobalReference, null);
			mod.Config = opt.Config || window["CPConfig"];

			// See if we're tracking page and user info
			if (mod.Config.Core.Tracking.TrackingId) {
				// Initialize the tracker
				mod.InitializeTracking(window, document);
			}

			// Load the launcher
			mod.LoadComponent({ Path: lp, Name: ln, GlobalReference: ar });

			// Load the startup module
			if (sp && sn) {
				mod.HasStartup = true;
				mod.LoadComponent({ Path: sp, Name: sn, Model: opt.StartModel, GlobalReference: sr });
			}
		}

		/**
		 * Initialize page and user tracking.
		 * @param {any} container - Container for the tracker.
		 * @param {Document} doc - Document DOM.
		 * @param {string} tagName - Tag type name for containing the tracker.
		 * @param {string} scriptPath - Path to the tracking library.
		 * @param {string} varName - Variable name within the container where the tracker will be stored.
		 * @param {HTMLElement} elem - Optional element containing the tracker.
		 * @param {Element} tagRef - Optional tag DOM reference where the tracker will be added.
		 */
		public InitializeTracking(
			container: any,
			doc: Document,
			tagName: string = 'script',
			scriptPath: string = 'https://www.google-analytics.com/analytics.js',
			varName: string = 'ga',
			elem?: HTMLElement,
			tagRef?: Element
		) {
			container['GoogleAnalyticsObject'] = varName;
			container[varName] = container[varName] || function () {
				(container[varName].q = container[varName].q || []).push(arguments)
			};
			container[varName].l = (new Date()).getTime();
			elem = doc.createElement(tagName);
			tagRef = doc.getElementsByTagName(tagName)[0];
			elem['async'] = 1;
			elem['src'] = scriptPath;
			tagRef.parentNode.insertBefore(elem, tagRef)
		}

		public AddResources(items: ResourceInfo[]): void {
			let mod = this;

			for (let i = 0; i < items.length; i++) {
				let item = items[i];
				mod.Resources[item.Key] = item;
			}
		}

		public LoadComponent(opt: LoadOptions) {
			let mod = this;
			// Validation
			if (!opt) throw new Error("Missing or invalid load options.");
			if (!opt.Path || opt.Path.length == 0) throw new Error("Missing or invalid module path.");
			if (!opt.Name) throw new Error("Missing or invalid module name.");

			let path = opt.Path;

			// Add an extension if there isn't one
			if (path.substring(path.length - 3, path.length) != ".js")
				path += ".js";

			// Add it to the queue
			// Components (first param) will be null until they are loaded
			let ci = new ComponentInfo(null, opt.Name, path, opt.Model, opt.GlobalReference);
			mod.Components.push(ci);
			mod.ComponentCount++;

			// Start the import
			mod.DoImport(ci);
		}

		private GetString(src: string, defaultValue: string = ""): string {
			if (src && src.length && src.length > 0)
				return src;
			return defaultValue;
		}

		private DoImport(componentInfo: ComponentInfo) {
			//debugger;
			let mod = this;

			// Load the component module and handle the promise/async
			// @@@ Is there a way to tell TS "SystemJS" is a global var?
			//console.log(window["SystemJS"].bundleConfig);
			if (window["SystemJS"].bundleConfig && window["SystemJS"].bundleConfig.enabled) {
				var bundleConfig = window["SystemJS"].bundleConfig;				
				var bundlePath = componentInfo.Path.replace('.js', bundleConfig.fileNameSuffix);
				//console.log(componentInfo.Path);
				window["SystemJS"].import(bundlePath)
					.then(function (bp) {
						mod.Import(componentInfo);
					});
			}
			else
				mod.Import(componentInfo);
		}

		private Import(componentInfo: ComponentInfo) {
			let mod = this;
			window["SystemJS"].import(componentInfo.Path)
				.then(function (comp) {
					// Save the reference
					componentInfo.Component = comp;
					//console.log(componentInfo.Path);
					// Increment the counter
					mod.ComponentsLoaded++;
					// Check the load status
					mod.CheckStatus();
				});
		}

		private CheckStatus(): void {
			//debugger;
			let mod = this;

			// If the page isn't ready, stop
			if (!mod.PageReady) return;

			// If all components haven't finished loading, stop
			if (mod.ComponentsLoaded < mod.ComponentCount) return;

			// Launch the app
			// The first component is the launcher itself
			// The second component is the startup component (optional)
			// Remove the launcher and startup from the array
			// Do this async (timeout of zero) so we don't hold up Initialize, DoImport, or page ready
			//debugger;
			setTimeout(() => {
				//debugger;
				let hs = mod.HasStartup;
				let components = mod.Components;
				var c = components[0];

				// Save the resource collection
				window["CPResourceData"] = mod.Resources;

				// Make sure launcher is present.
				// Pages could theoretically have no launcher or modules (likely legacy pages)
				if (c) {
					var s = hs ? components[1] : null;
					components.splice(0, hs ? 2 : 1);
					var a = new c.Component[c.Name](new LaunchOptions(components, mod.Config, c.GlobalReference, s));
				}
			});
		}

		public RegisterTemplate(id: string, type?: string, extraInfo?: any): void {
			//debugger;
			let mod = this;

			let template = mod.Templates[id];
			if (!template) {
				if (!type)
					type = "static";
				mod.Templates[id] = { Name: id, Template: null, Type: type, ExtraInfo: extraInfo };
			}
		}
		
		public RegisterTemplateCallback(templateId: string, controlId: string, data?: any, extraInfo?: any): void {
			// [TODO] Consider passing in object instead of params
			//debugger;
			let mod = this;

			mod.BindList.push({ ControlId: controlId, TemplateId: templateId, Type: "callback", Data: data, ExtraInfo: extraInfo });
		}

      public RenderTemplate(info: TemplateRunInfo): string {
        
			let mod = this;

			let id = info.Name;
			try {
				let template = mod.Templates[id];

              let data = info.Data;

             // debugger;
				if (data == undefined || data == null)
					data = {};
				// [TODO] Might need to move "_template" if Data is an observable model. But Meta coule be missing and Template is anonymous (transient)
				if (data._template == undefined || data._template == null)
					data._template = {
						Type: "function" // [TODO] Use enum or constant
					};

				// See if the template was found
				if (template == undefined || template == null || !template.Template) {
					// See if it was found but not defined
					if (template == undefined || template == null) {
						// Define a new template container
						mod.Templates[id] = template = { Name: id, Template: null, Type: "static" };
					}

					// Get the template contents
					let sel = $("#" + id);
          if (!sel || sel == undefined || sel.length == 0) {
            throw new Error("Unable to locate template '" + id + "'.");
          }
              


					// Get the template contents
					let tc = sel.html();

					// Compile the template
					template.Template = kendo.template(tc);
				}

				//if (data.id == "earningsCheck" && (id == 'gizmo' || id == 'gizmo__table')) debugger; // [TEST]

				let parent = info.Parent || '';
				let childKey = info.ChildKey;
				let parentMeta = info.ParentMeta || '';
				let metaKey = info.MetaKey;
				if (childKey === undefined || childKey === null) childKey = '';
				if (typeof childKey !== "string") childKey = childKey["toString"](); // [TODO] Fix type issue.
				if (metaKey === undefined || metaKey === null) metaKey = '';
				if (typeof metaKey !== "string") metaKey = metaKey["toString"](); // [TODO] Fix type issue.

				// Start with the parent path, or ID if no parent
				let controlPath = parent ? parent : id;
				// Add a child key, if specified
				if (childKey.length > 0)
					controlPath += '_' + childKey;
				let metaPath = (parentMeta ? parentMeta + '.' : '') + metaKey;

				// Runtime template info
				let ti: TemplateRuntimeInfo = {
					name: id,
					parentControlPath: parent,
					key: childKey,
					controlPath: controlPath,
					metaPath: metaPath,
					context: info.Context
				};

				// [TODO] Handle async model updates? What if two model updates are in progress and added to the queue, but only one of them is ready when the queue is processed?
				if (template.Type == "bound") { // [TODO] Use enum or constant
					mod.BindList.push({ ControlId: controlPath, TemplateId: id, Type: template.Type, Data: data, ExtraInfo: template.ExtraInfo });
				}

				// Invoke the template
				// Data/model param is an array (per Kendo) but should be a single structure
				return kendo.render(template.Template, [<TemplateRuntimeModel>{
					Template: ti,
					Meta: info.Meta || {},
					Data: info.Data || {},
					Resources: info.Context.Resources
					}]);
			} catch (err) {
				debugger; // Intentionally left in place
				console.log("Error processing template '" + id + "'.");
				throw err;
			}
		}

		public GetTemplate(id: string): TemplateInfo {
			let mod = this;

			if (!id) return null;

			let template = mod.Templates[id];

			if (template == undefined || template == null)
				return null;
			return template;
		}
	}

	// Expose an instance
	export var App = new WebApp();
}
