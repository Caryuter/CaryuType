
const randomWords = [
  "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", 
  "honeydew", "kiwi", "lemon", "mango", "nectarine", "orange", "papaya", 
  "quince", "raspberry", "strawberry", "tangerine", "ugli", "vanilla", 
  "watermelon", "xigua", "yellowfruit", "zucchini", "almond", "blueberry", 
  "coconut", "dragonfruit", "eggplant", "feijoa", "guava", "huckleberry", 
  "jackfruit", "kumquat", "lime", "mulberry", "nutmeg", "olive", "pomegranate", 
  "quinoa", "rhubarb", "soursop", "tomato", "uvas", "violet", "walnut", 
  "xanthan", "yam", "zebrafruit"
];
let wordsNum =20;

const $challengeSection = document.querySelector("#type_challenge") 
const $header = document.querySelector("body>header")
const $footer = document.querySelector("body>footer")
const $input = document.querySelector("input")
const $para = document.querySelector(".para")
const $caret = document.querySelector(".caret")
const $counter = document.querySelector(".counter")

let settingsJson = {};
let gameSarted = false
let gameFinished = false
let timer;
let timerCount = 0;

let onWriteNotFocus= [$header.querySelector(".topbar nav"),
  $header.querySelector(".options"),
  $header.querySelector(".logo"),
  $counter,
  document.querySelector(".lang"),
  $footer];

function randWord() {
    let randNum = Math.floor(Math.random() * randomWords.length)
    return randomWords[randNum]
}

