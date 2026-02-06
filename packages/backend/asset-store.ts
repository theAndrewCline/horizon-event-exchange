import type { Database, Statement } from "bun:sqlite";
import type { Asset, ID } from "core";
import {
  type CreateAssetInput,
  DatabaseRowSchema,
  type UpdateAssetInput,
} from "core";
import { ulid } from "ulid";

export class AssetStore {
  private db: Database;
  private createStmt!: Statement;
  private updateStmt!: Statement;
  private deleteStmt!: Statement;
  private getStmt!: Statement;
  private listStmt!: Statement;

  constructor(db: Database) {
    this.db = db;
    this.setupDatabase();
  }

  setupDatabase(): void {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        updated_at TEXT NOT NULL
      )
    `;
    this.db.run(createTableSql);

    const createSql = `
      INSERT INTO assets (id, name, price, updated_at)
      VALUES (?, ?, ?, ?)
    `;
    this.createStmt = this.db.prepare(createSql);

    const updateSql = `
      UPDATE assets SET price = ?, updated_at = ? WHERE id = ?
    `;
    this.updateStmt = this.db.prepare(updateSql);

    const deleteSql = `
      DELETE FROM assets WHERE id = ?
    `;
    this.deleteStmt = this.db.prepare(deleteSql);

    const getSql = `
      SELECT * FROM assets WHERE id = ?
    `;
    this.getStmt = this.db.prepare(getSql);

    const listSql = `
      SELECT * FROM assets ORDER BY updated_at DESC
    `;
    this.listStmt = this.db.prepare(listSql);
  }

  create(input: CreateAssetInput): Asset {
    const id = ulid();
    const updatedAt = new Date().toISOString();

    this.createStmt.run(id, input.name, input.price, updatedAt);

    return {
      id,
      name: input.name,
      price: input.price,
      updatedAt,
    };
  }

  update(id: ID, input: UpdateAssetInput): Asset {
    const updatedAt = new Date().toISOString();

    this.updateStmt.run(input.price, updatedAt, id);

    // Get the updated asset to return
    const rawQuery = this.getStmt.get(id) as unknown;
    return DatabaseRowSchema.parse(rawQuery);
  }

  delete(id: ID): void {
    this.deleteStmt.run(id);
  }

  get(id: ID): Asset | undefined {
    const rawQuery = this.getStmt.get(id) as unknown;
    if (!rawQuery) return undefined;

    return DatabaseRowSchema.parse(rawQuery);
  }

  list(): Asset[] {
    const rawQuery = this.listStmt.all() as unknown[];
    return rawQuery.map((row) => DatabaseRowSchema.parse(row));
  }
}
