export {
	startGame,
	prepareGame,
	gameOver,
	gameHasStarted,
	gameIsPaused,
	pauseGame,
	unPauseGame,
	settings,
};
import { disableInput, enableInput } from "../handlers/keyboardHandler.js";
import timer from "../handlers/timer.js";
import { beginTransition } from "../util/transitions.js";
import { updateCounter } from "./counterDisplay.js";
import {
	populateDisplay,
	focusTypeSection,
	unFocusTypeSection,
} from "./gameDisplay.js";

/**
 * @typedef GameMode
 * @type {"time"|"words"|"quote"|"zen"|"custom"}
 */
/**
 * @typedef quoteLength
 * @type {"all"|"short"|"medium"|"long"|"thicc"}
 */
/**
 * @typedef Timertime
 * @type {15|30|60|120}
 */
/**
 * @typedef wordsLength
 * @type {10|25|50|100}
 */
/**
 * @typedef settings
 * @type {Object}
 * @property {GameMode} gameMode - game mode
 * @property {Object} writingSettings - settings for time, word, and qoute modes
 * @property {Boolean} [writingSettings.punctuation] - wether text should include puntuations or not
 * @property {Boolean} [writingSettings.numbers] - wether text should include numbers or not
 * @property {Timertime|wordsLength|quoteLength} difficulty - The difficulty level
 *
 */

/**@type {settings} */
let settings = {};
let gameStarted = false;
let isPaused = false;
let gameFinished = false;
let wordsCount = 0;
let textLength = 0;

function startGame() {
	gameStarted = true;
	timer.start();
	focusTypeSection();
	updateCounter(settings, {
		timerCount: 0,
		textLength: textLength,
		wordsCount: 0,
	});
}

function gameOver() {
	gameStarted = false;
	gameFinished = true;
	timer.reset();
	disableInput();
	beginTransition(document.getElementById("type_challenge"), "opacity", {
		desiredOpacity: 0,
	}).then(() => console.log("GAME OVER"));
}

function prepareGame() {
	disableInput();
	saveConfig();
	timer.reset();
	switch (settings.gameMode) {
		case "time":
			timer.setCallback(() => {
				updateCounter(settings, { timerCount: timer.count });
				if (timer.count >= settings.difficulty) {
					gameOver();
				}
			});
			break;
		case "words":
			console.log("words");
			break;
		case "quote":
			console.log("Quote");
			break;
		case "zen":
			console.log("Zen");
			break;
		case "custom":
			console.log("custom");
			break;
	}
	return beginTransition(
		document.getElementById("type_challenge"),
		"hide-and-do",
		{ callback: populateDisplay.bind(null, settings.gameMode) }
	).then((val) => {
		textLength = val;
		enableInput();
	});
}

function pauseGame() {
	timer.pause();
	unFocusTypeSection();
	isPaused = true;
}

function unPauseGame() {
	timer.start();
	focusTypeSection();
	isPaused = false;
}

/**
 * Returns true if game has started
 * @returns {Boolean} - boolean
 */
function gameHasStarted() {
	return gameStarted;
}
/**
 * Returns true if game is paused
 * @returns
 */
function gameIsPaused() {
	return isPaused;
}

/**
 * Saves config in settingsJson variable
 */
function saveConfig() {
	let gameMode = document
		.querySelector(".mode")
		.querySelector(".active")
		.classList.item(0);

	settings.gameMode = gameMode;

	if (gameMode == "words" || gameMode == "time" || gameMode == "custom") {
		let punctuationSetting = document
			.querySelector(".punc_and_num")
			.querySelector(".punctuation")
			.classList.contains("selected");
		let numberSetting = document
			.querySelector(".punc_and_num")
			.querySelector(".numbers")
			.classList.contains("selected");
		settings.writingSettings = {
			punctuation: punctuationSetting,
			numbers: numberSetting,
		};
	}

	if (gameMode == "words") {
		settings.difficulty = document
			.querySelector(".words_select")
			.querySelector(".active")
			.getAttribute("words");
	} else if (gameMode == "time") {
		settings.difficulty = document
			.querySelector(".time_select")
			.querySelector(".active")
			.getAttribute("time");
	} else if (gameMode == "quote") {
		settings.difficulty = document
			.querySelector(".quote_select")
			.querySelector(".active")
			.getAttribute("length");
	}
	console.log(JSON.stringify(settings, null, 3));
}
