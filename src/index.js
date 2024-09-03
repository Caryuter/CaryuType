import resultsChart from "./components/results-chart.js"
import { onClickMenu } from "./components/optionsMenu.js"
import { onKeyUp, onKeyDown } from "./handlers/keyboardHandler.js"
import { styleInteractiveButtons } from "./util/styleButtons.js"
import { prepareGame } from "./components/gameLogic.js"
import { onMouseMove } from "./handlers/mouseHandlers.js"

document.addEventListener("DOMContentLoaded", () => {
  styleInteractiveButtons()

  document.querySelector(".options").addEventListener("click", onClickMenu)
  document.addEventListener("keydown", onKeyDown)
  document.addEventListener("keyup", onKeyUp) 
  document.addEventListener("mousemove", onMouseMove)
  prepareGame()
})
