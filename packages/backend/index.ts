import { Database } from "bun:sqlite";
import type { ServerWebSocket } from "bun";
import { type CurrentAssetsMessage, MessageSchema } from "core";
import { AssetStore } from "./asset-store.ts";

const db = new Database("assets.db");
const assetStore = new AssetStore(db);

const createCurrentAssetsMsg = (): CurrentAssetsMessage => {
  const assets = assetStore.list();
  return { type: "CURRENT_ASSETS", assets };
};

const clients = new Set<ServerWebSocket>();

const server = Bun.serve({
  port: 8000,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open: (ws) => {
      clients.add(ws);
      ws.send(JSON.stringify(createCurrentAssetsMsg()));
    },

    message: async (_, raw_message) => {
      const message = MessageSchema.parse(JSON.parse(raw_message.toString()));

      switch (message.type) {
        case "UPDATE_ASSET": {
          assetStore.update(message.id, message.input);
          // Broadcast to all connected clients
          const updateMsg = JSON.stringify(createCurrentAssetsMsg());
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(updateMsg);
            }
          });
          break;
        }

        case "CREATE_ASSET": {
          assetStore.create(message.input);
          const updateMsg = JSON.stringify(createCurrentAssetsMsg());
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(updateMsg);
            }
          });
          break;
        }
      }
    },

    close: (ws) => {
      clients.delete(ws);
    },
  },
});

console.log(`Server running at ${server.url}`);
