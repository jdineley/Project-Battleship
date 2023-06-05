/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/ui */ "./src/modules/ui.js");


const UI = (0,_modules_ui__WEBPACK_IMPORTED_MODULE_0__["default"])();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (UI);



/***/ }),

/***/ "./src/modules/cell.js":
/*!*****************************!*\
  !*** ./src/modules/cell.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cell)
/* harmony export */ });
function Cell(coord) {
  let hitBool = false;
  let ship = null;
  let offLimit = false;
  let value = 0;

  const isOffLimit = () => offLimit;

  const makeOffLimit = () => {
    offLimit = true;
  };

  const strike = () => {
    if (value === 0 || value === 1) {
      if (ship) {
        ship.strike();
        hitBool = true;
        value = 2;
      } else {
        console.log("MISS!!");
        hitBool = true;
        value = 3;
      }
      removeCoord();
      return value;
    }
    console.log("fire again, this square is already hit");
    return false;
  };

  const makeShip = (newShip) => {
    ship = newShip;
    value = 1;
  };

  const printValue = (player) => {
    if (player === "human") return value;
    else {
      if (value === 1) return 0;
      else return value;
    }
  };

  const getValue = () => value;

  const getShip = () => ship;

  const setValue = (newValue) => {
    value = newValue;
  };

  const getCoord = () => coord;

  const removeCoord = () => {
    coord = null;
  };

  const getHitBool = () => {
    return hitBool;
  };

  return {
    isOffLimit,
    makeOffLimit,
    strike,
    makeShip,
    getValue,
    setValue,
    getShip,
    getCoord,
    removeCoord,
    printValue,
    getHitBool,
  };
}


/***/ }),

/***/ "./src/modules/gameController.js":
/*!***************************************!*\
  !*** ./src/modules/gameController.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameController)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../index */ "./src/index.js");



function GameController(
  player1 = "Chuck",
  player2 = "computer"
) {
  let board1;
  let board2;
  let players;

  function makeBoards() {
    board1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
    board2 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
  }

  function makePlayers() {
    players = [
      {
        name: player1,
        targetBoard: board2,
        ownBoard: board1,
        targetShips: board2.ships,
        lastRound: {
          coords: null,
          shot: null,
        },
        hits: [],
      },
      {
        name: player2,
        targetBoard: board1,
        ownBoard: board2,
        targetShips: board1.ships,
        lastRound: {
          coords: null,
          shot: null,
        },
        hits: [],
      },
    ];
  }

  makeBoards();
  makePlayers();

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;
  const shipsLeft = () =>
    activePlayer.targetShips.map((ship) => ship.getSunk()).includes(false);
  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    _index__WEBPACK_IMPORTED_MODULE_1__["default"].highlightActivePLayer(activePlayer.name);
    if (activePlayer.name === "computer") {
      return setTimeout(computersTurn, 1000);
    }
  };
  const printNewRound = () => {
    console.log(`${getActivePlayer().name}'s turn.`);
    console.log("0 = no ship,  1 = ship,  2 = strike,  3 = miss");
    console.log(`${players[0].name}'s board`);
    board1.printBoard("human");
    console.log(`${players[1].name}'s board`);
    board2.printBoard("computer");
  };

  const playRound = (coords) => {
    console.log(
      `Dropping ${activePlayer.name}'s bomb onto coordinate ${coords}`
    );
    const hitValue = activePlayer.targetBoard.dropBomb(coords);

    if (hitValue) {
      activePlayer.lastRound.coords = coords;
      activePlayer.lastRound.shot = hitValue;
      activePlayer.hits.push(coords);
      const boardString =
        activePlayer.targetBoard === board1 ? "board1" : "board2";
      if (!shipsLeft()) {
        console.log(
          `${activePlayer.name} has distroyed all their opponents fleet`
        );
        _index__WEBPACK_IMPORTED_MODULE_1__["default"].renderBoard(boardString, activePlayer);
        return;
      }
      _index__WEBPACK_IMPORTED_MODULE_1__["default"].renderBoard(boardString);
      if (switchPlayer()) return;
    }
    console.log(players);

    printNewRound();
  };

  const computersTurn = () => {
    _index__WEBPACK_IMPORTED_MODULE_1__["default"].addHumanClickHandler();
    const coordsLeft = [];
    const targetBoard = activePlayer.targetBoard.getBoard();
    targetBoard
      .map((row) => row.map((cell) => cell.getCoord()))
      .map((row) =>
        row.forEach((coord) => {
          if (coord) coordsLeft.push(coord);
        })
      );
    const coordsLeftStringify = coordsLeft.map((coord) => coord.toString());
    console.log(coordsLeftStringify);

    function generalFoundHitProcessing(coord) {
      const hitType = checkHitType(coord);
      if (hitType === "single") return singleHitProcessing(coord);
      if (hitType === 0) {
        for (let i = 0; i < 4; i++) {
          if (coord[0] + i) {
            if (targetBoard[coord[1]][coord[0] + i].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          } else return singleHitProcessing(coord, hitType);
          if (
            coordsLeftStringify.includes([coord[0] + i, coord[1]].toString())
          ) {
            playRound([coord[0] + i, coord[1]]);
            return true;
          }
        }
        return singleHitProcessing(coord);
      }
      if (hitType === 1) {
        for (let i = 0; i < 4; i++) {
          if (coord[1] + i < 10) {
            if (targetBoard[coord[1] + i][coord[0]].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          } else return singleHitProcessing(coord, hitType);
          if (
            coordsLeftStringify.includes([coord[0], coord[1] + i].toString())
          ) {
            playRound([coord[0], coord[1] + i]);
            return true;
          }
        }
        return singleHitProcessing(coord);
      }
      if (hitType === 2) {
        for (let i = 0; i < 4; i++) {
          if (coord[0] - i > 0) {
            if (targetBoard[coord[1]][coord[0] - i].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          } else return singleHitProcessing(coord, hitType);
          if (
            coordsLeftStringify.includes([coord[0] - i, coord[1]].toString())
          ) {
            playRound([coord[0] - i, coord[1]]);
            return true;
          }
        }
        return singleHitProcessing(coord);
      }
      if (hitType === 3) {
        for (let i = 0; i < 4; i++) {
          if (coord[1] - i > 0) {
            if (targetBoard[coord[1] - i][coord[0]].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          } else return singleHitProcessing(coord, hitType);
          if (
            coordsLeftStringify.includes([coord[0], coord[1] - i].toString())
          ) {
            playRound([coord[0], coord[1] - i]);
            return true;
          }
        }
        return singleHitProcessing(coord);
      }
    }

    if (
      activePlayer.lastRound.shot === 2 &&
      !targetBoard[activePlayer.lastRound.coords[1]][
        activePlayer.lastRound.coords[0]
      ]
        .getShip()
        .getSunk()
    ) {
      let coords = activePlayer.lastRound.coords;
      return generalFoundHitProcessing(coords);
    }
    return processFindFirstUnsunkStruckShip();

    function processFindFirstUnsunkStruckShip() {
      function findFirstUnSunkStruckShip() {
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            if (
              targetBoard[i][j].getValue() === 2 &&
              !targetBoard[i][j].getShip().getSunk()
            )
              return [j, i];
          }
        }
        return false;
      }

      const foundUnsunkStuckShip = findFirstUnSunkStruckShip();

      if (foundUnsunkStuckShip) {
        return generalFoundHitProcessing(foundUnsunkStuckShip);
      }

      console.log("general random hit");
      return generalRandomHit();
    }

    // Three hit types (all ships that are unsunk):
    // 1. Single hit (no neighbour within 3 squares)
    // 2. Multiple adjacent hits
    // 3. Separated hits (no further than 3 squares)
    function checkHitType(coord) {
      console.log("checking hit type", coord);
      console.log("active player hits", activePlayer.hits);
      const unsunkHitShips = activePlayer.hits
        .filter((hit) => targetBoard[hit[1]][hit[0]].getShip())
        .filter((hit) => !targetBoard[hit[1]][hit[0]].getShip().getSunk());
      console.log("unsunk ships", unsunkHitShips);
      const unsunkHitShipsStringified = unsunkHitShips.map((cord) =>
        cord.toString()
      );
      //loop from 3 - 6 - 9 - 12 O'clock
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 2; j++) {
          if (i === 0) {
            console.log("3 Oclock");
            if (
              unsunkHitShipsStringified.includes(
                [coord[0] + j, coord[1]].toString()
              )
            ) {
              return i;
            }
          }
          if (i === 2) {
            console.log("9 Oclock");

            if (
              unsunkHitShipsStringified.includes(
                [coord[0] - j, coord[1]].toString()
              )
            ) {
              return i;
            }
          }
          if (i === 1) {
            console.log("6 Oclock");

            if (
              unsunkHitShipsStringified.includes(
                [coord[0], coord[1] + j].toString()
              )
            ) {
              return i;
            }
          }
          if (i === 3) {
            console.log("12 Oclock");
            if (
              unsunkHitShipsStringified.includes(
                [coord[0], coord[1] - j].toString()
              )
            ) {
              return i;
            }
          }
        }
      }
      return "single";
    }

    function singleHitProcessing(coord, hitType = null) {
      console.log("Single hit processing", coord, hitType);
      let shootNearOffset;
      switch (hitType) {
        case null:
          shootNearOffset = [
            [0, -1],
            [1, 0],
            [0, 1],
            [-1, 0],
          ];
          break;
        case 0:
        case 2:
          shootNearOffset = [
            [1, 0],
            [-1, 0],
          ];
          break;
        case 1:
        case 3:
          shootNearOffset = [
            [0, -1],
            [0, 1],
          ];
          break;
      }

      console.log(shootNearOffset);

      function getRandomSurroundIndex() {
        return Math.floor(Math.random() * 4);
      }
      const surroundingSquares = [];
      shootNearOffset.forEach((offset) => {
        surroundingSquares.push([coord[0] + offset[0], coord[1] + offset[1]]);
      });

      //implement better logic for selecting a surrounding square
      //1. filter the surrounding squares to be only the squares left in the unhit area
      //2. then randomly select square from filter array
      const surroundingSquaresStringify = surroundingSquares.map((square) =>
        square.toString()
      );
      const surroundingSquaresAvailable = surroundingSquaresStringify
        .filter((square) => coordsLeftStringify.includes(square))
        .map((square) => [+square[0], +square[2]]);

      console.log("surroundingSquaresAvailable", surroundingSquaresAvailable);

      if (surroundingSquaresAvailable.length > 0) {
        playRound(surroundingSquaresAvailable[0]);
        return true;
      } else {
        generalRandomHit();
      }
    }

    function generalRandomHit() {
      console.log("skipped");
      const randomIndex = Math.floor(Math.random() * coordsLeft.length);
      playRound(coordsLeft[randomIndex]);
      return true;
    }
  };

  printNewRound();

  return {
    playRound,
    board1,
    board2,
    getActivePlayer,
  };
}


