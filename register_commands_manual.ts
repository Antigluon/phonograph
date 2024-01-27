import Command from './command';
import { getCommands } from './command';
import registerCommands from './command_registration';
import log from './logging';

const commands: Command[] = [];
await getCommands('./commands', commands);
const clientId = process.env.APPLICATION_ID;
if (!clientId) {
  log.error(
    "Set the APPLICATION_ID environment variable to the bot's application ID."
  );
  process.exit(1);
}
await registerCommands(clientId, commands);

