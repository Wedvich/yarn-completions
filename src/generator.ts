import fs from "node:fs/promises";
import { StructuredDefinition } from "./types.ts";

export default async function generate(
  definitions: Array<StructuredDefinition>,
) {
  let completions = `
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
  _arguments "$\{_arguments_options[@]}"
  '-v[Print version information]'
  '--version[Print version information]'
}
`;

  const roots = definitions.filter((definition) => !definition.parent);

  // TODO: Recursively generate completions from roots to leaves

  completions += '\n_yarn "$@"';

  return fs.writeFile("../_yarn", completions.trim());
}
