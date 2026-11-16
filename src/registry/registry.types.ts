export interface FieldInfo {
  name: string;
  type: string;
  kind: string;
  isRequired: boolean;
  isId: boolean;
}

export interface RefInfo {
  /** Ota model (Prisma'da bo'lmasa null: primary key'siz yoki bloklangan jadval). */
  parent: ModelEntry | null;
  parentName: string;
  parentColumn: string;
}

export interface ChildLink {
  child: ModelEntry;
  column: string;
  parentColumn: string;
}

export interface ModelEntry {
  name: string;
  delegate: string;
  table: string;
  blocked: boolean;
  fields: Map<string, FieldInfo>;
  pk: string[];
  refs: Map<string, RefInfo>;
  referencedBy: ChildLink[];
}
