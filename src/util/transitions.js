export {beginTransition}
import { arraysAreIdentical, cloneObject, isInDOM, removeFirstOccurrence } from "./utils.js"



/**
 * Handles different types of transitions based on the provided options. 
 * By default if no neecesary option is provided it searches in computed styles;
 * it can be disabled with `disableCSS` option
 * 
 * If no `options.duration` or ``timingFunction`` is provided either on `options` or  computed styles,
 * it defaults to **1s** and  **ease** respectively
 * @param {HTMLElement} el - The element to be animated
 * @param {"collapse"|"expand"|"move"|"hide-and-do"|"opacity"} type - Type of transition 
 * @param {Object} options - Options for the transition
 * @param {String} [options.duration] - Duration of the transition **must declare units**
 * @param {"ease"|"ease-in"|"ease-out"|"ease-in-out"|"linear"} [options.timingFunction] - Timing function for the transition
 * @param {String} [options.delay] - Delay before the transition starts **must declare units**
 * @param {Number} [options.xPos] - x position for move transition
 * @param {Number} [options.yPos] - y position for move transition
 * @param {Number} [options.desiredWidth] - Desired width for collapse or expand transition in pixels
 * @param {Number} [options.desiredOpacity] - Desired opacity for opacity transitions in range between 0 and 1
 * @param {Function} [options.callback] - Callback function for hide transition
 * @param {Boolean} disableCSS - if checked disables default computed styles, defaults to *false*
 * @returns {Promise} A promise that resolves when the transition ends
 */
