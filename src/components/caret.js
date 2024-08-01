export {updateCaret}
import { moveAbsoluteElement } from "../util/transitions"

const $caret = document.querySelector(".caret")


/**
 * Updates visual caret position to mark current active word
 * @param {HTMLSpanElement} $activeWord - The current active word
 * @returns {Promise} a promise that resolves when caret is in position
 */
function updateCaret($activeWord){
  try{
    let positions = retrieveNewCaretPosition($activeWord)
    return moveAbsoluteElement($caret, positions)
  } catch(e){
      console.error(e)
  }
}



/**
 * Retrieves new position for caret 
 * @param {HTMLSpanElement} $activeWord - The current active word
 * @returns {{xPos: Number, yPos: Number}} An object with both X and Y fixed screen position
 */
function retrieveNewCaretPosition($activeWord){
  let xPos = 0
  let yPos = 0
  const $activeLetter = $activeWord.querySelector(".active") || $activeWord.querySelector(".last")
  if(!$activeLetter){
    throw new Error("No active letter on this word")
  }
  const {x, y, width, right} = $activeLetter.getBoundingClientRect()

  yPos = y
  if($activeWord.querySelector(".active")){
    xPos = x
    xPos -= width
  } else if($activeWord.querySelector(".last")){
    xPos = right
    xPos += width /2
  }
  return {xPos, yPos}
}

