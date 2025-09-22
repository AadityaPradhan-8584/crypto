"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { PredictionForm } from "@/components/prediction-form"
import { PredictionResults } from "@/components/prediction-results"
import { PredictionHistory } from "@/components/prediction-history"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

export default function PredictionPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user is logged in (mock implementation)
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    setIsLoggedIn(!!token)
  }, [])

  const handlePredictionRequest = async (predictionData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      const { getPrediction } = await import("@/services/api")
      const result = await getPrediction(predictionData.coin, predictionData.timeframe, predictionData.units)
      setCurrentPrediction(result)
    } catch (error) {
      console.error("Prediction failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="py-16">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Please log in to access AI-powered cryptocurrency predictions and analysis.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Button asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Crypto Predictions</h1>
          <p className="text-muted-foreground">Get accurate price and volume predictions powered by machine learning</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Prediction Form */}
          <div className="lg:col-span-1">
            <PredictionForm onSubmit={handlePredictionRequest} isLoading={isLoading} />
          </div>

          {/* Results and History */}
          <div className="lg:col-span-2 space-y-8">
            {currentPrediction && <PredictionResults prediction={currentPrediction} />}
            <PredictionHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
