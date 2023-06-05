import GameController from "./gameController";

const boards = document.querySelectorAll(".board");
const computerH2 = document.querySelector(".computer > h2");
const humanH2 = document.querySelector(".human > h2");
const nameInput = document.querySelector("input");
const playerNameForm = document.querySelector("form");
const main = document.querySelector("main");
const playAgainButton = document.querySelector(".play-again > button");
const playAgainDiv = document.querySelector(".play-again");
const playerTitlesH2 = document.querySelectorAll("h2");
const winnerDiv = document.querySelector(".winner");

export default function generateUI() {
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    humanH2.textContent = nameInput.value || "Chuck Noris";
    main.classList.remove("hidden");
    playAgainDiv.classList.remove("hidden");
    playerNameForm.classList.add("hidden");
  });

  let game = GameController();
  function init(board, boardNum) {
    game[board].getBoard().forEach((row, i) =>
      row.forEach((cell, j) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.setAttribute("data-coord", [j, i]);
        boards[boardNum].appendChild(cellDiv);
      })
    );
  }

  function renderBoard(board, winner = null) {
    console.log("rendering", board);
    if (winner) {
      const winnerName =
        winner.name === "computer" ? "computer" : humanH2.textContent;
      winnerDiv.textContent = `${winnerName} wins! having sunk all their opponent's fleet`;
      boards[1]
        .querySelectorAll(".cell")
        .forEach((cell) => cell.removeEventListener("click", clickHandler));
    }
    const boardDiv = board === "board1" ? boards[0] : boards[1];
    game[board].getBoard().forEach((row, i) =>
      row.forEach((cell, j) => {
        const targetCell = boardDiv.querySelector(
          `div[data-coord="${j},${i}"]`
        );
        if (board !== "board2") {
          if (cell.getShip()) {
            targetCell.classList.add("ship");
          }
        }

        if (cell.getShip() && cell.getHitBool()) {
          targetCell.classList.add("ship-hit");
        }

        if (cell.getShip() && cell.getShip().getSunk()) {
          targetCell.classList.remove("ship-hit");
          targetCell.classList.add("ship-sunk");
        }

        if (cell.getHitBool() && !cell.getShip())
          targetCell.classList.add("hit");
      })
    );
  }

  const highlightActivePLayer = (player) => {
    playerTitlesH2.forEach((title) => {
      title.classList.remove("active");
    });
    const activeTitle = player === "computer" ? computerH2 : humanH2;
    activeTitle.classList.add("active");
  };

  function clickHandler(e) {
    console.log("handle");
    const coords = e.target.getAttribute("data-coord");
    console.log([+coords[0], +coords[2]]);
    game.playRound([+coords[0], +coords[2]]);
    boards[1]
      .querySelectorAll(".cell")
      .forEach((cell) => cell.removeEventListener("click", clickHandler));
  }

  const activeTitle =
    game.getActivePlayer().name === "computer" ? computerH2 : humanH2;
  activeTitle.classList.add("active");
  init("board1", 0);
  init("board2", 1);
  renderBoard("board1");
  renderBoard("board2");

  // Event Binding
  const addHumanClickHandler = () => {
    boards[1]
      .querySelectorAll(".cell")
      .forEach((cell) => cell.addEventListener("click", clickHandler));
  };
  addHumanClickHandler();

  const resetBoards = () => {
    console.log("reset UI");
    boards.forEach((board) => {
      board.textContent = "";
    });
    winnerDiv.textContent = ""
    game = GameController();
    init("board1", 0);
    init("board2", 1);
    renderBoard("board1");
    renderBoard("board2");
    boards[1]
      .querySelectorAll(".cell")
      .forEach((cell) => cell.addEventListener("click", clickHandler));
  };

  playAgainButton.addEventListener("click", resetBoards);

  return {
    game,
    renderBoard,
    resetBoards,
    addHumanClickHandler,
    highlightActivePLayer,
  };
}
