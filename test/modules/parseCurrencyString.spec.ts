import { assert } from "chai";

import { Emotes } from "../../src/config/Emotes";
import { parseCurrencyString } from "../../src/modules/parseCurrencyString";

const currencyOne = {
  copper: 12,
  silver: 44,
  gold: 0,
  platinum: 4,
  amethyst: 5,
};

const currencyTwo = {
  copper: 1,
  silver: 1,
  gold: 1,
  platinum: 1,
  amethyst: 1,
};

suite("parseCurrencyString module", () => {
  test("should return the correct string", () => {
    assert.deepEqual(
      parseCurrencyString(currencyOne),
      `${Emotes.copper}: 12\n${Emotes.silver}: 44\n${Emotes.gold}: 0\n${Emotes.platinum}: 4\n${Emotes.amethyst}: 5`
    );
    assert.deepEqual(
      parseCurrencyString(currencyTwo),
      `${Emotes.copper}: 1\n${Emotes.silver}: 1\n${Emotes.gold}: 1\n${Emotes.platinum}: 1\n${Emotes.amethyst}: 1`
    );
  });
});