function initPage(){
// TAGS ===========================

  document.querySelectorAll('button, a').forEach(button => {
    if ((button.querySelector('i') && button.textContent.trim().length > 0) || (button.closest(".options") != null && button.querySelector("i") == null && button.children.length === 0)) {

        button.classList.add('text_button'); 
    } else if ((button.children.length === 1 && button.children[0].tagName.toLowerCase() === 'i') || (button.children.length == 0 && button.textContent.trim().length < 4)) {

        button.classList.add('icon_button'); 
    }
  });

// Options Menu UX =========================================
  $header.querySelector(".options").addEventListener("click", onClickMenu)


//WRITE GAME LISTENERS ===================================

  document.addEventListener("keydown", onKeyDown)
  document.addEventListener("keyup", onKeyUp) 

  /**
   * 
   * @param {MouseEvent} event 
   */
  function onClickMenu(event){
    /** @type {HTMLElement} button */
    let button = event.target.closest("button")
    console.log(event.target);

    if(!button){
      return
    }  


    /** @type {HTMLElement} buttonMenu */
    let buttonMenu = button.closest("menu")
    let buttonMenuClass = buttonMenu.classList.item(0)
    if ((buttonMenuClass != "punc_and_num") || (buttonMenuClass != "custom_select")){
      let siblingButtons = buttonMenu.querySelectorAll("button")
      siblingButtons.forEach(siblingButton => siblingButton.classList.remove("active"))
      button.classList.add("active")
    }
    if(buttonMenuClass == "mode"){

      let prevMenuStates = []
      event.currentTarget.querySelectorAll("menu").forEach((menu) => {
        prevMenuStates.push((menu.getAttribute("hidden") != null) ? false: true)
      })
      let newMenuStates = []

      if(button.classList.contains("time")){
        newMenuStates = [true, true, true, false, false, false]
      } else if(button.classList.contains("words")){
        newMenuStates = [true, true, false, true, false, false]
      } else if(button.classList.contains("quote")){
        newMenuStates = [false, true, false, false, true, false]
      } else if(button.classList.contains("zen")){
        newMenuStates = [false, true, false, false, false, false]
      } else if(button.classList.contains("custom")){
        newMenuStates = [true, true, false, false, false, true]
      }

      if(!newMenuStates[0]){
        document.querySelector(".left_spacer").setAttribute("hidden","")
      } else {
        document.querySelector(".left_spacer").removeAttribute("hidden")
      }

      if(newMenuStates.slice(2).some(value => value)){ 
        document.querySelector(".right_spacer").removeAttribute("hidden")
      } else {
        document.querySelector(".right_spacer").setAttribute("hidden","")
      }

      
      if(!prevMenuStates.every((element, index) => element == newMenuStates[index])){

        initGame()

        let allOptionButtons = event.currentTarget.querySelectorAll("button")
        allOptionButtons.forEach(el => el.setAttribute("disabled",""))
        let promises = []
        event.currentTarget.querySelectorAll("menu").forEach((menu, index)=> {
          if(prevMenuStates[index] != newMenuStates[index]){
            if(newMenuStates[index]){
              promises.push(expandElement(menu))
            } else {
              promises.push(collapseElement(menu, 0))
            }
          }
        })

        Promise.all(promises).then(() => {
          allOptionButtons.forEach(el => el.removeAttribute("disabled"))
        })
      }

    } else if(buttonMenuClass == "punc_and_num"){
      button.classList.toggle("selected")
    }
  }
  /**
   * 
   * @param {KeyboardEvent} key 
   */
  function onKeyDown(key){
    let textInput = $input.value.split("")
    let $activeWord = $para.querySelector("word.active")
    let $newActiveWord = $activeWord
    let $letters = $activeWord.querySelectorAll("letter")
    $input.focus()
    $caret.style.transition = "top .1s ease-in-out, left .1s ease-in-out";

    //Start GAME =========================
    if(!gameSarted && !gameFinished){
      startGame()
    }
    
    checkLetter($letters, textInput)
    
    for (let $letter of $activeWord.children){
      $letter.classList.remove("last")
      $letter.classList.remove("active")
    }
    if(key.code == "Space"){
      key.preventDefault() 
      if($activeWord.nextElementSibling){
        if($input.value.length > 0){
          $activeWord.classList.remove("active")
          $activeWord.classList.add("typed")
          $newActiveWord = $activeWord.nextElementSibling
          $newActiveWord.classList.add("active")
          $input.value = "";
          for (let $letter of $activeWord.children){
            if(!$letter.classList.contains("correct")){
              $activeWord.classList.add("marked")
            }
          }
        }
      } else { 
        $activeWord.classList.remove("active")
        $activeWord.classList.add("typed")
        for (let $letter of $activeWord.children){
          if(!$letter.classList.contains("correct")){
            $activeWord.classList.add("marked")
          }
        }
        gameOver()
      }
    } 
    if(key.code == "Backspace"){
      $caret.style.transition = "none";
      if($para.querySelector(".marked") && $input.value.length == 0){
        
        $newActiveWord = $activeWord.previousElementSibling
        key.preventDefault()  
        $activeWord.classList.remove("active")
        $activeWord.classList.remove("typed")
        $newActiveWord.classList.add("active")
        $newActiveWord.classList.remove("marked")
        $input.value = "";
        for (let $letter of $activeWord.children){
          $letter.classList.remove("active")
          $letter.classList.remove("last")
        }

        for (let $newLetter of $newActiveWord.children){
          if($newLetter.classList.contains("correct")){
            $input.value +=$newLetter.textContent
          } else if ($newLetter.classList.contains("incorrect")){
            if($newLetter.textContent == "*"){
              $input.value+="?"
            }else{
              $input.value +="*"
            }
          }
        }

      }

    }
    checkLetter($para.querySelector("word.active").querySelectorAll("letter"), $input.value.split(""))
    $newActiveWord.children[$input.value.length]?.classList.add("active")
    if(!$newActiveWord.querySelector(".active")){
      $newActiveWord.lastElementChild.classList.add("last")
    } 
    $input.maxLength = $newActiveWord.childElementCount
    
    updateCaret($newActiveWord)
    
  }

  /**
   * 
   * @param {KeyboardEvent} key 
   */
  function onKeyUp(){
    let textInput = $input.value.split("")
    let $activeWord = $para.querySelector("word.active")
    let $letters = $activeWord.querySelectorAll("letter")
    // Checking if letter is correct
    checkLetter($letters, textInput)
    $activeWord.children[$input.selectionStart]?.classList.add("active")
    if(!$activeWord.querySelector(".active")){
      $activeWord.lastElementChild.classList.add("last")
    } 
    $para.querySelectorAll("word.typed").forEach((word) => {
      if(word.classList.contains("marked")){
        console.log("Marked");
      }
    })
    
    updateCaret($activeWord)
  }


  function startGame(){
    gameSarted = true
      


      onWriteNotFocus.forEach((el) => {
        el.style.transition = 'opacity .15s linear'
        el.addEventListener("transitionend", () => {
          el.style.transition = ""
        })
        if(el != $counter){
          el.classList.add("not-focused")
        } else {
          el.classList.remove("not-focused")
        }
      })
      $caret.style.animationPlayState = "paused"
      
      $counter.textContent = (settingsJson.gameMode == "words") ? "0/50" : ((settingsJson.gameMode == "time"?"0":""))
      timer = setInterval(() => {
        timerCount++
        if(settingsJson.gameMode == "time"){
          $counter.textContent = timerCount
          if(timerCount >= settingsJson.difficulty){
            gameOver()
          }
        }
      },1000)
  }
  
}












