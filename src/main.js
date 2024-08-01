import { onClickMenu } from "./components/optionsMenu.js"
import { onKeyUp, onKeyDown } from "./handlers/keyboardHandler.js"
import { styleInteractiveButtons } from "./util/styleButtons.js"
import { initGame } from "./components/typeChallenge.js"

document.addEventListener("DOMContentLoaded", () => {
  styleInteractiveButtons()

  document.querySelector(".options").addEventListener("click", onClickMenu)
  document.addEventListener("keydown", onKeyDown)
  document.addEventListener("keyup", onKeyUp) 
  initGame()
})
