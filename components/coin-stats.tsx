"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface Coin {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
  volume24h: number
  high24h: number
  low24h: number
  priceHistory: { time: string; price: number }[]
}

interface CoinStatsProps {
  coin: Coin
}

export function CoinStats({ coin }: CoinStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">{coin.symbol.charAt(0)}</span>
            </div>
            <div>
              <CardTitle className="text-xl">{coin.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{coin.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${coin.price.toLocaleString()}</div>
            <Badge
              className={cn(
                coin.change24h >= 0
                  ? "bg-success text-success-foreground"
                  : "bg-destructive text-destructive-foreground",
              )}
            >
              {coin.change24h >= 0 ? "+" : ""}
              {coin.change24h.toFixed(2)}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">{formatNumber(coin.marketCap)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="font-semibold">{formatNumber(coin.volume24h)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h High</p>
            <p className="font-semibold">${coin.high24h.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h Low</p>
            <p className="font-semibold">${coin.low24h.toLocaleString()}</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={coin.priceHistory}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
