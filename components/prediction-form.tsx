"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { dummyCoins } from "@/services/api"
import { Loader2, TrendingUp } from "lucide-react"

interface PredictionFormProps {
  onSubmit: (data: {
    coin: string
    timeframe: "hourly" | "daily"
    units: number
  }) => void
  isLoading: boolean
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [selectedCoin, setSelectedCoin] = useState("")
  const [timeframe, setTimeframe] = useState<"hourly" | "daily">("hourly")
  const [units, setUnits] = useState([6])

  const maxUnits = timeframe === "hourly" ? 24 : 30
  const unitLabel = timeframe === "hourly" ? "hours" : "days"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCoin && timeframe && units[0]) {
      onSubmit({
        coin: selectedCoin,
        timeframe,
        units: units[0],
      })
    }
  }

  const isFormValid = selectedCoin && timeframe && units[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span>Create Prediction</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Coin Selection */}
          <div className="space-y-2">
            <Label htmlFor="coin">Select Cryptocurrency</Label>
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a coin..." />
              </SelectTrigger>
              <SelectContent>
                {dummyCoins.slice(0, 10).map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-accent-foreground">{coin.symbol.charAt(0)}</span>
                      </div>
                      <span>
                        {coin.name} ({coin.symbol})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label htmlFor="timeframe">Prediction Timeframe</Label>
            <Select
              value={timeframe}
              onValueChange={(value) => {
                setTimeframe(value as "hourly" | "daily")
                setUnits([timeframe === "hourly" ? 6 : 7]) // Reset units when timeframe changes
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly Predictions</SelectItem>
                <SelectItem value="daily">Daily Predictions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Units Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="units">Prediction Period</Label>
              <span className="text-sm font-medium text-accent">
                {units[0]} {unitLabel}
              </span>
            </div>
            <Slider value={units} onValueChange={setUnits} max={maxUnits} min={1} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 {unitLabel.slice(0, -1)}</span>
              <span>
                {maxUnits} {unitLabel}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={!isFormValid || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Prediction...
              </>
            ) : (
              "Generate Prediction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
