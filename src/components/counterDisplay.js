export {updateCounter}

/**
 * @typedef CounterValues
 * @type {Object} 
 * @property {Number} timerCount - time left in seconds
 * @property {Number} wordsCount - current typed words 
 * @property {Number} textLength - current text length
 */
/**
 * 
 * Updates counter text depending on mode an count variables
 * @param {import("./gameLogic.js").settings} settings - game settings
 * @param {CounterValues} value - value to display in counter
 */
function updateCounter(settings, value){
    const counter = document.querySelector(".counter")
    if(settings.gameMode == "time"){
      if(!value.timerCount && isNaN(value.timerCount)) throw new Error("Can't set counter value without timer count")
      counter.textContent = settings.difficulty - value.timerCount
    } else if(settings.gameMode == "words"){
      if(
        (!value.wordsCount && isNaN(value.wordsCount))
        || 
        (!value.textLength && isNaN(value.textLength))
      ) throw new Error("Can't set counter value without words count or text length")
      counter.textContent = `${value.wordsCount}: ${value.textLength}`
    }
  }