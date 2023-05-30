/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/cell.js":
/*!*****************************!*\
  !*** ./src/modules/cell.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Cell)
/* harmony export */ });
// import Ship from "./ship";

function Cell() {
  let hitBool = false;
  let ship = null;
  let offLimit = false;
  let value = 0;

  const isOffLimit = () => offLimit;

  const makeOffLimit = () => {
    offLimit = true;
  };

  const strike = () => {
    if(value === 0 || value === 1) {
        if (ship) {
            ship.strike();
            hitBool = true;
            value = 2
          } else {
            console.log('MISS!!')
            hitBool = true;
            value = 3
          }
          return true
    }
    console.log('fire again, this square is already hit')
    return false
  };

  const makeShip = (newShip) => {
    ship = newShip;
    value = 1;
  };

  const getValue = () => value;

  const getShip = () => ship

  const setValue = (newValue) => {
    value = newValue;
  };

  return {
    isOffLimit,
    makeOffLimit,
    strike,
    makeShip,
    getValue,
    setValue,
    getShip
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



function GameController(player1, player2 = 'computer') {
    let board1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])()
    let board2 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])()

    const players = [
        {
            name: player1,
            targetBoard: board2,
            targetShips: board2.ships
        },
        {
            name: player2,
            targetBoard: board1,
            targetShips: board1.ships
        }
    ]

    let activePlayer = players[0]

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer

    // const getShips = () => {

    // }

    const shipsLeft = () => activePlayer.targetShips.map(ship => ship.getSunk()).includes(false)

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn.`);
        console.log('0 = no ship,  1 = ship,  2 = strike,  3 = miss')
        // if(activePlayer === players[0]) {
        //     console.log(`${players[0].name}'s board`)
        //     board1.printBoard();
        // } else {
        //     console.log(`${players[1].name}'s board`)
        //     board2.printBoard();
        // }
        console.log(`${players[0].name}'s board`)
        console.log(players[0].targetShips)
        board1.printBoard();
        console.log(`${players[1].name}'s board`)
        console.log(players[0].targetShips)
        board2.printBoard();
    }

    const playRound = (coords) => {
        // console.log(
        //   `Dropping ${getActivePlayer().name}'s token into column ${column}...`
        // );
        console.log(`Dropping ${activePlayer.name}'s bomb onto coordinate ${coords}`)
        
        if(activePlayer.targetBoard.dropBomb(coords)) {
            console.log(activePlayer.targetShips.map(ship => ship.getSunk()), shipsLeft())
            if(!shipsLeft()) {
                console.log(`${activePlayer.name} has distroyed all their opponents fleet`)
                return
            }
            switchPlayer();
        }
            
        printNewRound();
        
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
    
      };

      

    printNewRound()
    

    return {
        playRound
    }
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
      board[i].push((0,_cell__WEBPACK_IMPORTED_MODULE_0__["default"])());
    }
  }

  function printBoard() {
    // const boardWithCellValues = board.map((row) => row.map((cell) => [cell.isOffLimit(), cell.getValue()].join(',')))
    // const boardWithCellValues = board.map((row) => row.map((cell) => cell.getShip()))
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
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
    ships.push(ship);
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
    }
    makeCellsOfflimits(shipRandomOrigin[0], shipRandomOrigin[1], length);
    return true;
  }

//   while (!placeShips(4)) {
//     console.log(4);
//   }
//   while (!placeShips(4)) {
//     console.log(4);
//   }
//   while (!placeShips(3)) {
//     console.log(3);
//   }
//   while (!placeShips(3)) {
//     console.log(3);
//   }
//   while (!placeShips(2)) {
//     console.log(2);
//   }
//   while (!placeShips(2)) {
//     console.log(2);
//   }
  while (!placeShips(1)) {
    console.log(1);
  }
  while (!placeShips(1)) {
    console.log(1);
  }

  const dropBomb = (coord) => {
    if(coord[0] > 9 || coord[0] < 0 || coord[1] > 9 || coord[1] < 0) {
        console.log('Out of range, fire again!')
        return
    } 
    let square = board[coord[1]][coord[0]];
    return square.strike()
    

  }

//   printBoard();

  return {
    printBoard,
    dropBomb,
    ships
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
    console.log(`STRIKE!!!! ${numHit} square(s) of ship length: ${length} destroyed. ${length - numHit} left to destroy`)
    if(numHit === length) sunk = true
};

const getNumHit = () => numHit

const getSunk = () => sunk


