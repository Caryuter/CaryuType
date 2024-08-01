export {isInDOM}

/**
 * Checks if the passed value is an Element or Node in DOM
 * @param {*} o 
 * @returns {Boolean}
 */
function isInDOM(o){
    return document.body.contains(o)
}