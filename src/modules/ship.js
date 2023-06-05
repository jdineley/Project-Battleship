export default function Ship(length) {
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
