export {beginTransition}
import { arraysAreIdentical, cloneObject, isInDOM, removeFirstOccurrence, resizeArray } from "./utils.js"



/**
 * @typedef Options
 * @type {Object}
 * @property {String} duration - Duration of the transition **must declare units**
 * @property {"ease"|"ease-in"|"ease-out"|"ease-in-out"|"linear"} timingFunction - Timing function for the transition
 * @property {String} delay - Delay before the transition starts **must declare units**
 * @property {Number} xPos - x position for move transition
 * @property {Number} yPos - y position for move transition
 * @property {Number} desiredWidth - Desired width for collapse or expand transition in pixels
 * @property {Number} desiredOpacity - Desired opacity for opacity transitions in range between 0 and 1
 * @property {Function} callback - Callback function for hide transition
 * @property {Boolean} disableCSS - if checked disables default computed styles, defaults to *false*
 */
/**
 * Handles different types of transitions based on the provided options. 
 * By default if no neecesary option is provided it searches in computed styles;
 * it can be disabled with `disableCSS` option
 * 
 * If no `options.duration` or ``timingFunction`` is provided either on `options` or  computed styles,
 * it defaults to **1s** and  **ease** respectively
 * @param {HTMLElement} el - The element to be animated
 * @param {"collapse"|"expand"|"move"|"hide-and-do"|"opacity"} type - Type of transition 
 * @param {Options} options - Options for the transition
 * @param {Boolean} disableCSS - if checked disables default computed styles, defaults to *false*
 * @returns {Promise} A promise that resolves when the transition ends
 */
function beginTransition(el,type, options, disableCSS = false) {
  if(!isInDOM(el)){
    return Promise.reject(new Error(`Passed value for transition ${this} isn't an element`))
  }
  if(!options) options = {}
  options.disableCSS = disableCSS
  switch (type) {
    case 'collapse':
      return collapseElement(el, options);
    case 'expand':
      return expandElement(el, options);
    case 'move':
      return moveAbsoluteElement(el, options);
    case 'hide-and-do':
      return hideAndDo(el, options);
    case 'opacity':
      return transitOpacity(el, options);
    default:
      console.error(`Unknown transition type: ${type}`);
      return Promise.reject(new Error(`Unknown transition type: ${type}`));
  }
}

/**
 * Collapses an element with auto width to a desired width
 * @param {HTMLElement} el The element to collapse
 * @param {Options} options - options for transition
 * @returns {Promise} promise resolving when transition ends
 */
function collapseElement(el, options){
  options.duration = options.duration/2
  if(!options.desiredOpacity) options.desiredOpacity = 0
  if(!options.desiredWidth) options.desiredWidth = 0
  let {desiredWidth} = options

  if(isNaN(desiredWidth)) return Promise.reject(new Error("desired width must be a number"))
  let prevWidth = Math.round(el.getBoundingClientRect().width)
  if(prevWidth == desiredWidth) return Promise.resolve()
  return transitOpacity(el, options)
  .then(() =>{
    addTransition(el, "width", options)
    el.style.width = prevWidth + "px"
    el.offsetWidth // force repaint
    el.style.width = desiredWidth + 'px'
    return waitForTransitions(el, "width")
  })
  .then(() =>{
    if(options.hidden) {
      el.setAttribute("hidden", true)
      el.setAttribute("aria-hidden", "true")
    } 
  })
}

/**
 * Expands an element to its auto width
 * @param {HTMLElement} el The element to expand
 * @param {Options} options - options for transition
 * @return {Promise} promise resolving when transition ends
 */
function expandElement(el, options){
  if(!options.desiredOpacity) options.desiredOpacity = 1
  el.offsetWidth // force repaint

  let desiredWidth = getAutoDimensions(el).width
  let prevWidth = Math.round(el.getBoundingClientRect().width)
  if(prevWidth == desiredWidth) return Promise.resolve()
  addTransition(el, "width", options)
  el.style.width =  desiredWidth + "px"
  return waitForTransitions(el, "width")
  .then(() => {
    el.style.width = 'auto'
    return transitOpacity(el, options)
  })
  .then(() => {
    el.removeAttribute("hidden")
    el.removeAttribute("aria-hidden")
  })
}

