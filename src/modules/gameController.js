import GameBoard from "./gameboard";


export default function GameController(player1, player2 = 'computer') {
    let board1 = GameBoard()
    let board2 = GameBoard()

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