function initGame(){
  
  
  saveConfig()

  let contentCharged = new Promise((resolve) => {
    let prevOpacity = getComputedStyle($challengeSection).opacity
    $challengeSection.style.opacity = 0
    if(!(prevOpacity == $challengeSection.style.opacity)){
      $challengeSection.addEventListener("transitionend", function transitionEnd(){
        resolve()
        $challengeSection.removeEventListener("transitionend", transitionEnd)
      })
    } else {
      resolve()
    }
    
  }).then(() => {
    populateParagraph()
  }).then(() => {
    $challengeSection.style.opacity = 1
  })

  return new Promise((resolve) => {
    contentCharged.then(() => {
      resolve()
    })
  })


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


  // TODO:
  // - Mejor generacion de texto coherente
  // - Generacion de texto con puntuacion y numeros
  // - Generacion de texto en modo:
  //   =Zen
  //   =Custom
  //   =Quote
  // -Promesa que resuelva cuando el texto
  
  function populateParagraph(){
    let text = []


    for (let index = 0; index < wordsNum; index++) {
      text.push(randWord())
    }
    const currentText = text.map((word) => {
      let wordletters = word.split("")
      return word = 
      `<word>${wordletters.map((letter) => {
          return `<letter>${letter}</letter>`
        }).join("")}</word>`
  
      }).join("")

    $para.innerHTML = currentText
    $para.children[0].classList.add("active")
    $para.children[0].children[0].classList.add("active")
    updateCaret($para.querySelector("word.active"))
    return new Promise((resolve) => {
      resolve()
    })
  }

}
















function gameOver(){
  gameSarted = false
  gameFinished = true
  timer.clearInterval()
  $input.disabled = true
  $para.setAttribute("style","display: none")
  console.log("GAME OVER");
}






//Helper Functions =================================================================================






function checkLetter($letters, textInput){
  $letters.forEach(($letter, index) => {
    $letter.classList.remove("incorrect")
    $letter.classList.remove("correct")
    $letter.classList.remove("active")
    $letter.classList.remove("last")
    if($letter.textContent == textInput[index]){
      $letter.classList.add("correct")
    } else if(textInput[index] != undefined){
      $letter.classList.add("incorrect")
    } 
  })
}
function updateCaret($activeWord){
  let xPos;
  let yPos;
  if($activeWord.querySelector(".active")){
    let $activeLetter = $activeWord.querySelector(".active")
    let rect = $activeLetter.getBoundingClientRect()
    
    xPos = rect.x
    yPos = rect.y
    xPos -= $caret.getBoundingClientRect().width
  } else if($activeWord.querySelector(".last")){
    let $activeLetter = $activeWord.querySelector(".last")
    let rect = $activeLetter.getBoundingClientRect()

    xPos = rect.right
    yPos = rect.y
    xPos += $caret.getBoundingClientRect().width /2
  }
  let prevY = $caret.style.top
  let prevX = $caret.style.left
  $caret.style.top = yPos + "px"
  $caret.style.left = xPos + "px"
  return new Promise((resolve) => {
    if(prevY != $caret.style.top || prevX != $caret.style.left){
      $caret.addEventListener("transitionend", function transitionEnd() {
        resolve()
        $caret.removeEventListener("transitionEnd",transitionEnd, false)
      })
    } else {
      resolve()
    }
  })
}

/**
 * 
 * @param {HTMLElement} element The element to collapse
 * @param {int} desiredWidth The desired width in pixels
 */
function collapseElement(element, desiredWidth){
  
    element.style.width = getComputedStyle(element).width
    element.style.opacity = "0"

    /**
     * 
     * @param {TransitionEvent} event 
     * @param {Function} resolve 
     */

  return new Promise((resolve) => {
    element.addEventListener("transitionend", function transitionEnd(event){
      if(event.propertyName == "opacity"){
        element.offsetWidth // force repaint
        element.style.width = desiredWidth + 'px'
      }
      if(event.propertyName == "width"){
        element.style.opacity = ""
        element.setAttribute("hidden", "")
        resolve()
        element.removeEventListener("transitionend",transitionEnd,false)
        
      }
    })
  })
  
}

/**
 * 
 * @param {HTMLElement} element The element to expand
 */
function expandElement(element){

  let delay = getComputedStyle(element).transitionDuration.split(",")[0]
  element.offsetWidth // force repaint
  element.style.width = element.scrollWidth + "px"
  element.style.transitionDelay = delay
 

  function transitionEnd(event) {
    if (event.propertyName == 'width') {
      element.style.transitionDelay = ""
      element.style.width = 'auto'
      element.removeAttribute("hidden")
      element.removeEventListener('transitionend', transitionEnd,false)
    }
  }
  element.addEventListener('transitionend', transitionEnd,false)
}
document.addEventListener("DOMContentLoaded", () => {
  initPage()
  initGame()
})
