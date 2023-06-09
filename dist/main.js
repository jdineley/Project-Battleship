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
      // removeCoord();
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
    }
    console.log(players);
    if (switchPlayer()) return;
    printNewRound();
  };

  const computersTurn = () => {
    _index__WEBPACK_IMPORTED_MODULE_1__["default"].addHumanClickHandler();
    const surroundingSquares = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1,1],
      [-1, -1],
      [-1, 0],
    ];
    const coordsLeft = [];
    const coordsSunkShips = [];
    const sunkShipsCoordsOffLimits = [];
    const targetBoard = activePlayer.targetBoard.getBoard();

    targetBoard.forEach((row) =>
      row.forEach((cell) => {
        if (!cell.getHitBool()) coordsLeft.push(cell.getCoord());
      })
    );
    targetBoard.forEach((row) =>
      row.forEach((cell) => {
        if (cell.getShip()) {
          if (cell.getShip().getSunk()) coordsSunkShips.push(cell.getCoord());
        }
      })
    );
    console.log(coordsSunkShips);
    if (coordsSunkShips.length > 0) {
      coordsSunkShips.forEach((coord) => {
        surroundingSquares.forEach((offset) => {
          if (
            coord[0] + offset[0] >= 0 &&
            coord[0] + offset[0] <= 9 &&
            coord[1] + offset[1] >= 0 &&
            coord[1] + offset[1] <= 9
          ) {
            sunkShipsCoordsOffLimits.push([
              coord[0] + offset[0],
              coord[1] + offset[1],
            ]);
          }
        });
      });
    }
    //
    const sunkShipsCoordsOffLimitsStringify = sunkShipsCoordsOffLimits.map(
      (coord) => coord.toString()
    );
    const sunkShipsCoordsOffLimitsStringifyNoDups =
      sunkShipsCoordsOffLimitsStringify.filter((coord, i, arr) => {
        if (arr.indexOf(coord) === i) return coord;
      });
    const coordsLeftStringify = coordsLeft.map((coord) => coord.toString());
    // coordsLeftStringify - sunkShipsCoordsOffLimitsStringifyNoDups:
    const realCoordsLeftStringify = coordsLeftStringify.filter(
      (coord, i, arr) => {
        if (sunkShipsCoordsOffLimitsStringifyNoDups.indexOf(coord) === -1)
          return coord;
      }
    );
    console.log(coordsLeftStringify, realCoordsLeftStringify);
    const realCoordsLeft = realCoordsLeftStringify.map((coords) => {
      return [+coords[0], +coords[2]];
    });
    console.log(realCoordsLeft);

    function generalFoundHitProcessing(coord) {
      const hitType = checkHitType(coord);
      if (hitType === "single") return singleHitProcessing(coord);
      if (hitType === 0) {
        for (let i = 0; i < 4; i++) {
          if (coord[0] + i < 10) {
            if (targetBoard[coord[1]][coord[0] + i].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          if (
            realCoordsLeftStringify.includes(
              [coord[0] + i, coord[1]].toString()
            )
          ) {
            playRound([coord[0] + i, coord[1]]);
            return true;
          }
        } 
        }
        return singleHitProcessing(coord, hitType);
      }
      if (hitType === 1) {
        for (let i = 0; i < 4; i++) {
          if (coord[1] + i < 10) {
            if (targetBoard[coord[1] + i][coord[0]].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          if (
            realCoordsLeftStringify.includes(
              [coord[0], coord[1] + i].toString()
            )
          ) {
            playRound([coord[0], coord[1] + i]);
            return true;
          }
        } 
        }
        return singleHitProcessing(coord, hitType);
      }
      if (hitType === 2) {
        for (let i = 0; i < 4; i++) {
          if (coord[0] - i >= 0) {
            if (targetBoard[coord[1]][coord[0] - i].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          if (
            realCoordsLeftStringify.includes(
              [coord[0] - i, coord[1]].toString()
            )
          ) {
            playRound([coord[0] - i, coord[1]]);
            return true;
          }
        } 
        }
        return singleHitProcessing(coord, hitType);
      }
      if (hitType === 3) {
        for (let i = 0; i < 4; i++) {
          if (coord[1] - i >= 0) {
            if (targetBoard[coord[1] - i][coord[0]].getValue() === 3)
              return singleHitProcessing(coord, hitType);
          if (
            realCoordsLeftStringify.includes(
              [coord[0], coord[1] - i].toString()
            )
          ) {
            playRound([coord[0], coord[1] - i]);
            return true;
          }
        } 
        }
        return singleHitProcessing(coord, hitType);
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

      // function getRandomSurroundIndex() {
      //   return Math.floor(Math.random() * 4);
      // }
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
        .filter((square) => realCoordsLeftStringify.includes(square))
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
      const randomIndex = Math.floor(Math.random() * realCoordsLeft.length);
      playRound(realCoordsLeft[randomIndex]);
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
const instructionDiv = document.querySelector(".instruction")

function generateUI() {
  playerNameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    humanH2.textContent = nameInput.value || "Chuck Noris";
    main.classList.remove("hidden");
    instructionDiv.classList.remove("hidden")
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
    winnerDiv.textContent = "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQywwQkFBMEIsUUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsT0FBTztBQUM3Qix3QkFBd0IsT0FBTztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FB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O0FBQ0E7Ozs7Ozs7VUNwSUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY2VsbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91aS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdlbmVyYXRlVUkgZnJvbSBcIi4vbW9kdWxlcy91aVwiO1xuXG5jb25zdCBVSSA9IGdlbmVyYXRlVUkoKTtcblxuZXhwb3J0IGRlZmF1bHQgVUk7XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDZWxsKGNvb3JkKSB7XG4gIGxldCBoaXRCb29sID0gZmFsc2U7XG4gIGxldCBzaGlwID0gbnVsbDtcbiAgbGV0IG9mZkxpbWl0ID0gZmFsc2U7XG4gIGxldCB2YWx1ZSA9IDA7XG5cbiAgY29uc3QgaXNPZmZMaW1pdCA9ICgpID0+IG9mZkxpbWl0O1xuXG4gIGNvbnN0IG1ha2VPZmZMaW1pdCA9ICgpID0+IHtcbiAgICBvZmZMaW1pdCA9IHRydWU7XG4gIH07XG5cbiAgY29uc3Qgc3RyaWtlID0gKCkgPT4ge1xuICAgIGlmICh2YWx1ZSA9PT0gMCB8fCB2YWx1ZSA9PT0gMSkge1xuICAgICAgaWYgKHNoaXApIHtcbiAgICAgICAgc2hpcC5zdHJpa2UoKTtcbiAgICAgICAgaGl0Qm9vbCA9IHRydWU7XG4gICAgICAgIHZhbHVlID0gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTUlTUyEhXCIpO1xuICAgICAgICBoaXRCb29sID0gdHJ1ZTtcbiAgICAgICAgdmFsdWUgPSAzO1xuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlQ29vcmQoKTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJmaXJlIGFnYWluLCB0aGlzIHNxdWFyZSBpcyBhbHJlYWR5IGhpdFwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgbWFrZVNoaXAgPSAobmV3U2hpcCkgPT4ge1xuICAgIHNoaXAgPSBuZXdTaGlwO1xuICAgIHZhbHVlID0gMTtcbiAgfTtcblxuICBjb25zdCBwcmludFZhbHVlID0gKHBsYXllcikgPT4ge1xuICAgIGlmIChwbGF5ZXIgPT09IFwiaHVtYW5cIikgcmV0dXJuIHZhbHVlO1xuICAgIGVsc2Uge1xuICAgICAgaWYgKHZhbHVlID09PSAxKSByZXR1cm4gMDtcbiAgICAgIGVsc2UgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBnZXRWYWx1ZSA9ICgpID0+IHZhbHVlO1xuXG4gIGNvbnN0IGdldFNoaXAgPSAoKSA9PiBzaGlwO1xuXG4gIGNvbnN0IHNldFZhbHVlID0gKG5ld1ZhbHVlKSA9PiB7XG4gICAgdmFsdWUgPSBuZXdWYWx1ZTtcbiAgfTtcblxuICBjb25zdCBnZXRDb29yZCA9ICgpID0+IGNvb3JkO1xuXG4gIGNvbnN0IHJlbW92ZUNvb3JkID0gKCkgPT4ge1xuICAgIGNvb3JkID0gbnVsbDtcbiAgfTtcblxuICBjb25zdCBnZXRIaXRCb29sID0gKCkgPT4ge1xuICAgIHJldHVybiBoaXRCb29sO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNPZmZMaW1pdCxcbiAgICBtYWtlT2ZmTGltaXQsXG4gICAgc3RyaWtlLFxuICAgIG1ha2VTaGlwLFxuICAgIGdldFZhbHVlLFxuICAgIHNldFZhbHVlLFxuICAgIGdldFNoaXAsXG4gICAgZ2V0Q29vcmQsXG4gICAgcmVtb3ZlQ29vcmQsXG4gICAgcHJpbnRWYWx1ZSxcbiAgICBnZXRIaXRCb29sLFxuICB9O1xufVxuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBVSSBmcm9tIFwiLi4vaW5kZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIoXG4gIHBsYXllcjEgPSBcIkNodWNrXCIsXG4gIHBsYXllcjIgPSBcImNvbXB1dGVyXCJcbikge1xuICBsZXQgYm9hcmQxO1xuICBsZXQgYm9hcmQyO1xuICBsZXQgcGxheWVycztcblxuICBmdW5jdGlvbiBtYWtlQm9hcmRzKCkge1xuICAgIGJvYXJkMSA9IEdhbWVCb2FyZCgpO1xuICAgIGJvYXJkMiA9IEdhbWVCb2FyZCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFrZVBsYXllcnMoKSB7XG4gICAgcGxheWVycyA9IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogcGxheWVyMSxcbiAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMixcbiAgICAgICAgb3duQm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgdGFyZ2V0U2hpcHM6IGJvYXJkMi5zaGlwcyxcbiAgICAgICAgbGFzdFJvdW5kOiB7XG4gICAgICAgICAgY29vcmRzOiBudWxsLFxuICAgICAgICAgIHNob3Q6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIGhpdHM6IFtdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogcGxheWVyMixcbiAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgb3duQm9hcmQ6IGJvYXJkMixcbiAgICAgICAgdGFyZ2V0U2hpcHM6IGJvYXJkMS5zaGlwcyxcbiAgICAgICAgbGFzdFJvdW5kOiB7XG4gICAgICAgICAgY29vcmRzOiBudWxsLFxuICAgICAgICAgIHNob3Q6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICAgIGhpdHM6IFtdLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG5cbiAgbWFrZUJvYXJkcygpO1xuICBtYWtlUGxheWVycygpO1xuXG4gIGxldCBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXJzWzBdO1xuICBjb25zdCBnZXRBY3RpdmVQbGF5ZXIgPSAoKSA9PiBhY3RpdmVQbGF5ZXI7XG4gIGNvbnN0IHNoaXBzTGVmdCA9ICgpID0+XG4gICAgYWN0aXZlUGxheWVyLnRhcmdldFNoaXBzLm1hcCgoc2hpcCkgPT4gc2hpcC5nZXRTdW5rKCkpLmluY2x1ZGVzKGZhbHNlKTtcbiAgY29uc3Qgc3dpdGNoUGxheWVyID0gKCkgPT4ge1xuICAgIGFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyc1swXSA/IHBsYXllcnNbMV0gOiBwbGF5ZXJzWzBdO1xuICAgIFVJLmhpZ2hsaWdodEFjdGl2ZVBMYXllcihhY3RpdmVQbGF5ZXIubmFtZSk7XG4gICAgaWYgKGFjdGl2ZVBsYXllci5uYW1lID09PSBcImNvbXB1dGVyXCIpIHtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KGNvbXB1dGVyc1R1cm4sIDEwMDApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgcHJpbnROZXdSb3VuZCA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgJHtnZXRBY3RpdmVQbGF5ZXIoKS5uYW1lfSdzIHR1cm4uYCk7XG4gICAgY29uc29sZS5sb2coXCIwID0gbm8gc2hpcCwgIDEgPSBzaGlwLCAgMiA9IHN0cmlrZSwgIDMgPSBtaXNzXCIpO1xuICAgIGNvbnNvbGUubG9nKGAke3BsYXllcnNbMF0ubmFtZX0ncyBib2FyZGApO1xuICAgIGJvYXJkMS5wcmludEJvYXJkKFwiaHVtYW5cIik7XG4gICAgY29uc29sZS5sb2coYCR7cGxheWVyc1sxXS5uYW1lfSdzIGJvYXJkYCk7XG4gICAgYm9hcmQyLnByaW50Qm9hcmQoXCJjb21wdXRlclwiKTtcbiAgfTtcblxuICBjb25zdCBwbGF5Um91bmQgPSAoY29vcmRzKSA9PiB7XG4gICAgY29uc29sZS5sb2coXG4gICAgICBgRHJvcHBpbmcgJHthY3RpdmVQbGF5ZXIubmFtZX0ncyBib21iIG9udG8gY29vcmRpbmF0ZSAke2Nvb3Jkc31gXG4gICAgKTtcbiAgICBjb25zdCBoaXRWYWx1ZSA9IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZC5kcm9wQm9tYihjb29yZHMpO1xuXG4gICAgaWYgKGhpdFZhbHVlKSB7XG4gICAgICBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3JkcyA9IGNvb3JkcztcbiAgICAgIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuc2hvdCA9IGhpdFZhbHVlO1xuICAgICAgYWN0aXZlUGxheWVyLmhpdHMucHVzaChjb29yZHMpO1xuICAgICAgY29uc3QgYm9hcmRTdHJpbmcgPVxuICAgICAgICBhY3RpdmVQbGF5ZXIudGFyZ2V0Qm9hcmQgPT09IGJvYXJkMSA/IFwiYm9hcmQxXCIgOiBcImJvYXJkMlwiO1xuICAgICAgaWYgKCFzaGlwc0xlZnQoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgJHthY3RpdmVQbGF5ZXIubmFtZX0gaGFzIGRpc3Ryb3llZCBhbGwgdGhlaXIgb3Bwb25lbnRzIGZsZWV0YFxuICAgICAgICApO1xuICAgICAgICBVSS5yZW5kZXJCb2FyZChib2FyZFN0cmluZywgYWN0aXZlUGxheWVyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgVUkucmVuZGVyQm9hcmQoYm9hcmRTdHJpbmcpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhwbGF5ZXJzKTtcbiAgICBpZiAoc3dpdGNoUGxheWVyKCkpIHJldHVybjtcbiAgICBwcmludE5ld1JvdW5kKCk7XG4gIH07XG5cbiAgY29uc3QgY29tcHV0ZXJzVHVybiA9ICgpID0+IHtcbiAgICBVSS5hZGRIdW1hbkNsaWNrSGFuZGxlcigpO1xuICAgIGNvbnN0IHN1cnJvdW5kaW5nU3F1YXJlcyA9IFtcbiAgICAgIFswLCAtMV0sXG4gICAgICBbMSwgLTFdLFxuICAgICAgWzEsIDBdLFxuICAgICAgWzEsIDFdLFxuICAgICAgWzAsIDFdLFxuICAgICAgWy0xLDFdLFxuICAgICAgWy0xLCAtMV0sXG4gICAgICBbLTEsIDBdLFxuICAgIF07XG4gICAgY29uc3QgY29vcmRzTGVmdCA9IFtdO1xuICAgIGNvbnN0IGNvb3Jkc1N1bmtTaGlwcyA9IFtdO1xuICAgIGNvbnN0IHN1bmtTaGlwc0Nvb3Jkc09mZkxpbWl0cyA9IFtdO1xuICAgIGNvbnN0IHRhcmdldEJvYXJkID0gYWN0aXZlUGxheWVyLnRhcmdldEJvYXJkLmdldEJvYXJkKCk7XG5cbiAgICB0YXJnZXRCb2FyZC5mb3JFYWNoKChyb3cpID0+XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBpZiAoIWNlbGwuZ2V0SGl0Qm9vbCgpKSBjb29yZHNMZWZ0LnB1c2goY2VsbC5nZXRDb29yZCgpKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0YXJnZXRCb2FyZC5mb3JFYWNoKChyb3cpID0+XG4gICAgICByb3cuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBpZiAoY2VsbC5nZXRTaGlwKCkpIHtcbiAgICAgICAgICBpZiAoY2VsbC5nZXRTaGlwKCkuZ2V0U3VuaygpKSBjb29yZHNTdW5rU2hpcHMucHVzaChjZWxsLmdldENvb3JkKCkpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG4gICAgY29uc29sZS5sb2coY29vcmRzU3Vua1NoaXBzKTtcbiAgICBpZiAoY29vcmRzU3Vua1NoaXBzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvb3Jkc1N1bmtTaGlwcy5mb3JFYWNoKChjb29yZCkgPT4ge1xuICAgICAgICBzdXJyb3VuZGluZ1NxdWFyZXMuZm9yRWFjaCgob2Zmc2V0KSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgY29vcmRbMF0gKyBvZmZzZXRbMF0gPj0gMCAmJlxuICAgICAgICAgICAgY29vcmRbMF0gKyBvZmZzZXRbMF0gPD0gOSAmJlxuICAgICAgICAgICAgY29vcmRbMV0gKyBvZmZzZXRbMV0gPj0gMCAmJlxuICAgICAgICAgICAgY29vcmRbMV0gKyBvZmZzZXRbMV0gPD0gOVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzLnB1c2goW1xuICAgICAgICAgICAgICBjb29yZFswXSArIG9mZnNldFswXSxcbiAgICAgICAgICAgICAgY29vcmRbMV0gKyBvZmZzZXRbMV0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8vXG4gICAgY29uc3Qgc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzU3RyaW5naWZ5ID0gc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzLm1hcChcbiAgICAgIChjb29yZCkgPT4gY29vcmQudG9TdHJpbmcoKVxuICAgICk7XG4gICAgY29uc3Qgc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzU3RyaW5naWZ5Tm9EdXBzID1cbiAgICAgIHN1bmtTaGlwc0Nvb3Jkc09mZkxpbWl0c1N0cmluZ2lmeS5maWx0ZXIoKGNvb3JkLCBpLCBhcnIpID0+IHtcbiAgICAgICAgaWYgKGFyci5pbmRleE9mKGNvb3JkKSA9PT0gaSkgcmV0dXJuIGNvb3JkO1xuICAgICAgfSk7XG4gICAgY29uc3QgY29vcmRzTGVmdFN0cmluZ2lmeSA9IGNvb3Jkc0xlZnQubWFwKChjb29yZCkgPT4gY29vcmQudG9TdHJpbmcoKSk7XG4gICAgLy8gY29vcmRzTGVmdFN0cmluZ2lmeSAtIHN1bmtTaGlwc0Nvb3Jkc09mZkxpbWl0c1N0cmluZ2lmeU5vRHVwczpcbiAgICBjb25zdCByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeSA9IGNvb3Jkc0xlZnRTdHJpbmdpZnkuZmlsdGVyKFxuICAgICAgKGNvb3JkLCBpLCBhcnIpID0+IHtcbiAgICAgICAgaWYgKHN1bmtTaGlwc0Nvb3Jkc09mZkxpbWl0c1N0cmluZ2lmeU5vRHVwcy5pbmRleE9mKGNvb3JkKSA9PT0gLTEpXG4gICAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgfVxuICAgICk7XG4gICAgY29uc29sZS5sb2coY29vcmRzTGVmdFN0cmluZ2lmeSwgcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkpO1xuICAgIGNvbnN0IHJlYWxDb29yZHNMZWZ0ID0gcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkubWFwKChjb29yZHMpID0+IHtcbiAgICAgIHJldHVybiBbK2Nvb3Jkc1swXSwgK2Nvb3Jkc1syXV07XG4gICAgfSk7XG4gICAgY29uc29sZS5sb2cocmVhbENvb3Jkc0xlZnQpO1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhjb29yZCkge1xuICAgICAgY29uc3QgaGl0VHlwZSA9IGNoZWNrSGl0VHlwZShjb29yZCk7XG4gICAgICBpZiAoaGl0VHlwZSA9PT0gXCJzaW5nbGVcIikgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQpO1xuICAgICAgaWYgKGhpdFR5cGUgPT09IDApIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICBpZiAoY29vcmRbMF0gKyBpIDwgMTApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXV1bY29vcmRbMF0gKyBpXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoXG4gICAgICAgICAgICAgIFtjb29yZFswXSArIGksIGNvb3JkWzFdXS50b1N0cmluZygpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwbGF5Um91bmQoW2Nvb3JkWzBdICsgaSwgY29vcmRbMV1dKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICB9XG4gICAgICBpZiAoaGl0VHlwZSA9PT0gMSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgIGlmIChjb29yZFsxXSArIGkgPCAxMCkge1xuICAgICAgICAgICAgaWYgKHRhcmdldEJvYXJkW2Nvb3JkWzFdICsgaV1bY29vcmRbMF1dLmdldFZhbHVlKCkgPT09IDMpXG4gICAgICAgICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgW2Nvb3JkWzBdLCBjb29yZFsxXSArIGldLnRvU3RyaW5nKClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0sIGNvb3JkWzFdICsgaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaXRUeXBlID09PSAyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzBdIC0gaSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAodGFyZ2V0Qm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdIC0gaV0uZ2V0VmFsdWUoKSA9PT0gMylcbiAgICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHJlYWxDb29yZHNMZWZ0U3RyaW5naWZ5LmluY2x1ZGVzKFxuICAgICAgICAgICAgICBbY29vcmRbMF0gLSBpLCBjb29yZFsxXV0udG9TdHJpbmcoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcGxheVJvdW5kKFtjb29yZFswXSAtIGksIGNvb3JkWzFdXSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgfVxuICAgICAgaWYgKGhpdFR5cGUgPT09IDMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICBpZiAoY29vcmRbMV0gLSBpID49IDApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXSAtIGldW2Nvb3JkWzBdXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoXG4gICAgICAgICAgICAgIFtjb29yZFswXSwgY29vcmRbMV0gLSBpXS50b1N0cmluZygpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBwbGF5Um91bmQoW2Nvb3JkWzBdLCBjb29yZFsxXSAtIGldKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID09PSAyICYmXG4gICAgICAhdGFyZ2V0Qm9hcmRbYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHNbMV1dW1xuICAgICAgICBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3Jkc1swXVxuICAgICAgXVxuICAgICAgICAuZ2V0U2hpcCgpXG4gICAgICAgIC5nZXRTdW5rKClcbiAgICApIHtcbiAgICAgIGxldCBjb29yZHMgPSBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3JkcztcbiAgICAgIHJldHVybiBnZW5lcmFsRm91bmRIaXRQcm9jZXNzaW5nKGNvb3Jkcyk7XG4gICAgfVxuICAgIHJldHVybiBwcm9jZXNzRmluZEZpcnN0VW5zdW5rU3RydWNrU2hpcCgpO1xuXG4gICAgZnVuY3Rpb24gcHJvY2Vzc0ZpbmRGaXJzdFVuc3Vua1N0cnVja1NoaXAoKSB7XG4gICAgICBmdW5jdGlvbiBmaW5kRmlyc3RVblN1bmtTdHJ1Y2tTaGlwKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdGFyZ2V0Qm9hcmRbaV1bal0uZ2V0VmFsdWUoKSA9PT0gMiAmJlxuICAgICAgICAgICAgICAhdGFyZ2V0Qm9hcmRbaV1bal0uZ2V0U2hpcCgpLmdldFN1bmsoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgICByZXR1cm4gW2osIGldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZvdW5kVW5zdW5rU3R1Y2tTaGlwID0gZmluZEZpcnN0VW5TdW5rU3RydWNrU2hpcCgpO1xuXG4gICAgICBpZiAoZm91bmRVbnN1bmtTdHVja1NoaXApIHtcbiAgICAgICAgcmV0dXJuIGdlbmVyYWxGb3VuZEhpdFByb2Nlc3NpbmcoZm91bmRVbnN1bmtTdHVja1NoaXApO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhcImdlbmVyYWwgcmFuZG9tIGhpdFwiKTtcbiAgICAgIHJldHVybiBnZW5lcmFsUmFuZG9tSGl0KCk7XG4gICAgfVxuXG4gICAgLy8gVGhyZWUgaGl0IHR5cGVzIChhbGwgc2hpcHMgdGhhdCBhcmUgdW5zdW5rKTpcbiAgICAvLyAxLiBTaW5nbGUgaGl0IChubyBuZWlnaGJvdXIgd2l0aGluIDMgc3F1YXJlcylcbiAgICAvLyAyLiBNdWx0aXBsZSBhZGphY2VudCBoaXRzXG4gICAgLy8gMy4gU2VwYXJhdGVkIGhpdHMgKG5vIGZ1cnRoZXIgdGhhbiAzIHNxdWFyZXMpXG4gICAgZnVuY3Rpb24gY2hlY2tIaXRUeXBlKGNvb3JkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImNoZWNraW5nIGhpdCB0eXBlXCIsIGNvb3JkKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYWN0aXZlIHBsYXllciBoaXRzXCIsIGFjdGl2ZVBsYXllci5oaXRzKTtcbiAgICAgIGNvbnN0IHVuc3Vua0hpdFNoaXBzID0gYWN0aXZlUGxheWVyLmhpdHNcbiAgICAgICAgLmZpbHRlcigoaGl0KSA9PiB0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpKVxuICAgICAgICAuZmlsdGVyKChoaXQpID0+ICF0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpLmdldFN1bmsoKSk7XG4gICAgICBjb25zb2xlLmxvZyhcInVuc3VuayBzaGlwc1wiLCB1bnN1bmtIaXRTaGlwcyk7XG4gICAgICBjb25zdCB1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkID0gdW5zdW5rSGl0U2hpcHMubWFwKChjb3JkKSA9PlxuICAgICAgICBjb3JkLnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgICAvL2xvb3AgZnJvbSAzIC0gNiAtIDkgLSAxMiBPJ2Nsb2NrXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDI7IGorKykge1xuICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjMgT2Nsb2NrXCIpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgIFtjb29yZFswXSArIGosIGNvb3JkWzFdXS50b1N0cmluZygpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPT09IDIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiOSBPY2xvY2tcIik7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdW5zdW5rSGl0U2hpcHNTdHJpbmdpZmllZC5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICBbY29vcmRbMF0gLSBqLCBjb29yZFsxXV0udG9TdHJpbmcoKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpID09PSAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjYgT2Nsb2NrXCIpO1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgW2Nvb3JkWzBdLCBjb29yZFsxXSArIGpdLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA9PT0gMykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCIxMiBPY2xvY2tcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgW2Nvb3JkWzBdLCBjb29yZFsxXSAtIGpdLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFwic2luZ2xlXCI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSA9IG51bGwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU2luZ2xlIGhpdCBwcm9jZXNzaW5nXCIsIGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgIGxldCBzaG9vdE5lYXJPZmZzZXQ7XG4gICAgICBzd2l0Y2ggKGhpdFR5cGUpIHtcbiAgICAgICAgY2FzZSBudWxsOlxuICAgICAgICAgIHNob290TmVhck9mZnNldCA9IFtcbiAgICAgICAgICAgIFswLCAtMV0sXG4gICAgICAgICAgICBbMSwgMF0sXG4gICAgICAgICAgICBbMCwgMV0sXG4gICAgICAgICAgICBbLTEsIDBdLFxuICAgICAgICAgIF07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNob290TmVhck9mZnNldCA9IFtcbiAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgc2hvb3ROZWFyT2Zmc2V0ID0gW1xuICAgICAgICAgICAgWzAsIC0xXSxcbiAgICAgICAgICAgIFswLCAxXSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZyhzaG9vdE5lYXJPZmZzZXQpO1xuXG4gICAgICAvLyBmdW5jdGlvbiBnZXRSYW5kb21TdXJyb3VuZEluZGV4KCkge1xuICAgICAgLy8gICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAvLyB9XG4gICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXMgPSBbXTtcbiAgICAgIHNob290TmVhck9mZnNldC5mb3JFYWNoKChvZmZzZXQpID0+IHtcbiAgICAgICAgc3Vycm91bmRpbmdTcXVhcmVzLnB1c2goW2Nvb3JkWzBdICsgb2Zmc2V0WzBdLCBjb29yZFsxXSArIG9mZnNldFsxXV0pO1xuICAgICAgfSk7XG5cbiAgICAgIC8vaW1wbGVtZW50IGJldHRlciBsb2dpYyBmb3Igc2VsZWN0aW5nIGEgc3Vycm91bmRpbmcgc3F1YXJlXG4gICAgICAvLzEuIGZpbHRlciB0aGUgc3Vycm91bmRpbmcgc3F1YXJlcyB0byBiZSBvbmx5IHRoZSBzcXVhcmVzIGxlZnQgaW4gdGhlIHVuaGl0IGFyZWFcbiAgICAgIC8vMi4gdGhlbiByYW5kb21seSBzZWxlY3Qgc3F1YXJlIGZyb20gZmlsdGVyIGFycmF5XG4gICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXNTdHJpbmdpZnkgPSBzdXJyb3VuZGluZ1NxdWFyZXMubWFwKChzcXVhcmUpID0+XG4gICAgICAgIHNxdWFyZS50b1N0cmluZygpXG4gICAgICApO1xuICAgICAgY29uc3Qgc3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlID0gc3Vycm91bmRpbmdTcXVhcmVzU3RyaW5naWZ5XG4gICAgICAgIC5maWx0ZXIoKHNxdWFyZSkgPT4gcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoc3F1YXJlKSlcbiAgICAgICAgLm1hcCgoc3F1YXJlKSA9PiBbK3NxdWFyZVswXSwgK3NxdWFyZVsyXV0pO1xuXG4gICAgICBjb25zb2xlLmxvZyhcInN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZVwiLCBzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGUpO1xuXG4gICAgICBpZiAoc3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGxheVJvdW5kKHN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZ2VuZXJhbFJhbmRvbUhpdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdlbmVyYWxSYW5kb21IaXQoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcInNraXBwZWRcIik7XG4gICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlYWxDb29yZHNMZWZ0Lmxlbmd0aCk7XG4gICAgICBwbGF5Um91bmQocmVhbENvb3Jkc0xlZnRbcmFuZG9tSW5kZXhdKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBwcmludE5ld1JvdW5kKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBwbGF5Um91bmQsXG4gICAgYm9hcmQxLFxuICAgIGJvYXJkMixcbiAgICBnZXRBY3RpdmVQbGF5ZXIsXG4gIH07XG59XG4iLCJpbXBvcnQgQ2VsbCBmcm9tIFwiLi9jZWxsXCI7XG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbWVCb2FyZCgpIHtcbiAgY29uc3Qgcm93cyA9IDEwO1xuICBjb25zdCBjb2x1bW5zID0gMTA7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzOyBpKyspIHtcbiAgICBib2FyZFtpXSA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sdW1uczsgaisrKSB7XG4gICAgICBib2FyZFtpXS5wdXNoKENlbGwoW2osIGldKSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZDtcblxuICBmdW5jdGlvbiBwcmludEJvYXJkKHBsYXllcikge1xuICAgIGNvbnN0IGJvYXJkV2l0aENlbGxWYWx1ZXMgPSBib2FyZC5tYXAoKHJvdykgPT5cbiAgICAgIHJvdy5tYXAoKGNlbGwpID0+IGNlbGwucHJpbnRWYWx1ZShwbGF5ZXIpKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coYm9hcmRXaXRoQ2VsbFZhbHVlcyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0Q29vcmRzID0gW107XG4gICAgZnVuY3Rpb24gcmFuZG9tT3JpZW50YXRpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiSFwiIDogXCJWXCI7XG4gICAgfVxuICAgIGNvbnN0IG9yaWVudCA9IHJhbmRvbU9yaWVudGF0aW9uKCk7XG4gICAgZnVuY3Rpb24gcmFuZG9tWSgpIHtcbiAgICAgIGlmIChvcmllbnQgPT09IFwiVlwiKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd3MgPSByb3dzIC0gbGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmV3Um93cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcm93cyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmRvbVgoKSB7XG4gICAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgICBjb25zdCBuZXdDb2x1bW5zID0gY29sdW1ucyAtIGxlbmd0aDtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5ld0NvbHVtbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbHVtbnMpO1xuICAgIH1cblxuICAgIHN0YXJ0Q29vcmRzLnB1c2gocmFuZG9tWCgpLCByYW5kb21ZKCkpO1xuICAgIHJldHVybiBbc3RhcnRDb29yZHMsIG9yaWVudF07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQ2VsbHNPZmZsaW1pdHMoc3RhcnRDb29yZCwgb3JpZW50LCBsZW5ndGgpIHtcbiAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0Q29vcmRbMF0gLSAxOyBpIDwgc3RhcnRDb29yZFswXSAtIDEgKyBsZW5ndGggKyAyOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29vcmRbMV0gLSAxOyBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyAzOyBqKyspIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJWXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydENvb3JkWzBdIC0gMTsgaSA8IHN0YXJ0Q29vcmRbMF0gLSAxICsgMzsgaSsrKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGogPSBzdGFydENvb3JkWzFdIC0gMTtcbiAgICAgICAgICBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIGorK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKGxlbmd0aCkge1xuICAgIGNvbnN0IHNoaXBSYW5kb21PcmlnaW4gPSByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCk7XG4gICAgY29uc3Qgc2hpcCA9IFNoaXAobGVuZ3RoKTtcblxuICAgIGNvbnN0IG9mZkxpbWl0Q2hlY2sgPSBbXTtcblxuICAgIGlmIChzaGlwUmFuZG9tT3JpZ2luWzFdID09PSBcIlZcIikge1xuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdO1xuICAgICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVsxXSArIGxlbmd0aDtcbiAgICAgICAgaSsrXG4gICAgICApIHtcbiAgICAgICAgb2ZmTGltaXRDaGVjay5wdXNoKGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLmlzT2ZmTGltaXQoKSk7XG4gICAgICB9XG4gICAgICBpZiAob2ZmTGltaXRDaGVjay5pbmNsdWRlcyh0cnVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVsxXTtcbiAgICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMV0gKyBsZW5ndGg7XG4gICAgICAgIGkrK1xuICAgICAgKSB7XG4gICAgICAgIGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLm1ha2VTaGlwKHNoaXApO1xuICAgICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgfVxuICAgICAgbWFrZUNlbGxzT2ZmbGltaXRzKHNoaXBSYW5kb21PcmlnaW5bMF0sIHNoaXBSYW5kb21PcmlnaW5bMV0sIGxlbmd0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZm9yIChcbiAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVswXTtcbiAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdICsgbGVuZ3RoO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBvZmZMaW1pdENoZWNrLnB1c2goYm9hcmRbc2hpcFJhbmRvbU9yaWdpblswXVsxXV1baV0uaXNPZmZMaW1pdCgpKTtcbiAgICB9XG4gICAgaWYgKG9mZkxpbWl0Q2hlY2suaW5jbHVkZXModHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdO1xuICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMF0gKyBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGJvYXJkW3NoaXBSYW5kb21PcmlnaW5bMF1bMV1dW2ldLm1ha2VTaGlwKHNoaXApO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICB9XG4gICAgbWFrZUNlbGxzT2ZmbGltaXRzKHNoaXBSYW5kb21PcmlnaW5bMF0sIHNoaXBSYW5kb21PcmlnaW5bMV0sIGxlbmd0aCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB3aGlsZSAoIXBsYWNlU2hpcHMoNCkpIHtcbiAgICBjb25zb2xlLmxvZyg0KTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoNCkpIHtcbiAgICBjb25zb2xlLmxvZyg0KTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMykpIHtcbiAgICBjb25zb2xlLmxvZygzKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMykpIHtcbiAgICBjb25zb2xlLmxvZygzKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMikpIHtcbiAgICBjb25zb2xlLmxvZygyKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMikpIHtcbiAgICBjb25zb2xlLmxvZygyKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMSkpIHtcbiAgICBjb25zb2xlLmxvZygxKTtcbiAgfVxuICB3aGlsZSAoIXBsYWNlU2hpcHMoMSkpIHtcbiAgICBjb25zb2xlLmxvZygxKTtcbiAgfVxuXG4gIGNvbnN0IGRyb3BCb21iID0gKGNvb3JkKSA9PiB7XG4gICAgaWYgKGNvb3JkWzBdID4gOSB8fCBjb29yZFswXSA8IDAgfHwgY29vcmRbMV0gPiA5IHx8IGNvb3JkWzFdIDwgMCkge1xuICAgICAgY29uc29sZS5sb2coXCJPdXQgb2YgcmFuZ2UsIGZpcmUgYWdhaW4hXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzcXVhcmUgPSBib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIHJldHVybiBzcXVhcmUuc3RyaWtlKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwcmludEJvYXJkLFxuICAgIGRyb3BCb21iLFxuICAgIHNoaXBzLFxuICAgIGdldEJvYXJkLFxuICAgIHJvd3MsXG4gICAgY29sdW1ucyxcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGxldCBudW1IaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0cmlrZSA9ICgpID0+IHtcbiAgICBudW1IaXQrKztcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBTVFJJS0UhISEhICR7bnVtSGl0fSBzcXVhcmUocykgb2Ygc2hpcCBsZW5ndGg6ICR7bGVuZ3RofSBkZXN0cm95ZWQuICR7XG4gICAgICAgIGxlbmd0aCAtIG51bUhpdFxuICAgICAgfSBsZWZ0IHRvIGRlc3Ryb3lgXG4gICAgKTtcbiAgICBpZiAobnVtSGl0ID09PSBsZW5ndGgpIHN1bmsgPSB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGdldE51bUhpdCA9ICgpID0+IG51bUhpdDtcblxuICBjb25zdCBnZXRTdW5rID0gKCkgPT4gc3VuaztcblxuICByZXR1cm4ge1xuICAgIHN0cmlrZSxcbiAgICBnZXROdW1IaXQsXG4gICAgZ2V0U3VuayxcbiAgICBsZW5ndGgsXG4gIH07XG59XG4iLCJpbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vZ2FtZUNvbnRyb2xsZXJcIjtcblxuY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbmNvbnN0IGNvbXB1dGVySDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyID4gaDJcIik7XG5jb25zdCBodW1hbkgyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5odW1hbiA+IGgyXCIpO1xuY29uc3QgbmFtZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuY29uc3QgcGxheWVyTmFtZUZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZm9ybVwiKTtcbmNvbnN0IG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibWFpblwiKTtcbmNvbnN0IHBsYXlBZ2FpbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheS1hZ2FpbiA+IGJ1dHRvblwiKTtcbmNvbnN0IHBsYXlBZ2FpbkRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheS1hZ2FpblwiKTtcbmNvbnN0IHBsYXllclRpdGxlc0gyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImgyXCIpO1xuY29uc3Qgd2lubmVyRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJcIik7XG5jb25zdCBpbnN0cnVjdGlvbkRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaW5zdHJ1Y3Rpb25cIilcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVVSSgpIHtcbiAgcGxheWVyTmFtZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBodW1hbkgyLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlIHx8IFwiQ2h1Y2sgTm9yaXNcIjtcbiAgICBtYWluLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgaW5zdHJ1Y3Rpb25EaXYuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxuICAgIHBsYXlBZ2FpbkRpdi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgIHBsYXllck5hbWVGb3JtLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gIH0pO1xuXG4gIGxldCBnYW1lID0gR2FtZUNvbnRyb2xsZXIoKTtcbiAgZnVuY3Rpb24gaW5pdChib2FyZCwgYm9hcmROdW0pIHtcbiAgICBnYW1lW2JvYXJkXS5nZXRCb2FyZCgpLmZvckVhY2goKHJvdywgaSkgPT5cbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBqKSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICBjZWxsRGl2LnNldEF0dHJpYnV0ZShcImRhdGEtY29vcmRcIiwgW2osIGldKTtcbiAgICAgICAgYm9hcmRzW2JvYXJkTnVtXS5hcHBlbmRDaGlsZChjZWxsRGl2KTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckJvYXJkKGJvYXJkLCB3aW5uZXIgPSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coXCJyZW5kZXJpbmdcIiwgYm9hcmQpO1xuICAgIGlmICh3aW5uZXIpIHtcbiAgICAgIGNvbnN0IHdpbm5lck5hbWUgPVxuICAgICAgICB3aW5uZXIubmFtZSA9PT0gXCJjb21wdXRlclwiID8gXCJjb21wdXRlclwiIDogaHVtYW5IMi50ZXh0Q29udGVudDtcbiAgICAgIHdpbm5lckRpdi50ZXh0Q29udGVudCA9IGAke3dpbm5lck5hbWV9IHdpbnMhIGhhdmluZyBzdW5rIGFsbCB0aGVpciBvcHBvbmVudCdzIGZsZWV0YDtcbiAgICAgIGJvYXJkc1sxXVxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpKTtcbiAgICB9XG4gICAgY29uc3QgYm9hcmREaXYgPSBib2FyZCA9PT0gXCJib2FyZDFcIiA/IGJvYXJkc1swXSA6IGJvYXJkc1sxXTtcbiAgICBnYW1lW2JvYXJkXS5nZXRCb2FyZCgpLmZvckVhY2goKHJvdywgaSkgPT5cbiAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBqKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldENlbGwgPSBib2FyZERpdi5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGBkaXZbZGF0YS1jb29yZD1cIiR7an0sJHtpfVwiXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGJvYXJkICE9PSBcImJvYXJkMlwiKSB7XG4gICAgICAgICAgaWYgKGNlbGwuZ2V0U2hpcCgpKSB7XG4gICAgICAgICAgICB0YXJnZXRDZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjZWxsLmdldFNoaXAoKSAmJiBjZWxsLmdldEhpdEJvb2woKSkge1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXAtaGl0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbGwuZ2V0U2hpcCgpICYmIGNlbGwuZ2V0U2hpcCgpLmdldFN1bmsoKSkge1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LnJlbW92ZShcInNoaXAtaGl0XCIpO1xuICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXAtc3Vua1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjZWxsLmdldEhpdEJvb2woKSAmJiAhY2VsbC5nZXRTaGlwKCkpXG4gICAgICAgICAgdGFyZ2V0Q2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgY29uc3QgaGlnaGxpZ2h0QWN0aXZlUExheWVyID0gKHBsYXllcikgPT4ge1xuICAgIHBsYXllclRpdGxlc0gyLmZvckVhY2goKHRpdGxlKSA9PiB7XG4gICAgICB0aXRsZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgIH0pO1xuICAgIGNvbnN0IGFjdGl2ZVRpdGxlID0gcGxheWVyID09PSBcImNvbXB1dGVyXCIgPyBjb21wdXRlckgyIDogaHVtYW5IMjtcbiAgICBhY3RpdmVUaXRsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGNsaWNrSGFuZGxlcihlKSB7XG4gICAgY29uc29sZS5sb2coXCJoYW5kbGVcIik7XG4gICAgY29uc3QgY29vcmRzID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiKTtcbiAgICBjb25zb2xlLmxvZyhbK2Nvb3Jkc1swXSwgK2Nvb3Jkc1syXV0pO1xuICAgIGdhbWUucGxheVJvdW5kKFsrY29vcmRzWzBdLCArY29vcmRzWzJdXSk7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH1cblxuICBjb25zdCBhY3RpdmVUaXRsZSA9XG4gICAgZ2FtZS5nZXRBY3RpdmVQbGF5ZXIoKS5uYW1lID09PSBcImNvbXB1dGVyXCIgPyBjb21wdXRlckgyIDogaHVtYW5IMjtcbiAgYWN0aXZlVGl0bGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgaW5pdChcImJvYXJkMVwiLCAwKTtcbiAgaW5pdChcImJvYXJkMlwiLCAxKTtcbiAgcmVuZGVyQm9hcmQoXCJib2FyZDFcIik7XG4gIHJlbmRlckJvYXJkKFwiYm9hcmQyXCIpO1xuXG4gIC8vIEV2ZW50IEJpbmRpbmdcbiAgY29uc3QgYWRkSHVtYW5DbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH07XG4gIGFkZEh1bWFuQ2xpY2tIYW5kbGVyKCk7XG5cbiAgY29uc3QgcmVzZXRCb2FyZHMgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJyZXNldCBVSVwiKTtcbiAgICBib2FyZHMuZm9yRWFjaCgoYm9hcmQpID0+IHtcbiAgICAgIGJvYXJkLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICB9KTtcbiAgICB3aW5uZXJEaXYudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIGdhbWUgPSBHYW1lQ29udHJvbGxlcigpO1xuICAgIGluaXQoXCJib2FyZDFcIiwgMCk7XG4gICAgaW5pdChcImJvYXJkMlwiLCAxKTtcbiAgICByZW5kZXJCb2FyZChcImJvYXJkMVwiKTtcbiAgICByZW5kZXJCb2FyZChcImJvYXJkMlwiKTtcbiAgICBib2FyZHNbMV1cbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNlbGxcIilcbiAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpKTtcbiAgfTtcblxuICBwbGF5QWdhaW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0Qm9hcmRzKTtcblxuICByZXR1cm4ge1xuICAgIGdhbWUsXG4gICAgcmVuZGVyQm9hcmQsXG4gICAgcmVzZXRCb2FyZHMsXG4gICAgYWRkSHVtYW5DbGlja0hhbmRsZXIsXG4gICAgaGlnaGxpZ2h0QWN0aXZlUExheWVyLFxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==