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
          removeCoord()
          return value
    }
    console.log('fire again, this square is already hit')
    return false
  };

  const makeShip = (newShip) => {
    ship = newShip;
    value = 1;
  };

  const printValue = (player) => {
    if(player === 'human') return value;
    else {
        if(value === 1) return 0
        else return value
    }

  }

  const getValue = () => value

  const getShip = () => ship

  const setValue = (newValue) => {
    value = newValue;
  };

  const getCoord = () => coord

  const removeCoord = () => {
    coord = null
  }

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
    printValue
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
            targetShips: board2.ships,
            lastRound: {
                coords: null,
                shot: null
            },
            hits: []
        },
        {
            name: player2,
            targetBoard: board1,
            targetShips: board1.ships,
            lastRound: {
                coords: null,
                shot: null
            },
            hits: []
        }
    ]

    let activePlayer = players[0]
    const getActivePlayer = () => activePlayer
    const shipsLeft = () => activePlayer.targetShips.map(ship => ship.getSunk()).includes(false)
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        if(activePlayer.name === 'computer') {
            return computersTurn()
        }
    }
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
        // console.log(players[0].targetShips)
        board1.printBoard('human');
        console.log(`${players[1].name}'s board`)
        // console.log(players[0].targetShips)
        board2.printBoard('computer');
    }

    const playRound = (coords) => {
        // console.log(
        //   `Dropping ${getActivePlayer().name}'s token into column ${column}...`
        // );
        // const shootNearOffset = [[0,-1], [1,0], [0,1], [-1,0]]
        // const surroundingSquares = []


        console.log(`Dropping ${activePlayer.name}'s bomb onto coordinate ${coords}`)
        const hitValue = activePlayer.targetBoard.dropBomb(coords)
        // activePlayer.lastRound.coords = coords;
        // activePlayer.lastRound.shot = hitValue;

        if(hitValue) {
            // console.log(activePlayer.targetShips.map(ship => ship.getSunk()), shipsLeft())
            activePlayer.lastRound.coords = coords;
            activePlayer.lastRound.shot = hitValue;
            activePlayer.hits.push(coords)
            if(!shipsLeft()) {
                console.log(`${activePlayer.name} has distroyed all their opponents fleet`)
                return
            }
            if(switchPlayer()) return;
        }
        console.log(players)    
        // if(activePlayer.lastRound.shot === 2) {
        //     shootNearOffset.forEach(offset => {
        //        surroundingSquares.push([activePlayer.lastRound.coords[0]+offset[0], activePlayer.lastRound.coords[1]+offset[1]])
        //     })
        // }
        // console.log(surroundingSquares)

        printNewRound();
        // if(activePlayer.name === 'computer') computersTurn()
        /*  This is where we would check for a winner and handle that logic,
            such as a win message. */
    
      };

    const computersTurn = () => {
        // const randomCoords = [Math.floor(Math.random()*10),Math.floor(Math.random()*10)]
        const coordsLeft = [];
        const targetBoard = activePlayer.targetBoard.getBoard()
    

        targetBoard.map(row => row.map(cell => cell.getCoord())).map(row => row.forEach(coord => {
            if(coord) coordsLeft.push(coord)
        }))
        const coordsLeftStringify = coordsLeft.map(coord => coord.toString())
        console.log(coordsLeftStringify)


        function generalFoundHitProcessing(coord) {
            const hitType = checkHitType(coord);
            if(hitType === 'single') return singleHitProcessing(coord)
            else {
                if(hitType === 0){
                    for(let i = 0; i <= 4; i++) {
                        if(coordsLeftStringify.includes([coord[0]+i, coord[1]].toString())){
                            playRound([coord[0]+i, coord[1]])
                            return true
                        } 
                    }
                } else if(hitType === 1){
                    for(let i = 0; i <= 4; i++) {
                        if(coordsLeftStringify.includes([coord[0], coord[1]+i].toString())){
                            playRound([coord[0], coord[1]+i])
                            return true
                        } 
                    }
                } else if(hitType === 2){
                    for(let i = 0; i <= 4; i++) {
                        if(coordsLeftStringify.includes([coord[0]-i, coord[1]].toString())){
                            playRound([coord[0]-i, coord[1]])
                            return true
                        } 
                    }
                } else if(hitType === 3){
                    for(let i = 0; i <= 4; i++) {
                        if(coordsLeftStringify.includes([coord[0], coord[1]-i].toString())){
                            playRound([coord[0], coord[1]-i])
                            return true
                        } 
                    }
                }
            }
        }



        // if(activePlayer.lastRound.shot === 2){
        //     let coords = activePlayer.lastRound.coords
        //     let cell = targetBoard[coords[1]][coords[0]]
        //     let shipSunk = cell.getShip().getSunk()
        //     if(!shipSunk) {
        //         let cellType = checkHitType(cell)
        //         if(cellType === 'single'){
        //             return singleHitProcessing(cell)
        //         }
        //     }
        // }
        if(activePlayer.lastRound.shot === 2 && !targetBoard[activePlayer.lastRound.coords[1]][activePlayer.lastRound.coords[0]].getShip().getSunk()){
            let coords = activePlayer.lastRound.coords
            return generalFoundHitProcessing(coords)
        } else {
           return processFindFirstUnsunkStruckShip()
        }

        function processFindFirstUnsunkStruckShip() {

            function findFirstUnSunkStruckShip(){
                for(let i = 0; i < 10; i++) {
                    for(let j = 0; j < 10; j++) {
                        if(targetBoard[i][j].getValue() === 2 && !targetBoard[i][j].getShip().getSunk()) return [j,i]
                    }
                }
                return false
            }

            const foundUnsunkStuckShip = findFirstUnSunkStruckShip()

            if(foundUnsunkStuckShip) {
                return generalFoundHitProcessing(foundUnsunkStuckShip)
            }
            else {
                //general random cell processing
                console.log('general random hit')
                return generalRandomHit()
            }

            

        }






        // Three hit types (all ships that are unsunk):
        // 1. Single hit (no neighbour within 3 squares)
        // 2. Multiple adjacent hits 
        // 3. Separated hits (no further than 3 squares)
        function checkHitType(coord) {
            console.log('whhhattt!!', coord)
            // const targetBoardArray = activePlayer.targetBoard.getBoard()
            console.log('active player hits',activePlayer.hits)
            const unsunkHitShips = activePlayer.hits.filter(hit => targetBoard[hit[1]][hit[0]].getShip()).filter(hit => !targetBoard[hit[1]][hit[0]].getShip().getSunk())
            console.log('unsunk ships',unsunkHitShips)
            const unsunkHitShipsStringified = unsunkHitShips.map(cord => cord.toString())
            // let coord = cell.getCoord()
            //loop from 3 - 6 - 9 - 12 O'clock 
            for(let i = 0; i < 4; i++) {
                for(let j = 1; j < 2; j++) {
                    if(i === 0){
                        console.log('foo')
                        if(unsunkHitShipsStringified.includes([coord[0]+j, coord[1]].toString())) {
                            if(targetBoard[coord[1]][coord[0]+j].getValue() === 2){
                            return i
                            }
                        }
                    } else if(i === 2){
                        console.log('bar')
                        
                        if(unsunkHitShipsStringified.includes([coord[0]-j, coord[1]].toString())) {
                            if(targetBoard[coord[1]][coord[0]-j].getValue() === 2){
                                return i
                            }
                        }
                    } else if(i === 1) {
                        console.log('baz')
                        
                        if(unsunkHitShipsStringified.includes([coord[0], coord[1]+j].toString())) {
                            if(targetBoard[coord[1]+j][coord[0]].getValue() === 2){
                                return i
                            }
                        } 
                    } else if(i === 3) {
                        console.log('jim')
                        if(unsunkHitShipsStringified.includes([coord[0], coord[1]-j].toString())) {
                            if(targetBoard[coord[1]-j][coord[0]].getValue() === 2){
                                return i
                            }
                        }
                    }
                    
                }
            }
            return 'single'
        }

       
        


        // ***********
        // Last shot === 2(hit)
        function singleHitProcessing(coord) {
            console.log('heeerrreee we areeee', coord)
        
        const shootNearOffset = [[0,-1], [1,0], [0,1], [-1,0]]
        function getRandomSurroundIndex() {
            return Math.floor(Math.random()*4)
        }
        // if(activePlayer.lastRound.shot === 2) 
            // console.log('focused shot1')
            const surroundingSquares = []
            shootNearOffset.forEach(offset => {
               surroundingSquares.push([coord[0]+offset[0], coord[1]+offset[1]])
            })
            // surroundingSquares = surroundingSquares.filter(square => !square.includes(-1) || !square.includes(10))

            //implement better logic for selecting a surrounding square 
            //1. filter the surrounding squares to be only the squares left in the unhit area
            //2. then randomly select square from filter array

            const surroundingSquaresStringify = surroundingSquares.map(square => square.toString())
            const surroundingSquaresAvailable = surroundingSquaresStringify.filter(square => coordsLeftStringify.includes(square)).map(square => [+square[0],+square[2]])
            
            console.log('surroundingSquaresAvailable', surroundingSquaresAvailable)
            
            // Need to change:  ['3,4','5,4','9,1']   =>    [[3,4],[5,4],[9,1]]

            if(surroundingSquaresAvailable.length > 0) {
                playRound(surroundingSquaresAvailable[0])
                return true
            } else {
                generalRandomHit()
            }

            // surroundingSquares.map(square => activePlayer.targetBoard[square[1]].getValue())
            // console.log('surrounding squares', surroundingSquares)
            // // const surroundingSquaresStringify = surroundingSquares.map(coord => coord.toString())
            // let randomSurroundingCoord
            // const getSurroundCoord = () => {
            //     randomSurroundingCoord = surroundingSquares[getRandomSurroundIndex()]
            //     return randomSurroundingCoord
            // }
            // // console.log(getSurroundCoord(), coordsLeftStringify.includes(getSurroundCoord().toString()))
            // while(coordsLeftStringify.includes(getSurroundCoord().toString())){
            //     console.log('focused shot1', randomSurroundingCoord)
            //     playRound(randomSurroundingCoord)
            //     return true
                
            // }
        
    }
        // ************

        function generalRandomHit() {
            console.log('skipped')
            const randomIndex = Math.floor(Math.random()*coordsLeft.length)
            // console.log(coordsLeft, randomIndex)
            playRound(coordsLeft[randomIndex])
            // console.log(board1.getBoard().map(row => row.map(cell => cell.getCoord())))
            return true
        }



    }



   

    // const getShips = () => {

    // }

    





      

    printNewRound()
    

    return {
        playRound
    }
}





