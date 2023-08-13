import { users } from "@prisma/client";

export const CurrencyValues: { [key in keyof users["currency"]]: number } = {
  copper: 1,
  silver: 100,
  gold: 10000,
  platinum: 1000000,
};
