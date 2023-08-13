import { SlashCommandBuilder } from "discord.js";

import { Items } from "../config/Items";
import { Command } from "../interfaces/Command";
import { makeChange } from "../modules/makeChange";
import { sumCurrency } from "../modules/sumCurrency";
import { errorHandler } from "../utils/errorHandler";
import { getDataRecord } from "../utils/getDataRecord";

export const purchase: Command = {
  data: new SlashCommandBuilder()
    .setName("purchase")
    .setDescription("Buy an item! YAY!")
    .addStringOption((option) =>
      option
        .setName("target")
        .setDescription("The item you want to buy.")
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
      const userRecord = await getDataRecord(bot, interaction.user.id);
      if (!userRecord) {
        await interaction.editReply({
          content: "There was an error with the database. Please try again.",
        });
        return;
      }
      const oldTotal = sumCurrency(userRecord.currency);
      if (oldTotal < item.price) {
        await interaction.editReply({
          content: `You don't have enough NaomiCoin to purchase a **${
            item.name
          }**!\nYou have ${oldTotal.toLocaleString()} NaomiCoin, and need ${item.price.toLocaleString()}.`,
        });
        return;
      }
      const newTotal = oldTotal - item.price;
      await bot.db.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          currency: { ...makeChange(newTotal) },
        },
      });

      await interaction.editReply({
        content: `You successfully purchased a **${
          item.name
        }**!\nYou now have ${newTotal.toLocaleString()} NaomiCoin.\n`,
      });
      await interaction.channel?.send({
        content: `<@!${bot.env.ownerId}>, a purchase was made!`,
      });
    } catch (err) {
      await errorHandler(bot, "about command", err);
    }
  },
};
