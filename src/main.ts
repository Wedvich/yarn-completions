import parse from "./parser.ts";
import generate from "./generator.ts";

const definitions = await parse();
await generate(definitions);