// const humanBoard = board1.getBoard()
//         const cellLookUp = [-3,3]

//         function traverseMiss(dir, coord) {
//             let workingRange = []
//             if(dir === 'H'){
//                 for(let i = 0; i >= -3; i--) {
//                     if(humanBoard[coord[1]][coord[0] + i].getValue() === 3) {
//                         workingRange.push(i)
//                     }
//                 }
//                 for(let i = 0; i <= 3; i++) {
//                     if(humanBoard[coord[1]][coord[0] + i].getValue() === 3) {
//                         workingRange.push(i)
//                     }
//                 }
//             } else {
//                 for(let i = 0; i >= -3; i--) {
//                     if(humanBoard[coord[1] + i][coord[0]].getValue() === 3) {
//                         workingRange.push(i)
//                     }
//                 }
//                 for(let i = 0; i <= 3; i++) {
//                     if(humanBoard[coord[1] + i][coord[0] + i].getValue() === 3) {
//                         workingRange.push(i)
//                     }
//                 }
//             }
//             //[2] =>  [-3,2]
//             //[]  =>  [-3,-3]
//             //[-3,-2, 1,2] =>  [-2, 1]
//             let minusNums = workingRange.filter(num => num<0)
//             minusNums.sort((a,b) => )
//             let posNums = workingRange.filter(num => num>0) 
//             return workingRange
//         }


//         for(let i = 0; i <= 9; i++) {
//             for(let j = 0; j <= 9; j++) {
//                 if(humanBoard[i][j].getValue() === 2 && !humanBoard[i][j].getShip().getSunk()){
//                     let coord = humanBoard[i][j].getCoord()
                
//                     let foundWorkingXRange = traverseMiss('H', coord)
//                     let workingXRange = foundWorkingXRange.length > 0 ? foundWorkingXRange : [-3,3]
//                     let foundWorkingYRange = traverseMiss('V', coord)
//                     let workingYRange = foundWorkingYRange.length > 0 ? foundWorkingYRange : [-3,3]

//                 }
//             }
//         }




// ***********
        // Last shot === 2(hit)
        // function singleHitProcessing(cell) {
            
        
        //     const shootNearOffset = [[0,-1], [1,0], [0,1], [-1,0]]
        //     function getRandomSurroundIndex() {
        //         return Math.floor(Math.random()*4)
        //     }
        //     // if(activePlayer.lastRound.shot === 2) 
        //         // console.log('focused shot1')
        //         const surroundingSquares = []
        //         shootNearOffset.forEach(offset => {
        //            surroundingSquares.push([activePlayer.lastRound.coords[0]+offset[0], activePlayer.lastRound.coords[1]+offset[1]])
        //         })
        //         // surroundingSquares = surroundingSquares.filter(square => !square.includes(-1) || !square.includes(10))
    
    
    
        //         // surroundingSquares.map(square => activePlayer.targetBoard[square[1]].getValue())
        //         console.log('focused shot1', surroundingSquares)
        //         // const surroundingSquaresStringify = surroundingSquares.map(coord => coord.toString())
        //         let randomSurroundingCoord
        //         const getSurroundCoord = () => {
        //             randomSurroundingCoord = surroundingSquares[getRandomSurroundIndex()]
        //             return randomSurroundingCoord
        //         }
        //         console.log(getSurroundCoord(), coordsLeftStringify.includes(getSurroundCoord().toString()))
        //         while(coordsLeftStringify.includes(getSurroundCoord().toString())){
        //             console.log('focused shot1', randomSurroundingCoord)
        //             playRound(randomSurroundingCoord)
        //             return true
                    
        //         }
            
        // }
            // ************

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
      board[i].push((0,_cell__WEBPACK_IMPORTED_MODULE_0__["default"])([j,i]));
    }
  }

  const getBoard = () => board;

  function printBoard(player) {
    // const boardWithCellValues = board.map((row) => row.map((cell) => [cell.isOffLimit(), cell.getValue()].join(',')))
    // const boardWithCellValues = board.map((row) => row.map((cell) => cell.getShip()))
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
    if(coord[0] > 9 || coord[0] < 0 || coord[1] > 9 || coord[1] < 0) {
        console.log('Out of range, fire again!')
        return
    } 
    const square = board[coord[1]][coord[0]];
    return square.strike()
    

  }

