"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dummyPredictions, calculatePredictionAccuracy } from "@/services/api"
import { History, TrendingUp, TrendingDown } from "lucide-react"

export function PredictionHistory() {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-success text-success-foreground"
    if (confidence >= 60) return "bg-warning text-warning-foreground"
    return "bg-destructive text-destructive-foreground"
  }

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return "bg-green-500 text-white"
    if (accuracy >= 75) return "bg-blue-500 text-white"
    if (accuracy >= 60) return "bg-yellow-500 text-black"
    return "bg-red-500 text-white"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5 text-accent" />
          <span>Prediction History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Timeframe</TableHead>
                <TableHead>Predicted Price</TableHead>
                <TableHead>Actual Price</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyPredictions.map((prediction) => {
                const accuracyData = calculatePredictionAccuracy(prediction)

                return (
                  <TableRow key={prediction.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-accent-foreground">
                            {prediction.symbol.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">{prediction.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {prediction.units} {prediction.timeframe === "hourly" ? "hours" : "days"}
                    </TableCell>
                    <TableCell className="font-mono">${prediction.predictedPrice.toLocaleString()}</TableCell>
                    <TableCell className="font-mono">
                      {accuracyData ? (
                        <div className="flex items-center space-x-1">
                          <span>${accuracyData.actualPrice.toLocaleString()}</span>
                          {accuracyData.difference > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {accuracyData ? (
                        <Badge className={getAccuracyColor(accuracyData.accuracy)}>
                          {accuracyData.accuracy.toFixed(1)}%
                        </Badge>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getConfidenceColor(prediction.confidence)}>{prediction.confidence}%</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(prediction.timestamp)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
