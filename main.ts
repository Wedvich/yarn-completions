import fs from "node:fs";
import path from "node:path";
import { Cli } from 'clipanion';
import type { Plugin }  from '@yarnpkg/core';

const root = path.resolve(import.meta.dirname, "yarn/packages");
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

let zshCompletions = `
#compdef yarn

autoload -U is-at-least

_yarn() {
  typeset -A opt_args
  typeset -a _arguments_options

  if is-at-least 5.2; then
      _arguments_options=(-s -S -C)
  else
      _arguments_options=(-s -C)
  fi

  local context curcontext="$curcontext" state line
  _arguments "$\{_arguments_options[@]}" \
  '-v[Print version information]' \
  '--version[Print version information]' \
}
`

for (const def of cli.definitions()) {
}

zshCompletions += '\n_yarn "$@"'

fs.writeFileSync('_yarn', zshCompletions.trim())
