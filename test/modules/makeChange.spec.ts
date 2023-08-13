import { assert } from "chai";

import { makeChange } from "../../src/modules/makeChange";

const currencyOne = {
  copper: 12,
  silver: 44,
  gold: 0,
  platinum: 4,
};

const currencyTwo = {
  copper: 1,
  silver: 1,
  gold: 1,
  platinum: 1,
};

suite("makeChange module", () => {
  test("should return the correct currency objects", () => {
    assert.deepEqual(makeChange(4004412), currencyOne);
    assert.deepEqual(makeChange(1010101), currencyTwo);
  });
});
