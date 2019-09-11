//es6
import $ from 'jquery';
import 'what-input';

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
import { hello } from './pages/page-1';
import { hellothere } from './pages/page-2';
import { Stepper } from './components/stepper';
import { ToggleDispatcher } from './components/toggleDispatcher';

//typescript
// import $ = require('jquery');

const STEPPER = Stepper.getInstance();
let toggleDispatcher: ToggleDispatcher;

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

require('foundation-sites');

$(document).foundation();

hello('index - ts');
hellothere('index - ts');

$(document).ready(function(e) {
	toggleDispatcher = new ToggleDispatcher();

	let stepperContainer = '.stepper ul.steps';
	let stepContentContainer = '#steps-content';
	STEPPER.setup(stepperContainer, stepContentContainer);



});
