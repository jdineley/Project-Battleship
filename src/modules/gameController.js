import GameBoard from "./gameboard";
import UI from "../index";

export default function GameController(
  player1 = "Chuck",
  player2 = "computer"
) {
  let board1;
  let board2;
  let players;

  function makeBoards() {
    board1 = GameBoard();
    board2 = GameBoard();
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
    UI.highlightActivePLayer(activePlayer.name);
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
        UI.renderBoard(boardString, activePlayer);
        return;
      }
      UI.renderBoard(boardString);
    }
    console.log(players);
    if (switchPlayer()) return;
    printNewRound();
  };

  const computersTurn = () => {
    UI.addHumanClickHandler();
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
