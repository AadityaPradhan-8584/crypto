// Configuration
const CONFIG = {
    // CryptoCompare API configuration
    API_KEY: 'da3f7a681558318ac0d2be9df5f07deae6e723c2321dc638e42a8f27b1f12ce5',
    BASE_URL: 'https://min-api.cryptocompare.com/data',
    
    // Supported cryptocurrencies
    SUPPORTED_COINS: [
        'BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE', 
        'AVAX', 'SHIB', 'MATIC', 'LTC', 'UNI', 'ATOM', 'LINK', 
        'XLM', 'VET', 'ICP', 'FIL', 'TRX'
    ],
    
    // Chart configuration
    CHART_COLORS: {
        bullish: '#10b981',
        bearish: '#ef4444',
        neutral: '#6b7280'
    },
    
    // Update intervals (in milliseconds)
    UPDATE_INTERVALS: {
        prices: 30000,      // 30 seconds
        charts: 60000,      // 1 minute
        market_stats: 300000 // 5 minutes
    },
    
    // Prediction API endpoint (your backend)
    PREDICTION_API: '/predict',
    
    // Display settings
    COINS_PER_PAGE: 20,
    CURRENCY: 'USD',
    
    // Chart timeframes
    TIMEFRAMES: {
        '1h': { limit: 60, aggregate: 1, unit: 'minute' },
        '24h': { limit: 24, aggregate: 1, unit: 'hour' },
        '7d': { limit: 7, aggregate: 1, unit: 'day' },
        '30d': { limit: 30, aggregate: 1, unit: 'day' },
        '1y': { limit: 365, aggregate: 1, unit: 'day' }
    }
};