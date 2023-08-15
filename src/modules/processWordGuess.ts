import { ModalSubmitInteraction } from "discord.js";

import { CurrencyName } from "../config/CurrencyName";
import { Words } from "../config/Words";
import { ExtendedClient } from "../interfaces/ExtendedClient";
import { errorHandler } from "../utils/errorHandler";
import { formatWordGuess } from "../utils/formatWordGuess";

/**
 * Handles the logic for processing a guess for the word game.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ModalSubmitInteraction} interaction The interaction payload from Discord.
 */
export const processWordGuess = async (
  bot: ExtendedClient,
  interaction: ModalSubmitInteraction
) => {
  try {
    const [, id] = interaction.customId.split("-");
    if (id !== interaction.user.id) {
      await interaction.reply({
        ephemeral: true,
        content: "How did you submit a modal that isn't yours?",
      });
      return;
    }
    if (!interaction.message) {
      await interaction.reply({
        ephemeral: true,
        content: "The message for this interaction doesn't exist.",
      });
      return;
    }
    const guess = interaction.fields.getTextInputValue("guess");
    if (!Words.includes(guess)) {
      await interaction.reply({
        ephemeral: true,
        content: "That's not in our dictionary.",
      });
      return;
    }
    const cache = bot.wordGame[interaction.user.id];
    await interaction.deferUpdate();
    cache.guesses.push(formatWordGuess(guess, cache.target));
    if (guess === cache.target) {
      const newTotal = cache.balance + cache.wager * 50;
      await interaction.message.edit({
        content: `You won ${
          cache.wager * 50
        } ${CurrencyName}! Your new total is ${newTotal} ${CurrencyName}.
            
\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\``,
        components: [],
      });
      delete bot.wordGame[interaction.user.id];
      return;
    }
    if (cache.guesses.length === 5) {
      await interaction.message.edit({
        content: `You lost ${cache.wager} ${CurrencyName}! The word was ${
          cache.target
        }.
            
\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\``,
        components: [],
      });
      delete bot.wordGame[interaction.user.id];
      return;
    }

    await interaction.message.edit({
      content: `Guess ${cache.guesses.length} / 5:

\`\`\`ansi
${cache.guesses.join("\n")}
\`\`\`
            `,
    });
  } catch (err) {
    await errorHandler(bot, "process word guess", err);
  }
};
