import { users } from "@prisma/client";

import { Emotes } from "../config/Emotes";

/**
 * Takes a currency object and generates a user-friendly string.
 *
 * @param {users["currency"]} currency The currency object from the database.
 * @returns {string} The user-friendly string.
 */
export const parseCurrencyString = (currency: users["currency"]) => {
  const entries = Object.entries(currency) as [
    keyof users["currency"],
    number
  ][];
  const mapped = entries.map((entry) => `${Emotes[entry[0]]}: ${entry[1]}`);
  return mapped.join("\n");
};
