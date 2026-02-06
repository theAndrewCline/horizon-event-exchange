import { Database } from "bun:sqlite";
import { AssetStore } from "./asset-store.ts";

// Sample asset names and realistic price ranges
const assetNames = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "META",
  "TSLA",
  "NVDA",
  "JPM",
  "JNJ",
  "V",
  "PG",
  "UNH",
  "HD",
  "MA",
  "DIS",
  "PYPL",
  "ADBE",
  "CRM",
  "NFLX",
  "INTC",
  "CSCO",
  "CMCSA",
  "PFE",
  "KO",
  "PEP",
  "TMO",
  "COST",
  "AVGO",
  "TXN",
  "ABT",
  "DHR",
  "VZ",
  "ACN",
  "NKE",
  "CRM",
  "QCOM",
  "MDT",
  "NEE",
  "LIN",
  "LLY",
  "BMY",
  "AMGN",
  "UPS",
  "HON",
  "BA",
  "WMT",
  "CAT",
  "DE",
  "GE",
  "MMM",
];

function generateRandomPrice(): number {
  // Generate realistic stock prices between $10 and $5000
  return Math.floor(Math.random() * 4990) + 10;
}

export function seedDatabase(db: Database, count: number = 50): void {
  const assetStore = new AssetStore(db);

  for (let i = 0; i < count; i++) {
    const assetName = assetNames[i % assetNames.length];
    const price = generateRandomPrice();

    assetStore.create({
      symbol: assetName as string,
      price: price,
    });
  }
}

// Allow running as script
if (import.meta.main) {
  const db = new Database("assets.db");
  seedDatabase(db);
  db.close();
}
