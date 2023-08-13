import { PrismaClient } from "@prisma/client";
import { Client, Events, GatewayIntentBits } from "discord.js";

import { Intents } from "./config/Intents";
import { ExtendedClient } from "./interfaces/ExtendedClient";
import { calculateMessageCurrency } from "./modules/calculateMessageCurrency";
import { makeChange } from "./modules/makeChange";
import { sumCurrency } from "./modules/sumCurrency";
import { errorHandler } from "./utils/errorHandler";
import { loadCommands } from "./utils/loadCommands";
import { logHandler } from "./utils/logHandler";
import { registerCommands } from "./utils/registerCommands";
import { isGuildCommandCommand } from "./utils/typeGuards";
import { validateEnv } from "./utils/validateEnv";

(async () => {
  try {
    const bot = new Client({
      intents: Intents,
    }) as ExtendedClient;
    bot.env = validateEnv();
    bot.db = new PrismaClient();
    bot.cooldowns = {};
    await bot.db.$connect();
    await loadCommands(bot);

    bot.on(Events.InteractionCreate, async (interaction) => {
      try {
        if (!interaction.isChatInputCommand()) {
          return;
        }
        await interaction.deferReply();
        if (!isGuildCommandCommand(interaction)) {
          await interaction.editReply({
            content: "You can only run this in a guild.",
          });
          return;
        }
        const target = bot.commands.find(
          (c) => c.data.name === interaction.commandName
        );
        if (!target) {
          await interaction.editReply({ content: "Command not found." });
          return;
        }
        await target.run(bot, interaction);
      } catch (err) {
        await errorHandler(bot, "interaction create event", err);
      }
    });

    bot.on(Events.MessageCreate, async (message) => {
      try {
        if (
          !message.guild ||
          message.author.bot ||
          message.author.id === bot.env.ownerId
        ) {
          return;
        }
        const { content, author } = message;
        // cooldown exists and is not more than 5 minutes ago
        if (
          bot.cooldowns[author.id] &&
          Date.now() - bot.cooldowns[author.id] < 300000
        ) {
          return;
        }
        // set it here to avoid race conditions
        bot.cooldowns[author.id] = Date.now();
        const userRecord = await bot.db.users.upsert({
          where: {
            userId: author.id,
          },
          create: {
            userId: author.id,
            currency: {
              copper: 0,
              silver: 0,
              gold: 0,
              platinum: 0,
            },
          },
          update: {},
        });
        const total =
          sumCurrency(userRecord.currency) + calculateMessageCurrency(content);
        const newCurrency = makeChange(total);
        await bot.db.users.update({
          where: {
            userId: author.id,
          },
          data: {
            currency: {
              copper: newCurrency.copper,
              silver: newCurrency.silver,
              gold: newCurrency.gold,
              platinum: newCurrency.platinum,
            },
          },
        });
      } catch (err) {
        await errorHandler(bot, "message create event", err);
      }
    });

    bot.on(Events.ClientReady, async () => {
      await registerCommands(bot);
      logHandler.log("info", "Bot is ready.");
    });

    await bot.login(bot.env.token);
  } catch (err) {
    const bot = new Client({
      intents: [GatewayIntentBits.Guilds],
    }) as ExtendedClient;
    bot.env = validateEnv();
    await errorHandler(bot, "entry file", err);
  }
})();
