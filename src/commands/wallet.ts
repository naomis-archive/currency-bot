import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { parseCurrencyString } from "../modules/parseCurrencyString";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDataRecord } from "../utils/getDataRecord";

export const wallet: Command = {
  data: new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("See how many NaomiCoin you have."),
  run: async (bot, interaction) => {
    try {
      const userRecord = await getDataRecord(bot, interaction.user.id);
      if (!userRecord) {
        await interaction.editReply({
          content: "There was an error with the database. Please try again.",
        });
        return;
      }
      const embed = new EmbedBuilder();
      embed.setTitle("Your NaomiCoin");
      embed.setDescription(parseCurrencyString(userRecord.currency));
      embed.addFields([
        {
          name: "Total",
          value: sumCurrency(userRecord.currency).toLocaleString(),
        },
      ]);
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (err) {
      await errorHandler(bot, "about command", err);
    }
  },
};
