import { SlashCommandBuilder } from "discord.js";

import { CacheChoices } from "../config/CacheChoices";
import { Command } from "../interfaces/Command";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";

export const cache: Command = {
  data: new SlashCommandBuilder()
    .setName("cache")
    .setDescription(
      `Bust a user's cache for one of the games. Useful when they lose an ephemeral message and get stuck`
    )
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("The user to bust the cache for.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("prop")
        .setDescription("The type of cache to bust.")
        .setRequired(true)
        .addChoices(...CacheChoices)
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
      const prop = interaction.options.getString(
        "prop",
        true
      ) as keyof ExtendedClient["cache"];
      delete bot.cache[prop][target.id];
      await interaction.editReply({
        content: `Cleared ${target.username}'s ${prop} cache!`,
      });
    } catch (err) {
      await errorHandler(bot, "cache command", err);
    }
  },
};
