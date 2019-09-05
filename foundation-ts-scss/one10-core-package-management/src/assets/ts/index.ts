
import { hello } from './pages/page-1'
import { hellothere } from './pages/page-2'

import $ = require('jquery');
// import * as $ from 'jquery';
// import $ from 'jquery';
// import 'what-input';


require("jsdom").env("", function (err:any, window:any) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.

declare global {
    interface Window {
        jQuery:any;
        $:any;
    }
}


// window.jQuery = jQuery;
// window.$ = jQuery;


require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$('body').css("background-color", "blue !important");

$(document).on("",()=>{});


hello("index - ts")
hellothere("index - ts")