/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameBoard)
/* harmony export */ });
/* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cell */ "./src/modules/cell.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");



function GameBoard() {
  const rows = 10;
  const columns = 10;
  const board = [];
  const ships = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push((0,_cell__WEBPACK_IMPORTED_MODULE_0__["default"])([j, i]));
    }
  }

  const getBoard = () => board;

  function printBoard(player) {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.printValue(player))
    );
    console.log(boardWithCellValues);
  }

  function randomShipOrigin(length) {
    const startCoords = [];
    function randomOrientation() {
      return Math.random() < 0.5 ? "H" : "V";
    }
    const orient = randomOrientation();
    function randomY() {
      if (orient === "V") {
        const newRows = rows - length;
        return Math.floor(Math.random() * newRows);
      }
      return Math.floor(Math.random() * rows);
    }
    function randomX() {
      if (orient === "H") {
        const newColumns = columns - length;
        return Math.floor(Math.random() * newColumns);
      }
      return Math.floor(Math.random() * columns);
    }

    startCoords.push(randomX(), randomY());
    return [startCoords, orient];
  }

  function makeCellsOfflimits(startCoord, orient, length) {
    if (orient === "H") {
      for (let i = startCoord[0] - 1; i < startCoord[0] - 1 + length + 2; i++) {
        for (let j = startCoord[1] - 1; j < startCoord[1] - 1 + 3; j++) {
          if (i >= 0 && j >= 0 && i <= 9 && j <= 9) {
            board[j][i].makeOffLimit();
          }
        }
      }
    } else if (orient === "V") {
      for (let i = startCoord[0] - 1; i < startCoord[0] - 1 + 3; i++) {
        for (
          let j = startCoord[1] - 1;
          j < startCoord[1] - 1 + length + 2;
          j++
        ) {
          if (i >= 0 && j >= 0 && i <= 9 && j <= 9) {
            board[j][i].makeOffLimit();
          }
        }
      }
    }
  }

  function placeShips(length) {
    const shipRandomOrigin = randomShipOrigin(length);
    const ship = (0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(length);

    const offLimitCheck = [];

    if (shipRandomOrigin[1] === "V") {
      for (
        let i = shipRandomOrigin[0][1];
        i < shipRandomOrigin[0][1] + length;
        i++
      ) {
        offLimitCheck.push(board[i][shipRandomOrigin[0][0]].isOffLimit());
      }
      if (offLimitCheck.includes(true)) {
        return false;
      }

      for (
        let i = shipRandomOrigin[0][1];
        i < shipRandomOrigin[0][1] + length;
        i++
      ) {
        board[i][shipRandomOrigin[0][0]].makeShip(ship);
        ships.push(ship);
      }
      makeCellsOfflimits(shipRandomOrigin[0], shipRandomOrigin[1], length);
      return true;
    }
    for (
      let i = shipRandomOrigin[0][0];
      i < shipRandomOrigin[0][0] + length;
      i++
    ) {
      offLimitCheck.push(board[shipRandomOrigin[0][1]][i].isOffLimit());
    }
    if (offLimitCheck.includes(true)) {
      return false;
    }

    for (
      let i = shipRandomOrigin[0][0];
      i < shipRandomOrigin[0][0] + length;
      i++
    ) {
      board[shipRandomOrigin[0][1]][i].makeShip(ship);
      ships.push(ship);
    }
    makeCellsOfflimits(shipRandomOrigin[0], shipRandomOrigin[1], length);
    return true;
  }

  while (!placeShips(4)) {
    console.log(4);
  }
  while (!placeShips(4)) {
    console.log(4);
  }
  while (!placeShips(3)) {
    console.log(3);
  }
  while (!placeShips(3)) {
    console.log(3);
  }
  while (!placeShips(2)) {
    console.log(2);
  }
  while (!placeShips(2)) {
    console.log(2);
  }
  while (!placeShips(1)) {
    console.log(1);
  }
  while (!placeShips(1)) {
    console.log(1);
  }

  const dropBomb = (coord) => {
    if (coord[0] > 9 || coord[0] < 0 || coord[1] > 9 || coord[1] < 0) {
      console.log("Out of range, fire again!");
      return;
    }
    const square = board[coord[1]][coord[0]];
    return square.strike();
  };

  return {
    printBoard,
    dropBomb,
    ships,
    getBoard,
    rows,
    columns,
  };
}


