import { SlashCommandBuilder as CommandBuilder } from 'discord.js';
import type { SlashCommandBuilder } from 'discord.js';
import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody as POSTData,
  Routes
} from 'discord.js'
import { promises as fs } from 'fs';
import log from './logging';

export default class Command {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<any>;

  constructor(data: SlashCommandBuilder, execute: (interaction: any) => Promise<any>) {
    this.data = data;
    this.execute = execute;
  }

  static new(name: string, description: string, execute: (interaction: any) => Promise<any>): Command {
    return new Command(new CommandBuilder().setName(name).setDescription(description), execute);
  }
}

export async function getCommands(path: string, commands: Command[]) {
  const files = await fs.readdir(path, { recursive: true });
  for (const file of files) {
    const qualified_path = `${path}/${file}`;
    const file_commands: Command[] = (await import(qualified_path)).default;
    commands.push(...file_commands);
    log.info(`Found ${file_commands.length} commands in ${qualified_path}.`);
  }
}

function jsonify(commands: Command[]): string {
  return JSON.stringify(commands, null, 2);
}

export async function registerCommands(
  clientId: string,
  token: string,
  commands: Command[]
) {
  const commandData: POSTData[] = [];
  const rest_client = new REST().setToken(token);
  for (const command of commands) {
    commandData.push(command.data.toJSON());
  }
  commandData.sort((a, b) => a.name.localeCompare(b.name));
  const cache_exists = await fs.exists('./commands.json');
  if (!cache_exists) {
    await fs.writeFile('./commands.json', "");
  }
  const cached = await fs.readFile('./commands.json', { encoding: 'utf-8' });
  if (cached === jsonify(commands)) {
    log.info("No changes to command metadata. Skipping command update registration.");
    return;
  }
  await rest_client.put(Routes.applicationCommands(clientId),
    { body: commandData }
  );
  fs.writeFile('./commands.json', jsonify(commands));
  log.info(`Registered ${commandData.length} commands.`);
}

