export {startGame, initGame, gameOver}
import { disableInput } from "../handlers/keyboardHandler";
import { randomTextArray } from "../util/textGenerator";
import { beginTransition } from "../util/transitions";
import { updateCaret } from "./caret";


let settingsJson = {};
let gameSarted = false
let gameFinished = false
let timer;
let timerCount = 0;
let wordsCount = 0;
let textWordsLength = 0;


function startGame(){
    gameSarted = true
    focusTypeSection()
    if(settingsJson.gameMode == "time"){
      startTimer()
    }
}

function gameOver(){
  gameSarted = false
  gameFinished = true
  clearInterval(timer)
  disableInput()
  beg(document.getElementById("type_challenge"), 0)
  console.log("GAME OVER");
}

function initGame(){
  saveConfig()
  return hideAndDo(document.getElementById("type_challenge"), populateParagraph)
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
    if(timerCount >= settingsJson.difficulty){
      gameOver()
    }
  },1000)
  timer.clearInterval
}

/**
 * Updates counter text depending on mode an count variables
 */
function updateCounter(){
  const counter = document.querySelector(".counter")
  if(settingsJson.gameMode == "time"){
    counter.textContent = settingsJson.difficulty - timerCount
  } else if(settingsJson.gameMode == "words"){
    counter.textContent = `${wordsCount}: ${textWordsLength}`
  }
}



/**
 * Hides everything and focus only the type section
 */  
function focusTypeSection(){
  const onWriteNotFocus= [document.querySelector(".topbar nav"),
    document.querySelector(".options"),
    document.querySelector(".topbar .logo"),
    document.querySelector(".counter"),
    document.querySelector(".lang"),
    document.querySelector("footer")];
  
  onWriteNotFocus.forEach((el) => {
    begin
    el.style.transition = 'opacity .15s linear'
    el.addEventListener("transitionend", () => {
      el.style.transition = ""
    })
    if(el != document.querySelector(".counter")){
      el.classList.add("not-focused")
    } else {
      el.classList.remove("not-focused")
    }
  })
  document.querySelector(".caret").style.animationPlayState = "paused"
}


/**
 * Saves config in settingsJson variable 
 */
function saveConfig(){
  let gameMode = document.querySelector(".mode").querySelector(".active").classList.item(0)

  settingsJson.gameMode = gameMode
  
  if(gameMode == "words" || gameMode == "time" || gameMode == "custom") {
    let punctuationSetting = document.querySelector(".punc_and_num").querySelector(".punctuation").classList.contains("selected")
    let numbersSetting = document.querySelector(".punc_and_num").querySelector(".numbers").classList.contains("selected")
    settingsJson.writingSettings= {
      puncutation: punctuationSetting,
      numbers: numbersSetting
    }
  }

  if(gameMode == "words"){
    settingsJson.difficulty = document.querySelector(".words_select").querySelector(".active").getAttribute("words")
  }else if(gameMode == "time"){
    settingsJson.difficulty = document.querySelector(".time_select").querySelector(".active").getAttribute("time")
  }else if(gameMode == "quote"){
    settingsJson.difficulty = document.querySelector(".quote_select").querySelector(".active").getAttribute("length")
  }
  console.log(settingsJson);
}


