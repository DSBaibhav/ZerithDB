/**
 * Unique identifier for a document.
 * - UUID v7 string (default — globally unique, sortable by insertion time)
 * - Auto-incrementing integer (opt-in via `{ idStrategy: "autoincrement" }`)
 */
export type DocumentId = string | number;

/** Name of a collection within ZerithDB */
export type CollectionName = string;

/** Base document shape. All stored documents have an `_id` field added automatically. */
export type Document<T extends Record<string, any> = Record<string, any>> = T & {
  _id: DocumentId;
  /** Created-at timestamp in Unix milliseconds */
  _createdAt: number;
  /** Last-updated-at timestamp in Unix milliseconds */
  _updatedAt: number;
};

/**
 * Options passed when opening a collection handle.
 *
 * @example UUID v7 (default)
 * ```ts
 * db.collection("users")
 * ```
 *
 * @example Auto-incrementing integer IDs
 * ```ts
 * db.collection("users", { idStrategy: "autoincrement" })
 * ```
 */
export interface CollectionOptions {
  /**
   * Controls how `_id` values are generated for new documents.
   *
   * - `"uuid"` *(default)* — UUID v7, globally unique and time-sortable.
   *   Safe for distributed / P2P workloads.
   * - `"autoincrement"` — Sequential integers starting at `1`.
   *   Familiar for SQL-style workflows. **Not safe for P2P sync** — IDs
   *   will collide when two peers insert independently.
   */
  idStrategy?: "uuid" | "autoincrement";
}

/**
 * MongoDB-style query filter operators.
 * Nested object fields are matched by equality.
 */
export type QueryFilter<T extends Record<string, any>> = {
  [K in keyof T]?:
  | T[K]
  | { $eq: T[K] }
  | { $ne: T[K] }
  | { $gt: T[K] }
  | { $gte: T[K] }
  | { $lt: T[K] }
  | { $lte: T[K] }
  | { $in: T[K][] }
  | { $nin: T[K][] }
  | { $regex: RegExp | string }
} & {
  _id?: DocumentId | { $eq: DocumentId } | { $ne: DocumentId } | { $gt: DocumentId }
  | { $gte: DocumentId } | { $lt: DocumentId } | { $lte: DocumentId }
  | { $in: DocumentId[] } | { $nin: DocumentId[] };
  _createdAt?: number | { $eq: number } | { $ne: number } | { $gt: number }
  | { $gte: number } | { $lt: number } | { $lte: number }
  | { $in: number[] } | { $nin: number[] };
  _updatedAt?: number | { $eq: number } | { $ne: number } | { $gt: number }
  | { $gte: number } | { $lt: number } | { $lte: number }
  | { $in: number[] } | { $nin: number[] };
};

/** Partial update spec — only specified fields are modified */
export type UpdateSpec<T extends Record<string, any>> = {
  $set?: Partial<T>;
  $unset?: { [K in keyof T]?: true };
};

export type InsertResult = {
  id: DocumentId;
};

export type FindResult<T extends Record<string, any>> = {
  documents: Document<T>[];
  count: number;
};
