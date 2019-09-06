module.exports = function (count, options) {
    let __data = "";
    let __HTML = "";
    for (var x = 1; x <= count; x++) {
        // console.log(options.data)
        __data = (options.data) ? options.data : {};
        (__data) ? __data.totalSteps = count: -1;
        (__data) ? __data.index = x: -1;
        __HTML += options.fn(this)
        // console.log(__HTML)
    }
    return __HTML;
}