import { asciiColours } from "./asciiColours";

const generateCount = (word: string) =>
  word.split("").reduce((acc: Record<string, number>, letter) => {
    if (!acc[letter]) {
      acc[letter] = 1;
    } else {
      acc[letter]++;
    }
    return acc;
  }, {});

const countCorrect = (guess: string, target: string) => {
  let correct = 0;
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      correct++;
    }
  }
  return correct;
};

/**
 * Formats the word guess into a Discord-compatible ANSI colour string.
 *
 * @param {string} guess The user's guess.
 * @param {string} target The correct word.
 * @returns {string} The formatted guess.
 */
export const formatWordGuess = (guess: string, target: string) => {
  const targetCounts = generateCount(target);
  return guess
    .split("")
    .map((letter, index) => {
      if (letter === target[index]) {
        targetCounts[letter]--;
        return asciiColours(letter, "green");
      }
      if (
        target.includes(letter) &&
        targetCounts[letter] > 0 &&
        countCorrect(guess.slice(index), target.slice(index)) <
          targetCounts[letter]
      ) {
        targetCounts[letter]--;
        return asciiColours(letter, "yellow");
      }
      return asciiColours(letter, "white");
    })
    .join("");
};
