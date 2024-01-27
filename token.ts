import log from './logging';
export default function getToken(or_else: () => string): string {
  const maybe_token = process.env.DISCORD_TOKEN;
  if (!maybe_token) {
    log.error("Set the DISCORD_TOKEN environment variable to a valid bot token.");
    return or_else();
  }
  return maybe_token as string;
}

