import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { Items } from "../config/Items";
import { Command } from "../interfaces/Command";
import { makeChange } from "../modules/makeChange";
import { parseCurrencyString } from "../modules/parseCurrencyString";
import { errorHandler } from "../utils/errorHandler";

export const item: Command = {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get information about an item in the shop")
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("The item you want to look up")
        .setRequired(true)
        .addChoices(
          ...Items.sort((a, b) => a.name.localeCompare(b.name)).map(
            ({ name, internalId: value }) => ({ name, value })
          )
        )
    ),
  run: async (bot, interaction) => {
    try {
      const id = interaction.options.getString("target", true);
      const item = Items.find((i) => i.internalId === id);
      if (!item) {
        await interaction.editReply({
          content: "That item doesn't exist!",
        });
        return;
      }
      const embed = new EmbedBuilder();
      embed.setTitle(item.name);
      embed.setDescription(item.description);
      embed.addFields([
        {
          name: `${item.price.toLocaleString()} NaomiCoin`,
          value: parseCurrencyString(makeChange(item.price)),
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
