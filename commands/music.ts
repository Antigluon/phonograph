import Command from "command";
import { SpotifyApi } from "@spotify/web-api-ts-sdk"
const commands = [
  Command.new("play", "Play a song!", async (interaction: any) => {
    await interaction.reply('//TODO discordx decorators oops');
  })
]

export default commands;
