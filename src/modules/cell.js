// import Ship from "./ship";

export default function Cell() {
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
