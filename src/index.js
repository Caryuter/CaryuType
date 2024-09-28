import resultsChart from "./components/results-chart.js";
import { onClickMenu } from "./components/optionsMenu.js";
import { onKeyUp, onKeyDown } from "./handlers/keyboardHandler.js";
import { styleInteractiveButtons } from "./util/styleButtons.js";
import { prepareGame } from "./components/gameLogic.js";
import { onMouseMove } from "./handlers/mouseHandlers.js";
import { onHoverTooltip, onLeaveTooltip } from "./components/tooltip.js";

document.addEventListener("DOMContentLoaded", () => {
	styleInteractiveButtons();

	document.querySelector(".options").addEventListener("click", onClickMenu);
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("keyup", onKeyUp);
	document.addEventListener("mousemove", onMouseMove);
	document.querySelectorAll(".tooltip").forEach((el) => {
		el.parentElement.addEventListener("mouseover", onHoverTooltip);
		el.parentElement.addEventListener("mouseout", onLeaveTooltip);
	});

	prepareGame();
});
