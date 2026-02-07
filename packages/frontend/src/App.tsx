import { useAssets } from "./hooks/useAssets";

export function App() {
  const { assets, isConnected } = useAssets(`ws://${window.location.host}/ws`);

  const sortedAssets = assets
    ? [...assets].sort((a, b) => a.symbol.localeCompare(b.symbol))
    : assets;

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className="absolute inset-0 bg-gradient-radial from-orange-950/20 via-transparent to-purple-950/10" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-center mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 bg-clip-text text-transparent">
            Horizon Event Exchange
          </h1>
          <div className="flex justify-center">
            <span
              className={`px-6 py-3 rounded-full text-sm font-bold tracking-wider border ${
                isConnected
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/50"
                  : "bg-red-500/10 text-red-400 border-red-500/50"
              }`}
            >
              {isConnected ? "◉ CONNECTED" : "◉ DISCONNECTED"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {sortedAssets?.map((a) => (
            <div
              key={a.id}
              className="bg-black/80 backdrop-blur-sm rounded-lg p-2 border border-purple-900/30 hover:border-orange-500/40 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-lg font-black text-orange-400 mb-1">
                {a.symbol}
              </h3>
              <div className="text-xl font-mono font-bold text-white mb-1">
                ${a.price.toFixed(2)}
              </div>
              <div className="text-xs text-purple-300 uppercase tracking-wider">
                {new Date(a.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>

        {!sortedAssets ||
          (sortedAssets.length === 0 && (
            <div className="text-center py-20">
              <div className="text-purple-400 text-lg font-medium">
                {isConnected
                  ? "No assets available"
                  : "Waiting for connection..."}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
