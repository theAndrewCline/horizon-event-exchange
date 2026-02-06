import { Database } from "bun:sqlite";
import { AssetStore } from "./asset-store.ts";
import { type CurrentAssetsMessage, MessageSchema } from "./schema.ts";

const db = new Database("asset.db");
const assetStore = new AssetStore(db);

const createCurrentAssetsMsg = (): CurrentAssetsMessage => {
  const assets = assetStore.list();
  return { type: "CURRENT_ASSETS", assets };
};

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open: (ws) => {
      ws.sendText(JSON.stringify(createCurrentAssetsMsg()));
    },

    message: async (ws, raw_message) => {
      const message = MessageSchema.parse(raw_message);

      switch (message.type) {
        case "UPDATE_ASSET": {
          await assetStore.update(message.id, message.input);
          ws.sendText(JSON.stringify(createCurrentAssetsMsg()));
          break;
        }

        case "CREATE_ASSET": {
          await assetStore.create(message.input);
          ws.sendText(JSON.stringify(createCurrentAssetsMsg()));
          break;
        }
      }
    },
  },
});
