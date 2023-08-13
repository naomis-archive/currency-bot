import { assert } from "chai";

import { calculateMessageCurrency } from "../../src/modules/calculateMessageCurrency";

suite("calculateMessageCurrency module", () => {
  test("should accurately calculate the currency of a message under 10 characters", () => {
    for (let i = 0; i < 1000; i++) {
      const total = calculateMessageCurrency("Naomi");
      assert.isAtMost(total, 10);
      assert.isAtLeast(total, 1);
    }
  });

  test("should accurately calculate the currency of a message at 25 characters", () => {
    for (let i = 0; i < 1000; i++) {
      const total = calculateMessageCurrency("NaomiNaomiNaomiNaomiNaomi");
      assert.isAtMost(total, 20);
      assert.isAtLeast(total, 2);
    }
  });

  test("should accurate calculate the currency of a message at 50 characters", () => {
    for (let i = 0; i < 1000; i++) {
      const total = calculateMessageCurrency(
        "NaomiNaomiNaomiNaomiNaomiNaomiNaomiNaomiNaomiNaomi"
      );
      assert.isAtMost(total, 50);
      assert.isAtLeast(total, 5);
    }
  });
});
