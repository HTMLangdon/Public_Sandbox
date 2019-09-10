const CLICK = 'click';
const HOVER = 'mouseover';
const PRESS = 'mousepress';
const RELEASE = 'mouserelease';
const IN = 'in';
const OUT = 'out';

//es6
import $ from 'jquery';
import 'what-input';
import { getHeapSpaceStatistics } from 'v8';
import { threadId } from 'worker_threads';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

declare global {
	interface Window {
		jQuery: any;
		$: any;
	}
}

class ToggleControl {
	static readonly ID = 'data-control';
	private _signalValue: any;
	private _html: HTMLElement;
	constructor(element: HTMLElement) {
		this._signalValue = element.getAttribute(ToggleControl.ID);
		this._html = element;
	}
}
class ToggleController {
	static readonly ID = 'data-toggle-controller';
	private _controls: Array<ToggleControl> = new Array();
	private _signal: any;
	private _html: HTMLElement;
	constructor(element: HTMLElement) {
		this._html = element;
		this._signal = element.getAttribute(ToggleController.ID)
		let __children: HTMLCollection = element.children;

		console.log(this._signal);
		console.log(`this._signal: ${this._signal}`);


		for (let i = 0; i < __children.length; i++) {
			var __isToggleControl: any = __children[i].hasAttribute(ToggleControl.ID);

			if (!__isToggleControl) {
				return;
			}
			this._controls.push(new ToggleControl(<HTMLElement>__children[i]));

			// if(__children[i].attributes
			// const __ToggleController = __children[i];
		}
	}
}

class ToggleDispatcher {
	// private _controllers: Array<any>;
	private _ToggleControllers: Array<ToggleController> = new Array();

	constructor() {
		this._set();
	}

	/// development helpers.. keystroke savers
	public l = ($msg: any) => {
		console.log($msg);
	};

	public blanklog = (num: Number = 1) => {
		for (var i = 0; i < num; i++) {
			console.log('\n');
		}
	};

	private _set = () => {
		let __controllers: NodeList = document.querySelectorAll(`[${ToggleController.ID}]`);

		__controllers.forEach((control) => {
			this._ToggleControllers.push(new ToggleController(<HTMLElement> control));
		});
	};

	private _setupControls = (element: ToggleController) => {};
	private _enable = () => {};
	private _pause = () => {};
}

export { ToggleDispatcher };
