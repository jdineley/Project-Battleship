export default function Cell(coord) {
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
