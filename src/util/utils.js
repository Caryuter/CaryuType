export {isInDOM, arraysAreIdentical, removeFirstOccurrence, cloneArray}

/**
 * Checks if the passed value is an Element or Node in DOM
 * @param {*} o 
 * @returns {Boolean}
 */
function isInDOM(o){
    return document.body.contains(o)
}

/**
 * Returns whether two arrays are identical or not
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @returns {Boolean} boolean
 */
function arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    arr1.sort()
    arr2.sort()
    arr1.forEach((arr1Element, index) => {
        if(arr1Element != arr2[index]) return false
    })
    return true; 
}

/**
 * Removes first ocurrence of a word in an array of strings
 * @param {Array<String>} array 
 * @param {String} word 
 * @returns array
 */
function removeFirstOccurrence(array, word) {
    const index = array.findIndex(element => element.includes(word));
    let newArray = cloneArray(array)
    if (index !== -1) {
        newArray.splice(index, 1);
    }
    return newArray;
}

/**
 * Shallow copies an array **(nested arrays or objects are copied as references)**
 * @param {Array} arr - array to copy
 * @returns {Array} an array with same values but different references 
 */
function cloneArray(arr){
    return [].concat(arr)
}