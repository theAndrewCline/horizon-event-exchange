import { Database } from "bun:sqlite";
import { beforeAll, describe, expect, it } from "bun:test";
import { DatabaseRowSchema } from "core";
import { AssetStore } from "../asset-store.ts";
import { seedDatabase } from "../seed.ts";

const db = new Database(":memory:");
const assetStore = new AssetStore(db);

beforeAll(() => {
  seedDatabase(db, 10); // Seed with 10 assets for testing
});

describe("AssetStore.create", () => {
  it("should create an asset", () => {
    const newAsset = assetStore.create({ name: "NASDAQ", price: 20000 });

    expect(newAsset.id).toHaveLength(26); // length of a ulid
    expect(newAsset.name).toEqual("NASDAQ");
    expect(newAsset.price).toEqual(20000); // $200
    expect(newAsset.updatedAt).toBeString(); // TODO: use test timers to garentee a specific time
  });
});

describe("AssetStore.update", () => {
  it("should update an asset price", async () => {
    const newAsset = assetStore.create({ name: "NASDAQ", price: 20000 });

    // Wait a bit to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 1));

    const updatedAsset = assetStore.update(newAsset.id, { price: 21000 });

    expect(updatedAsset.id).toEqual(newAsset.id);
    expect(updatedAsset.name).toEqual("NASDAQ");
    expect(updatedAsset.price).toEqual(21000); // $210
    expect(updatedAsset.updatedAt).toBeString();
    expect(updatedAsset.updatedAt).not.toEqual(newAsset.updatedAt); // should be different

    // Verify the database actually has the updated item by querying directly
    const query = db
      .query("SELECT * FROM assets WHERE id = ?")
      .get(newAsset.id);
    const result = DatabaseRowSchema.parse(query);
    expect(result.price).toEqual(21000);
    expect(result.updatedAt).toEqual(updatedAsset.updatedAt);
  });
});

describe("AssetStore.delete", () => {
  it("should delete an asset", () => {
    const newAsset = assetStore.create({ name: "NASDAQ", price: 20000 });

    assetStore.delete(newAsset.id);

    // Verify the asset no longer exists in database
    const query = db
      .query("SELECT * FROM assets WHERE id = ?")
      .get(newAsset.id);
    expect(query).toBeNull();
  });
});

describe("AssetStore.get", () => {
  it("should get an asset given an asset id", () => {
    const newAsset = assetStore.create({ name: "NASDAQ", price: 20000 });

    const retrievedAsset = assetStore.get(newAsset.id);

    expect(retrievedAsset).toBeDefined();
    expect(retrievedAsset?.id).toEqual(newAsset.id);
    expect(retrievedAsset?.name).toEqual("NASDAQ");
    expect(retrievedAsset?.price).toEqual(20000);
    expect(retrievedAsset?.updatedAt).toEqual(newAsset.updatedAt);
  });

  it("should return undefined for non-existent asset", () => {
    const retrievedAsset = assetStore.get("non-existent-id");
    expect(retrievedAsset).toBeUndefined();
  });
});

describe("AssetStore.list", () => {
  it("should return all assets including seeded data", () => {
    const assets = assetStore.list();

    // Should have at least our 10 seeded assets (may have more from other tests)
    expect(assets.length).toBeGreaterThanOrEqual(10);

    // Verify they have proper structure
    assets.forEach((asset) => {
      expect(asset.id).toBeDefined();
      expect(asset.name).toBeDefined();
      expect(asset.price).toBeGreaterThan(0);
      expect(asset.updatedAt).toBeDefined();
    });
  });

  it("should return empty array when no assets exist", () => {
    const isolatedDb = new Database(":memory:");
    const isolatedStore = new AssetStore(isolatedDb);

    const assets = isolatedStore.list();
    expect(assets).toHaveLength(0);
  });
});
