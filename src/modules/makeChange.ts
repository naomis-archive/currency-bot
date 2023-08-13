import { users } from "@prisma/client";

import { CurrencyValues } from "../config/CurrencyValues";

/**
 * Converts a number into a currency object.
 *
 * @param {number} amount The sum of money to convert.
 * @returns {users["currency"]} The updated currency object.
 */
export const makeChange = (amount: number): users["currency"] => {
  let clonedAmount = amount;
  const currency: users["currency"] = {
    copper: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
  };

  const platinum = Math.floor(clonedAmount / CurrencyValues.platinum);
  clonedAmount -= platinum * CurrencyValues.platinum;
  const gold = Math.floor(clonedAmount / CurrencyValues.gold);
  clonedAmount -= gold * CurrencyValues.gold;
  const silver = Math.floor(clonedAmount / CurrencyValues.silver);
  clonedAmount -= silver * CurrencyValues.silver;
  const copper = Math.floor(clonedAmount / CurrencyValues.copper);
  clonedAmount -= copper * CurrencyValues.copper;

  currency.platinum = platinum;
  currency.gold = gold;
  currency.silver = silver;
  currency.copper = copper;

  return currency;
};
