export { populateDisplay, focusTypeSection, unFocusTypeSection };

import { randomTextArray } from "../util/textGenerator.js";
import {
	playCaretAnimation,
	stopCaretAnimation,
	updateCaret,
} from "./caret.js";
import { beginTransition } from "../util/transitions.js";

const display = document.querySelector(".para");
const onWriteNotFocus = [
	document.querySelector(".topbar nav"),
	document.querySelector(".options"),
	document.querySelector(".topbar .logo"),
	document.querySelector(".counter"),
	document.querySelector(".lang"),
	document.querySelector("footer"),
];

let isFocused = false;

// TODO:
// - Mejor generacion de texto coherente
// - Generacion de texto con puntuacion y numeros
// - Generacion de texto en modo:
//   =Zen
//   =Custom
//   =Quote
// -Promesa que resuelva cuando el texto

/**
 *
 * @param {import("./gameLogic.js").GameMode} mode
 * @returns
 */
function populateDisplay(mode) {
	let text = "";
	if (mode == "time" || mode == "words") {
		text = randomTextArray();
	}
	const currentText = text
		.map((word) => {
			let wordLetters = word.split("");
			return (word = `<word>${wordLetters
				.map((letter) => {
					return `<letter>${letter}</letter>`;
				})
				.join("")}</word>`);
		})
		.join("");

	display.innerHTML = currentText;
	display.children[0].classList.add("active");
	display.children[0].children[0].classList.add("active");
	updateCaret(display.querySelector("word.active"));
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(text.length);
		}, 1000);
	});
}

/**
 * Hides everything and focus only the type section
 */
function focusTypeSection() {
	if (isFocused) return;
	onWriteNotFocus.forEach((el) => {
		let desiredOpacity;
		if (el != document.querySelector(".counter")) {
			el.classList.add("not-focused");
			desiredOpacity = 0;
		} else {
			el.classList.remove("not-focused");
			desiredOpacity = 1;
		}
		beginTransition(el, "opacity", {
			desiredOpacity: desiredOpacity,
			duration: ".15s",
			timingFunction: "linear",
		});
	});
	stopCaretAnimation();
	isFocused = true;
}

/**
 * Shows everything and unfocus type section
 */
function unFocusTypeSection() {
	if (!isFocused) return;
	onWriteNotFocus.forEach((el) => {
		el.classList.remove("not-focused");
		beginTransition(el, "opacity", {
			desiredOpacity: 1,
			duration: ".15s",
			timingFunction: "linear",
		});
	});
	playCaretAnimation();
	isFocused = false;
}
