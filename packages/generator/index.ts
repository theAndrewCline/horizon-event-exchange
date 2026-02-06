import { type Asset, MessageSchema, type UpdateAssetMessage } from "core";

let assetState: Asset[] = [];

const BACKEND_URL = "ws://localhost:8000";

const websocket = new WebSocket(BACKEND_URL);

websocket.addEventListener("open", () => {
  console.log(`connected to ${BACKEND_URL}`);
});

websocket.addEventListener("message", ({ data }) => {
  const message = MessageSchema.parse(JSON.parse(data));

  if (message.type === "CURRENT_ASSETS") {
    assetState = message.assets;
  }
});

function generateRandomPrice(): number {
  // Generate realistic stock prices between $10 and $5000
  return Math.floor(Math.random() * 4990) + 10;
}

function getRandomAsset(): Asset | undefined {
  return assetState[Math.floor(Math.random() * assetState.length)];
}

const pulse = setInterval(() => {
  const asset = getRandomAsset();

  if (asset) {
    const price = generateRandomPrice();
    const msg: UpdateAssetMessage = {
      type: "UPDATE_ASSET",
      id: asset.id,
      input: { price },
    };

    websocket.send(JSON.stringify(msg));
    console.log(`${asset.symbol}: ${asset.price} -> ${price}`);
  }
}, 1000);

websocket.addEventListener("close", () => {
  pulse.close();
});
