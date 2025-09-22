"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { generateChartData } from "@/services/api"
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
  supply: number
  maxSupply: number | null
}

interface CoinModalProps {
  coin: Coin
  isOpen: boolean
  onClose: () => void
}

export function CoinModal({ coin, isOpen, onClose }: CoinModalProps) {
  const [timeframe, setTimeframe] = useState<"hour" | "month" | "year">("hour")

  const chartData = generateChartData(
    timeframe === "hour" ? "hourly" : "daily",
    timeframe === "hour" ? 24 : timeframe === "month" ? 30 : 365,
  )

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">{coin.symbol.charAt(0)}</span>
            </div>
            <div>
              <span className="text-xl font-bold">{coin.name}</span>
              <span className="text-muted-foreground ml-2">({coin.symbol})</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Change */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold font-mono">${coin.price.toLocaleString()}</div>
              <Badge
                variant={coin.change24h >= 0 ? "default" : "destructive"}
                className={cn("mt-2", coin.change24h >= 0 ? "bg-success text-success-foreground" : "")}
              >
                {coin.change24h >= 0 ? "+" : ""}
                {coin.change24h.toFixed(2)}% (24h)
              </Badge>
            </div>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Price Chart</CardTitle>
                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as "hour" | "month" | "year")}>
                  <TabsList>
                    <TabsTrigger value="hour">1H</TabsTrigger>
                    <TabsTrigger value="month">1M</TabsTrigger>
                    <TabsTrigger value="year">1Y</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, "Price"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-lg font-semibold">{formatNumber(coin.marketCap)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="text-lg font-semibold">{formatNumber(coin.volume24h)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">24h High</div>
                <div className="text-lg font-semibold">${coin.high24h.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">24h Low</div>
                <div className="text-lg font-semibold">${coin.low24h.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Circulating Supply</div>
                <div className="text-lg font-semibold">{coin.supply.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Max Supply</div>
                <div className="text-lg font-semibold">{coin.maxSupply ? coin.maxSupply.toLocaleString() : "∞"}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
