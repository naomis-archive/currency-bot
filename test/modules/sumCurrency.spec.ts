import { assert } from "chai";

import { sumCurrency } from "../../src/modules/sumCurrency";

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

const noCurrency = {
  copper: 0,
  silver: 0,
  gold: 0,
  platinum: 0,
};

suite("makeChange module", () => {
  test("should return the correct currency objects", () => {
    assert.deepEqual(sumCurrency(currencyOne), 4004412);
    assert.deepEqual(sumCurrency(currencyTwo), 1010101);
    assert.deepEqual(sumCurrency(noCurrency), 0);
  });
});
