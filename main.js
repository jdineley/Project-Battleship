/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = {
    /***/ "./src/index.js":
      /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
          /* harmony export */
        });
        /* harmony import */ var _modules_ui__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./modules/ui */ "./src/modules/ui.js");

        const UI = (0, _modules_ui__WEBPACK_IMPORTED_MODULE_0__["default"])();

        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = UI;

        /***/
      },

    /***/ "./src/modules/cell.js":
      /*!*****************************!*\
  !*** ./src/modules/cell.js ***!
  \*****************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ Cell,
          /* harmony export */
        });
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

        /***/
      },

    /***/ "./src/modules/gameController.js":
      /*!***************************************!*\
  !*** ./src/modules/gameController.js ***!
  \***************************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ GameController,
          /* harmony export */
        });
        /* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");
        /* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ../index */ "./src/index.js");

        function GameController(player1 = "Chuck", player2 = "computer") {
          let board1;
          let board2;
          let players;

          function makeBoards() {
            board1 = (0, _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
            board2 = (0, _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
            activePlayer.targetShips
              .map((ship) => ship.getSunk())
              .includes(false);
          const switchPlayer = () => {
            activePlayer =
              activePlayer === players[0] ? players[1] : players[0];
            _index__WEBPACK_IMPORTED_MODULE_1__[
              "default"
            ].highlightActivePLayer(activePlayer.name);
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
                _index__WEBPACK_IMPORTED_MODULE_1__["default"].renderBoard(
                  boardString,
                  activePlayer
                );
                return;
              }
              _index__WEBPACK_IMPORTED_MODULE_1__["default"].renderBoard(
                boardString
              );
            }
            console.log(players);
            if (switchPlayer()) return;
            printNewRound();
          };

          const computersTurn = () => {
            _index__WEBPACK_IMPORTED_MODULE_1__[
              "default"
            ].addHumanClickHandler();
            const surroundingSquares = [
              [0, -1],
              [1, 0],
              [0, 1],
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

            // targetBoard
            //   .map((row) => row.map((cell) => cell.getCoord()))
            //   .map((row) =>
            //     row.forEach((coord) => {
            //       if (coord) coordsLeft.push(coord);
            //     })
            //   );
            targetBoard.forEach((row) =>
              row.forEach((cell) => {
                if (cell.getShip()) {
                  if (cell.getShip().getSunk())
                    coordsSunkShips.push(cell.getCoord());
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
            const sunkShipsCoordsOffLimitsStringify =
              sunkShipsCoordsOffLimits.map((coord) => coord.toString());
            const sunkShipsCoordsOffLimitsStringifyNoDups =
              sunkShipsCoordsOffLimitsStringify.filter((coord, i, arr) => {
                if (arr.indexOf(coord) === i) return coord;
              });
            const coordsLeftStringify = coordsLeft.map((coord) =>
              coord.toString()
            );
            // coordsLeftStringify - sunkShipsCoordsOffLimitsStringifyNoDups:
            const realCoordsLeftStringify = coordsLeftStringify.filter(
              (coord, i, arr) => {
                if (
                  sunkShipsCoordsOffLimitsStringifyNoDups.indexOf(coord) === -1
                )
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
                  if (coord[0] + i) {
                    if (targetBoard[coord[1]][coord[0] + i].getValue() === 3)
                      return singleHitProcessing(coord, hitType);
                  } else return singleHitProcessing(coord, hitType);
                  if (
                    realCoordsLeftStringify.includes(
                      [coord[0] + i, coord[1]].toString()
                    )
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
                    realCoordsLeftStringify.includes(
                      [coord[0], coord[1] + i].toString()
                    )
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
                    realCoordsLeftStringify.includes(
                      [coord[0] - i, coord[1]].toString()
                    )
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
                    realCoordsLeftStringify.includes(
                      [coord[0], coord[1] - i].toString()
                    )
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
                .filter(
                  (hit) => !targetBoard[hit[1]][hit[0]].getShip().getSunk()
                );
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
                surroundingSquares.push([
                  coord[0] + offset[0],
                  coord[1] + offset[1],
                ]);
              });

              //implement better logic for selecting a surrounding square
              //1. filter the surrounding squares to be only the squares left in the unhit area
              //2. then randomly select square from filter array
              const surroundingSquaresStringify = surroundingSquares.map(
                (square) => square.toString()
              );
              const surroundingSquaresAvailable = surroundingSquaresStringify
                .filter((square) => realCoordsLeftStringify.includes(square))
                .map((square) => [+square[0], +square[2]]);

              console.log(
                "surroundingSquaresAvailable",
                surroundingSquaresAvailable
              );

              if (surroundingSquaresAvailable.length > 0) {
                playRound(surroundingSquaresAvailable[0]);
                return true;
              } else {
                generalRandomHit();
              }
            }

            function generalRandomHit() {
              console.log("skipped");
              const randomIndex = Math.floor(
                Math.random() * realCoordsLeft.length
              );
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

        /***/
      },

    /***/ "./src/modules/gameboard.js":
      /*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ GameBoard,
          /* harmony export */
        });
        /* harmony import */ var _cell__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(/*! ./cell */ "./src/modules/cell.js");
        /* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ =
          __webpack_require__(/*! ./ship */ "./src/modules/ship.js");

        function GameBoard() {
          const rows = 10;
          const columns = 10;
          const board = [];
          const ships = [];

          for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
              board[i].push(
                (0, _cell__WEBPACK_IMPORTED_MODULE_0__["default"])([j, i])
              );
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
              for (
                let i = startCoord[0] - 1;
                i < startCoord[0] - 1 + length + 2;
                i++
              ) {
                for (
                  let j = startCoord[1] - 1;
                  j < startCoord[1] - 1 + 3;
                  j++
                ) {
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
            const ship = (0, _ship__WEBPACK_IMPORTED_MODULE_1__["default"])(
              length
            );

            const offLimitCheck = [];

            if (shipRandomOrigin[1] === "V") {
              for (
                let i = shipRandomOrigin[0][1];
                i < shipRandomOrigin[0][1] + length;
                i++
              ) {
                offLimitCheck.push(
                  board[i][shipRandomOrigin[0][0]].isOffLimit()
                );
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
              makeCellsOfflimits(
                shipRandomOrigin[0],
                shipRandomOrigin[1],
                length
              );
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
            makeCellsOfflimits(
              shipRandomOrigin[0],
              shipRandomOrigin[1],
              length
            );
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

        /***/
      },

    /***/ "./src/modules/ship.js":
      /*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ Ship,
          /* harmony export */
        });
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

        /***/
      },

    /***/ "./src/modules/ui.js":
      /*!***************************!*\
  !*** ./src/modules/ui.js ***!
  \***************************/
      /***/ (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.r(__webpack_exports__);
        /* harmony export */ __webpack_require__.d(__webpack_exports__, {
          /* harmony export */ default: () => /* binding */ generateUI,
          /* harmony export */
        });
        /* harmony import */ var _gameController__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            /*! ./gameController */ "./src/modules/gameController.js"
          );

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

          let game = (0,
          _gameController__WEBPACK_IMPORTED_MODULE_0__["default"])();
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
                .forEach((cell) =>
                  cell.removeEventListener("click", clickHandler)
                );
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
              .forEach((cell) =>
                cell.removeEventListener("click", clickHandler)
              );
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
            game = (0,
            _gameController__WEBPACK_IMPORTED_MODULE_0__["default"])();
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

        /***/
      },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/define property getters */
  /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/hasOwnProperty shorthand */
  /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })();
  /******/
  /******/ /* webpack/runtime/make namespace object */
  /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
  })();
  /******/
  /************************************************************************/
  /******/
  /******/ // startup
  /******/ // Load entry module and return exports
  /******/ // This entry module is referenced by other modules so it can't be inlined
  /******/ var __webpack_exports__ = __webpack_require__("./src/index.js");
  /******/
  /******/
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBc0M7O0FBRXRDLFdBQVcsdURBQVU7O0FBRXJCLGlFQUFlLEVBQUUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ0pIO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzFFb0M7QUFDVjs7QUFFWDtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGFBQWEsc0RBQVM7QUFDdEIsYUFBYSxzREFBUztBQUN0Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLG9FQUF3QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHVCQUF1QjtBQUMxQztBQUNBLG1CQUFtQixnQkFBZ0I7QUFDbkM7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixrQkFBa0IsMEJBQTBCLE9BQU87QUFDckU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBbUI7QUFDaEM7QUFDQSxRQUFRLDBEQUFjO0FBQ3RCO0FBQ0E7QUFDQSxNQUFNLDBEQUFjO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLG1FQUF1QjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLE9BQU87QUFDN0Isd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ25ZMEI7QUFDQTs7QUFFWDtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixVQUFVO0FBQzVCO0FBQ0Esb0JBQW9CLGFBQWE7QUFDakMsb0JBQW9CLGlEQUFJO0FBQ3hCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0Msb0NBQW9DO0FBQzFFLHdDQUF3QywyQkFBMkI7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixzQ0FBc0MsMkJBQTJCO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGlEQUFJOztBQUVyQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDeEtlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsUUFBUSw0QkFBNEIsUUFBUTtBQUNoRTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QjhDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUgsYUFBYSwyREFBYztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsWUFBWTtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsV0FBVywyREFBYztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNsSUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY2VsbC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy91aS5qcyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9wcm9qZWN0LWJhdHRsZXNoaXAvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdlbmVyYXRlVUkgZnJvbSBcIi4vbW9kdWxlcy91aVwiO1xuXG5jb25zdCBVSSA9IGdlbmVyYXRlVUkoKTtcblxuZXhwb3J0IGRlZmF1bHQgVUk7XG5cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENlbGwoY29vcmQpIHtcbiAgbGV0IGhpdEJvb2wgPSBmYWxzZTtcbiAgbGV0IHNoaXAgPSBudWxsO1xuICBsZXQgb2ZmTGltaXQgPSBmYWxzZTtcbiAgbGV0IHZhbHVlID0gMDtcblxuICBjb25zdCBpc09mZkxpbWl0ID0gKCkgPT4gb2ZmTGltaXQ7XG5cbiAgY29uc3QgbWFrZU9mZkxpbWl0ID0gKCkgPT4ge1xuICAgIG9mZkxpbWl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzdHJpa2UgPSAoKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSAwIHx8IHZhbHVlID09PSAxKSB7XG4gICAgICBpZiAoc2hpcCkge1xuICAgICAgICBzaGlwLnN0cmlrZSgpO1xuICAgICAgICBoaXRCb29sID0gdHJ1ZTtcbiAgICAgICAgdmFsdWUgPSAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJNSVNTISFcIik7XG4gICAgICAgIGhpdEJvb2wgPSB0cnVlO1xuICAgICAgICB2YWx1ZSA9IDM7XG4gICAgICB9XG4gICAgICAvLyByZW1vdmVDb29yZCgpO1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcImZpcmUgYWdhaW4sIHRoaXMgc3F1YXJlIGlzIGFscmVhZHkgaGl0XCIpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBtYWtlU2hpcCA9IChuZXdTaGlwKSA9PiB7XG4gICAgc2hpcCA9IG5ld1NoaXA7XG4gICAgdmFsdWUgPSAxO1xuICB9O1xuXG4gIGNvbnN0IHByaW50VmFsdWUgPSAocGxheWVyKSA9PiB7XG4gICAgaWYgKHBsYXllciA9PT0gXCJodW1hblwiKSByZXR1cm4gdmFsdWU7XG4gICAgZWxzZSB7XG4gICAgICBpZiAodmFsdWUgPT09IDEpIHJldHVybiAwO1xuICAgICAgZWxzZSByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGdldFZhbHVlID0gKCkgPT4gdmFsdWU7XG5cbiAgY29uc3QgZ2V0U2hpcCA9ICgpID0+IHNoaXA7XG5cbiAgY29uc3Qgc2V0VmFsdWUgPSAobmV3VmFsdWUpID0+IHtcbiAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IGdldENvb3JkID0gKCkgPT4gY29vcmQ7XG5cbiAgY29uc3QgcmVtb3ZlQ29vcmQgPSAoKSA9PiB7XG4gICAgY29vcmQgPSBudWxsO1xuICB9O1xuXG4gIGNvbnN0IGdldEhpdEJvb2wgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGhpdEJvb2w7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpc09mZkxpbWl0LFxuICAgIG1ha2VPZmZMaW1pdCxcbiAgICBzdHJpa2UsXG4gICAgbWFrZVNoaXAsXG4gICAgZ2V0VmFsdWUsXG4gICAgc2V0VmFsdWUsXG4gICAgZ2V0U2hpcCxcbiAgICBnZXRDb29yZCxcbiAgICByZW1vdmVDb29yZCxcbiAgICBwcmludFZhbHVlLFxuICAgIGdldEhpdEJvb2wsXG4gIH07XG59XG4iLCJpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IFVJIGZyb20gXCIuLi9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQ29udHJvbGxlcihcbiAgcGxheWVyMSA9IFwiQ2h1Y2tcIixcbiAgcGxheWVyMiA9IFwiY29tcHV0ZXJcIlxuKSB7XG4gIGxldCBib2FyZDE7XG4gIGxldCBib2FyZDI7XG4gIGxldCBwbGF5ZXJzO1xuXG4gIGZ1bmN0aW9uIG1ha2VCb2FyZHMoKSB7XG4gICAgYm9hcmQxID0gR2FtZUJvYXJkKCk7XG4gICAgYm9hcmQyID0gR2FtZUJvYXJkKCk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlUGxheWVycygpIHtcbiAgICBwbGF5ZXJzID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiBwbGF5ZXIxLFxuICAgICAgICB0YXJnZXRCb2FyZDogYm9hcmQyLFxuICAgICAgICBvd25Cb2FyZDogYm9hcmQxLFxuICAgICAgICB0YXJnZXRTaGlwczogYm9hcmQyLnNoaXBzLFxuICAgICAgICBsYXN0Um91bmQ6IHtcbiAgICAgICAgICBjb29yZHM6IG51bGwsXG4gICAgICAgICAgc2hvdDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgaGl0czogW10sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiBwbGF5ZXIyLFxuICAgICAgICB0YXJnZXRCb2FyZDogYm9hcmQxLFxuICAgICAgICBvd25Cb2FyZDogYm9hcmQyLFxuICAgICAgICB0YXJnZXRTaGlwczogYm9hcmQxLnNoaXBzLFxuICAgICAgICBsYXN0Um91bmQ6IHtcbiAgICAgICAgICBjb29yZHM6IG51bGwsXG4gICAgICAgICAgc2hvdDogbnVsbCxcbiAgICAgICAgfSxcbiAgICAgICAgaGl0czogW10sXG4gICAgICB9LFxuICAgIF07XG4gIH1cblxuICBtYWtlQm9hcmRzKCk7XG4gIG1ha2VQbGF5ZXJzKCk7XG5cbiAgbGV0IGFjdGl2ZVBsYXllciA9IHBsYXllcnNbMF07XG4gIGNvbnN0IGdldEFjdGl2ZVBsYXllciA9ICgpID0+IGFjdGl2ZVBsYXllcjtcbiAgY29uc3Qgc2hpcHNMZWZ0ID0gKCkgPT5cbiAgICBhY3RpdmVQbGF5ZXIudGFyZ2V0U2hpcHMubWFwKChzaGlwKSA9PiBzaGlwLmdldFN1bmsoKSkuaW5jbHVkZXMoZmFsc2UpO1xuICBjb25zdCBzd2l0Y2hQbGF5ZXIgPSAoKSA9PiB7XG4gICAgYWN0aXZlUGxheWVyID0gYWN0aXZlUGxheWVyID09PSBwbGF5ZXJzWzBdID8gcGxheWVyc1sxXSA6IHBsYXllcnNbMF07XG4gICAgVUkuaGlnaGxpZ2h0QWN0aXZlUExheWVyKGFjdGl2ZVBsYXllci5uYW1lKTtcbiAgICBpZiAoYWN0aXZlUGxheWVyLm5hbWUgPT09IFwiY29tcHV0ZXJcIikge1xuICAgICAgcmV0dXJuIHNldFRpbWVvdXQoY29tcHV0ZXJzVHVybiwgMTAwMCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBwcmludE5ld1JvdW5kID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGAke2dldEFjdGl2ZVBsYXllcigpLm5hbWV9J3MgdHVybi5gKTtcbiAgICBjb25zb2xlLmxvZyhcIjAgPSBubyBzaGlwLCAgMSA9IHNoaXAsICAyID0gc3RyaWtlLCAgMyA9IG1pc3NcIik7XG4gICAgY29uc29sZS5sb2coYCR7cGxheWVyc1swXS5uYW1lfSdzIGJvYXJkYCk7XG4gICAgYm9hcmQxLnByaW50Qm9hcmQoXCJodW1hblwiKTtcbiAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzFdLm5hbWV9J3MgYm9hcmRgKTtcbiAgICBib2FyZDIucHJpbnRCb2FyZChcImNvbXB1dGVyXCIpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlSb3VuZCA9IChjb29yZHMpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcbiAgICAgIGBEcm9wcGluZyAke2FjdGl2ZVBsYXllci5uYW1lfSdzIGJvbWIgb250byBjb29yZGluYXRlICR7Y29vcmRzfWBcbiAgICApO1xuICAgIGNvbnN0IGhpdFZhbHVlID0gYWN0aXZlUGxheWVyLnRhcmdldEJvYXJkLmRyb3BCb21iKGNvb3Jkcyk7XG5cbiAgICBpZiAoaGl0VmFsdWUpIHtcbiAgICAgIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzID0gY29vcmRzO1xuICAgICAgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID0gaGl0VmFsdWU7XG4gICAgICBhY3RpdmVQbGF5ZXIuaGl0cy5wdXNoKGNvb3Jkcyk7XG4gICAgICBjb25zdCBib2FyZFN0cmluZyA9XG4gICAgICAgIGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZCA9PT0gYm9hcmQxID8gXCJib2FyZDFcIiA6IFwiYm9hcmQyXCI7XG4gICAgICBpZiAoIXNoaXBzTGVmdCgpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIGAke2FjdGl2ZVBsYXllci5uYW1lfSBoYXMgZGlzdHJveWVkIGFsbCB0aGVpciBvcHBvbmVudHMgZmxlZXRgXG4gICAgICAgICk7XG4gICAgICAgIFVJLnJlbmRlckJvYXJkKGJvYXJkU3RyaW5nLCBhY3RpdmVQbGF5ZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBVSS5yZW5kZXJCb2FyZChib2FyZFN0cmluZyk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHBsYXllcnMpO1xuICAgIGlmIChzd2l0Y2hQbGF5ZXIoKSkgcmV0dXJuO1xuICAgIHByaW50TmV3Um91bmQoKTtcbiAgfTtcblxuICBjb25zdCBjb21wdXRlcnNUdXJuID0gKCkgPT4ge1xuICAgIFVJLmFkZEh1bWFuQ2xpY2tIYW5kbGVyKCk7XG4gICAgY29uc3Qgc3Vycm91bmRpbmdTcXVhcmVzID0gW1xuICAgICAgWzAsIC0xXSxcbiAgICAgIFsxLCAwXSxcbiAgICAgIFswLCAxXSxcbiAgICAgIFstMSwgMF0sXG4gICAgXVxuICAgIGNvbnN0IGNvb3Jkc0xlZnQgPSBbXTtcbiAgICBjb25zdCBjb29yZHNTdW5rU2hpcHMgPSBbXTtcbiAgICBjb25zdCBzdW5rU2hpcHNDb29yZHNPZmZMaW1pdHMgPSBbXTtcbiAgICBjb25zdCB0YXJnZXRCb2FyZCA9IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZC5nZXRCb2FyZCgpO1xuXG4gICAgdGFyZ2V0Qm9hcmQuZm9yRWFjaChyb3cgPT4gcm93LmZvckVhY2goY2VsbCA9PiB7XG4gICAgICBpZighY2VsbC5nZXRIaXRCb29sKCkpIGNvb3Jkc0xlZnQucHVzaChjZWxsLmdldENvb3JkKCkpXG4gICAgfSkpXG5cbiAgICAvLyB0YXJnZXRCb2FyZFxuICAgIC8vICAgLm1hcCgocm93KSA9PiByb3cubWFwKChjZWxsKSA9PiBjZWxsLmdldENvb3JkKCkpKVxuICAgIC8vICAgLm1hcCgocm93KSA9PlxuICAgIC8vICAgICByb3cuZm9yRWFjaCgoY29vcmQpID0+IHtcbiAgICAvLyAgICAgICBpZiAoY29vcmQpIGNvb3Jkc0xlZnQucHVzaChjb29yZCk7XG4gICAgLy8gICAgIH0pXG4gICAgLy8gICApO1xuICAgIHRhcmdldEJvYXJkLmZvckVhY2gocm93ID0+IHJvdy5mb3JFYWNoKGNlbGwgPT4ge1xuICAgICAgaWYoY2VsbC5nZXRTaGlwKCkpe1xuICAgICAgICBpZihjZWxsLmdldFNoaXAoKS5nZXRTdW5rKCkpIGNvb3Jkc1N1bmtTaGlwcy5wdXNoKGNlbGwuZ2V0Q29vcmQoKSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICBjb25zb2xlLmxvZyhjb29yZHNTdW5rU2hpcHMpXG4gICAgaWYoY29vcmRzU3Vua1NoaXBzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvb3Jkc1N1bmtTaGlwcy5mb3JFYWNoKGNvb3JkID0+IHtcbiAgICAgICAgc3Vycm91bmRpbmdTcXVhcmVzLmZvckVhY2gob2Zmc2V0ID0+IHtcbiAgICAgICAgICBpZihjb29yZFswXStvZmZzZXRbMF0gPj0gMCAmJiBjb29yZFswXStvZmZzZXRbMF0gPD0gOSAmJiBjb29yZFsxXStvZmZzZXRbMV0gPj0gMCAmJiBjb29yZFsxXStvZmZzZXRbMV0gPD0gOSkge1xuICAgICAgICAgICAgc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzLnB1c2goW2Nvb3JkWzBdK29mZnNldFswXSwgY29vcmRbMV0rb2Zmc2V0WzFdXSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBcbiAgICBjb25zdCBzdW5rU2hpcHNDb29yZHNPZmZMaW1pdHNTdHJpbmdpZnkgPSBzdW5rU2hpcHNDb29yZHNPZmZMaW1pdHMubWFwKGNvb3JkID0+IGNvb3JkLnRvU3RyaW5nKCkpXG4gICAgY29uc3Qgc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzU3RyaW5naWZ5Tm9EdXBzID0gc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzU3RyaW5naWZ5LmZpbHRlcigoY29vcmQsIGksIGFycikgPT4ge1xuICAgICAgaWYoYXJyLmluZGV4T2YoY29vcmQpID09PSBpKSByZXR1cm4gY29vcmRcbiAgICB9KVxuICAgIGNvbnN0IGNvb3Jkc0xlZnRTdHJpbmdpZnkgPSBjb29yZHNMZWZ0Lm1hcCgoY29vcmQpID0+IGNvb3JkLnRvU3RyaW5nKCkpO1xuICAgIC8vIGNvb3Jkc0xlZnRTdHJpbmdpZnkgLSBzdW5rU2hpcHNDb29yZHNPZmZMaW1pdHNTdHJpbmdpZnlOb0R1cHM6XG4gICAgY29uc3QgcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkgPSBjb29yZHNMZWZ0U3RyaW5naWZ5LmZpbHRlcigoY29vcmQsIGksIGFycikgPT4ge1xuICAgICAgaWYoc3Vua1NoaXBzQ29vcmRzT2ZmTGltaXRzU3RyaW5naWZ5Tm9EdXBzLmluZGV4T2YoY29vcmQpID09PSAtMSkgcmV0dXJuIGNvb3JkXG4gICAgfSkgXG4gICAgY29uc29sZS5sb2coY29vcmRzTGVmdFN0cmluZ2lmeSwgcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkpO1xuICAgIGNvbnN0IHJlYWxDb29yZHNMZWZ0ID0gcmVhbENvb3Jkc0xlZnRTdHJpbmdpZnkubWFwKGNvb3JkcyA9PiB7XG4gICAgICByZXR1cm4gWytjb29yZHNbMF0sICtjb29yZHNbMl1dXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhyZWFsQ29vcmRzTGVmdClcblxuICAgIGZ1bmN0aW9uIGdlbmVyYWxGb3VuZEhpdFByb2Nlc3NpbmcoY29vcmQpIHtcbiAgICAgIGNvbnN0IGhpdFR5cGUgPSBjaGVja0hpdFR5cGUoY29vcmQpO1xuICAgICAgaWYgKGhpdFR5cGUgPT09IFwic2luZ2xlXCIpIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIGlmIChoaXRUeXBlID09PSAwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzBdICsgaSkge1xuICAgICAgICAgICAgaWYgKHRhcmdldEJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXSArIGldLmdldFZhbHVlKCkgPT09IDMpXG4gICAgICAgICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICB9IGVsc2UgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQsIGhpdFR5cGUpO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHJlYWxDb29yZHNMZWZ0U3RyaW5naWZ5LmluY2x1ZGVzKFtjb29yZFswXSArIGksIGNvb3JkWzFdXS50b1N0cmluZygpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcGxheVJvdW5kKFtjb29yZFswXSArIGksIGNvb3JkWzFdXSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQpO1xuICAgICAgfVxuICAgICAgaWYgKGhpdFR5cGUgPT09IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICBpZiAoY29vcmRbMV0gKyBpIDwgMTApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXSArIGldW2Nvb3JkWzBdXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0sIGNvb3JkWzFdICsgaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0sIGNvb3JkWzFdICsgaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaXRUeXBlID09PSAyKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzBdIC0gaSA+IDApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXV1bY29vcmRbMF0gLSBpXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0gLSBpLCBjb29yZFsxXV0udG9TdHJpbmcoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0gLSBpLCBjb29yZFsxXV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIH1cbiAgICAgIGlmIChoaXRUeXBlID09PSAzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNvb3JkWzFdIC0gaSA+IDApIHtcbiAgICAgICAgICAgIGlmICh0YXJnZXRCb2FyZFtjb29yZFsxXSAtIGldW2Nvb3JkWzBdXS5nZXRWYWx1ZSgpID09PSAzKVxuICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlSGl0UHJvY2Vzc2luZyhjb29yZCwgaGl0VHlwZSk7XG4gICAgICAgICAgfSBlbHNlIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0sIGNvb3JkWzFdIC0gaV0udG9TdHJpbmcoKSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0sIGNvb3JkWzFdIC0gaV0pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLnNob3QgPT09IDIgJiZcbiAgICAgICF0YXJnZXRCb2FyZFthY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3Jkc1sxXV1bXG4gICAgICAgIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzWzBdXG4gICAgICBdXG4gICAgICAgIC5nZXRTaGlwKClcbiAgICAgICAgLmdldFN1bmsoKVxuICAgICkge1xuICAgICAgbGV0IGNvb3JkcyA9IGFjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzO1xuICAgICAgcmV0dXJuIGdlbmVyYWxGb3VuZEhpdFByb2Nlc3NpbmcoY29vcmRzKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2Nlc3NGaW5kRmlyc3RVbnN1bmtTdHJ1Y2tTaGlwKCk7XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzRmluZEZpcnN0VW5zdW5rU3RydWNrU2hpcCgpIHtcbiAgICAgIGZ1bmN0aW9uIGZpbmRGaXJzdFVuU3Vua1N0cnVja1NoaXAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB0YXJnZXRCb2FyZFtpXVtqXS5nZXRWYWx1ZSgpID09PSAyICYmXG4gICAgICAgICAgICAgICF0YXJnZXRCb2FyZFtpXVtqXS5nZXRTaGlwKCkuZ2V0U3VuaygpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgIHJldHVybiBbaiwgaV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZm91bmRVbnN1bmtTdHVja1NoaXAgPSBmaW5kRmlyc3RVblN1bmtTdHJ1Y2tTaGlwKCk7XG5cbiAgICAgIGlmIChmb3VuZFVuc3Vua1N0dWNrU2hpcCkge1xuICAgICAgICByZXR1cm4gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhmb3VuZFVuc3Vua1N0dWNrU2hpcCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiZ2VuZXJhbCByYW5kb20gaGl0XCIpO1xuICAgICAgcmV0dXJuIGdlbmVyYWxSYW5kb21IaXQoKTtcbiAgICB9XG5cbiAgICAvLyBUaHJlZSBoaXQgdHlwZXMgKGFsbCBzaGlwcyB0aGF0IGFyZSB1bnN1bmspOlxuICAgIC8vIDEuIFNpbmdsZSBoaXQgKG5vIG5laWdoYm91ciB3aXRoaW4gMyBzcXVhcmVzKVxuICAgIC8vIDIuIE11bHRpcGxlIGFkamFjZW50IGhpdHNcbiAgICAvLyAzLiBTZXBhcmF0ZWQgaGl0cyAobm8gZnVydGhlciB0aGFuIDMgc3F1YXJlcylcbiAgICBmdW5jdGlvbiBjaGVja0hpdFR5cGUoY29vcmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiY2hlY2tpbmcgaGl0IHR5cGVcIiwgY29vcmQpO1xuICAgICAgY29uc29sZS5sb2coXCJhY3RpdmUgcGxheWVyIGhpdHNcIiwgYWN0aXZlUGxheWVyLmhpdHMpO1xuICAgICAgY29uc3QgdW5zdW5rSGl0U2hpcHMgPSBhY3RpdmVQbGF5ZXIuaGl0c1xuICAgICAgICAuZmlsdGVyKChoaXQpID0+IHRhcmdldEJvYXJkW2hpdFsxXV1baGl0WzBdXS5nZXRTaGlwKCkpXG4gICAgICAgIC5maWx0ZXIoKGhpdCkgPT4gIXRhcmdldEJvYXJkW2hpdFsxXV1baGl0WzBdXS5nZXRTaGlwKCkuZ2V0U3VuaygpKTtcbiAgICAgIGNvbnNvbGUubG9nKFwidW5zdW5rIHNoaXBzXCIsIHVuc3Vua0hpdFNoaXBzKTtcbiAgICAgIGNvbnN0IHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQgPSB1bnN1bmtIaXRTaGlwcy5tYXAoKGNvcmQpID0+XG4gICAgICAgIGNvcmQudG9TdHJpbmcoKVxuICAgICAgKTtcbiAgICAgIC8vbG9vcCBmcm9tIDMgLSA2IC0gOSAtIDEyIE8nY2xvY2tcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgMjsgaisrKSB7XG4gICAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiMyBPY2xvY2tcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgIHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgW2Nvb3JkWzBdICsgaiwgY29vcmRbMV1dLnRvU3RyaW5nKClcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaSA9PT0gMikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCI5IE9jbG9ja1wiKTtcblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICB1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgIFtjb29yZFswXSAtIGosIGNvb3JkWzFdXS50b1N0cmluZygpXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGkgPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiNiBPY2xvY2tcIik7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdW5zdW5rSGl0U2hpcHNTdHJpbmdpZmllZC5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICBbY29vcmRbMF0sIGNvb3JkWzFdICsgal0udG9TdHJpbmcoKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpID09PSAzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIjEyIE9jbG9ja1wiKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgdW5zdW5rSGl0U2hpcHNTdHJpbmdpZmllZC5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICBbY29vcmRbMF0sIGNvb3JkWzFdIC0gal0udG9TdHJpbmcoKVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJzaW5nbGVcIjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkLCBoaXRUeXBlID0gbnVsbCkge1xuICAgICAgY29uc29sZS5sb2coXCJTaW5nbGUgaGl0IHByb2Nlc3NpbmdcIiwgY29vcmQsIGhpdFR5cGUpO1xuICAgICAgbGV0IHNob290TmVhck9mZnNldDtcbiAgICAgIHN3aXRjaCAoaGl0VHlwZSkge1xuICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgICAgc2hvb3ROZWFyT2Zmc2V0ID0gW1xuICAgICAgICAgICAgWzAsIC0xXSxcbiAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgIFswLCAxXSxcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgc2hvb3ROZWFyT2Zmc2V0ID0gW1xuICAgICAgICAgICAgWzEsIDBdLFxuICAgICAgICAgICAgWy0xLCAwXSxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzaG9vdE5lYXJPZmZzZXQgPSBbXG4gICAgICAgICAgICBbMCwgLTFdLFxuICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgIF07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKHNob290TmVhck9mZnNldCk7XG5cbiAgICAgIC8vIGZ1bmN0aW9uIGdldFJhbmRvbVN1cnJvdW5kSW5kZXgoKSB7XG4gICAgICAvLyAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICAgIC8vIH1cbiAgICAgIGNvbnN0IHN1cnJvdW5kaW5nU3F1YXJlcyA9IFtdO1xuICAgICAgc2hvb3ROZWFyT2Zmc2V0LmZvckVhY2goKG9mZnNldCkgPT4ge1xuICAgICAgICBzdXJyb3VuZGluZ1NxdWFyZXMucHVzaChbY29vcmRbMF0gKyBvZmZzZXRbMF0sIGNvb3JkWzFdICsgb2Zmc2V0WzFdXSk7XG4gICAgICB9KTtcblxuICAgICAgLy9pbXBsZW1lbnQgYmV0dGVyIGxvZ2ljIGZvciBzZWxlY3RpbmcgYSBzdXJyb3VuZGluZyBzcXVhcmVcbiAgICAgIC8vMS4gZmlsdGVyIHRoZSBzdXJyb3VuZGluZyBzcXVhcmVzIHRvIGJlIG9ubHkgdGhlIHNxdWFyZXMgbGVmdCBpbiB0aGUgdW5oaXQgYXJlYVxuICAgICAgLy8yLiB0aGVuIHJhbmRvbWx5IHNlbGVjdCBzcXVhcmUgZnJvbSBmaWx0ZXIgYXJyYXlcbiAgICAgIGNvbnN0IHN1cnJvdW5kaW5nU3F1YXJlc1N0cmluZ2lmeSA9IHN1cnJvdW5kaW5nU3F1YXJlcy5tYXAoKHNxdWFyZSkgPT5cbiAgICAgICAgc3F1YXJlLnRvU3RyaW5nKClcbiAgICAgICk7XG4gICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGUgPSBzdXJyb3VuZGluZ1NxdWFyZXNTdHJpbmdpZnlcbiAgICAgICAgLmZpbHRlcigoc3F1YXJlKSA9PiByZWFsQ29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhzcXVhcmUpKVxuICAgICAgICAubWFwKChzcXVhcmUpID0+IFsrc3F1YXJlWzBdLCArc3F1YXJlWzJdXSk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwic3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlXCIsIHN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZSk7XG5cbiAgICAgIGlmIChzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGUubGVuZ3RoID4gMCkge1xuICAgICAgICBwbGF5Um91bmQoc3Vycm91bmRpbmdTcXVhcmVzQXZhaWxhYmxlWzBdKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBnZW5lcmFsUmFuZG9tSGl0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2VuZXJhbFJhbmRvbUhpdCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwic2tpcHBlZFwiKTtcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVhbENvb3Jkc0xlZnQubGVuZ3RoKTtcbiAgICAgIHBsYXlSb3VuZChyZWFsQ29vcmRzTGVmdFtyYW5kb21JbmRleF0pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHByaW50TmV3Um91bmQoKTtcblxuICByZXR1cm4ge1xuICAgIHBsYXlSb3VuZCxcbiAgICBib2FyZDEsXG4gICAgYm9hcmQyLFxuICAgIGdldEFjdGl2ZVBsYXllcixcbiAgfTtcbn1cbiIsImltcG9ydCBDZWxsIGZyb20gXCIuL2NlbGxcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUJvYXJkKCkge1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHVtbnMgPSAxMDtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgIGJvYXJkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgIGJvYXJkW2ldLnB1c2goQ2VsbChbaiwgaV0pKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IGJvYXJkO1xuXG4gIGZ1bmN0aW9uIHByaW50Qm9hcmQocGxheWVyKSB7XG4gICAgY29uc3QgYm9hcmRXaXRoQ2VsbFZhbHVlcyA9IGJvYXJkLm1hcCgocm93KSA9PlxuICAgICAgcm93Lm1hcCgoY2VsbCkgPT4gY2VsbC5wcmludFZhbHVlKHBsYXllcikpXG4gICAgKTtcbiAgICBjb25zb2xlLmxvZyhib2FyZFdpdGhDZWxsVmFsdWVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbVNoaXBPcmlnaW4obGVuZ3RoKSB7XG4gICAgY29uc3Qgc3RhcnRDb29yZHMgPSBbXTtcbiAgICBmdW5jdGlvbiByYW5kb21PcmllbnRhdGlvbigpIHtcbiAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpIDwgMC41ID8gXCJIXCIgOiBcIlZcIjtcbiAgICB9XG4gICAgY29uc3Qgb3JpZW50ID0gcmFuZG9tT3JpZW50YXRpb24oKTtcbiAgICBmdW5jdGlvbiByYW5kb21ZKCkge1xuICAgICAgaWYgKG9yaWVudCA9PT0gXCJWXCIpIHtcbiAgICAgICAgY29uc3QgbmV3Um93cyA9IHJvd3MgLSBsZW5ndGg7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuZXdSb3dzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByb3dzKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmFuZG9tWCgpIHtcbiAgICAgIGlmIChvcmllbnQgPT09IFwiSFwiKSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbHVtbnMgPSBjb2x1bW5zIC0gbGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmV3Q29sdW1ucyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sdW1ucyk7XG4gICAgfVxuXG4gICAgc3RhcnRDb29yZHMucHVzaChyYW5kb21YKCksIHJhbmRvbVkoKSk7XG4gICAgcmV0dXJuIFtzdGFydENvb3Jkcywgb3JpZW50XTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VDZWxsc09mZmxpbWl0cyhzdGFydENvb3JkLCBvcmllbnQsIGxlbmd0aCkge1xuICAgIGlmIChvcmllbnQgPT09IFwiSFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gc3RhcnRDb29yZFswXSAtIDE7IGkgPCBzdGFydENvb3JkWzBdIC0gMSArIGxlbmd0aCArIDI7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gc3RhcnRDb29yZFsxXSAtIDE7IGogPCBzdGFydENvb3JkWzFdIC0gMSArIDM7IGorKykge1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPD0gOSAmJiBqIDw9IDkpIHtcbiAgICAgICAgICAgIGJvYXJkW2pdW2ldLm1ha2VPZmZMaW1pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50ID09PSBcIlZcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0Q29vcmRbMF0gLSAxOyBpIDwgc3RhcnRDb29yZFswXSAtIDEgKyAzOyBpKyspIHtcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBsZXQgaiA9IHN0YXJ0Q29vcmRbMV0gLSAxO1xuICAgICAgICAgIGogPCBzdGFydENvb3JkWzFdIC0gMSArIGxlbmd0aCArIDI7XG4gICAgICAgICAgaisrXG4gICAgICAgICkge1xuICAgICAgICAgIGlmIChpID49IDAgJiYgaiA+PSAwICYmIGkgPD0gOSAmJiBqIDw9IDkpIHtcbiAgICAgICAgICAgIGJvYXJkW2pdW2ldLm1ha2VPZmZMaW1pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcHMobGVuZ3RoKSB7XG4gICAgY29uc3Qgc2hpcFJhbmRvbU9yaWdpbiA9IHJhbmRvbVNoaXBPcmlnaW4obGVuZ3RoKTtcbiAgICBjb25zdCBzaGlwID0gU2hpcChsZW5ndGgpO1xuXG4gICAgY29uc3Qgb2ZmTGltaXRDaGVjayA9IFtdO1xuXG4gICAgaWYgKHNoaXBSYW5kb21PcmlnaW5bMV0gPT09IFwiVlwiKSB7XG4gICAgICBmb3IgKFxuICAgICAgICBsZXQgaSA9IHNoaXBSYW5kb21PcmlnaW5bMF1bMV07XG4gICAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdICsgbGVuZ3RoO1xuICAgICAgICBpKytcbiAgICAgICkge1xuICAgICAgICBvZmZMaW1pdENoZWNrLnB1c2goYm9hcmRbaV1bc2hpcFJhbmRvbU9yaWdpblswXVswXV0uaXNPZmZMaW1pdCgpKTtcbiAgICAgIH1cbiAgICAgIGlmIChvZmZMaW1pdENoZWNrLmluY2x1ZGVzKHRydWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdO1xuICAgICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVsxXSArIGxlbmd0aDtcbiAgICAgICAgaSsrXG4gICAgICApIHtcbiAgICAgICAgYm9hcmRbaV1bc2hpcFJhbmRvbU9yaWdpblswXVswXV0ubWFrZVNoaXAoc2hpcCk7XG4gICAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICB9XG4gICAgICBtYWtlQ2VsbHNPZmZsaW1pdHMoc2hpcFJhbmRvbU9yaWdpblswXSwgc2hpcFJhbmRvbU9yaWdpblsxXSwgbGVuZ3RoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdO1xuICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMF0gKyBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIG9mZkxpbWl0Q2hlY2sucHVzaChib2FyZFtzaGlwUmFuZG9tT3JpZ2luWzBdWzFdXVtpXS5pc09mZkxpbWl0KCkpO1xuICAgIH1cbiAgICBpZiAob2ZmTGltaXRDaGVjay5pbmNsdWRlcyh0cnVlKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAoXG4gICAgICBsZXQgaSA9IHNoaXBSYW5kb21PcmlnaW5bMF1bMF07XG4gICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVswXSArIGxlbmd0aDtcbiAgICAgIGkrK1xuICAgICkge1xuICAgICAgYm9hcmRbc2hpcFJhbmRvbU9yaWdpblswXVsxXV1baV0ubWFrZVNoaXAoc2hpcCk7XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIH1cbiAgICBtYWtlQ2VsbHNPZmZsaW1pdHMoc2hpcFJhbmRvbU9yaWdpblswXSwgc2hpcFJhbmRvbU9yaWdpblsxXSwgbGVuZ3RoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHdoaWxlICghcGxhY2VTaGlwcyg0KSkge1xuICAgIGNvbnNvbGUubG9nKDQpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcyg0KSkge1xuICAgIGNvbnNvbGUubG9nKDQpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygzKSkge1xuICAgIGNvbnNvbGUubG9nKDMpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygzKSkge1xuICAgIGNvbnNvbGUubG9nKDMpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygyKSkge1xuICAgIGNvbnNvbGUubG9nKDIpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygyKSkge1xuICAgIGNvbnNvbGUubG9nKDIpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygxKSkge1xuICAgIGNvbnNvbGUubG9nKDEpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygxKSkge1xuICAgIGNvbnNvbGUubG9nKDEpO1xuICB9XG5cbiAgY29uc3QgZHJvcEJvbWIgPSAoY29vcmQpID0+IHtcbiAgICBpZiAoY29vcmRbMF0gPiA5IHx8IGNvb3JkWzBdIDwgMCB8fCBjb29yZFsxXSA+IDkgfHwgY29vcmRbMV0gPCAwKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk91dCBvZiByYW5nZSwgZmlyZSBhZ2FpbiFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNxdWFyZSA9IGJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXV07XG4gICAgcmV0dXJuIHNxdWFyZS5zdHJpa2UoKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHByaW50Qm9hcmQsXG4gICAgZHJvcEJvbWIsXG4gICAgc2hpcHMsXG4gICAgZ2V0Qm9hcmQsXG4gICAgcm93cyxcbiAgICBjb2x1bW5zLFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgbGV0IG51bUhpdCA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG5cbiAgY29uc3Qgc3RyaWtlID0gKCkgPT4ge1xuICAgIG51bUhpdCsrO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgYFNUUklLRSEhISEgJHtudW1IaXR9IHNxdWFyZShzKSBvZiBzaGlwIGxlbmd0aDogJHtsZW5ndGh9IGRlc3Ryb3llZC4gJHtcbiAgICAgICAgbGVuZ3RoIC0gbnVtSGl0XG4gICAgICB9IGxlZnQgdG8gZGVzdHJveWBcbiAgICApO1xuICAgIGlmIChudW1IaXQgPT09IGxlbmd0aCkgc3VuayA9IHRydWU7XG4gIH07XG5cbiAgY29uc3QgZ2V0TnVtSGl0ID0gKCkgPT4gbnVtSGl0O1xuXG4gIGNvbnN0IGdldFN1bmsgPSAoKSA9PiBzdW5rO1xuXG4gIHJldHVybiB7XG4gICAgc3RyaWtlLFxuICAgIGdldE51bUhpdCxcbiAgICBnZXRTdW5rLFxuICAgIGxlbmd0aCxcbiAgfTtcbn1cbiIsImltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9nYW1lQ29udHJvbGxlclwiO1xuXG5jb25zdCBib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvYXJkXCIpO1xuY29uc3QgY29tcHV0ZXJIMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXIgPiBoMlwiKTtcbmNvbnN0IGh1bWFuSDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmh1bWFuID4gaDJcIik7XG5jb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG5jb25zdCBwbGF5ZXJOYW1lRm9ybSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJmb3JtXCIpO1xuY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xuY29uc3QgcGxheUFnYWluQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluID4gYnV0dG9uXCIpO1xuY29uc3QgcGxheUFnYWluRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5LWFnYWluXCIpO1xuY29uc3QgcGxheWVyVGl0bGVzSDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaDJcIik7XG5jb25zdCB3aW5uZXJEaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndpbm5lclwiKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGVVSSgpIHtcbiAgcGxheWVyTmFtZUZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcInN1Ym1pdFwiLCAoZSkgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBodW1hbkgyLnRleHRDb250ZW50ID0gbmFtZUlucHV0LnZhbHVlIHx8IFwiQ2h1Y2sgTm9yaXNcIjtcbiAgICBtYWluLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgcGxheUFnYWluRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgcGxheWVyTmFtZUZvcm0uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgfSk7XG5cbiAgbGV0IGdhbWUgPSBHYW1lQ29udHJvbGxlcigpO1xuICBmdW5jdGlvbiBpbml0KGJvYXJkLCBib2FyZE51bSkge1xuICAgIGdhbWVbYm9hcmRdLmdldEJvYXJkKCkuZm9yRWFjaCgocm93LCBpKSA9PlxuICAgICAgcm93LmZvckVhY2goKGNlbGwsIGopID0+IHtcbiAgICAgICAgY29uc3QgY2VsbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNlbGxEaXYuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICAgIGNlbGxEaXYuc2V0QXR0cmlidXRlKFwiZGF0YS1jb29yZFwiLCBbaiwgaV0pO1xuICAgICAgICBib2FyZHNbYm9hcmROdW1dLmFwcGVuZENoaWxkKGNlbGxEaXYpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQm9hcmQoYm9hcmQsIHdpbm5lciA9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZyhcInJlbmRlcmluZ1wiLCBib2FyZCk7XG4gICAgaWYgKHdpbm5lcikge1xuICAgICAgY29uc3Qgd2lubmVyTmFtZSA9XG4gICAgICAgIHdpbm5lci5uYW1lID09PSBcImNvbXB1dGVyXCIgPyBcImNvbXB1dGVyXCIgOiBodW1hbkgyLnRleHRDb250ZW50O1xuICAgICAgd2lubmVyRGl2LnRleHRDb250ZW50ID0gYCR7d2lubmVyTmFtZX0gd2lucyEgaGF2aW5nIHN1bmsgYWxsIHRoZWlyIG9wcG9uZW50J3MgZmxlZXRgO1xuICAgICAgYm9hcmRzWzFdXG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNlbGxcIilcbiAgICAgICAgLmZvckVhY2goKGNlbGwpID0+IGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNsaWNrSGFuZGxlcikpO1xuICAgIH1cbiAgICBjb25zdCBib2FyZERpdiA9IGJvYXJkID09PSBcImJvYXJkMVwiID8gYm9hcmRzWzBdIDogYm9hcmRzWzFdO1xuICAgIGdhbWVbYm9hcmRdLmdldEJvYXJkKCkuZm9yRWFjaCgocm93LCBpKSA9PlxuICAgICAgcm93LmZvckVhY2goKGNlbGwsIGopID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0Q2VsbCA9IGJvYXJkRGl2LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYGRpdltkYXRhLWNvb3JkPVwiJHtqfSwke2l9XCJdYFxuICAgICAgICApO1xuICAgICAgICBpZiAoYm9hcmQgIT09IFwiYm9hcmQyXCIpIHtcbiAgICAgICAgICBpZiAoY2VsbC5nZXRTaGlwKCkpIHtcbiAgICAgICAgICAgIHRhcmdldENlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbGwuZ2V0U2hpcCgpICYmIGNlbGwuZ2V0SGl0Qm9vbCgpKSB7XG4gICAgICAgICAgdGFyZ2V0Q2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcC1oaXRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2VsbC5nZXRTaGlwKCkgJiYgY2VsbC5nZXRTaGlwKCkuZ2V0U3VuaygpKSB7XG4gICAgICAgICAgdGFyZ2V0Q2VsbC5jbGFzc0xpc3QucmVtb3ZlKFwic2hpcC1oaXRcIik7XG4gICAgICAgICAgdGFyZ2V0Q2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcC1zdW5rXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNlbGwuZ2V0SGl0Qm9vbCgpICYmICFjZWxsLmdldFNoaXAoKSlcbiAgICAgICAgICB0YXJnZXRDZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBjb25zdCBoaWdobGlnaHRBY3RpdmVQTGF5ZXIgPSAocGxheWVyKSA9PiB7XG4gICAgcGxheWVyVGl0bGVzSDIuZm9yRWFjaCgodGl0bGUpID0+IHtcbiAgICAgIHRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgfSk7XG4gICAgY29uc3QgYWN0aXZlVGl0bGUgPSBwbGF5ZXIgPT09IFwiY29tcHV0ZXJcIiA/IGNvbXB1dGVySDIgOiBodW1hbkgyO1xuICAgIGFjdGl2ZVRpdGxlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7XG4gIH07XG5cbiAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcImhhbmRsZVwiKTtcbiAgICBjb25zdCBjb29yZHMgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvb3JkXCIpO1xuICAgIGNvbnNvbGUubG9nKFsrY29vcmRzWzBdLCArY29vcmRzWzJdXSk7XG4gICAgZ2FtZS5wbGF5Um91bmQoWytjb29yZHNbMF0sICtjb29yZHNbMl1dKTtcbiAgICBib2FyZHNbMV1cbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNlbGxcIilcbiAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpKTtcbiAgfVxuXG4gIGNvbnN0IGFjdGl2ZVRpdGxlID1cbiAgICBnYW1lLmdldEFjdGl2ZVBsYXllcigpLm5hbWUgPT09IFwiY29tcHV0ZXJcIiA/IGNvbXB1dGVySDIgOiBodW1hbkgyO1xuICBhY3RpdmVUaXRsZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuICBpbml0KFwiYm9hcmQxXCIsIDApO1xuICBpbml0KFwiYm9hcmQyXCIsIDEpO1xuICByZW5kZXJCb2FyZChcImJvYXJkMVwiKTtcbiAgcmVuZGVyQm9hcmQoXCJib2FyZDJcIik7XG5cbiAgLy8gRXZlbnQgQmluZGluZ1xuICBjb25zdCBhZGRIdW1hbkNsaWNrSGFuZGxlciA9ICgpID0+IHtcbiAgICBib2FyZHNbMV1cbiAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNlbGxcIilcbiAgICAgIC5mb3JFYWNoKChjZWxsKSA9PiBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjbGlja0hhbmRsZXIpKTtcbiAgfTtcbiAgYWRkSHVtYW5DbGlja0hhbmRsZXIoKTtcblxuICBjb25zdCByZXNldEJvYXJkcyA9ICgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcInJlc2V0IFVJXCIpO1xuICAgIGJvYXJkcy5mb3JFYWNoKChib2FyZCkgPT4ge1xuICAgICAgYm9hcmQudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgIH0pO1xuICAgIHdpbm5lckRpdi50ZXh0Q29udGVudCA9IFwiXCJcbiAgICBnYW1lID0gR2FtZUNvbnRyb2xsZXIoKTtcbiAgICBpbml0KFwiYm9hcmQxXCIsIDApO1xuICAgIGluaXQoXCJib2FyZDJcIiwgMSk7XG4gICAgcmVuZGVyQm9hcmQoXCJib2FyZDFcIik7XG4gICAgcmVuZGVyQm9hcmQoXCJib2FyZDJcIik7XG4gICAgYm9hcmRzWzFdXG4gICAgICAucXVlcnlTZWxlY3RvckFsbChcIi5jZWxsXCIpXG4gICAgICAuZm9yRWFjaCgoY2VsbCkgPT4gY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2xpY2tIYW5kbGVyKSk7XG4gIH07XG5cbiAgcGxheUFnYWluQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZXNldEJvYXJkcyk7XG5cbiAgcmV0dXJuIHtcbiAgICBnYW1lLFxuICAgIHJlbmRlckJvYXJkLFxuICAgIHJlc2V0Qm9hcmRzLFxuICAgIGFkZEh1bWFuQ2xpY2tIYW5kbGVyLFxuICAgIGhpZ2hsaWdodEFjdGl2ZVBMYXllcixcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
