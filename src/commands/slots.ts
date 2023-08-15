import { SlashCommandBuilder } from "discord.js";

import { CurrencyName } from "../config/CurrencyName";
import { SlotReel, Slots } from "../config/Slots";
import { Command } from "../interfaces/Command";
import { makeChange } from "../modules/makeChange";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDataRecord } from "../utils/getDataRecord";
import { getRandomValue } from "../utils/getRandomValue";
import { sleep } from "../utils/sleep";

export const slots: Command = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription(`Gamble your ${CurrencyName} on the slot machines!`)
    .addIntegerOption((option) =>
      option
        .setName("wager")
        .setDescription("How much do you want to bet?")
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      if (bot.wordGame[interaction.user.id]) {
        await interaction.editReply({
          content:
            "You cannot play slots while you have an active word game. Please finish that before playing slots.",
        });
        return;
      }
      const wager = interaction.options.getInteger("wager", true);
      const userRecord = await getDataRecord(bot, interaction.user.id);
      if (!userRecord) {
        await interaction.editReply({
          content: "There was an error with the database. Please try again.",
        });
        return;
      }
      const oldTotal = sumCurrency(userRecord.currency);
      if (wager > oldTotal) {
        await interaction.editReply({
          content: `You can't wager more ${CurrencyName} than you have!`,
        });
        return;
      }
      const first = getRandomValue(Slots);
      const second = getRandomValue(Slots);
      const third = getRandomValue(Slots);
      const set = new Set([first, second, third]);
      const won = set.size < 3;
      // lose if three different, if two match get 25x, if three match get 250x
      const result =
        set.size >= 3
          ? 0 - wager
          : set.size === 2
          ? wager * Slots.length * 2
          : wager * Math.pow(Slots.length, 2) * 2;
      await interaction.editReply({
        content: `Spinning...\n# ${SlotReel} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${third}`,
      });
      const newTotal = oldTotal + result;
      await bot.db.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          currency: { ...makeChange(newTotal) },
        },
      });
      await interaction.editReply({
        content: `You ${won ? "won" : "lost"} ${Math.abs(
          result
        ).toLocaleString()} ${CurrencyName}!\n# ${first} ${second} ${third}`,
      });
    } catch (err) {
      await errorHandler(bot, "slots command", err);
    }
  },
};
