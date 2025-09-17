// API Service for cryptocurrency data
class CryptoAPI {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
        this.apiKey = CONFIG.API_KEY;
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }

    // Generic API request method
    async makeRequest(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        
        // Add API key to headers
        const headers = {
            'Authorization': `Apikey ${this.apiKey}`,
            'Content-Type': 'application/json'
        };

        // Add parameters to URL
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.Response === 'Error') {
                throw new Error(data.Message || 'API returned an error');
            }

            return data;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Cache management
    getCachedData(key) {
        const now = Date.now();
        const expiry = this.cacheExpiry.get(key);
        
        if (expiry && now < expiry) {
            return this.cache.get(key);
        }
        
        // Clean expired cache
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
        return null;
    }

    setCachedData(key, data, ttl = 60000) { // Default 1 minute TTL
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }

    // Get multiple cryptocurrency prices
    async getMultiplePrices(coins = CONFIG.SUPPORTED_COINS, currency = CONFIG.CURRENCY) {
        const cacheKey = `prices_${coins.join(',')}_${currency}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const data = await this.makeRequest('/pricemultifull', {
                fsyms: coins.join(','),
                tsyms: currency
            });

            const result = {};
            
            for (const coin of coins) {
                if (data.RAW && data.RAW[coin] && data.RAW[coin][currency]) {
                    const raw = data.RAW[coin][currency];
                    const display = data.DISPLAY && data.DISPLAY[coin] && data.DISPLAY[coin][currency];
                    
                    result[coin] = {
                        price: raw.PRICE,
                        change24h: raw.CHANGE24HOUR,
                        changePct24h: raw.CHANGEPCT24HOUR,
                        volume24h: raw.VOLUME24HOURTO,
                        marketCap: raw.MKTCAP,
                        supply: raw.SUPPLY,
                        high24h: raw.HIGH24HOUR,
                        low24h: raw.LOW24HOUR,
                        open24h: raw.OPEN24HOUR,
                        lastUpdate: raw.LASTUPDATE,
                        // Display formatted values
                        displayPrice: display?.PRICE || `$${raw.PRICE.toFixed(2)}`,
                        displayChange: display?.CHANGE24HOUR || raw.CHANGE24HOUR.toFixed(2),
                        displayVolume: display?.VOLUME24HOURTO || this.formatNumber(raw.VOLUME24HOURTO),
                        displayMarketCap: display?.MKTCAP || this.formatNumber(raw.MKTCAP)
                    };
                }
            }

            this.setCachedData(cacheKey, result, 30000); // 30 seconds cache
            return result;
        } catch (error) {
            console.error('Error fetching multiple prices:', error);
            throw error;
        }
    }

    // Get single cryptocurrency price
    async getSinglePrice(coin, currency = CONFIG.CURRENCY) {
        try {
            const data = await this.makeRequest('/price', {
                fsym: coin,
                tsyms: currency
            });

            return data[currency];
        } catch (error) {
            console.error(`Error fetching price for ${coin}:`, error);
            throw error;
        }
    }

    // Get historical data for charts
    async getHistoricalData(coin, period = '24h', currency = CONFIG.CURRENCY) {
        const cacheKey = `chart_${coin}_${period}_${currency}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        const timeframe = CONFIG.TIMEFRAMES[period];
        if (!timeframe) {
            throw new Error(`Unsupported timeframe: ${period}`);
        }

        let endpoint;
        switch (timeframe.unit) {
            case 'minute':
                endpoint = '/v2/histominute';
                break;
            case 'hour':
                endpoint = '/v2/histohour';
                break;
            case 'day':
                endpoint = '/v2/histoday';
                break;
            default:
                throw new Error(`Unsupported unit: ${timeframe.unit}`);
        }

        try {
            const data = await this.makeRequest(endpoint, {
                fsym: coin,
                tsym: currency,
                limit: timeframe.limit,
                aggregate: timeframe.aggregate
            });

            if (!data.Data || !data.Data.Data) {
                throw new Error('Invalid historical data response');
            }

            const result = data.Data.Data.map(point => ({
                time: point.time * 1000, // Convert to milliseconds
                open: point.open,
                high: point.high,
                low: point.low,
                close: point.close,
                volume: point.volumeto
            }));

            this.setCachedData(cacheKey, result, 60000); // 1 minute cache
            return result;
        } catch (error) {
            console.error(`Error fetching historical data for ${coin}:`, error);
            throw error;
        }
    }

    // Get market statistics
    async getMarketStats() {
        const cacheKey = 'market_stats';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Get data for top coins to calculate market stats
            const topCoins = CONFIG.SUPPORTED_COINS.slice(0, 10);
            const data = await this.getMultiplePrices(topCoins);
            
            let totalMarketCap = 0;
            let total24hVolume = 0;
            let activeCryptos = 0;

            Object.values(data).forEach(coin => {
                if (coin.marketCap) {
                    totalMarketCap += coin.marketCap;
                }
                if (coin.volume24h) {
                    total24hVolume += coin.volume24h;
                }
                activeCryptos++;
            });

            const result = {
                totalMarketCap,
                total24hVolume,
                activeCryptos: CONFIG.SUPPORTED_COINS.length,
                formattedMarketCap: this.formatNumber(totalMarketCap),
                formattedVolume: this.formatNumber(total24hVolume)
            };

            this.setCachedData(cacheKey, result, 300000); // 5 minutes cache
            return result;
        } catch (error) {
            console.error('Error fetching market stats:', error);
            throw error;
        }
    }

    // Get detailed coin information
    async getCoinDetails(coin) {
        const cacheKey = `details_${coin}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // Get price data
            const priceData = await this.getMultiplePrices([coin]);
            const coinData = priceData[coin];

            if (!coinData) {
                throw new Error(`No data available for ${coin}`);
            }

            // Get additional coin information (you might need a different endpoint for this)
            // For now, we'll use the available price data
            const result = {
                ...coinData,
                name: this.getCoinName(coin),
                symbol: coin,
                description: `${this.getCoinName(coin)} (${coin}) is a digital cryptocurrency.`,
                // Add more details as needed
            };

            this.setCachedData(cacheKey, result, 600000); // 10 minutes cache
            return result;
        } catch (error) {
            console.error(`Error fetching details for ${coin}:`, error);
            throw error;
        }
    }

    // Utility methods
    formatNumber(num) {
        if (num >= 1e12) {
            return `$${(num / 1e12).toFixed(2)}T`;
        } else if (num >= 1e9) {
            return `$${(num / 1e9).toFixed(2)}B`;
        } else if (num >= 1e6) {
            return `$${(num / 1e6).toFixed(2)}M`;
        } else if (num >= 1e3) {
            return `$${(num / 1e3).toFixed(2)}K`;
        } else {
            return `$${num.toFixed(2)}`;
        }
    }

    getCoinName(symbol) {
        const coinNames = {
            'BTC': 'Bitcoin',
            'ETH': 'Ethereum',
            'BNB': 'Binance Coin',
            'ADA': 'Cardano',
            'XRP': 'XRP',
            'SOL': 'Solana',
            'DOT': 'Polkadot',
            'DOGE': 'Dogecoin',
            'AVAX': 'Avalanche',
            'SHIB': 'Shiba Inu',
            'MATIC': 'Polygon',
            'LTC': 'Litecoin',
            'UNI': 'Uniswap',
            'ATOM': 'Cosmos',
            'LINK': 'Chainlink',
            'XLM': 'Stellar',
            'VET': 'VeChain',
            'ICP': 'Internet Computer',
            'FIL': 'Filecoin',
            'TRX': 'TRON'
        };
        
        return coinNames[symbol] || symbol;
    }

    formatPercentage(value) {
        const formatted = Math.abs(value).toFixed(2);
        const sign = value >= 0 ? '+' : '-';
        return `${sign}${formatted}%`;
    }

    getChangeClass(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return 'neutral';
    }
}

// Create global API instance
const cryptoAPI = new CryptoAPI();