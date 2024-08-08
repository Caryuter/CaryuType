export {startGame, prepareGame, gameOver, notStarted}
import { disableInput } from "../handlers/keyboardHandler.js";
import { beginTransition } from "../util/transitions.js";
import { populateDisplay, focusTypeSection } from "./gameDisplay.js";


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
let gameSarted = false
let gameFinished = false
let timer;
let timerCount = 0;
let wordsCount = 0;
let textWordsLength = 0;

function startGame(){
    gameSarted = true
    focusTypeSection()
    if(settings.gameMode == "time"){
      startTimer()
    }
}

function gameOver(){
  gameSarted = false
  gameFinished = true
  clearInterval(timer)
  disableInput()
  beginTransition(
    document.getElementById("type_challenge"),
    "opacity",{"desiredOpacity": 0,}
  )
  .then(() => console.log("GAME OVER"))
}

function prepareGame(){
  saveConfig()
  return beginTransition(
    document.getElementById("type_challenge"),
    "hide-and-do",
    {"callback": populateDisplay.bind(null, )}
  )
}

/**
 * Returns true if game hasn't started
 * @returns {Boolean} - boolean
 */
function notStarted(){
  return !gameSarted
}


/**
 * Starts timer for game
 */
function startTimer(){
  if(timer){
    return
  }
  timer = setInterval(() => {
    timerCount++
    updateCounter()
    if(timerCount >= settings.difficulty){
      gameOver()
    }
  },1000)
}

/**
 * Updates counter text depending on mode an count variables
 */
function updateCounter(){
  const counter = document.querySelector(".counter")
  if(settings.gameMode == "time"){
    counter.textContent = settings.difficulty - timerCount
  } else if(settings.gameMode == "words"){
    counter.textContent = `${wordsCount}: ${textWordsLength}`
  }
}


/**
 * Saves config in settingsJson variable 
 */
function saveConfig(){
  let gameMode = document.querySelector(".mode").querySelector(".active").classList.item(0)

  settings.gameMode = gameMode
  
  if(gameMode == "words" || gameMode == "time" || gameMode == "custom") {
    let punctuationSetting = document.querySelector(".punc_and_num").querySelector(".punctuation").classList.contains("selected")
    let numbersSetting = document.querySelector(".punc_and_num").querySelector(".numbers").classList.contains("selected")
    settings.writingSettings= {
      puncutation: punctuationSetting,
      numbers: numbersSetting
    }
  }

  if(gameMode == "words"){
    settings.difficulty = document.querySelector(".words_select").querySelector(".active").getAttribute("words")
  }else if(gameMode == "time"){
    settings.difficulty = document.querySelector(".time_select").querySelector(".active").getAttribute("time")
  }else if(gameMode == "quote"){
    settings.difficulty = document.querySelector(".quote_select").querySelector(".active").getAttribute("length")
  }
  console.log(JSON.stringify(settings,null,3));
}


