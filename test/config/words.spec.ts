import { assert } from "chai";
import { isProfane } from "no-profanity";

import { Words } from "../../src/config/Words";

suite("words config", () => {
  test("should not be profane", () => {
    for (const word of Words) {
      assert.isFalse(isProfane(word), `${word} is profane`);
    }
  });

  test("must be five in length", () => {
    for (const word of Words) {
      assert.equal(word.length, 5, `${word} is not five in length`);
    }
  });

  test("must be unique", () => {
    const uniqueWords = new Set(Words);
    assert.equal(uniqueWords.size, Words.length, "words are not unique");
  });
});
