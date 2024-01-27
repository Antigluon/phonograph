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
  const stat = await fs.stat(path);
  if (stat.isDirectory()) {
    const children = await fs.readdir(path);
    for (const child of children) {
      await getCommands(`${path}/${child}`, commands);
    }
  }
  else if (stat.isFile()) {
    const file_commands: Command[] = (await import(path)).default;
    commands.push(...file_commands);
    log.info(`Found ${file_commands.length} commands in ${path}.`);
  }
}

