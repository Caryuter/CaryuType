import { updateCaret } from "../components/caret"
import { gameOver, startGame } from "../components/typeChallenge"
import { checkLetter } from "../util/typeCheckers"

export {onKeyUp, onKeyDown, disableInput}


/**
   * 
   * @param {KeyboardEvent} key 
   */
function onKeyUp(){
    let textInput = $input.value.split("")
    let $activeWord = $para.querySelector("word.active")
    let $letters = $activeWord.querySelectorAll("letter")
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

  function disableInput(){

  }