/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
function Ship(length) {
  let numHit = 0;
  let sunk = false;

  const strike = () => {
    numHit++;
    console.log(
      `STRIKE!!!! ${numHit} square(s) of ship length: ${length} destroyed. ${
        length - numHit
      } left to destroy`
    );
    if (numHit === length) sunk = true;
  };

  const getNumHit = () => numHit;

  const getSunk = () => sunk;

  return {
    strike,
    getNumHit,
    getSunk,
    length,
  };
}


/***/ }),

/***/ "./src/modules/ui.js":
/*!***************************!*\
  !*** ./src/modules/ui.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generateUI)
/* harmony export */ });
/* harmony import */ var _gameController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameController */ "./src/modules/gameController.js");


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

function generateUI() {
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    humanH2.textContent = nameInput.value || "Chuck Noris";
    main.classList.remove("hidden");
    playAgainDiv.classList.remove("hidden");
    playerNameForm.classList.add("hidden");
  });

  let game = (0,_gameController__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
    game = (0,_gameController__WEBPACK_IMPORTED_MODULE_0__["default"])();
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0M7O0FBRXRDLFdBQVcsdURBQVU7O0FBRXJCLGlFQUFlLEVBQUUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0pIO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFFb0M7QUFDVjs7QUFFWDtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsc0RBQVM7QUFDdEIsYUFBYSxzREFBUztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9FQUF3QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVCQUF1QjtBQUMxQztBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0IsMEJBQTBCLE9BQU87QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQSxRQUFRLDBEQUFjO0FBQ3RCO0FBQ0E7QUFDQSxNQUFNLDBEQUFjO0FBQ3BCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxtRUFBdUI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NlbGwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvdWkuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZW5lcmF0ZVVJIGZyb20gXCIuL21vZHVsZXMvdWlcIjtcblxuY29uc3QgVUkgPSBnZW5lcmF0ZVVJKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFVJO1xuXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDZWxsKGNvb3JkKSB7XG4gIGxldCBoaXRCb29sID0gZmFsc2U7XG4gIGxldCBzaGlwID0gbnVsbDtcbiAgbGV0IG9mZkxpbWl0ID0gZmFsc2U7XG4gIGxldCB2YWx1ZSA9IDA7XG5cbiAgY29uc3QgaXNPZmZMaW1pdCA9ICgpID0+IG9mZkxpbWl0O1xuXG4gIGNvbnN0IG1ha2VPZmZMaW1pdCA9ICgpID0+IHtcbiAgICBvZmZMaW1pdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc3RyaWtlID0gKCkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMSkge1xuICAgICAgaWYgKHNoaXApIHtcbiAgICAgICAgc2hpcC5zdHJpa2UoKTtcbiAgICAgICAgaGl0Qm9vbCA9IHRydWU7XG4gICAgICAgIHZhbHVlID0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTUlTUyEhXCIpO1xuICAgICAgICBoaXRCb29sID0gdHJ1ZTtcbiAgICAgICAgdmFsdWUgPSAzO1xuICAgICAgfVxuICAgICAgcmVtb3ZlQ29vcmQoKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJmaXJlIGFnYWluLCB0aGlzIHNxdWFyZSBpcyBhbHJlYWR5IGhpdFwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgbWFrZVNoaXAgPSAobmV3U2hpcCkgPT4ge1xuICAgIHNoaXAgPSBuZXdTaGlwO1xuICAgIHZhbHVlID0gMTtcbiAgfTtcblxuICBjb25zdCBwcmludFZhbHVlID0gKHBsYXllcikgPT4ge1xuICAgIGlmIChwbGF5ZXIgPT09IFwiaHVtYW5cIikgcmV0dXJuIHZhbHVlO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHZhbHVlID09PSAxKSByZXR1cm4gMDtcbiAgICAgIGVsc2UgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBnZXRWYWx1ZSA9ICgpID0+IHZhbHVlO1xuXG4gIGNvbnN0IGdldFNoaXAgPSAoKSA9PiBzaGlwO1xuXG4gIGNvbnN0IHNldFZhbHVlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgfTtcblxuICBjb25zdCBnZXRDb29yZCA9ICgpID0+IGNvb3JkO1xuXG4gIGNvbnN0IHJlbW92ZUNvb3JkID0gKCkgPT4ge1xuICAgIGNvb3JkID0gbnVsbDtcbiAgfTtcblxuICBjb25zdCBnZXRIaXRCb29sID0gKCkgPT4ge1xuICAgIHJldHVybiBoaXRCb29sO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNPZmZMaW1pdCxcbiAgICBtYWtlT2ZmTGltaXQsXG4gICAgc3RyaWtlLFxuICAgIG1ha2VTaGlwLFxuICAgIGdldFZhbHVlLFxuICAgIHNldFZhbHVlLFxuICAgIGdldFNoaXAsXG4gICAgZ2V0Q29vcmQsXG4gICAgcmVtb3ZlQ29vcmQsXG4gICAgcHJpbnRWYWx1ZSxcbiAgICBnZXRIaXRCb29sLFxuICB9O1xufVxuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBVSSBmcm9tIFwiLi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIoXG4gIHBsYXllcjEgPSBcIkNodWNrXCIsXG4gIHBsYXllcjIgPSBcImNvbXB1dGVyXCJcbikge1xuICBsZXQgYm9hcmQxO1xuICBsZXQgYm9hcmQyO1xuICBsZXQgcGxheWVycztcblxuICBmdW5jdGlvbiBtYWtlQm9hcmRzKCkge1xuICAgIGJvYXJkMSA9IEdhbWVCb2FyZCgpO1xuICAgIGJvYXJkMiA9IEdhbWVCb2FyZCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVBsYXllcnMoKSB7XG4gICAgcGxheWVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogcGxheWVyMSxcbiAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMixcbiAgICAgICAgb3duQm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgdGFyZ2V0U2hpcHM6IGJvYXJkMi5zaGlwcyxcbiAgICAgICAgbGFzdFJvdW5kOiB7XG4gICAgICAgICAgY29vcmRzOiBudWxsLFxuICAgICAgICAgIHNob3Q6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIGhpdHM6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogcGxheWVyMixcbiAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgb3duQm9hcmQ6IGJvYXJkMixcbiAgICAgICAgdGFyZ2V0U2hpcHM6IGJvYXJkMS5zaGlwcyxcbiAgICAgICAgbGFzdFJvdW5kOiB7XG4gICAgICAgICAgY29vcmRzOiBudWxsLFxuICAgICAgICAgIHNob3Q6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIGhpdHM6IFtdLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgbWFrZUJvYXJkcygpO1xuICBtYWtlUGxheWVycygpO1xuXG4gIGxldCBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXJzWzBdO1xuICBjb25zdCBnZXRBY3RpdmVQbGF5ZXIgPSAoKSA9PiBhY3RpdmVQbGF5ZXI7XG4gIGNvbnN0IHNoaXBzTGVmdCA9ICgpID0+XG4gICAgYWN0aXZlUGxheWVyLnRhcmdldFNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5nZXRTdW5rKCkpLmluY2x1ZGVzKGZhbHNlKTtcbiAgY29uc3Qgc3dpdGNoUGxheWVyID0gKCkgPT4ge1xuICAgIGFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyc1swXSA/IHBsYXllcnNbMV0gOiBwbGF5ZXJzWzBdO1xuICAgIFVJLmhpZ2hsaWdodEFjdGl2ZVBMYXllcihhY3RpdmVQbGF5ZXIubmFtZSk7XG4gICAgaWYgKGFjdGl2ZVBsYXllci5uYW1lID09PSBcImNvbXB1dGVyXCIpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGNvbXB1dGVyc1R1cm4sIDEwMDApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcHJpbnROZXdSb3VuZCA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgJHtnZXRBY3RpdmVQbGF5ZXIoKS5uYW1lfSdzIHR1cm4uYCk7XG4gICAgY29uc29sZS5sb2coXCIwID0gbm8gc2hpcCwgIDEgPSBzaGlwLCAgMiA9IHN0cmlrZSwgIDMgPSBtaXNzXCIpO1xuICAgIGNvbnNvbGUubG9nKGAke3BsYXllcnNbMF0ubmFtZX0ncyBib2FyZGApO1xuICAgIGJvYXJkMS5wcmludEJvYXJkKFwiaHVtYW5cIik7XG4gICAgY29uc29sZS5sb2coYCR7cGxheWVyc1sxXS5uYW1lfSdzIGJvYXJkYCk7XG4gICAgYm9hcmQyLnByaW50Qm9hcmQoXCJjb21wdXRlclwiKTtcbiAgfTtcblxuICBjb25zdCBwbGF5Um91bmQgPSAoY29vcmRzKSA9PiB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgRHJvcHBpbmcgJHthY3RpdmVQbGF5ZXIubmFtZX0ncyBib21iIG9udG8gY29vcmRpbmF0ZSAke2Nvb3Jkc31gXG4gICAgKTtcbiAgICBjb25zdCBoaXRWYWx1ZSA9IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZC5kcm9wQm9tYihjb29yZHMpO1xuXG4gICAgaWYgKGhpdFZhbHVlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3JkcyA9IGNvb3JkcztcbiAgICAgIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuc2hvdCA9IGhpdFZhbHVlO1xuICAgICAgYWN0aXZlUGxheWVyLmhpdHMucHVzaChjb29yZHMpO1xuICAgICAgY29uc3QgYm9hcmRTdHJpbmcgPVxuICAgICAgICBhY3RpdmVQbGF5ZXIudGFyZ2V0Qm9hcmQgPT09IGJvYXJkMSA/IFwiYm9hcmQxXCIgOiBcImJvYXJkMlwiO1xuICAgICAgaWYgKCFzaGlwc0xlZnQoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgJHthY3RpdmVQbGF5ZXIubmFtZX0gaGFzIGRpc3Ryb3llZCBhbGwgdGhlaXIgb3Bwb25lbnRzIGZsZWV0YFxuICAgICAgICApO1xuICAgICAgICBVSS5yZW5kZXJCb2FyZChib2FyZFN0cmluZywgYWN0aXZlUGxheWVyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgVUkucmVuZGVyQm9hcmQoYm9hcmRTdHJpbmcpO1xuICAgICAgaWYgKHN3aXRjaFBsYXllcigpKSByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHBsYXllcnMpO1xuXG4gICAgcHJpbnROZXdSb3VuZCgpO1xuICB9O1xuXG4gIGNvbnN0IGNvbXB1dGVyc1R1cm4gPSAoKSA9PiB7XG4gICAgVUkuYWRkSHVtYW5DbGlja0hhbmRsZXIoKTtcbiAgICBjb25zdCBjb29yZHNMZWZ0ID0gW107XG4gICAgY29uc3QgdGFyZ2V0Qm9hcmQgPSBhY3RpdmVQbGF5ZXIudGFyZ2V0Qm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICB0YXJnZXRCb2FyZFxuICAgICAgLm1hcCgocm93KSA9PiByb3cubWFwKChjZWxsKSA9PiBjZWxsLmdldENvb3JkKCkpKVxuICAgICAgLm1hcCgocm93KSA9PlxuICAgICAgICByb3cuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAgICAgICBpZiAoY29vcmQpIGNvb3Jkc0xlZnQucHVzaChjb29yZCk7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIGNvbnN0IGNvb3Jkc0xlZnRTdHJpbmdpZnkgPSBjb29yZHNMZWZ0Lm1hcCgoY29vcmQpID0+IGNvb3JkLnRvU3RyaW5nKCkpO1xuICAgIGNvbnNvbGUubG9nKGNvb3Jkc0xlZnRTdHJpbmdpZnkpO1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhjb29yZCkge1xuICAgICAgY29uc3QgaGl0VHlwZSA9IGNoZWNrSGl0VHlwZShjb29yZCk7XG4gICAgICBpZiAoaGl0VHlwZSA9PT0gXCJzaW5nbGVcIikgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQpO1xuICAgICAgaWYgKGhpdFR5cGUgPT09IDApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICBpZiAoY29vcmRbMF0gKyBpKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Qm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdICsgaV0uZ2V0VmFsdWUoKSA9PT0gMylcbiAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgICAgIH0gZWxzZSByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0gKyBpLCBjb29yZFsxXV0udG9TdHJpbmcoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0gKyBpLCBjb29yZFsxXV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaXRUeXBlID09PSAxKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzFdICsgaSA8IDEwKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Qm9hcmRbY29vcmRbMV0gKyBpXVtjb29yZFswXV0uZ2V0VmFsdWUoKSA9PT0gMylcbiAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgICAgIH0gZWxzZSByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0sIGNvb3JkWzFdICsgaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0sIGNvb3JkWzFdICsgaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaXRUeXBlID09PSAyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzBdIC0gaSA+IDApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXV1bY29vcmRbMF0gLSBpXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBjb29yZHNMZWZ0U3RyaW5naWZ5LmluY2x1ZGVzKFtjb29yZFswXSAtIGksIGNvb3JkWzFdXS50b1N0cmluZygpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcGxheVJvdW5kKFtjb29yZFswXSAtIGksIGNvb3JkWzFdXSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQpO1xuICAgICAgfVxuICAgICAgaWYgKGhpdFR5cGUgPT09IDMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICBpZiAoY29vcmRbMV0gLSBpID4gMCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldEJvYXJkW2Nvb3JkWzFdIC0gaV1bY29vcmRbMF1dLmdldFZhbHVlKCkgPT09IDMpXG4gICAgICAgICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGNvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoW2Nvb3JkWzBdLCBjb29yZFsxXSAtIGldLnRvU3RyaW5nKCkpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwbGF5Um91bmQoW2Nvb3JkWzBdLCBjb29yZFsxXSAtIGldKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID09PSAyICYmXG4gICAgICAhdGFyZ2V0Qm9hcmRbYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHNbMV1dW1xuICAgICAgICBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3Jkc1swXVxuICAgICAgXVxuICAgICAgICAuZ2V0U2hpcCgpXG4gICAgICAgIC5nZXRTdW5rKClcbiAgICApIHtcbiAgICAgIGxldCBjb29yZHMgPSBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3JkcztcbiAgICAgIHJldHVybiBnZW5lcmFsRm91bmRIaXRQcm9jZXNzaW5nKGNvb3Jkcyk7XG4gICAgfVxuICAgIHJldHVybiBwcm9jZXNzRmluZEZpcnN0VW5zdW5rU3RydWNrU2hpcCgpO1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0ZpbmRGaXJzdFVuc3Vua1N0cnVja1NoaXAoKSB7XG4gICAgICBmdW5jdGlvbiBmaW5kRmlyc3RVblN1bmtTdHJ1Y2tTaGlwKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGFyZ2V0Qm9hcmRbaV1bal0uZ2V0VmFsdWUoKSA9PT0gMiAmJlxuICAgICAgICAgICAgICAhdGFyZ2V0Qm9hcmRbaV1bal0uZ2V0U2hpcCgpLmdldFN1bmsoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICByZXR1cm4gW2osIGldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvdW5kVW5zdW5rU3R1Y2tTaGlwID0gZmluZEZpcnN0VW5TdW5rU3RydWNrU2hpcCgpO1xuXG4gICAgICBpZiAoZm91bmRVbnN1bmtTdHVja1NoaXApIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYWxGb3VuZEhpdFByb2Nlc3NpbmcoZm91bmRVbnN1bmtTdHVja1NoaXApO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcImdlbmVyYWwgcmFuZG9tIGhpdFwiKTtcbiAgICAgIHJldHVybiBnZW5lcmFsUmFuZG9tSGl0KCk7XG4gICAgfVxuXG4gICAgLy8gVGhyZWUgaGl0IHR5cGVzIChhbGwgc2hpcHMgdGhhdCBhcmUgdW5zdW5rKTpcbiAgICAvLyAxLiBTaW5nbGUgaGl0IChubyBuZWlnaGJvdXIgd2l0aGluIDMgc3F1YXJlcylcbiAgICAvLyAyLiBNdWx0aXBsZSBhZGphY2VudCBoaXRzXG4gICAgLy8gMy4gU2VwYXJhdGVkIGhpdHMgKG5vIGZ1cnRoZXIgdGhhbiAzIHNxdWFyZXMpXG4gICAgZnVuY3Rpb24gY2hlY2tIaXRUeXBlKGNvb3JkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImNoZWNraW5nIGhpdCB0eXBlXCIsIGNvb3JkKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYWN0aXZlIHBsYXllciBoaXRzXCIsIGFjdGl2ZVBsYXllci5oaXRzKTtcbiAgICAgIGNvbnN0IHVuc3Vua0hpdFNoaXBzID0gYWN0aXZlUGxheWVyLmhpdHNcbiAgICAgICAgLmZpbHRlcigoaGl0KSA9PiB0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpKVxuICAgICAgICAuZmlsdGVyKChoaXQpID0+ICF0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpLmdldFN1bmsoKSk7XG4gICAgICBjb25zb2xlLmxvZyhcInVuc3VuayBzaGlwc1wiLCB1bnN1bmtIaXRTaGlwcyk7XG4gICAgICBjb25zdCB1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkID0gdW5zdW5rSGl0U2hpcHMubWFwKChjb3JkKSA9PlxuICAgICAgICBjb3JkLnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgICAvL2xvb3AgZnJvbSAzIC0gNiAtIDkgLSAxMiBPJ2Nsb2NrXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDI7IGorKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjMgT2Nsb2NrXCIpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgIFtjb29yZFswXSArIGosIGNvb3JkWzFdXS50b1N0cmluZygpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPT09IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiOSBPY2xvY2tcIik7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdW5zdW5rSGl0U2hpcHNTdHJpbmdpZmllZC5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICBbY29vcmRbMF0gLSBqLCBjb29yZFsxXV0udG9TdHJpbmcoKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjYgT2Nsb2NrXCIpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgW2Nvb3JkWzBdLCBjb29yZFsxXSArIGpdLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA9PT0gMykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIxMiBPY2xvY2tcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgW2Nvb3JkWzBdLCBjb29yZFsxXSAtIGpdLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFwic2luZ2xlXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSA9IG51bGwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU2luZ2xlIGhpdCBwcm9jZXNzaW5nXCIsIGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgIGxldCBzaG9vdE5lYXJPZmZzZXQ7XG4gICAgICBzd2l0Y2ggKGhpdFR5cGUpIHtcbiAgICAgICAgY2FzZSBudWxsOlxuICAgICAgICAgIHNob290TmVhck9mZnNldCA9IFtcbiAgICAgICAgICAgIFswLCAtMV0sXG4gICAgICAgICAgICBbMSwgMF0sXG4gICAgICAgICAgICBbMCwgMV0sXG4gICAgICAgICAgICBbLTEsIDBdLFxuICAgICAgICAgIF07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNob290TmVhck9mZnNldCA9IFtcbiAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2hvb3ROZWFyT2Zmc2V0ID0gW1xuICAgICAgICAgICAgWzAsIC0xXSxcbiAgICAgICAgICAgIFswLCAxXSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhzaG9vdE5lYXJPZmZzZXQpO1xuXG4gICAgICBmdW5jdGlvbiBnZXRSYW5kb21TdXJyb3VuZEluZGV4KCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICB9XG4gICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXMgPSBbXTtcbiAgICAgIHNob290TmVhck9mZnNldC5mb3JFYWNoKChvZmZzZXQpID0+IHtcbiAgICAgICAgc3Vycm91bmRpbmdTcXVhcmVzLnB1c2goW2Nvb3JkWzBdICsgb2Zmc2V0WzBdLCBjb29yZFsxXSArIG9mZnNldFsxXV0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vaW1wbGVtZW50IGJldHRlciBsb2dpYyBmb3Igc2VsZWN0aW5nIGEgc3Vycm91bmRpbmcgc3F1YXJlXG4gICAgICAvLzEuIGZpbHRlciB0aGUgc3Vycm91bmRpbmcgc3F1YXJlcyB0byBiZSBvbmx5IHRoZSBzcXVhcmVzIGxlZnQgaW4gdGhlIHVuaGl0IGFyZWFcbiAgICAgIC8vMi4gdGhlbiByYW5kb21seSBzZWxlY3Qgc3F1YXJlIGZyb20gZmlsdGVyIGFycmF5XG4gICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXNTdHJpbmdpZnkgPSBzdXJyb3VuZGluZ1NxdWFyZXMubWFwKChzcXVhcmUpID0+XG4gICAgICAgIHNxdWFyZS50b1N0cmluZygpXG4gICAgICApO1xuICAgICAgY29uc3Qgc3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlID0gc3Vycm91bmRpbmdTcXVhcmVzU3RyaW5naWZ5XG4gICAgICAgIC5maWx0ZXIoKHNxdWFyZSkgPT4gY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhzcXVhcmUpKVxuICAgICAgICAubWFwKChzcXVhcmUpID0+IFsrc3F1YXJlWzBdLCArc3F1YXJlWzJdXSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlXCIsIHN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZSk7XG5cbiAgICAgIGlmIChzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGUubGVuZ3RoID4gMCkge1xuICAgICAgICBwbGF5Um91bmQoc3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlWzBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW5lcmFsUmFuZG9tSGl0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhbFJhbmRvbUhpdCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic2tpcHBlZFwiKTtcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29vcmRzTGVmdC5sZW5ndGgpO1xuICAgICAgcGxheVJvdW5kKGNvb3Jkc0xlZnRbcmFuZG9tSW5kZXhdKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBwcmludE5ld1JvdW5kKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbGF5Um91bmQsXG4gICAgYm9hcmQxLFxuICAgIGJvYXJkMixcbiAgICBnZXRBY3RpdmVQbGF5ZXIsXG4gIH07XG59XG4iLCJpbXBvcnQgQ2VsbCBmcm9tIFwiLi9jZWxsXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgY29uc3Qgcm93cyA9IDEwO1xuICBjb25zdCBjb2x1bW5zID0gMTA7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICBib2FyZFtpXSA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICBib2FyZFtpXS5wdXNoKENlbGwoW2osIGldKSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZDtcblxuICBmdW5jdGlvbiBwcmludEJvYXJkKHBsYXllcikge1xuICAgIGNvbnN0IGJvYXJkV2l0aENlbGxWYWx1ZXMgPSBib2FyZC5tYXAoKHJvdykgPT5cbiAgICAgIHJvdy5tYXAoKGNlbGwpID0+IGNlbGwucHJpbnRWYWx1ZShwbGF5ZXIpKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coYm9hcmRXaXRoQ2VsbFZhbHVlcyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0Q29vcmRzID0gW107XG4gICAgZnVuY3Rpb24gcmFuZG9tT3JpZW50YXRpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiSFwiIDogXCJWXCI7XG4gICAgfVxuICAgIGNvbnN0IG9yaWVudCA9IHJhbmRvbU9yaWVudGF0aW9uKCk7XG4gICAgZnVuY3Rpb24gcmFuZG9tWSgpIHtcbiAgICAgIGlmIChvcmllbnQgPT09IFwiVlwiKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd3MgPSByb3dzIC0gbGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmV3Um93cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcm93cyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmRvbVgoKSB7XG4gICAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgICBjb25zdCBuZXdDb2x1bW5zID0gY29sdW1ucyAtIGxlbmd0aDtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5ld0NvbHVtbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbHVtbnMpO1xuICAgIH1cblxuICAgIHN0YXJ0Q29vcmRzLnB1c2gocmFuZG9tWCgpLCByYW5kb21ZKCkpO1xuICAgIHJldHVybiBbc3RhcnRDb29yZHMsIG9yaWVudF07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQ2VsbHNPZmZsaW1pdHMoc3RhcnRDb29yZCwgb3JpZW50LCBsZW5ndGgpIHtcbiAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0Q29vcmRbMF0gLSAxOyBpIDwgc3RhcnRDb29yZFswXSAtIDEgKyBsZW5ndGggKyAyOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29vcmRbMV0gLSAxOyBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyAzOyBqKyspIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJWXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydENvb3JkWzBdIC0gMTsgaSA8IHN0YXJ0Q29vcmRbMF0gLSAxICsgMzsgaSsrKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGogPSBzdGFydENvb3JkWzFdIC0gMTtcbiAgICAgICAgICBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIGorK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKGxlbmd0aCkge1xuICAgIGNvbnN0IHNoaXBSYW5kb21PcmlnaW4gPSByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCk7XG4gICAgY29uc3Qgc2hpcCA9IFNoaXAobGVuZ3RoKTtcblxuICAgIGNvbnN0IG9mZkxpbWl0Q2hlY2sgPSBbXTtcblxuICAgIGlmIChzaGlwUmFuZG9tT3JpZ2luWzFdID09PSBcIlZcIikge1xuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdO1xuICAgICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVsxXSArIGxlbmd0aDtcbiAgICAgICAgaSsrXG4gICAgICApIHtcbiAgICAgICAgb2ZmTGltaXRDaGVjay5wdXNoKGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLmlzT2ZmTGltaXQoKSk7XG4gICAgICB9XG4gICAgICBpZiAob2ZmTGltaXRDaGVjay5pbmNsdWRlcyh0cnVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVsxXTtcbiAgICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMV0gKyBsZW5ndGg7XG4gICAgICAgIGkrK1xuICAgICAgKSB7XG4gICAgICAgIGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLm1ha2VTaGlwKHNoaXApO1xuICAgICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgfVxuICAgICAgbWFrZUNlbGxzT2ZmbGltaXRzKHNoaXBSYW5kb21PcmlnaW5bMF0sIHNoaXBSYW5kb21PcmlnaW5bMV0sIGxlbmd0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZm9yIChcbiAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVswXTtcbiAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdICsgbGVuZ3RoO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBvZmZMaW1pdENoZWNrLnB1c2goYm9hcmRbc2hpcFJhbmRvbU9yaWdpblswXVsxXV1baV0uaXNPZmZMaW1pdCgpKTtcbiAgICB9XG4gICAgaWYgKG9mZkxpbWl0Q2hlY2suaW5jbHVkZXModHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdO1xuICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMF0gKyBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGJvYXJkW3NoaXBSYW5kb21PcmlnaW5bMF1bMV1dW2ldLm1ha2VTaGlwKHNoaXApO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICB9XG4gICAgbWFrZUNlbGxzT2ZmbGltaXRzKHNoaXBSYW5kb21PcmlnaW5bMF0sIHNoaXBSYW5kb21PcmlnaW5bMV0sIGxlbmd0aCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB3aGlsZSAoIXBsYWNlU2hpcHMoNCkpIHtcbiAgICBjb25zb2xlLmxvZyg0KTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoNCkpIHtcbiAgICBjb25zb2xlLmxvZyg0KTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMykpIHtcbiAgICBjb25zb2xlLmxvZygzKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMykpIHtcbiAgICBjb25zb2xlLmxvZygzKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMikpIHtcbiAgICBjb25zb2xlLmxvZygyKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMikpIHtcbiAgICBjb25zb2xlLmxvZygyKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMSkpIHtcbiAgICBjb25zb2xlLmxvZygxKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMSkpIHtcbiAgICBjb25zb2xlLmxvZygxKTtcbiAgfVxuXG4gIGNvbnN0IGRyb3BCb21iID0gKGNvb3JkKSA9PiB7XG4gICAgaWYgKGNvb3JkWzBdID4gOSB8fCBjb29yZFswXSA8IDAgfHwgY29vcmRbMV0gPiA5IHx8IGNvb3JkWzFdIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coXCJPdXQgb2YgcmFuZ2UsIGZpcmUgYWdhaW4hXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzcXVhcmUgPSBib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIHJldHVybiBzcXVhcmUuc3RyaWtlKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwcmludEJvYXJkLFxuICAgIGRyb3BCb21iLFxuICAgIHNoaXBzLFxuICAgIGdldEJvYXJkLFxuICAgIHJvd3MsXG4gICAgY29sdW1ucyxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGxldCBudW1IaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0cmlrZSA9ICgpID0+IHtcbiAgICBudW1IaXQrKztcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBTVFJJS0UhISEhICR7bnVtSGl0fSBzcXVhcmUocykgb2Ygc2hpcCBsZW5ndGg6ICR7bGVuZ3RofSBkZXN0cm95ZWQuICR7XG4gICAgICAgIGxlbmd0aCAtIG51bUhpdFxuICAgICAgfSBsZWZ0IHRvIGRlc3Ryb3lgXG4gICAgKTtcbiAgICBpZiAobnVtSGl0ID09PSBsZW5ndGgpIHN1bmsgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGdldE51bUhpdCA9ICgpID0+IG51bUhpdDtcblxuICBjb25zdCBnZXRTdW5rID0gKCkgPT4gc3VuaztcblxuICByZXR1cm4ge1xuICAgIHN0cmlrZSxcbiAgICBnZXROdW1IaXQsXG4gICAgZ2V0U3VuayxcbiAgICBsZW5ndGgsXG4gIH07XG59XG4iLCJpbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vZ2FtZUNvbnRyb2xsZXJcIjtcblxuY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbmNvbnN0IGNvbXB1dGVySDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyID4gaDJcIik7XG5jb25zdCBodW1hbkgyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5odW1hbiA+IGgyXCIpO1xuY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuY29uc3QgcGxheWVyTmFtZUZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKTtcbmNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbmNvbnN0IHBsYXlBZ2FpbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheS1hZ2FpbiA+IGJ1dHRvblwiKTtcbmNvbnN0IHBsYXlBZ2FpbkRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheS1hZ2FpblwiKTtcbmNvbnN0IHBsYXllclRpdGxlc0gyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImgyXCIpO1xuY29uc3Qgd2lubmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJcIik7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdlbmVyYXRlVUkoKSB7XG4gIHBsYXllck5hbWVGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGUpID0+IHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaHVtYW5IMi50ZXh0Q29udGVudCA9IG5hbWVJbnB1dC52YWx1ZSB8fCBcIkNodWNrIE5vcmlzXCI7XG4gICAgbWFpbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIHBsYXlBZ2FpbkRpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIHBsYXllck5hbWVGb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0pO1xuXG4gIGxldCBnYW1lID0gR2FtZUNvbnRyb2xsZXIoKTtcbiAgZnVuY3Rpb24gaW5pdChib2FyZCwgYm9hcmROdW0pIHtcbiAgICBnYW1lW2JvYXJkXS5nZXRCb2FyZCgpLmZvckVhY2goKHJvdywgaSkgPT5cbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBqKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICBjZWxsRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtY29vcmRcIiwgW2osIGldKTtcbiAgICAgICAgYm9hcmRzW2JvYXJkTnVtXS5hcHBlbmRDaGlsZChjZWxsRGl2KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckJvYXJkKGJvYXJkLCB3aW5uZXIgPSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coXCJyZW5kZXJpbmdcIiwgYm9hcmQpO1xuICAgIGlmICh3aW5uZXIpIHtcbiAgICAgIGNvbnN0IHdpbm5lck5hbWUgPVxuICAgICAgICB3aW5uZXIubmFtZSA9PT0gXCJjb21wdXRlclwiID8gXCJjb21wdXRlclwiIDogaHVtYW5IMi50ZXh0Q29udGVudDtcbiAgICAgIHdpbm5lckRpdi50ZXh0Q29udGVudCA9IGAke3dpbm5lck5hbWV9IHdpbnMhIGhhdmluZyBzdW5rIGFsbCB0aGVpciBvcHBvbmVudCdzIGZsZWV0YDtcbiAgICAgIGJvYXJkc1sxXVxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpKTtcbiAgICB9XG4gICAgY29uc3QgYm9hcmREaXYgPSBib2FyZCA9PT0gXCJib2FyZDFcIiA/IGJvYXJkc1swXSA6IGJvYXJkc1sxXTtcbiAgICBnYW1lW2JvYXJkXS5nZXRCb2FyZCgpLmZvckVhY2goKHJvdywgaSkgPT5cbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBqKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldENlbGwgPSBib2FyZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBkaXZbZGF0YS1jb29yZD1cIiR7an0sJHtpfVwiXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGJvYXJkICE9PSBcImJvYXJkMlwiKSB7XG4gICAgICAgICAgaWYgKGNlbGwuZ2V0U2hpcCgpKSB7XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjZWxsLmdldFNoaXAoKSAmJiBjZWxsLmdldEhpdEJvb2woKSkge1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXAtaGl0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbGwuZ2V0U2hpcCgpICYmIGNlbGwuZ2V0U2hpcCgpLmdldFN1bmsoKSkge1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LnJlbW92ZShcInNoaXAtaGl0XCIpO1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXAtc3Vua1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjZWxsLmdldEhpdEJvb2woKSAmJiAhY2VsbC5nZXRTaGlwKCkpXG4gICAgICAgICAgdGFyZ2V0Q2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgY29uc3QgaGlnaGxpZ2h0QWN0aXZlUExheWVyID0gKHBsYXllcikgPT4ge1xuICAgIHBsYXllclRpdGxlc0gyLmZvckVhY2goKHRpdGxlKSA9PiB7XG4gICAgICB0aXRsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIH0pO1xuICAgIGNvbnN0IGFjdGl2ZVRpdGxlID0gcGxheWVyID09PSBcImNvbXB1dGVyXCIgPyBjb21wdXRlckgyIDogaHVtYW5IMjtcbiAgICBhY3RpdmVUaXRsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgY29uc29sZS5sb2coXCJoYW5kbGVcIik7XG4gICAgY29uc3QgY29vcmRzID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKTtcbiAgICBjb25zb2xlLmxvZyhbK2Nvb3Jkc1swXSwgK2Nvb3Jkc1syXV0pO1xuICAgIGdhbWUucGxheVJvdW5kKFsrY29vcmRzWzBdLCArY29vcmRzWzJdXSk7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH1cblxuICBjb25zdCBhY3RpdmVUaXRsZSA9XG4gICAgZ2FtZS5nZXRBY3RpdmVQbGF5ZXIoKS5uYW1lID09PSBcImNvbXB1dGVyXCIgPyBjb21wdXRlckgyIDogaHVtYW5IMjtcbiAgYWN0aXZlVGl0bGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgaW5pdChcImJvYXJkMVwiLCAwKTtcbiAgaW5pdChcImJvYXJkMlwiLCAxKTtcbiAgcmVuZGVyQm9hcmQoXCJib2FyZDFcIik7XG4gIHJlbmRlckJvYXJkKFwiYm9hcmQyXCIpO1xuXG4gIC8vIEV2ZW50IEJpbmRpbmdcbiAgY29uc3QgYWRkSHVtYW5DbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH07XG4gIGFkZEh1bWFuQ2xpY2tIYW5kbGVyKCk7XG5cbiAgY29uc3QgcmVzZXRCb2FyZHMgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJyZXNldCBVSVwiKTtcbiAgICBib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICAgIGJvYXJkLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9KTtcbiAgICBnYW1lID0gR2FtZUNvbnRyb2xsZXIoKTtcbiAgICBpbml0KFwiYm9hcmQxXCIsIDApO1xuICAgIGluaXQoXCJib2FyZDJcIiwgMSk7XG4gICAgcmVuZGVyQm9hcmQoXCJib2FyZDFcIik7XG4gICAgcmVuZGVyQm9hcmQoXCJib2FyZDJcIik7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH07XG5cbiAgcGxheUFnYWluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZXNldEJvYXJkcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBnYW1lLFxuICAgIHJlbmRlckJvYXJkLFxuICAgIHJlc2V0Qm9hcmRzLFxuICAgIGFkZEh1bWFuQ2xpY2tIYW5kbGVyLFxuICAgIGhpZ2hsaWdodEFjdGl2ZVBMYXllcixcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=