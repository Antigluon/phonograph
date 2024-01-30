import Command from "command";
const commands = [
  Command.new("ping", "Replies with pong!", async (interaction: any) => {
    await interaction.reply('Pong!');
  }),
  Command.new("info", "Information about Phonograph", async (interaction: any) => {
    await interaction.reply({
      content: "Phonograph is an in-development Discord bot for playing music. It is currently in a very early stage of development.",
      ephemeral: true
    });
  }),
]
export default commands;