/**
 * Moves an absolute element to the desired absolute position
 * @param {HTMLElement} el - Element to move 
 * @param {Options} options - options for transition
 * @returns {Promise} A promise that resolves when transition ends
 */
function moveAbsoluteElement(el, options){

  let {xPos, yPos} = options
  xPos = Math.round(xPos)
  yPos = Math.round(yPos)
  let propToTransition = []

  if(isNaN(xPos) || isNaN(yPos)) return Promise.reject(new Error("desired position must be a number"))
  let {top, left, height, width} = el.getBoundingClientRect()
  let prevX = Math.round(left) //+ Math.round(width)/2
  let prevY = Math.round(top) //+ Math.round(height)/2
  if(prevX != xPos) propToTransition.push("left")
  if(prevY != yPos) propToTransition.push("top")
  console.log({prevY, yPos}, {prevX,xPos});
  addTransition(el, propToTransition, options)
  if(propToTransition[0] == undefined) return Promise.resolve()
  if(propToTransition.includes("left")) el.style.left = xPos + "px"
  if(propToTransition.includes("top")) el.style.top = yPos + "px"
  console.log(propToTransition);
  return waitForTransitions(el, propToTransition)
}

/**
 * Hides an element and executes a callback while it's not visible, after that element will be visible again 
 * @param {HTMLElement} el - Element to be hided
 * @param {Options} options - options for transition
 * @returns {Promise} a promise that resolves when element is visible again
 */
function hideAndDo(el, options){
  
  if(!options.callback) return Promise.reject(new Error("No callback passed por element: " + el.classList))
  options.desiredOpacity = 0
  

  return transitOpacity(el, options)
  .then(() => {
    try {
      return Promise.resolve(options.callback())
    }catch(e){
      console.error(e.stack);
    }
  })
  .then((val) => {
    options.desiredOpacity = 1
    return transitOpacity(el, options, val)
  })
}

/**
 * Transitions an element to the desired opacity
 * @param {HTMLElement} el - Element to be transitioned
 * @param {Options} options - options for transition
 * @param {*} res - Value to return after transition has finished 
 * @return {Promise} a promise that resolves when transition ends
 */
function transitOpacity(el, options = {}, res){
  let {desiredOpacity} = options
  if (isNaN(desiredOpacity)) return Promise.reject(new Error("Didn't passed desired opacity for transitioning element"))
  let prevOpacity = getComputedStyle(el).getPropertyValue("opacity")
  if(prevOpacity == desiredOpacity) return Promise.resolve()

  addTransition(el, "opacity", options)

  el.style.opacity = desiredOpacity
  return waitForTransitions(el, "opacity", res)
}

/**
 * Returns a promise that resolves when the element has transitioned properties passed succesfully
 * @param {HTMLElement} el - element being animated 
 * @param {String|Array<String>} properties - css property or properties being animated
 * @param {*} res - value to return after transition has finished  
 * @returns {Promise} a promise
 */
function waitForTransitions(el, properties, res){
  if(typeof properties == "string") properties = [properties]
  if(properties[0] == undefined) return Promise.resolve()

  let promisesToResolve= properties.length
  return new Promise((resolve) => {
    el.addEventListener("transitionend", function onTransitionEnd(event){
      if(properties.includes(event.propertyName)){
        removeTransitionProperty(el, event.propertyName)
        promisesToResolve -= 1
        if(promisesToResolve == 0){
          this.removeEventListener("transitionend", onTransitionEnd)
          resolve(res)
        }
      }
    })
  })
}

/**
 * Removes only the transition property from the specified element 
 * @param {HTMLElement} el - element to be removed the property from 
 * @param {String} property - css property to remove 
 */
function removeTransitionProperty(el, property){
  let transitions  = el.style.transition.match(/(((cubic-bezier\(.+?\))|(\w+[-.]?)+)\s?)+/g).map(s => s.trim()) //Prevent cubic-brezier to break code
  let updatedTransitions = removeFirstOccurrence(transitions,property)
  if(arraysAreIdentical(transitions, updatedTransitions)) {
    console.warn(`can't remove ${property} transition on ${el.tagName}: ${el.classList.item(0)}`)
    return
  }
  el.style.transition = updatedTransitions.toString()
}

