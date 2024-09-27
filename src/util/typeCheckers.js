export { checkWord, markWord, resetWord, resetLetter, setActiveLetter };

/**
 * Marks a letter with ´correct´ or ´incorrect´ depending on input
 * @param {Array<HTMLSpanElement>} letter - an Array with the `<letter>` to check
 * @param {String} inputLetter - user input
 */
function checkLetter(letter, inputLetter) {
	resetLetter(letter);
	if (inputLetter == undefined) return;
	if (letter.textContent == inputLetter) {
		letter.classList.add("correct");
	} else if (inputLetter != undefined) {
		letter.classList.add("incorrect");
	}
}

/**
 * Checks the spelling of each letter in a word and marks
 * them all with `.correct` or `.incorrect` CSS classes
 * @param {HTMLSpanElement} word - `<word>` HTML element to check
 * @param {String} textInput - user input
 */
function checkWord(word, textInput) {
	let letters = word.querySelectorAll("letter");
	letters.forEach((letter, i) => {
		checkLetter(letter, textInput[i]);
	});
}

/**
 * Checks the spelling, marking it with CSS classes `.typed`
 * and `.mark` if incorrect
 * @param {HTMLSpanElement} word - `<word>` HTML element to check
 *
 */
function markWord(word) {
	word.classList.add("typed");
	word.querySelectorAll("letter").forEach((letter) => {
		resetLetter();
		if (!letter.classList.contains("correct")) {
			word.classList.add("marked");
		}
	});
}

/**
 * Resets all CSS classes for a letter
 * @param {HTMLSpanElement} letter - `<letter>` HTML element
 */
function resetLetter(letter) {
	letter?.classList.remove("incorrect");
	letter?.classList.remove("correct");
	resetActiveLetter(letter?.parentElement);
}

/**
 * Resets all css classes that describes active letter of the current `word`
 * @param {HTMLSpanElement} word - `<word>` HTML element
 */
function resetActiveLetter(word) {
	let letter = word?.querySelector(".active") || word?.querySelector(".last");
	letter?.classList.remove("active");
	letter?.classList.remove("last");
}

/**
 * Resets all CSS classes for a `<word>`
 * @param {HTMLSpanElement} word - `<word>` HTML element to check
 */
function resetWord(word) {
	word?.classList.remove("active");
	word?.classList.remove("typed");
	word?.classList.remove("marked");
	resetActiveLetter(word);
}

/**
 * Marks the active `<letter>` of the active `<word>` with `.active` CSS class
 * depending on user input. `.last` will be written instead
 * if user has no room for another character
 * @param {HTMLSpanElement} word - `<word>` HTML element to check
 * @param {HTMLInputElement} input - input element of type text
 */
function setActiveLetter(word, input) {
	word.classList;
	word.children[input.selectionStart]?.classList.add("active");
	if (!word.querySelector(".active")) {
		word.lastElementChild.classList.add("last");
	}
	input.maxLength = word.childElementCount;
}
