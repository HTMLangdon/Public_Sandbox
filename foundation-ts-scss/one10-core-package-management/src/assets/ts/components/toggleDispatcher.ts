const CLICK = 'click';
const HOVER = 'mouseover';
const PRESS = 'mousepress';
const RELEASE = 'mouserelease';
const IN = 'in';
const OUT = 'out';

enum HTMLElements {
	BLOCK = 'BlockLevelElement',
	INLINE = 'InlineElement',
	INPUT = 'HTMLInputElement',
	UL = 'HTMLDivElement',
	OL = 'HTMLDivElement',
	LI = 'HTMLDivElement',
	DIV = 'HTMLDivElement',

	P = 'HTMLParagraphElement',
	FIELDSET = 'HTMLFieldsetSetElement',
	LEGEND = 'HTMLLegendElement',
	H1 = 'HTMLH1Element',
	H2 = 'HTMLH2Element',
	H3 = 'HTMLH3Element',
	H4 = 'HTMLH4Element',
	H5 = 'HTMLH5Element',
	H6 = 'HTMLH6Element'
}

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
		this._signal = element.getAttribute(ToggleController.ID);
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
	private _toggleControllers: Array<ToggleController> = new Array();

	constructor() {
		this.set();
		this.register();
	}
	/**
 * 
 * @param context - String - querySelectorAll -  where to look for data-toggle-controller
 * 
*/
	public register = (context: any = document) => {
		const __parentElement = context == document ? document : document.querySelector(context);

		// const _context_inputs = __parentElement.querySelectorAll('input');
		const _context_inputs = [
			...document.querySelectorAll('input')
		];
		console.log(`_context_inputs:${_context_inputs}`);
		console.log(_context_inputs);

		document.addEventListener('blur', this._onInputVisited, true);
		document.addEventListener('click', this._onInputVisited, true);
		document.addEventListener('onfocusin', this._onInputVisited);
		document.addEventListener('onfocusout', this._onInputVisited);

		// Array.from(e.children).indexOf(theChild)/

		// _context_inputs.addEventListener('blur', this._onInputVisited);
	};
	private _onInputVisited = (e: Event) => {
		let __targetClassName = this._classNameFor(e.target);

		if (__targetClassName == HTMLInputElement.name) {
			// var last = __targetClassName.substring(__targetClassName.indexOf("__targetClassNamement"),__targetClassName.length)
			// var first = __targetClassName.substr(__targetClassName.indexOf("HTML"),4)
			// var base = String.prototype.concat(first,last)
			console.log('********* Input Focused & Blurred \n \n *********');
			
			switch(e.type)
			{
				case 'click':
				this._onHTMLInputElementClicked(e.target)
				break;
				case 'blur':
				case 'onfocusout':
				this._onHTMLInputElementBlur(e.target)
				break
				case 'onfocusin':
				default:


			}
			

			console.log('\n');
		}

		// for (let i = 0; i < this._toggleControllers.length; i++) {
		// 	const element = this._toggleControllers[i];
		// 	console.log(`this._toggleControllers[i] ==   ${element}`);
		// 	console.log(element);
		// }

		// this._toggleControllers.forEach((element) => {
		// 	console.log(`this._toggleControllers[element] ==   ${element}`);
		// 	console.log(element);
		// });
	};


	private _onHTMLInputElementBlur = (element:any) =>{
		console.log("HTMLInputElement has been UN-FOCUSED.")
		console.log(element)
		
	}
	
	private _onHTMLInputElementClicked = (element:any) =>{
		console.log("HTMLInputElement has been CLICKED")
		console.log(element)
		
	}

	public set = (context: any = document) => {
		const __parentElement = context == document ? document : document.querySelector(context);

		let __controllers: NodeList = document.querySelectorAll(`[${ToggleController.ID}]`);

		__controllers.forEach((control) => {
			this._toggleControllers.push(new ToggleController(<HTMLElement>control));
		});
	};

	private _setupControls = (element: ToggleController) => {};
	private _enable = () => {};

	private _pause = () => {};

	// function is($object:any) {
	private _classNameFor = ($object: any): String => {
		var __class = Object.prototype.toString.call($object).slice(8, -1);
		//return true/false
		return __class;
	};
}

export { ToggleDispatcher };
