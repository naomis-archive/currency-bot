import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";

import { Words } from "../config/Words";
import { Command } from "../interfaces/Command";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDataRecord } from "../utils/getDataRecord";
import { getRandomValue } from "../utils/getRandomValue";

export const word: Command = {
  data: new SlashCommandBuilder()
    .setName("word-game")
    .setDescription("Play a word game!")
    .addIntegerOption((option) =>
      option
        .setName("wager")
        .setDescription("How much do you want to wager?")
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      const wager = interaction.options.getInteger("wager", true);
      const userRecord = await getDataRecord(bot, interaction.user.id);
      if (!userRecord) {
        await interaction.editReply({
          content: "There was an error with the database. Please try again.",
        });
        return;
      }
      const oldTotal = sumCurrency(userRecord.currency);
      if (oldTotal < wager) {
        await interaction.editReply({
          content: "You don't have enough currency to wager that much!",
        });
        return;
      }

      const targetWord = getRandomValue(Words);
      if (bot.wordGame[interaction.user.id]) {
        await interaction.editReply({
          content: "You are already playing a word game!",
        });
        return;
      }
      bot.wordGame[interaction.user.id] = {
        wager,
        target: targetWord,
        guesses: [],
        balance: oldTotal,
      };

      const button = new ButtonBuilder()
        .setCustomId(`word-${interaction.user.id}`)
        .setStyle(ButtonStyle.Success)
        .setLabel("Guess the Word");

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
      await interaction.editReply({
        content:
          "You have five guesses to guess this 5-letter word. Letters will be yellow if they are in the word, but not in the correct position. Letters will be green if they are in the correct position.",
        components: [row],
      });
    } catch (err) {
      await errorHandler(bot, "word game", err);
    }
  },
};
