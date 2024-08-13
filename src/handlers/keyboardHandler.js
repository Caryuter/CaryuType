import { caretSmoothMode, caretStepMode, updateCaret } from "../components/caret.js"
import { startGame, gameOver, gameHasStarted, gameIsPaused, unPauseGame } from "../components/gameLogic.js"
import { checkWord, setActiveLetter, markWord, resetWord} from "../util/typeCheckers.js"


export {onKeyUp, onKeyDown, disableInput, enableInput}

const input = document.querySelector("input")
const display = document.querySelector(".para")

/**@type {HTMLSpanElement} */
let activeWord


/**
 * Handler for user char input
 * @param {KeyboardEvent} key 
 */
function onKeyUp(){
  if(input.disabled) return
  activeWord = display.querySelector("word.active")
  onType()
}

/**
 * Handler for space and backspace input. Also triggers 
 * game start 
 * @param {KeyboardEvent} key 
 */
function onKeyDown(key){
  if(input.disabled) return
  activeWord = display.querySelector("word.active")
  input.focus()
  caretSmoothMode()
  if(!gameHasStarted()){
    startGame()
  } else if(gameIsPaused()){
    unPauseGame()
  }
  if(key.code == "Space") onKeySpace(key)
  if(key.code == "Backspace") onKeyBackspace(key)
}

/**
 * Handler for keydown of space key event
 * @param {KeyboardEvent} key 
 */
function onKeySpace(key){
  key.preventDefault()
  key.stopPropagation()
  let nextWord = activeWord.nextElementSibling
  if(input.value.length > 0) changeActiveWord(nextWord, true)
 
}

/**
 * Handler for keydown of backspace key event
 * @param {KeyboardEvent} key 
 */
function onKeyBackspace(key){
  caretStepMode()
  onType()
  if(!display.querySelector(".marked") || input.value.length != 0) return
  key.preventDefault()
  changeActiveWord(activeWord.previousElementSibling, false)
}

/**
 * Handles typing event, whether adding or removing a character
 */
function onType(){
  checkWord(activeWord, input.value)
  setActiveLetter(activeWord, input)
  updateCaret(activeWord)
}

/** 
 * Changes current active word for `newWord` 
 * by reseting CSS classes for current word,
 * adding `.typed` class and `.mark` if there's an incorrect letter
 * @param {HTMLSpanElement} newWord -  new word
 * @param {Boolean} mode - true for forward
 */
function changeActiveWord(newWord, mode){
  if(newWord){
    resetWord(activeWord)
    resetWord(newWord)
    newWord.classList.add("active")
    console.log("Changing word");
  } 
  if(mode){
    if(!newWord) {
      resetWord(activeWord)
      gameOver()
    }
    markWord(activeWord)
    populateInput(newWord, mode)
  } else {
    populateInput(newWord, mode)
  }
}

/**
 * Populates an input according to the word to match every letter current state
 * @param {HTMLSpanElement} word - word to match state 
 * @param {Boolean} mode - true for forward
 */
function populateInput(word, mode){
  input.value = "";
  if(!mode && word) {
    word.querySelectorAll("letter")
    .forEach((letter) => {
      if(letter.classList.contains("correct")){
        input.value += letter.textContent
      } else if (letter.classList.contains("incorrect")){

        if(letter.textContent == "*"){
          input.value+="?"
        }else{
          input.value +="*"
        }

      }
    })
  }
}

function disableInput(){
  input.disabled = true
}

function enableInput(){
  input.disabled = false
}