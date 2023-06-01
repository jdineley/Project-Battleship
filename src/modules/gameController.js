import GameBoard from "./gameboard";


export default function GameController(player1, player2 = 'computer') {
    let board1 = GameBoard()
    let board2 = GameBoard()

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