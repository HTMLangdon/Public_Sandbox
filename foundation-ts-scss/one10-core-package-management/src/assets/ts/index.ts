
import { hello } from './pages/page-1'
import { hellothere } from './pages/page-2'

//typescript
// import $ = require('jquery');




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

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

declare global {
    interface Window {
        jQuery:any;
        $:any;
    }
}

require('foundation-sites');

$(document).foundation();
hello("index - ts")
hellothere("index - ts")























const CLICK = 'click'
const HOVER = 'mouseover'
const PRESS = 'mousepress'
const RELEASE = 'mouserelease'
const IN = "in"
const OUT = "out"

let selector_step:any = null

let stepper:any = null;
let arr_steps:any = null;
let arr_steps_content:any = null;
// let:any steps_count = null;
let i_step_start:any = 0;
let i_step_current:any = 0;
let i_step_clicked:any = -1;

let steps_content:any = null;

$(document).foundation();
$(document).ready(function () {
    initialize();
})

//setup some initial variables
function initialize() {

    console.log('INITIALIZED');


    //HTMLCollection - #steps-content > div#step1 / div#step2 / ...etc.
    steps_content = document.querySelectorAll("#steps-content");
    //convert HTMLCollection to plain [Object Array]:
    arr_steps_content = [].slice.call(steps_content[0].children);

    //HTMLCollection - div.stepper > ul.steps > li.step:
    stepper = document.querySelectorAll(".stepper ul.steps");
    //convert HTMLCollection to plain [Object Array]:
    arr_steps = [].slice.call(stepper[0].children);

    //set the current step index to the :
    //                                  index of 
    //                                          the element of 
    //                                                         the index of 
    //                                                                      start step index
    //          yup. that's a confusing explaination ;)
    i_step_current = arr_steps.indexOf(arr_steps[i_step_start]);

    //mimic mouse click to show the starting step [index]
    // onStepClicked({
    //     currentTarget: arr_steps[i_step_current]
    // })

    selector_step = document.querySelectorAll('.stepper ul.steps li.step');

    addUIListeners();
    // console.log(stepper[0].children[i_step_start].click())


}

function l($msg:any) {
    console.log($msg)
}

function addUIListeners() {
    let i = -1
    for (const a_step of selector_step) {
        a_step.addEventListener('click', onStepClicked);
        i++;
        (i === i_step_start) ? a_step.click(): ""


    }
}




// function addUIListeners() {

// for (let i = 0; i < stepper[0].children.length; i++) {
//     let stepper_button = stepper[0].children[i];
//     // l(stepper_button)
//     // stepper_button.addEventListener('click', onStepClicked)
//     (i == i_step_start) ? stepper_button.click() : "";
// }
// let i = 0;
// for (const a_step of step) {
//     a_step.addEventListener('click', onStepClicked)
//     (a_step == 1)
//     i++
//     l(i)
// }
// }



function onStepClicked(e:any) {
    // l(`${e.currentTarget}`)
    // l(e.currentTarget.children[0].children[0].checked = true)

    // e.currentTarget.checked = true;

    var __currentIndex = i_step_current;

    //
    ///
    ////        index of the stepper button that has been clicked.
    ////
    i_step_clicked = arr_steps.indexOf(e.currentTarget);
    ////
    ////
    ///
    //

    if (i_step_clicked == i_step_current) {
        $(arr_steps_content[i_step_clicked]).show()
    } else {
        $(arr_steps_content[i_step_current]).hide()
        $(arr_steps_content[i_step_clicked]).show()

    }
    let input_step_current = getCurrentStepperButton(i_step_current)
    let input_step_clicked = getCurrentStepperButton(i_step_clicked)
    $(input_step_clicked).attr("checked", "true")
    $(input_step_current).attr("checked", "false")



    // input_step_current.checked = "true"

    console.log("")
    console.log("")
    console.log("")
    console.log("input_step_clicked:")
    console.log(input_step_current)
    console.log("")
    console.log("")
    console.log("input_step_clicked:")
    console.log(input_step_current)
    console.log("")
    console.log("")
    console.log("input_step_current === input_step_clicked: ")
    console.log(input_step_clicked == input_step_current)
    console.log("")
    console.log("")
    console.log("")


    i_step_current = i_step_clicked;

    i_step_clicked = -1

    input_step_current.checked = "true"

}

function getCurrentStepperButton(index:any) {

    let __stepbtn = stepper[0].children[index].getElementsByTagName('label')[0].getElementsByTagName('input')[0];
    return __stepbtn;
}