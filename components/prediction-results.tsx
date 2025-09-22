"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, DollarSign, BarChart3, Target } from "lucide-react"

interface PredictionResultsProps {
  prediction: {
    coin: string
    symbol: string
    timeframe: string
    units: number
    predictedPrice: number
    predictedVolume: number
    confidence: number
    chartData: Array<{ time: number; price: number; volume: number }>
  }
}

export function PredictionResults({ prediction }: PredictionResultsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-success text-success-foreground"
    if (confidence >= 60) return "bg-warning text-warning-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Prediction Results</h2>
        <Badge className={getConfidenceColor(prediction.confidence)}>{prediction.confidence}% Confidence</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">${prediction.predictedPrice.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {prediction.symbol} in {prediction.units} {prediction.timeframe === "hourly" ? "hours" : "days"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(prediction.predictedVolume)}</div>
            <p className="text-xs text-muted-foreground">24h trading volume</p>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <span>Price Prediction Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prediction.chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(value) => `${value}${prediction.timeframe === "hourly" ? "h" : "d"}`}
                />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "price" ? `$${Number(value).toLocaleString()}` : formatNumber(Number(value)),
                    name === "price" ? "Price" : "Volume",
                  ]}
                  labelFormatter={(label) => `${label} ${prediction.timeframe === "hourly" ? "hours" : "days"}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  dot={false}
                  name="price"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Prediction Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-accent" />
            <span>Prediction Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Asset:</span> {prediction.symbol}
            </p>
            <p>
              <span className="font-medium">Timeframe:</span> {prediction.units}{" "}
              {prediction.timeframe === "hourly" ? "hours" : "days"}
            </p>
            <p>
              <span className="font-medium">Model Confidence:</span> {prediction.confidence}%
            </p>
            <p className="text-muted-foreground mt-4">
              This prediction is generated using advanced machine learning algorithms analyzing historical price data,
              market sentiment, and technical indicators. Results are for informational purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