function beginTransition(el,type, options, disableCSS = false) {

  if(!isInDOM(el)){
    return Promise.reject(new Error(`Passed value for transition ${this} isn't an element`))
  }
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
 * @param {Object} options - options object
 * @returns {Promise} promise resolving when transition ends
 */
function collapseElement(el, options){
  let {desiredWidth} = options
  options.duration = options.duration/2
  if(!options.desiredOpacity) options.desiredOpacity = 0.7

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

//TODO: Doesn't expands element
/**
 * Expands an element to its auto width
 * @param {HTMLElement} el The element to expand
 * @param {Object} options - options object
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
 * @param {Object} options - options
 * @returns {Promise} A promise that resolves when transition ends
 */
function moveAbsoluteElement(el, options){
  let {xPos, yPos} = options

  if(isNaN(xPos) || isNaN(yPos)) return Promise.reject(new Error("desired position must be a number"))
  let {top, left, height, width} = el.getBoundingClientRect()
  let prevX = Math.round(left) + Math.round(width)/2
  let prevY = Math.round(top) + Math.round(height)/2
  if(prevY == yPos && prevX == xPos) return Promise.resolve()

  addTransition(el, ["top", "left"], options)
  el.style.top = yPos + "px"
  el.style.left = xPos + "px"
  return waitForTransitions(el, ["top", "left"])
}

/**
 * Hides an element and executes a callback while it's not visible, after that element will be visible again 
 * @param {HTMLElement} el - Element to be hided
 * @param {Object} options - options
 * @returns {Promise} a promise that resolves when element is visible again
 */
function hideAndDo(el, options){
  if(!options.callback) return Promise.reject(new Error("No callback passed por element: " + el.classList))
  options.desiredOpacity = 0

  return transitOpacity(el, options)
  .then(() => Promise.resolve(options.callback()))
  .then(() => {
    options.desiredOpacity = 1
    transitOpacity(el, options)
  })
}

/**
 * Transitions an element to the desired opacity
 * @param {HTMLElement} el - Element to be transitioned
 * @param {Object} options - options
 * @return {Promise} a promise that resolves when transition ends
 */
function transitOpacity(el, options = {}){
  let {desiredOpacity} = options
  if (isNaN(desiredOpacity)) return Promise.reject(new Error("Didn't passed desired opacity for transitioning element"))
  let prevOpacity = getComputedStyle(el).getPropertyValue("opacity")
  if(prevOpacity == desiredOpacity) return Promise.resolve()

  addTransition(el, "opacity", options)
  el.style.opacity = desiredOpacity
  return waitForTransitions(el, "opacity")
}

/**
 * Returns a promise that resolves when the element has transitioned properties passed succesfully
 * @param {HTMLElement} el - element being animated 
 * @param {String|Array<String>} properties - css property or properties being animated 
 * @returns {Promise} a promise
 */
function waitForTransitions(el, properties){
  if(typeof properties == "string") properties = [properties]

  let promisesToResolve= properties.length
  return new Promise((resolve) => {
    el.addEventListener("transitionend", function onTransitionEnd(event){
      if(properties.includes(event.propertyName)){
        removeTransitionProperty(el, event.propertyName)
        promisesToResolve -= 1
        if(promisesToResolve == 0){
          this.removeEventListener("transitionend", onTransitionEnd)
          resolve()
        }
      }
    })
  })
}

//TODO: Doesn't work properly
/**
 * Removes only the transition property from the specified element 
 * @param {HTMLElement} el - element to be removed the property from 
 * @param {String} property - css property to remove 
 */
function removeTransitionProperty(el, property){
  let transitions =  el.style.transition.split(",").map((transition) => transition.trim())
  let updatedTransitions = removeFirstOccurrence(transitions,property)
  if(arraysAreIdentical(transitions, updatedTransitions)) {
    console.warn(`can't remove ${property} transition on ${el.tagName}: ${el.classList.item(0)}`)
    return
  }
  el.style.transition = updatedTransitions.toString()
}

/**
 * Adds a transition to an element without removing existing ones
 * @param {HTMLElement} el - The element to which the transition will be added
 * @param {String|Array<String>} properties - The CSS property or properties to transition
 * @param {Object} [options] - Optional transition parameters
 */
function addTransition(el, properties, options = {}) {
  if(typeof properties == "string"){
    properties = [properties]
  }


  let newTransitions = properties.map((property) => {
    let propertyOptions = applyDefaultOptions(el, property, options)
    console.log(property,propertyOptions);
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
  console.log(el.style.transition);
}

/**
 * Get dimensions of an element if its width were set to auto
 * @param {HTMLElement} el - element to get its dimensions
 * @returns {{width: Number, height: Number}}
 */
function getAutoDimensions(el){
  const clone = el.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.visibility = 'hidden';
      clone.style.width = 'auto';
      clone.style.height = 'auto';
      document.body.appendChild(clone);
      const autoWidth = clone.offsetWidth;
      const autoHeight = clone.offsetHeight;
      document.body.removeChild(clone);
      return { width: autoWidth, height: autoHeight };
}

/**
 * Applies default transition styles by searching on conputed styles
 * @param {HTMLElement} el - element to check styles on
 * @param {String} porperty - property to check styles on
 * @param {Object} options - Base options 
 */
function applyDefaultOptions(el, property, options){
  let optionsCopy = cloneObject(options)
  let prop = getComputedStyle(el).transitionProperty.split(",").map(s => s.trim())
  if(!options.disableCSS){
    let index = prop.findIndex(s => s == property || s == "all")
    console.log(prop,index,property);
    if(index == -1){
      console.warn("can't apply default styles to a property that doesn't exists on element")
      return optionsCopy
    }
    // get calculated css transition properties for element
    let {transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay} = getComputedStyle(el)
    //group transitions properties in array to traverse it
    let transitionproperties = [transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay];
    //get property for transition type index and re-destructure it
    [transitionProperty, transitionDuration, transitionTimingFunction, transitionDelay] = transitionproperties.map(
      (val) => {
        return val.split(",").map(s => s.trim())[index]
    })
    console.log(transitionTimingFunction);
    const numberRegex = /[\d.]+/

    //Check if value isn't configured and if number is greater than 0
    if(!optionsCopy.duration && transitionDuration.match(numberRegex)[0] > 0) optionsCopy.duration = transitionDuration
    if(!optionsCopy.timingFunction) optionsCopy.timingFunction = transitionTimingFunction
    if(!optionsCopy.delay && transitionDelay.match(numberRegex)[0] > 0) optionsCopy.delay = transitionDelay
  }
  if(!optionsCopy.timingFunction) optionsCopy.timingFunction = "ease"
  if(!optionsCopy.duration) optionsCopy.duration = "0.4s"

  return optionsCopy
}
