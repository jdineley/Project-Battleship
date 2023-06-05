// import GameBoard from "./modules/gameboard";
// import GameController from "./modules/gameController";
// import UI from "./modules/ui";
import generateUI from "./modules/ui";

// const playAgainButton = document.querySelector('.play-again button')
// const playAgainDiv = document.querySelector('.play-again')

// const game = GameBoard();

// const game = GameController('James')

// function startGame() {
//     return generateUI()
// }

// const UI = startGame()

// playAgainButton.addEventListener('click', (e) => {
//     playAgainDiv.classList.add('hidden')
//     UI = startGame()
// })

const UI = generateUI();

export default UI;

// game.printBoard()

window.battle = {
  game: UI.game,
  resetBoards: UI.resetBoards,
};

// window.battle = {
//     game
// }