//   printBoard();

  return {
    printBoard,
    dropBomb,
    ships,
    getBoard
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDN0tlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQThCLFFBQVEsNEJBQTRCLFFBQVEsYUFBYSxpQkFBaUI7QUFDeEc7QUFDQTs7QUFFQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUMxQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05BO0FBQ3NEOztBQUV0RDs7QUFFQSxhQUFhLG1FQUFjOzs7O0FBSTNCOzs7QUFHQTtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2NlbGwuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Byb2plY3QtYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHJvamVjdC1iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ2VsbChjb29yZCkge1xuICBsZXQgaGl0Qm9vbCA9IGZhbHNlO1xuICBsZXQgc2hpcCA9IG51bGw7XG4gIGxldCBvZmZMaW1pdCA9IGZhbHNlO1xuICBsZXQgdmFsdWUgPSAwO1xuICBcblxuICBjb25zdCBpc09mZkxpbWl0ID0gKCkgPT4gb2ZmTGltaXQ7XG5cbiAgY29uc3QgbWFrZU9mZkxpbWl0ID0gKCkgPT4ge1xuICAgIG9mZkxpbWl0ID0gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBzdHJpa2UgPSAoKSA9PiB7XG4gICAgaWYodmFsdWUgPT09IDAgfHwgdmFsdWUgPT09IDEpIHtcbiAgICAgICAgaWYgKHNoaXApIHtcbiAgICAgICAgICAgIHNoaXAuc3RyaWtlKCk7XG4gICAgICAgICAgICBoaXRCb29sID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gMlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTUlTUyEhJylcbiAgICAgICAgICAgIGhpdEJvb2wgPSB0cnVlO1xuICAgICAgICAgICAgdmFsdWUgPSAzXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlbW92ZUNvb3JkKClcbiAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ2ZpcmUgYWdhaW4sIHRoaXMgc3F1YXJlIGlzIGFscmVhZHkgaGl0JylcbiAgICByZXR1cm4gZmFsc2VcbiAgfTtcblxuICBjb25zdCBtYWtlU2hpcCA9IChuZXdTaGlwKSA9PiB7XG4gICAgc2hpcCA9IG5ld1NoaXA7XG4gICAgdmFsdWUgPSAxO1xuICB9O1xuXG4gIGNvbnN0IHByaW50VmFsdWUgPSAocGxheWVyKSA9PiB7XG4gICAgaWYocGxheWVyID09PSAnaHVtYW4nKSByZXR1cm4gdmFsdWU7XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHZhbHVlID09PSAxKSByZXR1cm4gMFxuICAgICAgICBlbHNlIHJldHVybiB2YWx1ZVxuICAgIH1cblxuICB9XG5cbiAgY29uc3QgZ2V0VmFsdWUgPSAoKSA9PiB2YWx1ZVxuXG4gIGNvbnN0IGdldFNoaXAgPSAoKSA9PiBzaGlwXG5cbiAgY29uc3Qgc2V0VmFsdWUgPSAobmV3VmFsdWUpID0+IHtcbiAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IGdldENvb3JkID0gKCkgPT4gY29vcmRcblxuICBjb25zdCByZW1vdmVDb29yZCA9ICgpID0+IHtcbiAgICBjb29yZCA9IG51bGxcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaXNPZmZMaW1pdCxcbiAgICBtYWtlT2ZmTGltaXQsXG4gICAgc3RyaWtlLFxuICAgIG1ha2VTaGlwLFxuICAgIGdldFZhbHVlLFxuICAgIHNldFZhbHVlLFxuICAgIGdldFNoaXAsXG4gICAgZ2V0Q29vcmQsXG4gICAgcmVtb3ZlQ29vcmQsXG4gICAgcHJpbnRWYWx1ZVxuICB9O1xufVxuIiwiaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQ29udHJvbGxlcihwbGF5ZXIxLCBwbGF5ZXIyID0gJ2NvbXB1dGVyJykge1xuICAgIGxldCBib2FyZDEgPSBHYW1lQm9hcmQoKVxuICAgIGxldCBib2FyZDIgPSBHYW1lQm9hcmQoKVxuXG4gICAgY29uc3QgcGxheWVycyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogcGxheWVyMSxcbiAgICAgICAgICAgIHRhcmdldEJvYXJkOiBib2FyZDIsXG4gICAgICAgICAgICB0YXJnZXRTaGlwczogYm9hcmQyLnNoaXBzLFxuICAgICAgICAgICAgbGFzdFJvdW5kOiB7XG4gICAgICAgICAgICAgICAgY29vcmRzOiBudWxsLFxuICAgICAgICAgICAgICAgIHNob3Q6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXRzOiBbXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiBwbGF5ZXIyLFxuICAgICAgICAgICAgdGFyZ2V0Qm9hcmQ6IGJvYXJkMSxcbiAgICAgICAgICAgIHRhcmdldFNoaXBzOiBib2FyZDEuc2hpcHMsXG4gICAgICAgICAgICBsYXN0Um91bmQ6IHtcbiAgICAgICAgICAgICAgICBjb29yZHM6IG51bGwsXG4gICAgICAgICAgICAgICAgc2hvdDogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpdHM6IFtdXG4gICAgICAgIH1cbiAgICBdXG5cbiAgICBsZXQgYWN0aXZlUGxheWVyID0gcGxheWVyc1swXVxuICAgIGNvbnN0IGdldEFjdGl2ZVBsYXllciA9ICgpID0+IGFjdGl2ZVBsYXllclxuICAgIGNvbnN0IHNoaXBzTGVmdCA9ICgpID0+IGFjdGl2ZVBsYXllci50YXJnZXRTaGlwcy5tYXAoc2hpcCA9PiBzaGlwLmdldFN1bmsoKSkuaW5jbHVkZXMoZmFsc2UpXG4gICAgY29uc3Qgc3dpdGNoUGxheWVyID0gKCkgPT4ge1xuICAgICAgICBhY3RpdmVQbGF5ZXIgPSBhY3RpdmVQbGF5ZXIgPT09IHBsYXllcnNbMF0gPyBwbGF5ZXJzWzFdIDogcGxheWVyc1swXTtcbiAgICAgICAgaWYoYWN0aXZlUGxheWVyLm5hbWUgPT09ICdjb21wdXRlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlcnNUdXJuKClcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBwcmludE5ld1JvdW5kID0gKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtnZXRBY3RpdmVQbGF5ZXIoKS5uYW1lfSdzIHR1cm4uYCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcwID0gbm8gc2hpcCwgIDEgPSBzaGlwLCAgMiA9IHN0cmlrZSwgIDMgPSBtaXNzJylcbiAgICAgICAgLy8gaWYoYWN0aXZlUGxheWVyID09PSBwbGF5ZXJzWzBdKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzBdLm5hbWV9J3MgYm9hcmRgKVxuICAgICAgICAvLyAgICAgYm9hcmQxLnByaW50Qm9hcmQoKTtcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGAke3BsYXllcnNbMV0ubmFtZX0ncyBib2FyZGApXG4gICAgICAgIC8vICAgICBib2FyZDIucHJpbnRCb2FyZCgpO1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnNvbGUubG9nKGAke3BsYXllcnNbMF0ubmFtZX0ncyBib2FyZGApXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHBsYXllcnNbMF0udGFyZ2V0U2hpcHMpXG4gICAgICAgIGJvYXJkMS5wcmludEJvYXJkKCdodW1hbicpO1xuICAgICAgICBjb25zb2xlLmxvZyhgJHtwbGF5ZXJzWzFdLm5hbWV9J3MgYm9hcmRgKVxuICAgICAgICAvLyBjb25zb2xlLmxvZyhwbGF5ZXJzWzBdLnRhcmdldFNoaXBzKVxuICAgICAgICBib2FyZDIucHJpbnRCb2FyZCgnY29tcHV0ZXInKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbGF5Um91bmQgPSAoY29vcmRzKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFxuICAgICAgICAvLyAgIGBEcm9wcGluZyAke2dldEFjdGl2ZVBsYXllcigpLm5hbWV9J3MgdG9rZW4gaW50byBjb2x1bW4gJHtjb2x1bW59Li4uYFxuICAgICAgICAvLyApO1xuICAgICAgICAvLyBjb25zdCBzaG9vdE5lYXJPZmZzZXQgPSBbWzAsLTFdLCBbMSwwXSwgWzAsMV0sIFstMSwwXV1cbiAgICAgICAgLy8gY29uc3Qgc3Vycm91bmRpbmdTcXVhcmVzID0gW11cblxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBEcm9wcGluZyAke2FjdGl2ZVBsYXllci5uYW1lfSdzIGJvbWIgb250byBjb29yZGluYXRlICR7Y29vcmRzfWApXG4gICAgICAgIGNvbnN0IGhpdFZhbHVlID0gYWN0aXZlUGxheWVyLnRhcmdldEJvYXJkLmRyb3BCb21iKGNvb3JkcylcbiAgICAgICAgLy8gYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHMgPSBjb29yZHM7XG4gICAgICAgIC8vIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuc2hvdCA9IGhpdFZhbHVlO1xuXG4gICAgICAgIGlmKGhpdFZhbHVlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhY3RpdmVQbGF5ZXIudGFyZ2V0U2hpcHMubWFwKHNoaXAgPT4gc2hpcC5nZXRTdW5rKCkpLCBzaGlwc0xlZnQoKSlcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzID0gY29vcmRzO1xuICAgICAgICAgICAgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID0gaGl0VmFsdWU7XG4gICAgICAgICAgICBhY3RpdmVQbGF5ZXIuaGl0cy5wdXNoKGNvb3JkcylcbiAgICAgICAgICAgIGlmKCFzaGlwc0xlZnQoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2FjdGl2ZVBsYXllci5uYW1lfSBoYXMgZGlzdHJveWVkIGFsbCB0aGVpciBvcHBvbmVudHMgZmxlZXRgKVxuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc3dpdGNoUGxheWVyKCkpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJzKSAgICBcbiAgICAgICAgLy8gaWYoYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID09PSAyKSB7XG4gICAgICAgIC8vICAgICBzaG9vdE5lYXJPZmZzZXQuZm9yRWFjaChvZmZzZXQgPT4ge1xuICAgICAgICAvLyAgICAgICAgc3Vycm91bmRpbmdTcXVhcmVzLnB1c2goW2FjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzWzBdK29mZnNldFswXSwgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHNbMV0rb2Zmc2V0WzFdXSlcbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coc3Vycm91bmRpbmdTcXVhcmVzKVxuXG4gICAgICAgIHByaW50TmV3Um91bmQoKTtcbiAgICAgICAgLy8gaWYoYWN0aXZlUGxheWVyLm5hbWUgPT09ICdjb21wdXRlcicpIGNvbXB1dGVyc1R1cm4oKVxuICAgICAgICAvKiAgVGhpcyBpcyB3aGVyZSB3ZSB3b3VsZCBjaGVjayBmb3IgYSB3aW5uZXIgYW5kIGhhbmRsZSB0aGF0IGxvZ2ljLFxuICAgICAgICAgICAgc3VjaCBhcyBhIHdpbiBtZXNzYWdlLiAqL1xuICAgIFxuICAgICAgfTtcblxuICAgIGNvbnN0IGNvbXB1dGVyc1R1cm4gPSAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnN0IHJhbmRvbUNvb3JkcyA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTApLE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMCldXG4gICAgICAgIGNvbnN0IGNvb3Jkc0xlZnQgPSBbXTtcbiAgICAgICAgY29uc3QgdGFyZ2V0Qm9hcmQgPSBhY3RpdmVQbGF5ZXIudGFyZ2V0Qm9hcmQuZ2V0Qm9hcmQoKVxuICAgIFxuXG4gICAgICAgIHRhcmdldEJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChjZWxsID0+IGNlbGwuZ2V0Q29vcmQoKSkpLm1hcChyb3cgPT4gcm93LmZvckVhY2goY29vcmQgPT4ge1xuICAgICAgICAgICAgaWYoY29vcmQpIGNvb3Jkc0xlZnQucHVzaChjb29yZClcbiAgICAgICAgfSkpXG4gICAgICAgIGNvbnN0IGNvb3Jkc0xlZnRTdHJpbmdpZnkgPSBjb29yZHNMZWZ0Lm1hcChjb29yZCA9PiBjb29yZC50b1N0cmluZygpKVxuICAgICAgICBjb25zb2xlLmxvZyhjb29yZHNMZWZ0U3RyaW5naWZ5KVxuXG5cbiAgICAgICAgZnVuY3Rpb24gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhjb29yZCkge1xuICAgICAgICAgICAgY29uc3QgaGl0VHlwZSA9IGNoZWNrSGl0VHlwZShjb29yZCk7XG4gICAgICAgICAgICBpZihoaXRUeXBlID09PSAnc2luZ2xlJykgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY29vcmQpXG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihoaXRUeXBlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoW2Nvb3JkWzBdK2ksIGNvb3JkWzFdXS50b1N0cmluZygpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheVJvdW5kKFtjb29yZFswXStpLCBjb29yZFsxXV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaGl0VHlwZSA9PT0gMSl7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPD0gNDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjb29yZHNMZWZ0U3RyaW5naWZ5LmluY2x1ZGVzKFtjb29yZFswXSwgY29vcmRbMV0raV0udG9TdHJpbmcoKSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlSb3VuZChbY29vcmRbMF0sIGNvb3JkWzFdK2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGhpdFR5cGUgPT09IDIpe1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDw9IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhbY29vcmRbMF0taSwgY29vcmRbMV1dLnRvU3RyaW5nKCkpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5Um91bmQoW2Nvb3JkWzBdLWksIGNvb3JkWzFdXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihoaXRUeXBlID09PSAzKXtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8PSA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoW2Nvb3JkWzBdLCBjb29yZFsxXS1pXS50b1N0cmluZygpKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheVJvdW5kKFtjb29yZFswXSwgY29vcmRbMV0taV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgLy8gaWYoYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID09PSAyKXtcbiAgICAgICAgLy8gICAgIGxldCBjb29yZHMgPSBhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3Jkc1xuICAgICAgICAvLyAgICAgbGV0IGNlbGwgPSB0YXJnZXRCb2FyZFtjb29yZHNbMV1dW2Nvb3Jkc1swXV1cbiAgICAgICAgLy8gICAgIGxldCBzaGlwU3VuayA9IGNlbGwuZ2V0U2hpcCgpLmdldFN1bmsoKVxuICAgICAgICAvLyAgICAgaWYoIXNoaXBTdW5rKSB7XG4gICAgICAgIC8vICAgICAgICAgbGV0IGNlbGxUeXBlID0gY2hlY2tIaXRUeXBlKGNlbGwpXG4gICAgICAgIC8vICAgICAgICAgaWYoY2VsbFR5cGUgPT09ICdzaW5nbGUnKXtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIHNpbmdsZUhpdFByb2Nlc3NpbmcoY2VsbClcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgaWYoYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5zaG90ID09PSAyICYmICF0YXJnZXRCb2FyZFthY3RpdmVQbGF5ZXIubGFzdFJvdW5kLmNvb3Jkc1sxXV1bYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHNbMF1dLmdldFNoaXAoKS5nZXRTdW5rKCkpe1xuICAgICAgICAgICAgbGV0IGNvb3JkcyA9IGFjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzXG4gICAgICAgICAgICByZXR1cm4gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhjb29yZHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgIHJldHVybiBwcm9jZXNzRmluZEZpcnN0VW5zdW5rU3RydWNrU2hpcCgpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzRmluZEZpcnN0VW5zdW5rU3RydWNrU2hpcCgpIHtcblxuICAgICAgICAgICAgZnVuY3Rpb24gZmluZEZpcnN0VW5TdW5rU3RydWNrU2hpcCgpe1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRCb2FyZFtpXVtqXS5nZXRWYWx1ZSgpID09PSAyICYmICF0YXJnZXRCb2FyZFtpXVtqXS5nZXRTaGlwKCkuZ2V0U3VuaygpKSByZXR1cm4gW2osaV1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZm91bmRVbnN1bmtTdHVja1NoaXAgPSBmaW5kRmlyc3RVblN1bmtTdHJ1Y2tTaGlwKClcblxuICAgICAgICAgICAgaWYoZm91bmRVbnN1bmtTdHVja1NoaXApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2VuZXJhbEZvdW5kSGl0UHJvY2Vzc2luZyhmb3VuZFVuc3Vua1N0dWNrU2hpcClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vZ2VuZXJhbCByYW5kb20gY2VsbCBwcm9jZXNzaW5nXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dlbmVyYWwgcmFuZG9tIGhpdCcpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdlbmVyYWxSYW5kb21IaXQoKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcblxuICAgICAgICB9XG5cblxuXG5cblxuXG4gICAgICAgIC8vIFRocmVlIGhpdCB0eXBlcyAoYWxsIHNoaXBzIHRoYXQgYXJlIHVuc3Vuayk6XG4gICAgICAgIC8vIDEuIFNpbmdsZSBoaXQgKG5vIG5laWdoYm91ciB3aXRoaW4gMyBzcXVhcmVzKVxuICAgICAgICAvLyAyLiBNdWx0aXBsZSBhZGphY2VudCBoaXRzIFxuICAgICAgICAvLyAzLiBTZXBhcmF0ZWQgaGl0cyAobm8gZnVydGhlciB0aGFuIDMgc3F1YXJlcylcbiAgICAgICAgZnVuY3Rpb24gY2hlY2tIaXRUeXBlKGNvb3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnd2hoaGF0dHQhIScsIGNvb3JkKVxuICAgICAgICAgICAgLy8gY29uc3QgdGFyZ2V0Qm9hcmRBcnJheSA9IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZC5nZXRCb2FyZCgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZlIHBsYXllciBoaXRzJyxhY3RpdmVQbGF5ZXIuaGl0cylcbiAgICAgICAgICAgIGNvbnN0IHVuc3Vua0hpdFNoaXBzID0gYWN0aXZlUGxheWVyLmhpdHMuZmlsdGVyKGhpdCA9PiB0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpKS5maWx0ZXIoaGl0ID0+ICF0YXJnZXRCb2FyZFtoaXRbMV1dW2hpdFswXV0uZ2V0U2hpcCgpLmdldFN1bmsoKSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1bnN1bmsgc2hpcHMnLHVuc3Vua0hpdFNoaXBzKVxuICAgICAgICAgICAgY29uc3QgdW5zdW5rSGl0U2hpcHNTdHJpbmdpZmllZCA9IHVuc3Vua0hpdFNoaXBzLm1hcChjb3JkID0+IGNvcmQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC8vIGxldCBjb29yZCA9IGNlbGwuZ2V0Q29vcmQoKVxuICAgICAgICAgICAgLy9sb29wIGZyb20gMyAtIDYgLSA5IC0gMTIgTydjbG9jayBcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGogPSAxOyBqIDwgMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGkgPT09IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZvbycpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFtjb29yZFswXStqLCBjb29yZFsxXV0udG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRCb2FyZFtjb29yZFsxXV1bY29vcmRbMF0ral0uZ2V0VmFsdWUoKSA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihpID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdiYXInKVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFtjb29yZFswXS1qLCBjb29yZFsxXV0udG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRCb2FyZFtjb29yZFsxXV1bY29vcmRbMF0tal0uZ2V0VmFsdWUoKSA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaSA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2JheicpXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVuc3Vua0hpdFNoaXBzU3RyaW5naWZpZWQuaW5jbHVkZXMoW2Nvb3JkWzBdLCBjb29yZFsxXStqXS50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRhcmdldEJvYXJkW2Nvb3JkWzFdK2pdW2Nvb3JkWzBdXS5nZXRWYWx1ZSgpID09PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaSA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ppbScpXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1bnN1bmtIaXRTaGlwc1N0cmluZ2lmaWVkLmluY2x1ZGVzKFtjb29yZFswXSwgY29vcmRbMV0tal0udG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZih0YXJnZXRCb2FyZFtjb29yZFsxXS1qXVtjb29yZFswXV0uZ2V0VmFsdWUoKSA9PT0gMil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnc2luZ2xlJ1xuICAgICAgICB9XG5cbiAgICAgICBcbiAgICAgICAgXG5cblxuICAgICAgICAvLyAqKioqKioqKioqKlxuICAgICAgICAvLyBMYXN0IHNob3QgPT09IDIoaGl0KVxuICAgICAgICBmdW5jdGlvbiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNvb3JkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnaGVlZXJycmVlZSB3ZSBhcmVlZWUnLCBjb29yZClcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHNob290TmVhck9mZnNldCA9IFtbMCwtMV0sIFsxLDBdLCBbMCwxXSwgWy0xLDBdXVxuICAgICAgICBmdW5jdGlvbiBnZXRSYW5kb21TdXJyb3VuZEluZGV4KCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSo0KVxuICAgICAgICB9XG4gICAgICAgIC8vIGlmKGFjdGl2ZVBsYXllci5sYXN0Um91bmQuc2hvdCA9PT0gMikgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9jdXNlZCBzaG90MScpXG4gICAgICAgICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXMgPSBbXVxuICAgICAgICAgICAgc2hvb3ROZWFyT2Zmc2V0LmZvckVhY2gob2Zmc2V0ID0+IHtcbiAgICAgICAgICAgICAgIHN1cnJvdW5kaW5nU3F1YXJlcy5wdXNoKFtjb29yZFswXStvZmZzZXRbMF0sIGNvb3JkWzFdK29mZnNldFsxXV0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gc3Vycm91bmRpbmdTcXVhcmVzID0gc3Vycm91bmRpbmdTcXVhcmVzLmZpbHRlcihzcXVhcmUgPT4gIXNxdWFyZS5pbmNsdWRlcygtMSkgfHwgIXNxdWFyZS5pbmNsdWRlcygxMCkpXG5cbiAgICAgICAgICAgIC8vaW1wbGVtZW50IGJldHRlciBsb2dpYyBmb3Igc2VsZWN0aW5nIGEgc3Vycm91bmRpbmcgc3F1YXJlIFxuICAgICAgICAgICAgLy8xLiBmaWx0ZXIgdGhlIHN1cnJvdW5kaW5nIHNxdWFyZXMgdG8gYmUgb25seSB0aGUgc3F1YXJlcyBsZWZ0IGluIHRoZSB1bmhpdCBhcmVhXG4gICAgICAgICAgICAvLzIuIHRoZW4gcmFuZG9tbHkgc2VsZWN0IHNxdWFyZSBmcm9tIGZpbHRlciBhcnJheVxuXG4gICAgICAgICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXNTdHJpbmdpZnkgPSBzdXJyb3VuZGluZ1NxdWFyZXMubWFwKHNxdWFyZSA9PiBzcXVhcmUudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIGNvbnN0IHN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZSA9IHN1cnJvdW5kaW5nU3F1YXJlc1N0cmluZ2lmeS5maWx0ZXIoc3F1YXJlID0+IGNvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoc3F1YXJlKSkubWFwKHNxdWFyZSA9PiBbK3NxdWFyZVswXSwrc3F1YXJlWzJdXSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZScsIHN1cnJvdW5kaW5nU3F1YXJlc0F2YWlsYWJsZSlcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gTmVlZCB0byBjaGFuZ2U6ICBbJzMsNCcsJzUsNCcsJzksMSddICAgPT4gICAgW1szLDRdLFs1LDRdLFs5LDFdXVxuXG4gICAgICAgICAgICBpZihzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHBsYXlSb3VuZChzdXJyb3VuZGluZ1NxdWFyZXNBdmFpbGFibGVbMF0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2VuZXJhbFJhbmRvbUhpdCgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHN1cnJvdW5kaW5nU3F1YXJlcy5tYXAoc3F1YXJlID0+IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZFtzcXVhcmVbMV1dLmdldFZhbHVlKCkpXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc3Vycm91bmRpbmcgc3F1YXJlcycsIHN1cnJvdW5kaW5nU3F1YXJlcylcbiAgICAgICAgICAgIC8vIC8vIGNvbnN0IHN1cnJvdW5kaW5nU3F1YXJlc1N0cmluZ2lmeSA9IHN1cnJvdW5kaW5nU3F1YXJlcy5tYXAoY29vcmQgPT4gY29vcmQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC8vIGxldCByYW5kb21TdXJyb3VuZGluZ0Nvb3JkXG4gICAgICAgICAgICAvLyBjb25zdCBnZXRTdXJyb3VuZENvb3JkID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIHJhbmRvbVN1cnJvdW5kaW5nQ29vcmQgPSBzdXJyb3VuZGluZ1NxdWFyZXNbZ2V0UmFuZG9tU3Vycm91bmRJbmRleCgpXVxuICAgICAgICAgICAgLy8gICAgIHJldHVybiByYW5kb21TdXJyb3VuZGluZ0Nvb3JkXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyAvLyBjb25zb2xlLmxvZyhnZXRTdXJyb3VuZENvb3JkKCksIGNvb3Jkc0xlZnRTdHJpbmdpZnkuaW5jbHVkZXMoZ2V0U3Vycm91bmRDb29yZCgpLnRvU3RyaW5nKCkpKVxuICAgICAgICAgICAgLy8gd2hpbGUoY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhnZXRTdXJyb3VuZENvb3JkKCkudG9TdHJpbmcoKSkpe1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdmb2N1c2VkIHNob3QxJywgcmFuZG9tU3Vycm91bmRpbmdDb29yZClcbiAgICAgICAgICAgIC8vICAgICBwbGF5Um91bmQocmFuZG9tU3Vycm91bmRpbmdDb29yZClcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gfVxuICAgICAgICBcbiAgICB9XG4gICAgICAgIC8vICoqKioqKioqKioqKlxuXG4gICAgICAgIGZ1bmN0aW9uIGdlbmVyYWxSYW5kb21IaXQoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2tpcHBlZCcpXG4gICAgICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSpjb29yZHNMZWZ0Lmxlbmd0aClcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNvb3Jkc0xlZnQsIHJhbmRvbUluZGV4KVxuICAgICAgICAgICAgcGxheVJvdW5kKGNvb3Jkc0xlZnRbcmFuZG9tSW5kZXhdKVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYm9hcmQxLmdldEJvYXJkKCkubWFwKHJvdyA9PiByb3cubWFwKGNlbGwgPT4gY2VsbC5nZXRDb29yZCgpKSkpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuICAgXG5cbiAgICAvLyBjb25zdCBnZXRTaGlwcyA9ICgpID0+IHtcblxuICAgIC8vIH1cblxuICAgIFxuXG5cblxuXG5cbiAgICAgIFxuXG4gICAgcHJpbnROZXdSb3VuZCgpXG4gICAgXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwbGF5Um91bmRcbiAgICB9XG59XG5cblxuXG5cblxuLy8gY29uc3QgaHVtYW5Cb2FyZCA9IGJvYXJkMS5nZXRCb2FyZCgpXG4vLyAgICAgICAgIGNvbnN0IGNlbGxMb29rVXAgPSBbLTMsM11cblxuLy8gICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZU1pc3MoZGlyLCBjb29yZCkge1xuLy8gICAgICAgICAgICAgbGV0IHdvcmtpbmdSYW5nZSA9IFtdXG4vLyAgICAgICAgICAgICBpZihkaXIgPT09ICdIJyl7XG4vLyAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA+PSAtMzsgaS0tKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGlmKGh1bWFuQm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdICsgaV0uZ2V0VmFsdWUoKSA9PT0gMykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgd29ya2luZ1JhbmdlLnB1c2goaSlcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDw9IDM7IGkrKykge1xuLy8gICAgICAgICAgICAgICAgICAgICBpZihodW1hbkJvYXJkW2Nvb3JkWzFdXVtjb29yZFswXSArIGldLmdldFZhbHVlKCkgPT09IDMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtpbmdSYW5nZS5wdXNoKGkpXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPj0gLTM7IGktLSkge1xuLy8gICAgICAgICAgICAgICAgICAgICBpZihodW1hbkJvYXJkW2Nvb3JkWzFdICsgaV1bY29vcmRbMF1dLmdldFZhbHVlKCkgPT09IDMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtpbmdSYW5nZS5wdXNoKGkpXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8PSAzOyBpKyspIHtcbi8vICAgICAgICAgICAgICAgICAgICAgaWYoaHVtYW5Cb2FyZFtjb29yZFsxXSArIGldW2Nvb3JkWzBdICsgaV0uZ2V0VmFsdWUoKSA9PT0gMykge1xuLy8gICAgICAgICAgICAgICAgICAgICAgICAgd29ya2luZ1JhbmdlLnB1c2goaSlcbi8vICAgICAgICAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIC8vWzJdID0+ICBbLTMsMl1cbi8vICAgICAgICAgICAgIC8vW10gID0+ICBbLTMsLTNdXG4vLyAgICAgICAgICAgICAvL1stMywtMiwgMSwyXSA9PiAgWy0yLCAxXVxuLy8gICAgICAgICAgICAgbGV0IG1pbnVzTnVtcyA9IHdvcmtpbmdSYW5nZS5maWx0ZXIobnVtID0+IG51bTwwKVxuLy8gICAgICAgICAgICAgbWludXNOdW1zLnNvcnQoKGEsYikgPT4gKVxuLy8gICAgICAgICAgICAgbGV0IHBvc051bXMgPSB3b3JraW5nUmFuZ2UuZmlsdGVyKG51bSA9PiBudW0+MCkgXG4vLyAgICAgICAgICAgICByZXR1cm4gd29ya2luZ1JhbmdlXG4vLyAgICAgICAgIH1cblxuXG4vLyAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPD0gOTsgaSsrKSB7XG4vLyAgICAgICAgICAgICBmb3IobGV0IGogPSAwOyBqIDw9IDk7IGorKykge1xuLy8gICAgICAgICAgICAgICAgIGlmKGh1bWFuQm9hcmRbaV1bal0uZ2V0VmFsdWUoKSA9PT0gMiAmJiAhaHVtYW5Cb2FyZFtpXVtqXS5nZXRTaGlwKCkuZ2V0U3VuaygpKXtcbi8vICAgICAgICAgICAgICAgICAgICAgbGV0IGNvb3JkID0gaHVtYW5Cb2FyZFtpXVtqXS5nZXRDb29yZCgpXG4gICAgICAgICAgICAgICAgXG4vLyAgICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZFdvcmtpbmdYUmFuZ2UgPSB0cmF2ZXJzZU1pc3MoJ0gnLCBjb29yZClcbi8vICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmtpbmdYUmFuZ2UgPSBmb3VuZFdvcmtpbmdYUmFuZ2UubGVuZ3RoID4gMCA/IGZvdW5kV29ya2luZ1hSYW5nZSA6IFstMywzXVxuLy8gICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmRXb3JraW5nWVJhbmdlID0gdHJhdmVyc2VNaXNzKCdWJywgY29vcmQpXG4vLyAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JraW5nWVJhbmdlID0gZm91bmRXb3JraW5nWVJhbmdlLmxlbmd0aCA+IDAgPyBmb3VuZFdvcmtpbmdZUmFuZ2UgOiBbLTMsM11cblxuLy8gICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuXG5cblxuXG4vLyAqKioqKioqKioqKlxuICAgICAgICAvLyBMYXN0IHNob3QgPT09IDIoaGl0KVxuICAgICAgICAvLyBmdW5jdGlvbiBzaW5nbGVIaXRQcm9jZXNzaW5nKGNlbGwpIHtcbiAgICAgICAgICAgIFxuICAgICAgICBcbiAgICAgICAgLy8gICAgIGNvbnN0IHNob290TmVhck9mZnNldCA9IFtbMCwtMV0sIFsxLDBdLCBbMCwxXSwgWy0xLDBdXVxuICAgICAgICAvLyAgICAgZnVuY3Rpb24gZ2V0UmFuZG9tU3Vycm91bmRJbmRleCgpIHtcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjQpXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICAvLyBpZihhY3RpdmVQbGF5ZXIubGFzdFJvdW5kLnNob3QgPT09IDIpIFxuICAgICAgICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmb2N1c2VkIHNob3QxJylcbiAgICAgICAgLy8gICAgICAgICBjb25zdCBzdXJyb3VuZGluZ1NxdWFyZXMgPSBbXVxuICAgICAgICAvLyAgICAgICAgIHNob290TmVhck9mZnNldC5mb3JFYWNoKG9mZnNldCA9PiB7XG4gICAgICAgIC8vICAgICAgICAgICAgc3Vycm91bmRpbmdTcXVhcmVzLnB1c2goW2FjdGl2ZVBsYXllci5sYXN0Um91bmQuY29vcmRzWzBdK29mZnNldFswXSwgYWN0aXZlUGxheWVyLmxhc3RSb3VuZC5jb29yZHNbMV0rb2Zmc2V0WzFdXSlcbiAgICAgICAgLy8gICAgICAgICB9KVxuICAgICAgICAvLyAgICAgICAgIC8vIHN1cnJvdW5kaW5nU3F1YXJlcyA9IHN1cnJvdW5kaW5nU3F1YXJlcy5maWx0ZXIoc3F1YXJlID0+ICFzcXVhcmUuaW5jbHVkZXMoLTEpIHx8ICFzcXVhcmUuaW5jbHVkZXMoMTApKVxuICAgIFxuICAgIFxuICAgIFxuICAgICAgICAvLyAgICAgICAgIC8vIHN1cnJvdW5kaW5nU3F1YXJlcy5tYXAoc3F1YXJlID0+IGFjdGl2ZVBsYXllci50YXJnZXRCb2FyZFtzcXVhcmVbMV1dLmdldFZhbHVlKCkpXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ2ZvY3VzZWQgc2hvdDEnLCBzdXJyb3VuZGluZ1NxdWFyZXMpXG4gICAgICAgIC8vICAgICAgICAgLy8gY29uc3Qgc3Vycm91bmRpbmdTcXVhcmVzU3RyaW5naWZ5ID0gc3Vycm91bmRpbmdTcXVhcmVzLm1hcChjb29yZCA9PiBjb29yZC50b1N0cmluZygpKVxuICAgICAgICAvLyAgICAgICAgIGxldCByYW5kb21TdXJyb3VuZGluZ0Nvb3JkXG4gICAgICAgIC8vICAgICAgICAgY29uc3QgZ2V0U3Vycm91bmRDb29yZCA9ICgpID0+IHtcbiAgICAgICAgLy8gICAgICAgICAgICAgcmFuZG9tU3Vycm91bmRpbmdDb29yZCA9IHN1cnJvdW5kaW5nU3F1YXJlc1tnZXRSYW5kb21TdXJyb3VuZEluZGV4KCldXG4gICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiByYW5kb21TdXJyb3VuZGluZ0Nvb3JkXG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGdldFN1cnJvdW5kQ29vcmQoKSwgY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhnZXRTdXJyb3VuZENvb3JkKCkudG9TdHJpbmcoKSkpXG4gICAgICAgIC8vICAgICAgICAgd2hpbGUoY29vcmRzTGVmdFN0cmluZ2lmeS5pbmNsdWRlcyhnZXRTdXJyb3VuZENvb3JkKCkudG9TdHJpbmcoKSkpe1xuICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnZm9jdXNlZCBzaG90MScsIHJhbmRvbVN1cnJvdW5kaW5nQ29vcmQpXG4gICAgICAgIC8vICAgICAgICAgICAgIHBsYXlSb3VuZChyYW5kb21TdXJyb3VuZGluZ0Nvb3JkKVxuICAgICAgICAvLyAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gKioqKioqKioqKioqIiwiaW1wb3J0IENlbGwgZnJvbSBcIi4vY2VsbFwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBHYW1lQm9hcmQoKSB7XG4gIGNvbnN0IHJvd3MgPSAxMDtcbiAgY29uc3QgY29sdW1ucyA9IDEwO1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkrKykge1xuICAgIGJvYXJkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqKyspIHtcbiAgICAgIGJvYXJkW2ldLnB1c2goQ2VsbChbaixpXSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG5cbiAgZnVuY3Rpb24gcHJpbnRCb2FyZChwbGF5ZXIpIHtcbiAgICAvLyBjb25zdCBib2FyZFdpdGhDZWxsVmFsdWVzID0gYm9hcmQubWFwKChyb3cpID0+IHJvdy5tYXAoKGNlbGwpID0+IFtjZWxsLmlzT2ZmTGltaXQoKSwgY2VsbC5nZXRWYWx1ZSgpXS5qb2luKCcsJykpKVxuICAgIC8vIGNvbnN0IGJvYXJkV2l0aENlbGxWYWx1ZXMgPSBib2FyZC5tYXAoKHJvdykgPT4gcm93Lm1hcCgoY2VsbCkgPT4gY2VsbC5nZXRTaGlwKCkpKVxuICAgIGNvbnN0IGJvYXJkV2l0aENlbGxWYWx1ZXMgPSBib2FyZC5tYXAoKHJvdykgPT5cbiAgICAgIHJvdy5tYXAoKGNlbGwpID0+IGNlbGwucHJpbnRWYWx1ZShwbGF5ZXIpKVxuICAgICk7XG4gICAgY29uc29sZS5sb2coYm9hcmRXaXRoQ2VsbFZhbHVlcyk7XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCkge1xuICAgIGNvbnN0IHN0YXJ0Q29vcmRzID0gW107XG4gICAgZnVuY3Rpb24gcmFuZG9tT3JpZW50YXRpb24oKSB7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSA8IDAuNSA/IFwiSFwiIDogXCJWXCI7XG4gICAgfVxuICAgIGNvbnN0IG9yaWVudCA9IHJhbmRvbU9yaWVudGF0aW9uKCk7XG4gICAgZnVuY3Rpb24gcmFuZG9tWSgpIHtcbiAgICAgIGlmIChvcmllbnQgPT09IFwiVlwiKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd3MgPSByb3dzIC0gbGVuZ3RoO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbmV3Um93cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcm93cyk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJhbmRvbVgoKSB7XG4gICAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgICBjb25zdCBuZXdDb2x1bW5zID0gY29sdW1ucyAtIGxlbmd0aDtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5ld0NvbHVtbnMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbHVtbnMpO1xuICAgIH1cblxuICAgIHN0YXJ0Q29vcmRzLnB1c2gocmFuZG9tWCgpLCByYW5kb21ZKCkpO1xuICAgIHJldHVybiBbc3RhcnRDb29yZHMsIG9yaWVudF07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlQ2VsbHNPZmZsaW1pdHMoc3RhcnRDb29yZCwgb3JpZW50LCBsZW5ndGgpIHtcbiAgICBpZiAob3JpZW50ID09PSBcIkhcIikge1xuICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0Q29vcmRbMF0gLSAxOyBpIDwgc3RhcnRDb29yZFswXSAtIDEgKyBsZW5ndGggKyAyOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29vcmRbMV0gLSAxOyBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyAzOyBqKyspIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudCA9PT0gXCJWXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSBzdGFydENvb3JkWzBdIC0gMTsgaSA8IHN0YXJ0Q29vcmRbMF0gLSAxICsgMzsgaSsrKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgbGV0IGogPSBzdGFydENvb3JkWzFdIC0gMTtcbiAgICAgICAgICBqIDwgc3RhcnRDb29yZFsxXSAtIDEgKyBsZW5ndGggKyAyO1xuICAgICAgICAgIGorK1xuICAgICAgICApIHtcbiAgICAgICAgICBpZiAoaSA+PSAwICYmIGogPj0gMCAmJiBpIDw9IDkgJiYgaiA8PSA5KSB7XG4gICAgICAgICAgICBib2FyZFtqXVtpXS5tYWtlT2ZmTGltaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXBzKGxlbmd0aCkge1xuICAgIGNvbnN0IHNoaXBSYW5kb21PcmlnaW4gPSByYW5kb21TaGlwT3JpZ2luKGxlbmd0aCk7XG4gICAgY29uc3Qgc2hpcCA9IFNoaXAobGVuZ3RoKTtcbiAgICBcbiAgICBjb25zdCBvZmZMaW1pdENoZWNrID0gW107XG5cbiAgICBpZiAoc2hpcFJhbmRvbU9yaWdpblsxXSA9PT0gXCJWXCIpIHtcbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVsxXTtcbiAgICAgICAgaSA8IHNoaXBSYW5kb21PcmlnaW5bMF1bMV0gKyBsZW5ndGg7XG4gICAgICAgIGkrK1xuICAgICAgKSB7XG4gICAgICAgIG9mZkxpbWl0Q2hlY2sucHVzaChib2FyZFtpXVtzaGlwUmFuZG9tT3JpZ2luWzBdWzBdXS5pc09mZkxpbWl0KCkpO1xuICAgICAgfVxuICAgICAgaWYgKG9mZkxpbWl0Q2hlY2suaW5jbHVkZXModHJ1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBmb3IgKFxuICAgICAgICBsZXQgaSA9IHNoaXBSYW5kb21PcmlnaW5bMF1bMV07XG4gICAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzFdICsgbGVuZ3RoO1xuICAgICAgICBpKytcbiAgICAgICkge1xuICAgICAgICBib2FyZFtpXVtzaGlwUmFuZG9tT3JpZ2luWzBdWzBdXS5tYWtlU2hpcChzaGlwKTtcbiAgICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIH1cbiAgICAgIG1ha2VDZWxsc09mZmxpbWl0cyhzaGlwUmFuZG9tT3JpZ2luWzBdLCBzaGlwUmFuZG9tT3JpZ2luWzFdLCBsZW5ndGgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGZvciAoXG4gICAgICBsZXQgaSA9IHNoaXBSYW5kb21PcmlnaW5bMF1bMF07XG4gICAgICBpIDwgc2hpcFJhbmRvbU9yaWdpblswXVswXSArIGxlbmd0aDtcbiAgICAgIGkrK1xuICAgICkge1xuICAgICAgb2ZmTGltaXRDaGVjay5wdXNoKGJvYXJkW3NoaXBSYW5kb21PcmlnaW5bMF1bMV1dW2ldLmlzT2ZmTGltaXQoKSk7XG4gICAgfVxuICAgIGlmIChvZmZMaW1pdENoZWNrLmluY2x1ZGVzKHRydWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yIChcbiAgICAgIGxldCBpID0gc2hpcFJhbmRvbU9yaWdpblswXVswXTtcbiAgICAgIGkgPCBzaGlwUmFuZG9tT3JpZ2luWzBdWzBdICsgbGVuZ3RoO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBib2FyZFtzaGlwUmFuZG9tT3JpZ2luWzBdWzFdXVtpXS5tYWtlU2hpcChzaGlwKTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgfVxuICAgIG1ha2VDZWxsc09mZmxpbWl0cyhzaGlwUmFuZG9tT3JpZ2luWzBdLCBzaGlwUmFuZG9tT3JpZ2luWzFdLCBsZW5ndGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDQpKSB7XG4gICAgY29uc29sZS5sb2coNCk7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDQpKSB7XG4gICAgY29uc29sZS5sb2coNCk7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDMpKSB7XG4gICAgY29uc29sZS5sb2coMyk7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDMpKSB7XG4gICAgY29uc29sZS5sb2coMyk7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDIpKSB7XG4gICAgY29uc29sZS5sb2coMik7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDIpKSB7XG4gICAgY29uc29sZS5sb2coMik7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDEpKSB7XG4gICAgY29uc29sZS5sb2coMSk7XG4gIH1cbiAgd2hpbGUgKCFwbGFjZVNoaXBzKDEpKSB7XG4gICAgY29uc29sZS5sb2coMSk7XG4gIH1cblxuICBjb25zdCBkcm9wQm9tYiA9IChjb29yZCkgPT4ge1xuICAgIGlmKGNvb3JkWzBdID4gOSB8fCBjb29yZFswXSA8IDAgfHwgY29vcmRbMV0gPiA5IHx8IGNvb3JkWzFdIDwgMCkge1xuICAgICAgICBjb25zb2xlLmxvZygnT3V0IG9mIHJhbmdlLCBmaXJlIGFnYWluIScpXG4gICAgICAgIHJldHVyblxuICAgIH0gXG4gICAgY29uc3Qgc3F1YXJlID0gYm9hcmRbY29vcmRbMV1dW2Nvb3JkWzBdXTtcbiAgICByZXR1cm4gc3F1YXJlLnN0cmlrZSgpXG4gICAgXG5cbiAgfVxuXG4vLyAgIHByaW50Qm9hcmQoKTtcblxuICByZXR1cm4ge1xuICAgIHByaW50Qm9hcmQsXG4gICAgZHJvcEJvbWIsXG4gICAgc2hpcHMsXG4gICAgZ2V0Qm9hcmRcbiAgfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFNoaXAobGVuZ3RoKSB7XG4gIGxldCBudW1IaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0cmlrZSA9ICgpID0+IHtcbiAgICBudW1IaXQrKztcbiAgICBjb25zb2xlLmxvZyhgU1RSSUtFISEhISAke251bUhpdH0gc3F1YXJlKHMpIG9mIHNoaXAgbGVuZ3RoOiAke2xlbmd0aH0gZGVzdHJveWVkLiAke2xlbmd0aCAtIG51bUhpdH0gbGVmdCB0byBkZXN0cm95YClcbiAgICBpZihudW1IaXQgPT09IGxlbmd0aCkgc3VuayA9IHRydWVcbn07XG5cbmNvbnN0IGdldE51bUhpdCA9ICgpID0+IG51bUhpdFxuXG5jb25zdCBnZXRTdW5rID0gKCkgPT4gc3Vua1xuXG5cbi8vICAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuLy8gICAgIHN1bmsgPSBudW1IaXQgPT09IGxlbmd0aCA/IHRydWUgOiBmYWxzZTtcbi8vICAgICByZXR1cm4gc3Vuaztcbi8vICAgfTtcblxuICByZXR1cm4ge1xuICAgIHN0cmlrZSxcbiAgICBnZXROdW1IaXQsXG4gICAgZ2V0U3VuayxcbiAgICBsZW5ndGhcbiAgfTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9tb2R1bGVzL2dhbWVib2FyZFwiO1xuaW1wb3J0IEdhbWVDb250cm9sbGVyIGZyb20gXCIuL21vZHVsZXMvZ2FtZUNvbnRyb2xsZXJcIjtcblxuLy8gY29uc3QgZ2FtZSA9IEdhbWVCb2FyZCgpO1xuXG5jb25zdCBnYW1lID0gR2FtZUNvbnRyb2xsZXIoJ0phbWVzJylcblxuXG5cbi8vIGdhbWUucHJpbnRCb2FyZCgpXG5cblxud2luZG93LmJhdHRsZSA9IHtcbiAgICBnYW1lXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9