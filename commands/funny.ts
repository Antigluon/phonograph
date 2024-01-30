import Command from 'command';
const eightball_responses: string[] = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
const commands = [
  Command.new("8ball", "Ask the magic 8 ball a question", async (interaction: any) => {
    await interaction.reply(eightball_responses[Math.floor(Math.random() * eightball_responses.length)]);
  }),
]

export default commands;
