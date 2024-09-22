export { onClickMenuButton, disableAllButtons, enableAllButtons };
import { resetActiveMode, observeNewMenuStates } from "./optionsMenu.js";

/**
 *
 * @param {HTMLButtonElement} button El botón de menú por inicializar
 */
function onClickMenuButton(button) {
  resetActiveMode(button);

  if (button.closest("menu").classList.item(0) == "punc_and_num") {
    button.classList.toggle("selected");
  } else if (button.closest("menu").classList.item(0) == "mode") {
    observeNewMenuStates(button);
  }
}

function disableAllButtons() {
  document
    .querySelector(".options")
    .querySelectorAll("button")
    .forEach((el) => el.setAttribute("disabled", ""));
}
function enableAllButtons() {
  document
    .querySelector(".options")
    .querySelectorAll("button")
    .forEach((el) => el.removeAttribute("disabled"));
}
