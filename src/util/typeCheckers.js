export {checkLetter}

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