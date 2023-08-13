import { SlashCommandBuilder } from "discord.js";

import { Command } from "../interfaces/Command";
import { errorHandler } from "../utils/errorHandler";

export const about: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About the currency system"),
  run: async (bot, interaction) => {
    try {
      await interaction.editReply({
        content: "This is a command.",
      });
    } catch (err) {
      await errorHandler(bot, "about command", err);
    }
  },
};