//   const isSunk = () => {
//     sunk = numHit === length ? true : false;
//     return sunk;
//   };

  return {
    strike,
    getNumHit,
    getSunk,
    length
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_gameController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/gameController */ "./src/modules/gameController.js");
// import GameBoard from "./modules/gameboard";


// const game = GameBoard();

const game = (0,_modules_gameController__WEBPACK_IMPORTED_MODULE_0__["default"])('James')



// game.printBoard()


window.battle = {
    game
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsOEJBQThCLFFBQVEsNEJBQTRCLFFBQVEsYUFBYSxpQkFBaUI7QUFDeEc7QUFDQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUMxQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ3NEOztBQUV0RDs7QUFFQSxhQUFhLG1FQUFjOzs7O0FBSTNCOzs7QUFHQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NlbGwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2VsbCgpIHtcbiAgbGV0IGhpdEJvb2wgPSBmYWxzZTtcbiAgbGV0IHNoaXAgPSBudWxsO1xuICBsZXQgb2ZmTGltaXQgPSBmYWxzZTtcbiAgbGV0IHZhbHVlID0gMDtcblxuICBjb25zdCBpc09mZkxpbWl0ID0gKCkgPT4gb2ZmTGltaXQ7XG5cbiAgY29uc3QgbWFrZU9mZkxpbWl0ID0gKCkgPT4ge1xuICAgIG9mZkxpbWl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzdHJpa2UgPSAoKSA9PiB7XG4gICAgaWYodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEpIHtcbiAgICAgICAgaWYgKHNoaXApIHtcbiAgICAgICAgICAgIHNoaXAuc3RyaWtlKCk7XG4gICAgICAgICAgICBoaXRCb29sID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gMlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTUlTUyEhJylcbiAgICAgICAgICAgIGhpdEJvb2wgPSB0cnVlO1xuICAgICAgICAgICAgdmFsdWUgPSAzXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdmaXJlIGFnYWluLCB0aGlzIHNxdWFyZSBpcyBhbHJlYWR5IGhpdCcpXG4gICAgcmV0dXJuIGZhbHNlXG4gIH07XG5cbiAgY29uc3QgbWFrZVNoaXAgPSAobmV3U2hpcCkgPT4ge1xuICAgIHNoaXAgPSBuZXdTaGlwO1xuICAgIHZhbHVlID0gMTtcbiAgfTtcblxuICBjb25zdCBnZXRWYWx1ZSA9ICgpID0+IHZhbHVlO1xuXG4gIGNvbnN0IGdldFNoaXAgPSAoKSA9PiBzaGlwXG5cbiAgY29uc3Qgc2V0VmFsdWUgPSAobmV3VmFsdWUpID0+IHtcbiAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaXNPZmZMaW1pdCxcbiAgICBtYWtlT2ZmTGltaXQsXG4gICAgc3RyaWtlLFxuICAgIG1ha2VTaGlwLFxuICAgIGdldFZhbHVlLFxuICAgIHNldFZhbHVlLFxuICAgIGdldFNoaXBcbiAgfTtcbn1cbiIsImltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gR2FtZUNvbnRyb2xsZXIocGxheWVyMSwgcGxheWVyMiA9ICdjb21wdXRlcicpIHtcbiAgICBsZXQgYm9hcmQxID0gR2FtZUJvYXJkKClcbiAgICBsZXQgYm9hcmQyID0gR2FtZUJvYXJkKClcblxuICAgIGNvbnN0IHBsYXllcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IHBsYXllcjEsXG4gICAgICAgICAgICB0YXJnZXRCb2FyZDogYm9hcmQyLFxuICAgICAgICAgICAgdGFyZ2V0U2hpcHM6IGJvYXJkMi5zaGlwc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBwbGF5ZXIyLFxuICAgICAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgICAgIHRhcmdldFNoaXBzOiBib2FyZDEuc2hpcHNcbiAgICAgICAgfVxuICAgIF1cblxuICAgIGxldCBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXJzWzBdXG5cbiAgICBjb25zdCBzd2l0Y2hQbGF5ZXIgPSAoKSA9PiB7XG4gICAgICAgIGFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyc1swXSA/IHBsYXllcnNbMV0gOiBwbGF5ZXJzWzBdO1xuICAgIH1cblxuICAgIGNvbnN0IGdldEFjdGl2ZVBsYXllciA9ICgpID0+IGFjdGl2ZVBsYXllclxuXG4gICAgLy8gY29uc3QgZ2V0U2hpcHMgPSAoKSA9PiB7XG5cbiAgICAvLyB9XG5cbiAgICBjb25zdCBzaGlwc0xlZnQgPSAoKSA9PiBhY3RpdmVQbGF5ZXIudGFyZ2V0U2hpcHMubWFwKHNoaXAgPT4gc2hpcC5nZXRTdW5rKCkpLmluY2x1ZGVzKGZhbHNlKVxuXG4gICAgY29uc3QgcHJpbnROZXdSb3VuZCA9ICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7Z2V0QWN0aXZlUGxheWVyKCkubmFtZX0ncyB0dXJuLmApO1xuICAgICAgICBjb25zb2xlLmxvZygnMCA9IG5vIHNoaXAsICAxID0gc2hpcCwgIDIgPSBzdHJpa2UsICAzID0gbWlzcycpXG4gICAgICAgIC8vIGlmKGFjdGl2ZVBsYXllciA9PT0gcGxheWVyc1swXSkge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coYCR7cGxheWVyc1swXS5uYW1lfSdzIGJvYXJkYClcbiAgICAgICAgLy8gICAgIGJvYXJkMS5wcmludEJvYXJkKCk7XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzFdLm5hbWV9J3MgYm9hcmRgKVxuICAgICAgICAvLyAgICAgYm9hcmQyLnByaW50Qm9hcmQoKTtcbiAgICAgICAgLy8gfVxuICAgICAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzBdLm5hbWV9J3MgYm9hcmRgKVxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJzWzBdLnRhcmdldFNoaXBzKVxuICAgICAgICBib2FyZDEucHJpbnRCb2FyZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzFdLm5hbWV9J3MgYm9hcmRgKVxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJzWzBdLnRhcmdldFNoaXBzKVxuICAgICAgICBib2FyZDIucHJpbnRCb2FyZCgpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9IChjb29yZHMpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXG4gICAgICAgIC8vICAgYERyb3BwaW5nICR7Z2V0QWN0aXZlUGxheWVyKCkubmFtZX0ncyB0b2tlbiBpbnRvIGNvbHVtbiAke2NvbHVtbn0uLi5gXG4gICAgICAgIC8vICk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBEcm9wcGluZyAke2FjdGl2ZVBsYXllci5uYW1lfSdzIGJvbWIgb250byBjb29yZGluYXRlICR7Y29vcmRzfWApXG4gICAgICAgIFxuICAgICAgICBpZihhY3RpdmVQbGF5ZXIudGFyZ2V0Qm9hcmQuZHJvcEJvbWIoY29vcmRzKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYWN0aXZlUGxheWVyLnRhcmdldFNoaXBzLm1hcChzaGlwID0+IHNoaXAuZ2V0U3VuaygpKSwgc2hpcHNMZWZ0KCkpXG4gICAgICAgICAgICBpZighc2hpcHNMZWZ0KCkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHthY3RpdmVQbGF5ZXIubmFtZX0gaGFzIGRpc3Ryb3llZCBhbGwgdGhlaXIgb3Bwb25lbnRzIGZsZWV0YClcbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaFBsYXllcigpO1xuICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgcHJpbnROZXdSb3VuZCgpO1xuICAgICAgICBcbiAgICAgICAgLyogIFRoaXMgaXMgd2hlcmUgd2Ugd291bGQgY2hlY2sgZm9yIGEgd2lubmVyIGFuZCBoYW5kbGUgdGhhdCBsb2dpYyxcbiAgICAgICAgICAgIHN1Y2ggYXMgYSB3aW4gbWVzc2FnZS4gKi9cbiAgICBcbiAgICAgIH07XG5cbiAgICAgIFxuXG4gICAgcHJpbnROZXdSb3VuZCgpXG4gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwbGF5Um91bmRcbiAgICB9XG59IiwiaW1wb3J0IENlbGwgZnJvbSBcIi4vY2VsbFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gIGNvbnN0IHJvd3MgPSAxMDtcbiAgY29uc3QgY29sdW1ucyA9IDEwO1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgIGJvYXJkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgIGJvYXJkW2ldLnB1c2goQ2VsbCgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcmludEJvYXJkKCkge1xuICAgIC8vIGNvbnN0IGJvYXJkV2l0aENlbGxWYWx1ZXMgPSBib2FyZC5tYXAoKHJvdykgPT4gcm93Lm1hcCgoY2VsbCkgPT4gW2NlbGwuaXNPZmZMaW1pdCgpLCBjZWxsLmdldFZhbHVlKCldLmpvaW4oJywnKSkpXG4gICAgLy8gY29uc3QgYm9hcmRXaXRoQ2VsbFZhbHVlcyA9IGJvYXJkLm1hcCgocm93KSA9PiByb3cubWFwKChjZWxsKSA9PiBjZWxsLmdldFNoaXAoKSkpXG4gICAgY29uc3QgYm9hcmRXaXRoQ2VsbFZhbHVlcyA9IGJvYXJkLm1hcCgocm93KSA9PlxuICAgICAgcm93Lm1hcCgoY2VsbCkgPT4gY2VsbC5nZXRWYWx1ZSgpKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coYm9hcmRXaXRoQ2VsbFZhbHVlcyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0Q29vcmRzID0gW107XG4gICAgZnVuY3Rpb24gcmFuZG9tT3JpZW50YXRpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiSFwiIDogXCJWXCI7XG4gICAgfVxuICAgIGNvbnN0IG9yaWVudCA9IHJhbmRvbU9yaWVudGF0aW9uKCk7XG4gICAgZnVuY3Rpb24gcmFuZG9tWSgpIHtcbiAgICAgIGlmIChvcmllbnQgPT09IFwiVlwiKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd3MgPSByb3dzIC0gbGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmV3Um93cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcm93cyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmRvbVgoKSB7XG4gICAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgICBjb25zdCBuZXdDb2x1bW5zID0gY29sdW1ucyAtIGxlbmd0aDtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5ld0NvbHVtbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbHVtbnMpO1xuICAgIH1cblxuICAgIHN0YXJ0Q29vcmRzLnB1c2gocmFuZG9tWCgpLCByYW5kb21ZKCkpO1xuICAgIHJldHVybiBbc3RhcnRDb29yZHMsIG9yaWVudF07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQ2VsbHNPZmZsaW1pdHMoc3RhcnRDb29yZCwgb3JpZW50LCBsZW5ndGgpIHtcbiAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0Q29vcmRbMF0gLSAxOyBpIDwgc3RhcnRDb29yZFswXSAtIDEgKyBsZW5ndGggKyAyOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29vcmRbMV0gLSAxOyBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyAzOyBqKyspIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJWXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydENvb3JkWzBdIC0gMTsgaSA8IHN0YXJ0Q29vcmRbMF0gLSAxICsgMzsgaSsrKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGogPSBzdGFydENvb3JkWzFdIC0gMTtcbiAgICAgICAgICBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIGorK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKGxlbmd0aCkge1xuICAgIGNvbnN0IHNoaXBSYW5kb21PcmlnaW4gPSByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCk7XG4gICAgY29uc3Qgc2hpcCA9IFNoaXAobGVuZ3RoKTtcbiAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIGNvbnN0IG9mZkxpbWl0Q2hlY2sgPSBbXTtcblxuICAgIGlmIChzaGlwUmFuZG9tT3JpZ2luWzFdID09PSBcIlZcIikge1xuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdO1xuICAgICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVsxXSArIGxlbmd0aDtcbiAgICAgICAgaSsrXG4gICAgICApIHtcbiAgICAgICAgb2ZmTGltaXRDaGVjay5wdXNoKGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLmlzT2ZmTGltaXQoKSk7XG4gICAgICB9XG4gICAgICBpZiAob2ZmTGltaXRDaGVjay5pbmNsdWRlcyh0cnVlKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVsxXTtcbiAgICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMV0gKyBsZW5ndGg7XG4gICAgICAgIGkrK1xuICAgICAgKSB7XG4gICAgICAgIGJvYXJkW2ldW3NoaXBSYW5kb21PcmlnaW5bMF1bMF1dLm1ha2VTaGlwKHNoaXApO1xuICAgICAgfVxuICAgICAgbWFrZUNlbGxzT2ZmbGltaXRzKHNoaXBSYW5kb21PcmlnaW5bMF0sIHNoaXBSYW5kb21PcmlnaW5bMV0sIGxlbmd0aCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZm9yIChcbiAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVswXTtcbiAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdICsgbGVuZ3RoO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBvZmZMaW1pdENoZWNrLnB1c2goYm9hcmRbc2hpcFJhbmRvbU9yaWdpblswXVsxXV1baV0uaXNPZmZMaW1pdCgpKTtcbiAgICB9XG4gICAgaWYgKG9mZkxpbWl0Q2hlY2suaW5jbHVkZXModHJ1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmb3IgKFxuICAgICAgbGV0IGkgPSBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdO1xuICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMF0gKyBsZW5ndGg7XG4gICAgICBpKytcbiAgICApIHtcbiAgICAgIGJvYXJkW3NoaXBSYW5kb21PcmlnaW5bMF1bMV1dW2ldLm1ha2VTaGlwKHNoaXApO1xuICAgIH1cbiAgICBtYWtlQ2VsbHNPZmZsaW1pdHMoc2hpcFJhbmRvbU9yaWdpblswXSwgc2hpcFJhbmRvbU9yaWdpblsxXSwgbGVuZ3RoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcyg0KSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDQpO1xuLy8gICB9XG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcyg0KSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDQpO1xuLy8gICB9XG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcygzKSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDMpO1xuLy8gICB9XG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcygzKSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDMpO1xuLy8gICB9XG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcygyKSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDIpO1xuLy8gICB9XG4vLyAgIHdoaWxlICghcGxhY2VTaGlwcygyKSkge1xuLy8gICAgIGNvbnNvbGUubG9nKDIpO1xuLy8gICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygxKSkge1xuICAgIGNvbnNvbGUubG9nKDEpO1xuICB9XG4gIHdoaWxlICghcGxhY2VTaGlwcygxKSkge1xuICAgIGNvbnNvbGUubG9nKDEpO1xuICB9XG5cbiAgY29uc3QgZHJvcEJvbWIgPSAoY29vcmQpID0+IHtcbiAgICBpZihjb29yZFswXSA+IDkgfHwgY29vcmRbMF0gPCAwIHx8IGNvb3JkWzFdID4gOSB8fCBjb29yZFsxXSA8IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ091dCBvZiByYW5nZSwgZmlyZSBhZ2FpbiEnKVxuICAgICAgICByZXR1cm5cbiAgICB9IFxuICAgIGxldCBzcXVhcmUgPSBib2FyZFtjb29yZFsxXV1bY29vcmRbMF1dO1xuICAgIHJldHVybiBzcXVhcmUuc3RyaWtlKClcbiAgICBcblxuICB9XG5cbi8vICAgcHJpbnRCb2FyZCgpO1xuXG4gIHJldHVybiB7XG4gICAgcHJpbnRCb2FyZCxcbiAgICBkcm9wQm9tYixcbiAgICBzaGlwc1xuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU2hpcChsZW5ndGgpIHtcbiAgbGV0IG51bUhpdCA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG5cbiAgY29uc3Qgc3RyaWtlID0gKCkgPT4ge1xuICAgIG51bUhpdCsrO1xuICAgIGNvbnNvbGUubG9nKGBTVFJJS0UhISEhICR7bnVtSGl0fSBzcXVhcmUocykgb2Ygc2hpcCBsZW5ndGg6ICR7bGVuZ3RofSBkZXN0cm95ZWQuICR7bGVuZ3RoIC0gbnVtSGl0fSBsZWZ0IHRvIGRlc3Ryb3lgKVxuICAgIGlmKG51bUhpdCA9PT0gbGVuZ3RoKSBzdW5rID0gdHJ1ZVxufTtcblxuY29uc3QgZ2V0TnVtSGl0ID0gKCkgPT4gbnVtSGl0XG5cbmNvbnN0IGdldFN1bmsgPSAoKSA9PiBzdW5rXG5cblxuLy8gICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4vLyAgICAgc3VuayA9IG51bUhpdCA9PT0gbGVuZ3RoID8gdHJ1ZSA6IGZhbHNlO1xuLy8gICAgIHJldHVybiBzdW5rO1xuLy8gICB9O1xuXG4gIHJldHVybiB7XG4gICAgc3RyaWtlLFxuICAgIGdldE51bUhpdCxcbiAgICBnZXRTdW5rLFxuICAgIGxlbmd0aFxuICB9O1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBpbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL21vZHVsZXMvZ2FtZWJvYXJkXCI7XG5pbXBvcnQgR2FtZUNvbnRyb2xsZXIgZnJvbSBcIi4vbW9kdWxlcy9nYW1lQ29udHJvbGxlclwiO1xuXG4vLyBjb25zdCBnYW1lID0gR2FtZUJvYXJkKCk7XG5cbmNvbnN0IGdhbWUgPSBHYW1lQ29udHJvbGxlcignSmFtZXMnKVxuXG5cblxuLy8gZ2FtZS5wcmludEJvYXJkKClcblxuXG53aW5kb3cuYmF0dGxlID0ge1xuICAgIGdhbWVcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=