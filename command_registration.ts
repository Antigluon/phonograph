import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody as POSTData,
  Routes
} from 'discord.js'
import { promises as fs } from 'fs';
import Command from './command';
import getToken from './token';
import log from './logging';

const token = getToken(() => process.exit(1));
function jsonify(commands: Command[]): string {
  return JSON.stringify(commands, null, 2);
}

export default async function registerCommands(
  clientId: string,
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
