// TODO:
// - Mejor generacion de texto coherente
// - Generacion de texto con puntuacion y numeros
// - Generacion de texto en modo:
//   =Zen
//   =Custom
//   =Quote
// -Promesa que resuelva cuando el texto


function populateParagraph(){
    const text = randomTextArray()
    const paragraph = document.querySelector(".para")
    textWordsLength = text.length
    const currentText = text.map((word) => {
      let wordletters = word.split("")
      return word = 
      `<word>${wordletters.map((letter) => {
          return `<letter>${letter}</letter>`
        }).join("")}</word>`
  
      }).join("")
  
    paragraph.innerHTML = currentText
    paragraph.children[0].classList.add("active")
    paragraph.children[0].children[0].classList.add("active")
    updateCaret(paragraph.querySelector("word.active"))
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }
  
  function setActiveLetter() {
    
  }