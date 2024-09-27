export {
	isInDOM,
	arraysAreIdentical,
	removeFirstOccurrence,
	cloneArray,
	scaleArray,
	cloneObject,
	cloneJson,
};

/**
 * Checks if the passed value is an Element or Node in DOM
 * @param {*} o
 * @returns {Boolean}
 */
function isInDOM(o) {
	return document.body.contains(o);
}

/**
 * Returns whether two arrays are identical or not
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Boolean} boolean
 */
function arraysAreIdentical(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
	arr1.sort();
	arr2.sort();
	arr1.forEach((arr1Element, index) => {
		if (arr1Element != arr2[index]) return false;
	});
	return true;
}

/**
 * Removes first ocurrence of a word in an array of strings
 * @param {Array<String>} array
 * @param {String} word
 * @returns array
 */
function removeFirstOccurrence(array, word) {
	const index = array.findIndex((element) => element.includes(word));
	let newArray = cloneArray(array);
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
function cloneArray(arr) {
	return [].concat(arr);
}

/**
 * Shallow copies an object **(nested objects are copied as references)**
 * @param {Object} obj
 * @returns {Object} a new Object with same values but different references
 */
function cloneObject(obj) {
	return Object.assign({}, obj);
}

/**
 * Deep clones a JSON object with {@link https://stackoverflow.com/a/122704|some data loss}.
 * @param {Object} val - object to clone
 * @returns {Object} - Object
 */
function cloneJson(val) {
	return JSON.parse(JSON.stringify(val));
}

/**
 * Resizes an array to the provided `size` and fills
 * new spaces with provided `defval`
 *
 *
 * @param {Array} arr - Array to resize
 * @param {Number} size - Desired size of the array
 * @param {*} defval
 */
function scaleArray(arr, size, defVal) {
	var delta = arr.length - size;
	if (size > 0) {
		while (delta-- > 0) {
			arr.pop();
		}
		while (delta++ < 0) {
			arr.push(defVal);
		}
	}
}
