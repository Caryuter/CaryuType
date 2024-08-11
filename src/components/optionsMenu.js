export {resetActiveMode, observeNewMenuStates, onClickMenu}
import { onClickMenuButton, disableAllButtons, enableAllButtons } from "./menuButton.js"
import { beginTransition } from "../util/transitions.js"
import { prepareGame } from "./gameLogic.js"


/**
 * 
 * @param {HTMLButtonElement} activeButton The new active button
 */
function observeNewMenuStates(activeButton){

    let newMenuStates = []
    if(activeButton.classList.contains("time")){
      newMenuStates = [true, true, true, false, false, false]
    } else if(activeButton.classList.contains("words")){
      newMenuStates = [true, true, false, true, false, false]
    } else if(activeButton.classList.contains("quote")){
      newMenuStates = [false, true, false, false, true, false]
    } else if(activeButton.classList.contains("zen")){
      newMenuStates = [false, true, false, false, false, false]
    } else if(activeButton.classList.contains("custom")){
      newMenuStates = [true, true, false, false, false, true]
    }

    console.log(menuStatesChanged(newMenuStates));
    if(menuStatesChanged(newMenuStates)){
      toggleSpacersVisibility(newMenuStates)
      toggleMenusVisibility(newMenuStates)
      prepareGame()
    }   
}

/**
 * Triggers transitions on menus if changed 
 * @param {Array<Boolean>} newStates New menu states
 */
function toggleMenusVisibility(newStates){
  disableAllButtons()

  let promises = []
  document.querySelector(".options").querySelectorAll("menu").forEach((menu, index)=> {
      if(newStates[index]){
        const delay = getComputedStyle(menu).transitionDuration.split(",")[0]
        promises.push(beginTransition(menu,"expand",{"delay": delay}))
      } else {
        promises.push(beginTransition(menu,"collapse"))
      }
  })

  Promise.all(promises).then(enableAllButtons())
}

/**
 * 
 * @param {Array<Boolean>} newStates array of menu desired shown states 
 * @returns {Boolean} boolean indicating if menu states changed
 */
function menuStatesChanged(newStates){
  let changed = false
  document.querySelector(".options").querySelectorAll("menu")
  .forEach((menu, index) => {
    if(isVisible(menu) != newStates[index]){
      changed = true
    }
  })
  return changed
}

/**
 * Retrieves wether an element is hidden or not 
 * @param {HTMLElement} el 
 * @returns boolean
 */
function isVisible(el){
  return el.getAttribute("hidden") == null
}


/**
 * Toggles hidden attribute of spacers if needed
 * @param {Array<Boolean>} states new options menu expanded states
 */
function toggleSpacersVisibility(states){
    if(!states[0]){
          
        document.querySelector(".left_spacer").setAttribute("hidden","")
      } else {
        document.querySelector(".left_spacer").removeAttribute("hidden")
      }

      if(states.slice(2).some(value => value)){ 
        document.querySelector(".right_spacer").removeAttribute("hidden")
      } else {
        document.querySelector(".right_spacer").setAttribute("hidden","")
      }
}
/**
 * 
 * @param {HTMLButtonElement} button 
 */
function resetActiveMode(button){
    let buttonMenu = button.closest("menu")
    let buttonMenuClass = buttonMenu.classList.item(0)
    if ((buttonMenuClass != "punc_and_num") || (buttonMenuClass != "custom_select")){
      let siblingButtons = buttonMenu.querySelectorAll("button")
      siblingButtons.forEach(siblingButton => siblingButton.classList.remove("active"))
      button.classList.add("active")
    }
    button.classList.add("active")
}

/**
 * 
 * @param {MouseEvent} event 
 * @returns 
 */
function onClickMenu(event){
    /** @type {HTMLElement} button */
    let button = event.target.closest("button")
    if(!button){
      return
    }  
    onClickMenuButton(button)
}