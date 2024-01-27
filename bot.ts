import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  Partials
} from 'discord.js'
import log from './logging';
import chalk from 'chalk';
import Command from './command';
import { getCommands } from './command'
import getToken from './token';
import registerCommands from './command_registration';


// Configuration and setup

const version = process.env.PHONOGRAPH_VERSION || '0.unknown';

const header: string = chalk.bold(chalk.blue(`Phonograph`)) + ` version ${version}`;
console.log(header);
console.log();


const token = getToken(() => process.exit(1));

const client = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] })
log.info("Initializing client.");

client.on(Events.Error, (e) => {
  log.error(e);
});

log.info("Loading commands...");
const commands: Command[] = [];
await getCommands('./commands', commands);
log.info(`Loaded ${commands.length} total commands.`);

const clientId = process.env.APPLICATION_ID;
if (!clientId) {
  log.error(
    "Set the APPLICATION_ID environment variable to the bot's application ID."
  );
  process.exit(1);
}
await registerCommands(clientId, commands);

const commandMap = new Collection<string, Command>();
commands.forEach((command) => {
  commandMap.set(command.data.name, command);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  interaction = interaction as ChatInputCommandInteraction;
  const command = commandMap.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (e) {
    log.error(`Error executing command ${command.data.name}: ${e}`);
    await interaction.reply({
      content: "An error occurred while executing this command.",
      ephemeral: true
    });
  }
});

client.once(Events.ClientReady, () => {
  log.info(`Successfully logged in as ${client.user?.tag}.`);
  const n_servers = client.guilds.cache.size;
  log.info(`Listening on ${n_servers} guild${n_servers === 1 ? '' : 's'}.`);
});

client.login(token);
