import { SlashCommandBuilder } from "discord.js";

import { CurrencyName } from "../config/CurrencyName";
import { Command } from "../interfaces/Command";
import { makeChange } from "../modules/makeChange";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDataRecord } from "../utils/getDataRecord";

export const award: Command = {
  data: new SlashCommandBuilder()
    .setName("award")
    .setDescription(`Grant some ${CurrencyName} to a user`)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to give to.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription(
          "The amount to award. Use a negative number to take away."
        )
        .setRequired(true)
    ),
  run: async (bot, interaction) => {
    try {
      if (interaction.user.id !== bot.env.ownerId) {
        await interaction.editReply({
          content: `Only <@${bot.env.ownerId}> can use this command!`,
        });
        return;
      }
      const target = interaction.options.getUser("target", true);
      if (bot.wordGame[target.id]) {
        await interaction.editReply({
          content:
            "Target has an active word game and cannot be awarded points until that is resolved.",
        });
        return;
      }
      const amount = interaction.options.getNumber("amount", true);
      const userRecord = await getDataRecord(bot, target.id);
      if (!userRecord) {
        await interaction.editReply({
          content: "There was an error with the database. Please try again.",
        });
        return;
      }
      const oldTotal = sumCurrency(userRecord.currency);
      if (amount < 0 && oldTotal < Math.abs(amount)) {
        await interaction.editReply({
          content: `You can't take away more ${CurrencyName} than the user has!`,
        });
        return;
      }
      const newTotal = oldTotal + amount;
      await bot.db.users.update({
        where: {
          userId: target.id,
        },
        data: {
          currency: { ...makeChange(newTotal) },
        },
      });
      await interaction.editReply({
        content: `You have awarded ${amount.toLocaleString()} ${CurrencyName} to <@${
          target.id
        }>! Their new total is ${newTotal.toLocaleString()} ${CurrencyName}.`,
      });
    } catch (err) {
      await errorHandler(bot, "award command", err);
    }
  },
};
