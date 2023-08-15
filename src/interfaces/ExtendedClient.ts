import { PrismaClient } from "@prisma/client";
import { Client, WebhookClient } from "discord.js";

import { Command } from "./Command";

export interface ExtendedClient extends Client {
  env: {
    token: string;
    homeGuild: string;
    debugHook: WebhookClient;
    ownerId: string;
  };
  commands: Command[];
  db: PrismaClient;
  cooldowns: {
    [userId: string]: number;
  };
  slots: {
    [userId: string]: {
      lastPlayed: number;
    };
  };
  wordGame: {
    [userId: string]: {
      wager: number;
      guesses: string[];
      target: string;
      balance: number;
    };
  };
}
