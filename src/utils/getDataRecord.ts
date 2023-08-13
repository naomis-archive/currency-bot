import { users } from "@prisma/client";

import { ExtendedClient } from "../interfaces/ExtendedClient";

import { errorHandler } from "./errorHandler";

/**
 * Fetches the data record for a user, creating it if not found.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {string} userId The id of the user to fetch.
 * @returns {Promise<users | null>} The record, or null on error.
 */
export const getDataRecord = async (
  bot: ExtendedClient,
  userId: string
): Promise<users | null> => {
  try {
    const userRecord = await bot.db.users.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        currency: {
          copper: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
          amethyst: 0,
        },
      },
      update: {},
    });
    return userRecord;
  } catch (err) {
    await errorHandler(bot, "get data record util", err);
    return null;
  }
};
