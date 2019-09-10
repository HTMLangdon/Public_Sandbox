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

class Stepper {
	//instance property for singleton methodology - so that a single stepper can only exist 
	private static instance: Stepper;
	/**/
	/* 		<button targeting for mouse functionality>		 */
	private _indexOf_start: any = 0;
	private _indexOf_current: any = 0;
	private _indexOf_clicked: any = -1;
	private _button_clicked:any;
	private _button_current:any;
	
	/* 		< / button targeting for mouse functionality>		 */
	/**/


	//target container of the steps  -- ues questySelector to define
	private _wrapper: any;

	//array of html elements for the stepper's buttons for each step
	private _buttons:Array<any>

	// array of html elements for the steps' content to show/hide
	private _pages:Array<any>

	private constructor() {
		// do something construct...
	}

	//functionality for singleton methodology 
	static getInstance = () => {
		if (!Stepper.instance) {
			Stepper.instance = new Stepper();
			// ... any one time initialization goes here ...
		}
		return Stepper.instance;
	};



	/// development helpers.. keystroke savers
	public l = ($msg: any) => {
		console.log($msg);
	};

	public blanklog = (num: Number = 1) => {
		for (var i = 0; i < num; i++) {
			console.log('\n');
		}
	};
	public el = ($msg: String, args: Object = { prop: undefined }) => {
		for (var arg in args) {
			console.log($msg + `${arg} == ${args[arg]}`);
		}
	};

	public setup = (selectorOf_stepper: any,selectorOf_pages: any) => {
		this.l('STEPPER (Singleton) -- setup(stepper,pages) - called.');

		//stepper's highest level mark-up element

		this._wrapper = document.querySelector(selectorOf_stepper);
		this._buttons = [].slice.call(this._wrapper.children);
		
		this._pages = [].slice.call(document.querySelectorAll(selectorOf_pages)[0].children);
		
		this.l(`HTML content for each step: ${this._pages} \n\n`);
		this.l(`HTMLElement container for step buttons = \n ${this._wrapper}`)
		
		this._button_clicked = this._buttons.indexOf(this._buttons[this._indexOf_start]);

		



		this.initialize();
	};

	//
	

	private initialize = () => {
		this.l('STEPPER (Singleton) -- initialize() - called.');


		this.addMouseEvents();
		// console.log(stepper[0].children[_indexOf_start].click())
	};

	private addMouseEvents = () => {
		let i = -1;
		for (const button of this._buttons) {
			button.addEventListener('click', this.onStepClicked);
			i++;
			if (i === this._indexOf_start) {
				this.blanklog(2);
				// this.l(`clicked button: ${button}`);
				// this.l(`this._indexOf_current: ${this._indexOf_current}`);
				// this.l(`: ${button}`);
				button.click();
				// this.blanklog(2);
			}
			else {
			}
		}
	};

	private onStepClicked = (e: any) => {

		/* */

		var __currentIndex = this._indexOf_current;

		//
		///
		////        index of the stepper button that has been clicked.
		this.blanklog(1)
		this.l(`e.currentTarget ==  ${e.currentTarget}`)
		this.l(e.currentTarget)
		this.blanklog(1)
		////
		this._indexOf_clicked = this._buttons.indexOf(e.currentTarget);
		////
		////
		///
		//

		if (this._indexOf_clicked == this._indexOf_current) {
			$(this._pages[this._indexOf_clicked]).show();
		}
		else {
			$(this._pages[this._indexOf_current]).hide();
			$(this._pages[this._indexOf_clicked]).show();
		}

		this._button_current = this._buttons[this._indexOf_current];
		this._button_clicked = this._buttons[this._indexOf_clicked]
		
		$(this._button_current).attr('checked', 'true');
		$(this._button_clicked).attr('checked', 'false');

		this._indexOf_current = this._indexOf_clicked;
		this._indexOf_clicked = -1;

		this._button_current.checked = 'true';
	};



	get stepButtons() {
		return this._buttons;
	}

	set stepButtons(stepButton: any) {
		if (!this._buttons) {
			this._buttons = [];
			console.log(`this._buttons previously didn't exist. now it does: ${this._buttons}`);
		}
		this._buttons.push(stepButton);
	}
}

export { Stepper };

// addUIListeners() {

// for (let i = 0; i < stepper[0].children.length; i++) {
//     let stepper_button = stepper[0].children[i];
//     // l(stepper_button)
//     // stepper_button.addEventListener('click', onStepClicked)
//     (i == _indexOf_start) ? stepper_button.click() : "";
// }
// let i = 0;
// for (const a_step of step) {
//     a_step.addEventListener('click', onStepClicked)
//     (a_step == 1)
//     i++
//     l(i)
// }
// }
