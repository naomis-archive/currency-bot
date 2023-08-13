import { users } from "@prisma/client";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

import { CurrencyName } from "../config/CurrencyName";
import { CurrencyValues } from "../config/CurrencyValues";
import { Emotes } from "../config/Emotes";
import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About the currency system"),
  run: async (bot, interaction) => {
    try {
      const totals = (
        Object.entries(CurrencyValues) as [keyof users["currency"], number][]
      ).map(
        ([currency, value]) =>
          `One ${
            Emotes[currency]
          } is worth ${value.toLocaleString()} ${CurrencyName}.`
      );

      const embed = new EmbedBuilder();
      embed.setTitle(CurrencyName);
      embed.setDescription(
        "Our currency system is designed to reward activity in our community. You earn currency slowly as you interact with your fellow members, and can be granted currency by Naomi for specific events and rewards.\n\nYou can use your currency to purchase items with the `/purchase` command. If you want to know about a specific item, you can look it up with the `/item` command. See how much you currently have with the `/wallet` command!\n\nCurrencies have no cash value."
      );
      embed.addFields([
        {
          name: "Currency values",
          value: totals.join("\n"),
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
