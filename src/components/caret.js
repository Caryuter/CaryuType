export {
	updateCaret,
	playCaretAnimation,
	stopCaretAnimation,
	caretSmoothMode,
	caretStepMode,
};
import { beginTransition } from "../util/transitions.js";

/**@type {HTMLElement} */
const caret = document.querySelector(".caret");
const { width: caretWidth } = caret.getBoundingClientRect();

/**
 * Updates visual caret position to mark current active word
 * @param {HTMLSpanElement} activeWord - The current active word
 * @returns {Promise} a promise that resolves when caret is in position
 */
function updateCaret(activeWord) {
	try {
		let { xPos, yPos } = getNewPosition(activeWord);
		return beginTransition(caret, "move", { xPos: xPos, yPos: yPos });
	} catch (e) {
		console.error(e);
	}
}

/**
 * Retrieves new position for caret
 * @param {HTMLSpanElement} activeWord - The current active word
 * @returns {{xPos: Number, yPos: Number}} An object with both X and Y fixed screen position
 */
function getNewPosition(activeWord) {
	let xPos = 0;
	let yPos = 0;
	const activeLetter =
		activeWord.querySelector(".active") || activeWord.querySelector(".last");
	if (!activeLetter) {
		throw new Error("No active letter on this word");
	}
	const { x, y, right } = activeLetter.getBoundingClientRect();

	yPos = y;
	if (activeWord.querySelector(".active")) {
		xPos = x - caretWidth;
	} else if (activeWord.querySelector(".last")) {
		xPos = right + caretWidth;
	}
	return { xPos, yPos };
}
//TODO: Make functions work
function playCaretAnimation() {
	caret.style.opacity = "";
	caret.style.animation = "";
	document.body.style.cursor = "";
}

function stopCaretAnimation() {
	caret.style.opacity = "1";
	caret.style.animation = "none";
	document.body.style.cursor = "none";
}

function caretStepMode() {}

function caretSmoothMode() {}
