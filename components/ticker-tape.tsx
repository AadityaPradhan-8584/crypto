"use client"
import { cn } from "@/lib/utils"

interface Coin {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
}

interface TickerTapeProps {
  coins: Coin[]
  onCoinClick: (coinId: string) => void
}

export function TickerTape({ coins, onCoinClick }: TickerTapeProps) {
  return (
    <div className="relative overflow-hidden bg-card border border-border rounded-lg">
      <div className="flex items-center py-4">
        <div className="flex items-center ticker-container">
          <div className="flex items-center space-x-6 ticker-animation">
            {/* Triple the coins for truly seamless loop */}
            {[...coins, ...coins, ...coins].map((coin, index) => (
              <div
                key={`${coin.id}-${index}`}
                onClick={() => onCoinClick(coin.id)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors whitespace-nowrap"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-accent-foreground">{coin.symbol.charAt(0)}</span>
                  </div>
                  <span className="font-semibold text-foreground">{coin.symbol}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm text-foreground">${coin.price.toLocaleString()}</span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      coin.change24h >= 0
                        ? "text-success-foreground bg-success"
                        : "text-destructive-foreground bg-destructive",
                    )}
                  >
                    {coin.change24h >= 0 ? "+" : ""}
                    {coin.change24h.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
