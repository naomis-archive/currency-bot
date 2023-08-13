import { assert } from "chai";

import { Items } from "../../src/config/Items";

suite("Items config", () => {
  test("must all be unique", () => {
    const nameSet = new Set(Items.map((item) => item.name));
    const idSet = new Set(Items.map((item) => item.internalId));
    assert.equal(nameSet.size, Items.length);
    assert.equal(idSet.size, Items.length);
  });

  test("cannot have more than 25 items", () => {
    assert.isAtMost(Items.length, 25);
  });
});
