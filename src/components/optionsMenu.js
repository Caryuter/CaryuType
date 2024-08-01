export {resetActiveMode, generateNewMenuStates, onClickMenu}
import { onClickMenuButton, disableAllButtons, enableAllButtons } from "./menuButton.js"
import { expandElement, collapseElement } from "../util/transitions.js"
import { initGame } from "../components/typeChallenge.js"


/**
 * Generates an array refering to the new options menu states. 
 * True = expanded
 * False = collapsed
 * @param {HTMLButtonElement} activeButton The new active button
 * @returns New menu expanded states
 */
function generateNewMenuStates(activeButton){

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

    if(menuStatesChanged()){
      toggleSpacersVisibility(newMenuStates)
      transitionOnToggleMenu(newMenuStates)
      initGame()
    }   
}

/**
 * Triggers transitions on menus if changed 
 * @param {Array<Boolean>} newStates New menu states
 */
function transitionOnToggleMenu(newStates){
  disableAllButtons()

  let promises = []
  document.querySelector(".options").querySelectorAll("menu").forEach((menu, index)=> {
      if(newStates[index]){
        promises.push(expandElement(menu))
      } else {
        promises.push(collapseElement(menu, 0))
      }
    
  })

  Promise.all(promises).then(enableAllButtons)
}

/**
 * 
 * @param {Array<Boolean>} newStates array of menu desired shown states 
 * @returns boolean indicating if menu states changed
 */
function menuStatesChanged(newStates){
    document.querySelector(".options").querySelectorAll("menu")
    .forEach((menu, index) => {
      if(isVisible(menu) != newStates[index]){
        return true
      }
    })
    return false
}

/**
 * Retrieves wether an element is hidden or not 
 * @param {HTMLElement} el 
 * @returns boolean
 */
function isVisible(el){
  el.getAttribute("hidden") == null
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