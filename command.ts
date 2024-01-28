import { SlashCommandBuilder as CommandBuilder } from 'discord.js';
import type { SlashCommandBuilder } from 'discord.js';
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

