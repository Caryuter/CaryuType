export {collapseElement, expandElement, moveAbsoluteElement, hideAndDo, transitionOpacity}
import { isInDOM } from "./utils"

/**
 * Collapses an elemento with auto width to a desired width
 * @param {HTMLElement} element The element to collapse
 * @param {int} desiredWidth The desired width in pixels
 * @returns {Promise} promise resolving when transition ends
 */
function collapseElement(element, desiredWidth){
  
    element.style.width = getComputedStyle(element).width
    element.style.opacity = "0"

  return new Promise((resolve) => {
    element.addEventListener("transitionend", function transitionEnd(event){
      if(event.propertyName == "opacity"){
        element.offsetWidth // force repaint
        element.style.width = desiredWidth + 'px'
      }
      if(event.propertyName == "width"){
        element.style.opacity = ""
        if(desiredWidth == 0){
          element.setAttribute("hidden", "")
        }
        resolve()
        element.removeEventListener("transitionend",transitionEnd,false)
        
      }
    })
  })
  
}

/**
 * Expands an element to it's auto width
 * @param {HTMLElement} element The element to expand
 * @return {Promise} promise resolving when transition ends
 */
function expandElement(element){

  let delay = getComputedStyle(element).transitionDuration.split(",")[0]
  element.offsetWidth // force repaint
  element.style.width = element.scrollWidth + "px"
  element.style.transitionDelay = delay
 

  return new Promise((resolve) => {
    element.addEventListener('transitionend', function transitionEnd(event) {
      if (event.propertyName == 'width') {
        element.style.transitionDelay = ""
        element.style.width = 'auto'
        element.removeAttribute("hidden")
        resolve()
        element.removeEventListener('transitionend', transitionEnd,false)
      }
    })
  }) 
}

/**
 * Moves an absolute element to the desired absolute position
 * @param {HTMLElement} el - Element to move 
 * @param {{xPos: Number, yPos: Number}} Positions - an object with the desired fixed positions
 * @returns {Promise} A promise that resolves when transition ends
 */
function moveAbsoluteElement(el, {xPos, yPos}){

  if(!isInDOM(el)){
    throw new Error("Passed value isn't in DOM")
  }

  let prevY = el.style.top
  let prevX = el.style.left
  el.style.top = yPos + "px"
  el.style.left = xPos + "px"
  return new Promise((resolve) => {
    if(prevY != el.style.top || prevX != el.style.left){
      el.addEventListener("transitionend", function transitionEnd() {
        resolve()
        el.removeEventListener("transitionEnd",transitionEnd, false)
      })
    } else {
      resolve()
    }
  })
}

/**
 * Hides an element and executes a callback while it's not visible, after that element will be visible again 
 * @param {HTMLElement} el - Element to be hided
 * @param {Function} callback - function to execute while element is hided
 * @returns {Promise} a promise that resolves when element is visible again
 */
function hideAndDo(el, callback){
  return transitionOpacity(el, 0)
  .then(() => Promise.resolve(callback))
  .then(() => transitionOpacity(el, 1))
}

/**
 * Transitions an element to the desired opacity
 * @param {Number} desiredOpacity - the desired opacity
 * @return {Promise} a promise that resolves when transition ends
 */
function transitionOpacity(el, desiredOpacity){
  return new Promise((resolve) => {
    el.style.opacity = desiredOpacity
    el.addEventListener("transitionend", function transitionEnd(){
      resolve()
      el.removeEventListener("transitionend", transitionEnd)
    })
  })
}