/**
 * Adds a transition inline style to an element with specified options
 * @param {HTMLElement} el - The element to which the transition will be added
 * @param {String|Array<String>} properties - The CSS property or properties add transition to
 * @param {Options} options - options for transition
 */
function addTransition(el, properties, options = {}) {
  if(typeof properties == "string"){
    properties = [properties]
  }


  let newTransitions = properties.map((property) => {
    /**@type {Options} */
    let propertyOptions = applyDefaultOptions(el, property, options)
    let newTransition = property;
    if (propertyOptions.duration !== undefined && propertyOptions.duration !== '') {
      newTransition += ` ${propertyOptions.duration}`;
    }

    if (propertyOptions.timingFunction !== undefined && propertyOptions.timingFunction !== '') {
      newTransition += ` ${propertyOptions.timingFunction}`;
    }

    if (propertyOptions.delay !== undefined && propertyOptions.delay !== '') {
      newTransition += ` ${propertyOptions.delay}`;
    }
    return newTransition
  })
  // If there are existing transitions, append the new one
  if (el.style.transition) {
    let existingTransitions = el.style.transition.split(",").map(t => t.trim())
    el.style.transition = [...existingTransitions, ...newTransitions].join(", ")
  } else {
    el.style.transition = newTransitions.join(", ");
  }
}

/**
 * Get dimensions in pixels of an element if its width were set to auto
 * @param {HTMLElement} el - element to get its dimensions
 * @returns {{width: Number, height: Number}} `width` and `height` in pixels
 */
function getAutoDimensions(el){
  /**@type {HTMLElement} */
  const clone = el.cloneNode(true);
  clone.style.width = "auto"
  clone.style.height = "auto"
  const parentClone = el.parentElement.cloneNode(false); //Clone to mantain context
  parentClone.style.position = 'absolute';
  parentClone.style.visibility = 'hidden'; // Oculta para no afectar la vista
  parentClone.appendChild(clone);

  document.body.appendChild(parentClone);
  const autoWidth = clone.offsetWidth;
  const autoHeight = clone.offsetHeight;
  document.body.removeChild(parentClone)
  return { width: autoWidth, height: autoHeight };
}

/**
 * Applies default transition styles by searching on computed styles
 * or applying default duration and timing function if CSS support
 * is disabled
 * @param {HTMLElement} el - element to check styles on
 * @param {String} porperty - property to check styles on
 * @param {Options} options - options for transition
 */
function applyDefaultOptions(el, property, options){
  let optionsCopy = cloneObject(options)

  if(!options.disableCSS){
    let prop = getComputedStyle(el).transitionProperty.split(",").map(s => s.trim())
    let propLength = prop.length
    let index = prop.findIndex(s => s == property || s == "all")
    if(index == -1){
      console.warn("can't apply default styles to a property that doesn't exists on element",el, property,options)
      return optionsCopy
    }
    // get calculated css transition properties for element
    let {transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay} = getComputedStyle(el)
    //group transitions properties in array to traverse it
    let transitionproperties = [transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay];
    //get property for transition type index and re-destructure it
    [transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay] = transitionproperties.map(
      (val) => {
        let defVals = []
        
        if(val == transitionTimingFunction){
          defVals = val.match(/(cubic-bezier\(.*\))|(\w+-?)+/g) //Prevent commas in cubic brezier to brake code
        }
        defVals = val.split(",").map(s => s.trim())
        if(defVals != propLength) resizeArray(defVals, propLength, defVals[0])
        return defVals[index]

    })

    const numberRegex = /[\d.]+/
    //Check if value isn't configured and if number is greater than 0
    if(!optionsCopy.duration && transitionDuration.match(numberRegex)[0] > 0) optionsCopy.duration = transitionDuration
    if(!optionsCopy.timingFunction) optionsCopy.timingFunction = transitionTimingFunction
    if(!optionsCopy.delay && transitionDelay.match(numberRegex)[0] > 0) optionsCopy.delay = transitionDelay
  }

  //Default styles if CSS support is disabled
  if(!optionsCopy.timingFunction) optionsCopy.timingFunction = "ease"
  if(!optionsCopy.duration) optionsCopy.duration = "0.4s"

  return optionsCopy
}
