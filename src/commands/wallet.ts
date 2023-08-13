import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { parseCurrencyString } from "../modules/parseCurrencyString";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";

export const wallet: Command = {
  data: new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("See how many NaomiCoin you have."),
  run: async (bot, interaction) => {
    try {
      const userRecord = await bot.db.users.upsert({
        where: {
          userId: interaction.user.id,
        },
        create: {
          userId: interaction.user.id,
          currency: {
            copper: 0,
            silver: 0,
            gold: 0,
            platinum: 0,
          },
        },
        update: {},
      });
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
