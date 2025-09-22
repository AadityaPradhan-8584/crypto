"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { TickerTape } from "@/components/ticker-tape"
import { CoinStats } from "@/components/coin-stats"
import { GlobalStats } from "@/components/global-stats"
import { dummyCoins } from "@/services/api"

export default function HomePage() {
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null)

  const handleCoinClick = (coinId: string) => {
    setSelectedCoin(coinId)
  }

  const coin = selectedCoin ? dummyCoins.find((c) => c.id === selectedCoin) : null

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            AI-Powered Crypto
            <span className="text-accent block">Predictions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get accurate cryptocurrency price predictions powered by advanced machine learning algorithms
          </p>
        </div>

        <GlobalStats />

        {/* Ticker Tape */}
        <div className="mb-6">
          <TickerTape coins={dummyCoins} onCoinClick={handleCoinClick} />
        </div>

        {coin && <CoinStats coin={coin} />}
      </main>
    </div>
  )
}
