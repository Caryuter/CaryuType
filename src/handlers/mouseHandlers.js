export {onMouseMove}
import { gameHasStarted, pauseGame} from "../components/gameLogic.js";

/**
 * @param {MouseEvent} event 
 */
function onMouseMove(event){
    if(gameHasStarted()){
        pauseGame()
    }
}