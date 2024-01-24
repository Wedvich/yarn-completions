import fs from "node:fs";
import path from "node:path";
import { Cli } from "clipanion";
import type { Plugin } from "@yarnpkg/core";
import type { StructuredDefinition } from "./types.ts";

export default async function parse(): Promise<Array<StructuredDefinition>> {
  const root = path.resolve(import.meta.dirname, "../yarn/packages");
  const folders = fs.readdirSync(root);

  const cli = new Cli();
  for (const name of folders) {
    if (!name.startsWith(`plugin-`)) continue;

    const manifest = await import(path.join(root, name, `package.json`));
    const index = await import(path.join(root, name, manifest.main));
    const commands = (index.default as Plugin).commands;

    if (!commands?.length) continue;

    for (const command of commands || []) {
      cli.register(command);
    }
  }

  const definitions = new Map<string, StructuredDefinition>();

  for (const rawDefinition of cli.definitions()) {
    const commands = rawDefinition.path.replace("... ", "").split(" ");

    const leafCommand = commands.pop();
    const leafDefinition: StructuredDefinition = {
      ...rawDefinition,
      path: leafCommand,
    };
    definitions.set(leafCommand, leafDefinition);

    let parentCommand: string;
    while ((parentCommand = commands.pop())) {
      let parentDefinition = definitions.get(parentCommand);
      if (!parentDefinition) {
        parentDefinition = {
          path: parentCommand,
          usage: "",
          options: [],
          children: [leafDefinition],
        };
        definitions.set(parentCommand, parentDefinition);
      } else {
        parentDefinition.children ??= [];
        parentDefinition.children.push(leafDefinition);
      }
      leafDefinition.parent = parentDefinition;
    }
  }

  return Array.from(definitions.values());
}
