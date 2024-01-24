import type { Definition } from "clipanion";

export interface StructuredDefinition extends Definition {
  children?: StructuredDefinition[];
  parent?: StructuredDefinition;
}
