import Cell from "./cell";
import Ship from "./ship";

export default function GameBoard() {
  const rows = 10;
  const columns = 10;
  const board = [];
  const ships = [];
  

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
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
    const ship = Ship(length);
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
