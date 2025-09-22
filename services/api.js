// Dummy data for the crypto prediction app

export const dummyCoins = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 67420.5,
    change24h: 2.5,
    marketCap: 1320000000000,
    volume24h: 28500000000,
    high24h: 68200.0,
    low24h: 65800.0,
    supply: 19600000,
    maxSupply: 21000000,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 3420.8,
    change24h: -1.2,
    marketCap: 411000000000,
    volume24h: 15200000000,
    high24h: 3480.0,
    low24h: 3380.0,
    supply: 120200000,
    maxSupply: null,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 635.2,
    change24h: 3.8,
    marketCap: 92000000000,
    volume24h: 1800000000,
    high24h: 642.0,
    low24h: 618.0,
    supply: 144800000,
    maxSupply: 200000000,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 198.45,
    change24h: 5.2,
    marketCap: 93000000000,
    volume24h: 3200000000,
    high24h: 205.0,
    low24h: 188.0,
    supply: 468000000,
    maxSupply: null,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 1.08,
    change24h: -0.8,
    marketCap: 38000000000,
    volume24h: 890000000,
    high24h: 1.12,
    low24h: 1.05,
    supply: 35000000000,
    maxSupply: 45000000000,
  },
  {
    id: "avalanche",
    symbol: "AVAX",
    name: "Avalanche",
    price: 42.3,
    change24h: 4.1,
    marketCap: 17000000000,
    volume24h: 650000000,
    high24h: 44.2,
    low24h: 40.8,
    supply: 402000000,
    maxSupply: 720000000,
  },
  {
    id: "chainlink",
    symbol: "LINK",
    name: "Chainlink",
    price: 25.8,
    change24h: 1.9,
    marketCap: 15000000000,
    volume24h: 420000000,
    high24h: 26.5,
    low24h: 25.2,
    supply: 583000000,
    maxSupply: 1000000000,
  },
  {
    id: "polygon",
    symbol: "MATIC",
    name: "Polygon",
    price: 0.95,
    change24h: -2.1,
    marketCap: 9500000000,
    volume24h: 380000000,
    high24h: 0.98,
    low24h: 0.92,
    supply: 10000000000,
    maxSupply: 10000000000,
  },
  {
    id: "polkadot",
    symbol: "DOT",
    name: "Polkadot",
    price: 8.45,
    change24h: 0.7,
    marketCap: 11000000000,
    volume24h: 290000000,
    high24h: 8.68,
    low24h: 8.32,
    supply: 1300000000,
    maxSupply: null,
  },
  {
    id: "uniswap",
    symbol: "UNI",
    name: "Uniswap",
    price: 12.6,
    change24h: 2.8,
    marketCap: 7500000000,
    volume24h: 180000000,
    high24h: 13.1,
    low24h: 12.2,
    supply: 596000000,
    maxSupply: 1000000000,
  },
]

export const globalStats = {
  totalMarketCap: 2800000000000,
  total24hVolume: 89000000000,
  btcDominance: 47.2,
  ethDominance: 14.7,
  topGainer: { symbol: "SOL", change: 5.2 },
  topLoser: { symbol: "MATIC", change: -2.1 },
  fearGreedIndex: 72,
}

export const dummyPredictions = [
  {
    id: "1",
    coin: "bitcoin",
    symbol: "BTC",
    timeframe: "hourly",
    units: 6,
    predictedPrice: 68200.0,
    predictedVolume: 29000000000,
    confidence: 85,
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    coin: "ethereum",
    symbol: "ETH",
    timeframe: "daily",
    units: 7,
    predictedPrice: 3580.0,
    predictedVolume: 16800000000,
    confidence: 78,
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    coin: "solana",
    symbol: "SOL",
    timeframe: "hourly",
    units: 12,
    predictedPrice: 210.5,
    predictedVolume: 3800000000,
    confidence: 82,
    timestamp: "2024-01-13T09:20:00Z",
  },
]

// Generate dummy chart data
export const generateChartData = (timeframe, units) => {
  const dataPoints = timeframe === "hourly" ? units : units * 24
  const data = []
  let basePrice = 50000 + Math.random() * 20000

  for (let i = 0; i < dataPoints; i++) {
    const change = (Math.random() - 0.5) * 0.05 // ±2.5% change
    basePrice = basePrice * (1 + change)
    data.push({
      time: i,
      price: Math.round(basePrice * 100) / 100,
      volume: Math.round((Math.random() * 1000000000 + 500000000) * 100) / 100,
    })
  }

  return data
}

// Mock API functions
export const login = async (username, password) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = { username }
      setCurrentUser(user)
      resolve({ success: true, token: "mock-jwt-token", user })
    }, 1000)
  })
}

export const signup = async (username, password) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Account created successfully" })
    }, 1000)
  })
}

export const getPrediction = async (coin, timeframe, units) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseCoin = dummyCoins.find((c) => c.id === coin)
      const prediction = {
        coin,
        symbol: baseCoin?.symbol || "UNKNOWN",
        timeframe,
        units,
        predictedPrice: baseCoin ? baseCoin.price * (1 + (Math.random() - 0.5) * 0.1) : 0,
        predictedVolume: baseCoin ? baseCoin.volume24h * (1 + (Math.random() - 0.5) * 0.2) : 0,
        confidence: Math.round(75 + Math.random() * 20),
        chartData: generateChartData(timeframe, units),
      }
      resolve(prediction)
    }, 1500)
  })
}

export const calculatePredictionAccuracy = (prediction) => {
  const currentCoin = dummyCoins.find((coin) => coin.id === prediction.coin)
  if (!currentCoin) return null

  const actualPrice = currentCoin.price
  const predictedPrice = prediction.predictedPrice
  const accuracy = Math.max(0, 100 - Math.abs(((actualPrice - predictedPrice) / actualPrice) * 100))

  return {
    actualPrice,
    accuracy: Math.round(accuracy * 100) / 100,
    difference: actualPrice - predictedPrice,
    percentDifference: (((actualPrice - predictedPrice) / predictedPrice) * 100).toFixed(2),
  }
}

let currentUser = null

export const getCurrentUser = () => currentUser

export const setCurrentUser = (user) => {
  currentUser = user
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export const logout = () => {
  currentUser = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
  }
}
