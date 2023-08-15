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

const calculateWinRate = (matches: number) => {
  switch (matches) {
    case 1:
      return 0;
    case 2:
      return 1;
    case 3:
      return 10;
    case 4:
      return 25;
    case 5:
      return 50;
    default:
      return 1;
  }
};

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
      // played less than 5 minutes ago
      if (
        bot.slots[interaction.user.id] &&
        Date.now() - bot.slots[interaction.user.id].lastPlayed < 300000
      ) {
        await interaction.editReply({
          content: "You can only play slots once every 5 minutes.",
        });
        return;
      }
      bot.slots[interaction.user.id] = {
        lastPlayed: Date.now(),
      };

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
      const totalWithoutWager = oldTotal - wager;
      const first = getRandomValue(Slots);
      const second = getRandomValue(Slots);
      const third = getRandomValue(Slots);
      const fourth = getRandomValue(Slots);
      const fifth = getRandomValue(Slots);
      const set = new Set([first, second, third, fourth, fifth]);
      const won = set.size < 5;

      const result = wager * calculateWinRate(5 - set.size + 1);
      await interaction.editReply({
        content: `Spinning...\n# ${SlotReel} ${SlotReel} ${SlotReel} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${SlotReel} ${SlotReel} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${SlotReel} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${third} ${SlotReel} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${third} ${fourth} ${SlotReel}`,
      });
      await sleep(1000);
      await interaction.editReply({
        content: `Spinning...\n# ${first} ${second} ${third} ${fourth} ${fifth}`,
      });
      const newTotal = totalWithoutWager + result;
      await bot.db.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          currency: { ...makeChange(newTotal) },
        },
      });
      await interaction.editReply({
        content: `You ${
          won
            ? `won ${result.toLocaleString()}`
            : `lost ${wager.toLocaleString()}`
        } ${CurrencyName}!\n# ${first} ${second} ${third} ${fourth} ${fifth}\nYou now have ${newTotal.toLocaleString()} ${CurrencyName}.`,
      });
    } catch (err) {
      await errorHandler(bot, "slots command", err);
    }
  },
};
