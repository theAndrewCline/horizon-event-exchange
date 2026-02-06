import { type Asset, MessageSchema } from "core";
import { useEffect, useRef, useState } from "react";

export function useAssets(url: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = ({ data }) => {
      const msg = MessageSchema.parse(JSON.parse(data));

      if (msg.type === "CURRENT_ASSETS") {
        setAssets(msg.assets);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onopen = () => {
      setIsConnected(true);
    };

    wsRef.current = ws;

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  return { assets, isConnected };
}
