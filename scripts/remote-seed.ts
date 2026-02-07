#!/usr/bin/env bun

import {
  type CreateAssetMessage,
  CreateAssetSchema,
} from "../packages/core/schema";

const BACKEND_URL = process.env.BACKEND_URL || "ws://localhost:8000";

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

async function seedBackend(url: string, count: number = 50): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);

    ws.addEventListener("open", () => {
      console.log(`Connected to ${url}, seeding ${count} assets...`);

      let seeded = 0;

      const seedInterval = setInterval(() => {
        if (seeded >= count) {
          clearInterval(seedInterval);
          ws.close();
          return;
        }

        const assetName = assetNames[seeded % assetNames.length];
        const price = generateRandomPrice();

        const createInput = CreateAssetSchema.parse({
          symbol: assetName,
          price: price,
        });

        const message: CreateAssetMessage = {
          type: "CREATE_ASSET",
          input: createInput,
        };

        ws.send(JSON.stringify(message));
        console.log(`Seeded ${assetName}: $${price}`);
        seeded++;
      }, 100); // Send one every 100ms to avoid overwhelming
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    });

    ws.addEventListener("close", () => {
      console.log("Seeding complete!");
      resolve();
    });
  });
}

// Allow running as script
if (import.meta.main) {
  const count = process.argv[2] ? parseInt(process.argv[2]) : 50;

  try {
    await seedBackend(BACKEND_URL, count);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}
