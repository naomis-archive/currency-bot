import { assert } from "chai";
import { WebhookClient } from "discord.js";
import { after } from "mocha";

import { validateEnv } from "../../src/utils/validateEnv";

suite("validateEnv utility", () => {
  test("throws an error on missing TOKEN", () => {
    assert.throws(validateEnv, "Missing TOKEN environment variable");
  });

  test("throws an error on missing HOME_GUILD_ID", () => {
    process.env.TOKEN = "discord bot token";
    assert.throws(validateEnv, "Missing HOME_GUILD_ID environment variable");
  });

  test("throws an error when missing DEBUG_HOOK", () => {
    process.env.HOME_GUILD_ID = "123";
    assert.throws(validateEnv, "Missing DEBUG_HOOK environment variable");
  });

  test("throws an error when missing MONGO_URL", () => {
    process.env.DEBUG_HOOK =
      // This is not a live webhook URL, so don't bother trying to use it.
      "https://canary.discord.com/api/webhooks/1133857667505463326/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    assert.throws(validateEnv, "Missing MONGO_URL environment variable");
  });

  test("throws an error when missing OWNER_ID", () => {
    process.env.MONGO_URL = "https://example.com";
    assert.throws(validateEnv, "Missing OWNER_ID environment variable");
  });

  test("returns the environment cache when all variables are present", () => {
    process.env.OWNER_ID = "123";
    const result = validateEnv();
    assert.equal(result.token, "discord bot token");
    assert.equal(result.homeGuild, "123");
    assert.instanceOf(result.debugHook, WebhookClient);
    assert.equal(result.ownerId, "123");
  });

  after(() => {
    delete process.env.TOKEN;
    delete process.env.HOME_GUILD_ID;
    delete process.env.DEBUG_HOOK;
    delete process.env.MONGO_URL;
    delete process.env.OWNER_ID;
  });
});
