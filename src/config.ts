/**
 * Application configuration interface definitions.
 */
export interface EnvironmentConfig {
  readonly discordToken: string;
  readonly discordAppId: string;
  readonly discordUserId: string;
  readonly robloxUserId: string;
  readonly robloxCookie: string;
}

/**
 * Initializes and validates runtime environment configurations.
 * @throws {Error} If mandatory environment configurations are absent or malformed.
 */
function loadAndValidateConfig(): EnvironmentConfig {
  const {
    DISCORD_TOKEN,
    DISCORD_APP_ID,
    DISCORD_USER_ID,
    ROBLOX_USER_ID,
    ROBLOX_COOKIE,
    SYNC_INTERVAL_MS,
  } = Bun.env;

  if (
    !DISCORD_TOKEN ||
    !DISCORD_APP_ID ||
    !DISCORD_USER_ID ||
    !ROBLOX_USER_ID ||
    !ROBLOX_COOKIE
  ) {
    throw new Error(
      "ConfigurationInitializationException: Missing vital environment variables.",
    );
  }

  const parsedInterval = SYNC_INTERVAL_MS
    ? Number.parseInt(SYNC_INTERVAL_MS, 10)
    : 300000;

  return {
    discordToken: DISCORD_TOKEN,
    discordAppId: DISCORD_APP_ID,
    discordUserId: DISCORD_USER_ID,
    robloxUserId: ROBLOX_USER_ID,
    robloxCookie: ROBLOX_COOKIE,
  };
}

export const config = loadAndValidateConfig();
