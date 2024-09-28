import { beginTransition } from "../util/transitions.js";

export { onLeaveTooltip, onHoverTooltip };

/**
 * Handles mouseenter event for elements that have a tooltip
 * @param {MouseEvent} event - mouse enter event
 */
function onHoverTooltip(event) {
	/**@type {HTMLElement} */
	let target = event.target;
	if (!target.closest(".tooltip")) {
		/**@type {HTMLElement} */
		let tooltip = event.currentTarget.querySelector(".tooltip");
		showTooltip(tooltip);
	}
}

/**
 * Handles mouseleave event for elements that have a tooltip
 * @param {MouseEvent} event - mouse leave event
 */
function onLeaveTooltip(event) {
	/**@type {HTMLElement} */
	let tooltip = event.currentTarget.querySelector(".tooltip");
	hideTooltip(tooltip);
}

/**
 * shows the an element tooltip
 * @param {HTMLElement} tooltip html element
 */
function showTooltip(tooltip) {
	tooltip.classList.add("show");
}

/**
 * hides the an element tooltip
 * @param {HTMLElement} tooltip html element
 */
function hideTooltip(tooltip) {
	tooltip.classList.remove("show");
}
