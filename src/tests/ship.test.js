import Ship from "../modules/ship";

const ship = Ship(3);

test("check isSunk", () => {
  expect(ship.isSunk()).toBe(false);
  ship.strike();
  expect(ship.isSunk()).toBe(false);
  ship.strike();
  expect(ship.isSunk()).toBe(false);
  ship.strike();
  expect(ship.isSunk()).toBe(true);
});
