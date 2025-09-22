"use client"

import { Badge } from "@/components/ui/badge"
import { globalStats } from "@/services/api"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"

export function GlobalStats() {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Market Cap:</span>
          <span className="font-semibold">{formatNumber(globalStats.totalMarketCap)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">24h Vol:</span>
          <span className="font-semibold">{formatNumber(globalStats.total24hVolume)}</span>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Top Gainer:</span>
          <span className="font-semibold">{globalStats.topGainer.symbol}</span>
          <Badge className="bg-success text-success-foreground text-xs">
            +{globalStats.topGainer.change.toFixed(1)}%
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <TrendingDown className="h-4 w-4 text-destructive" />
          <span className="text-muted-foreground">Top Loser:</span>
          <span className="font-semibold">{globalStats.topLoser.symbol}</span>
          <Badge variant="destructive" className="text-xs">
            {globalStats.topLoser.change.toFixed(1)}%
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">Fear & Greed:</span>
          <span className="font-semibold">{globalStats.fearGreedIndex}</span>
          <Badge
            className={
              globalStats.fearGreedIndex >= 75
                ? "bg-success text-success-foreground"
                : globalStats.fearGreedIndex >= 50
                  ? "bg-warning text-warning-foreground"
                  : "bg-destructive text-destructive-foreground"
            }
            size="sm"
          >
            {globalStats.fearGreedIndex >= 75 ? "Greed" : globalStats.fearGreedIndex >= 50 ? "Neutral" : "Fear"}
          </Badge>
        </div>
      </div>
    </div>
  )
}
