/**
 * Gives value as a string; the specific data type for whatever is passed as an argument
 * For more information, visit:
 * http://bonsaiden.github.io/JavaScript-Garden/#types
 * 
 * @param {*} $object - Object for data-type to be determined 
 * @returns {String} of $object type
 * @example
 * //returns "HTMLDocument" 
 * console.log(getType(window.document))
 * //returns "HTMLDivElement" 
 * console.log(getType(document.querySelector('div')))
 * 
 */



// function is($object:any) {
function getType($object) {
    var __class = Object.prototype.toString.call($object).slice(8, -1);
    //return true/false
    return __class
}

// function is($object:any,$type:String) {
function is($object, $type) {
    var __class = getType($object)
    //return true/false
    return __result !== undefined && $object !== null && __class === $type;
}