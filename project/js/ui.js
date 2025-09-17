// UI Management and Event Handlers
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.currentCoin = null;
        this.searchTimeout = null;
        this.updateIntervals = new Map();
        this.sortBy = 'price';
        this.sortOrder = 'desc';
        
        this.initializeEventListeners();
        this.initializeTheme();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Navigation events
        document.getElementById('backBtn')?.addEventListener('click', () => {
            this.showHomePage();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.refreshAllData();
        });

        // Sort controls
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSort(e.target.dataset.sort);
            });
        });

        // Chart timeframe buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeframe-btn')) {
                this.handleTimeframeChange(e.target.dataset.period);
            }
        });

        // Prediction controls
        document.getElementById('predictionType')?.addEventListener('change', (e) => {
            this.updatePredictionSteps(e.target.value);
        });

        document.getElementById('predictBtn')?.addEventListener('click', () => {
            this.handlePredictionRequest();
        });
    }

    // Initialize theme
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Toggle theme
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Show loading spinner
    showLoading(show = true) {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.toggle('hidden', !show);
        }
    }

    // Update market statistics
    async updateMarketStats() {
        try {
            const stats = await cryptoAPI.getMarketStats();
            
            const elements = {
                totalMarketCap: document.getElementById('totalMarketCap'),
                total24hVolume: document.getElementById('total24hVolume'),
                activeCryptos: document.getElementById('activeCryptos')
            };

            if (elements.totalMarketCap) {
                elements.totalMarketCap.textContent = stats.formattedMarketCap;
            }
            
            if (elements.total24hVolume) {
                elements.total24hVolume.textContent = stats.formattedVolume;
            }
            
            if (elements.activeCryptos) {
                elements.activeCryptos.textContent = stats.activeCryptos.toLocaleString();
            }
        } catch (error) {
            console.error('Error updating market stats:', error);
        }
    }

    // Create cryptocurrency card
    createCryptoCard(coin, data) {
        const changeClass = cryptoAPI.getChangeClass(data.changePct24h);
        const changeIcon = data.changePct24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        return `
            <div class="crypto-card" data-coin="${coin}" onclick="uiManager.showCoinPage('${coin}')">
                <div class="crypto-header">
                    <div class="crypto-icon">${coin.substr(0, 2)}</div>
                    <div class="crypto-info">
                        <h3>${cryptoAPI.getCoinName(coin)}</h3>
                        <span class="crypto-symbol">${coin}</span>
                    </div>
                </div>
                
                <div class="crypto-price">${data.displayPrice}</div>
                
                <div class="crypto-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    <span>${cryptoAPI.formatPercentage(data.changePct24h)}</span>
                </div>
                
                <div class="crypto-stats">
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">Market Cap</span>
                        <span class="crypto-stat-value">${data.displayMarketCap}</span>
                    </div>
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">Volume 24h</span>
                        <span class="crypto-stat-value">${data.displayVolume}</span>
                    </div>
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">High 24h</span>
                        <span class="crypto-stat-value">$${data.high24h.toFixed(2)}</span>
                    </div>
                    <div class="crypto-stat">
                        <span class="crypto-stat-label">Low 24h</span>
                        <span class="crypto-stat-value">$${data.low24h.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Update cryptocurrency grid
    async updateCryptoGrid(coins = CONFIG.SUPPORTED_COINS) {
        const grid = document.getElementById('cryptoGrid');
        if (!grid) return;

        try {
            this.showLoading(true);
            const pricesData = await cryptoAPI.getMultiplePrices(coins);
            
            // Sort data
            const sortedCoins = this.sortCoins(pricesData);
            
            // Generate cards HTML
            const cardsHTML = sortedCoins.map(([coin, data]) => 
                this.createCryptoCard(coin, data)
            ).join('');
            
            grid.innerHTML = cardsHTML;
            this.showLoading(false);
        } catch (error) {
            console.error('Error updating crypto grid:', error);
            grid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading cryptocurrency data. Please try again.</p>
                    <button onclick="uiManager.updateCryptoGrid()">Retry</button>
                </div>
            `;
            this.showLoading(false);
        }
    }

    // Sort coins based on current sort criteria
    sortCoins(data) {
        const entries = Object.entries(data);
        
        return entries.sort((a, b) => {
            const [coinA, dataA] = a;
            const [coinB, dataB] = b;
            
            let valueA, valueB;
            
            switch (this.sortBy) {
                case 'price':
                    valueA = dataA.price;
                    valueB = dataB.price;
                    break;
                case 'change':
                    valueA = dataA.changePct24h;
                    valueB = dataB.changePct24h;
                    break;
                case 'volume':
                    valueA = dataA.volume24h;
                    valueB = dataB.volume24h;
                    break;
                case 'rank':
                    valueA = dataA.marketCap;
                    valueB = dataB.marketCap;
                    break;
                default:
                    valueA = dataA.price;
                    valueB = dataB.price;
            }
            
            if (this.sortOrder === 'desc') {
                return valueB - valueA;
            } else {
                return valueA - valueB;
            }
        });
    }

    // Handle sort button click
    handleSort(sortBy) {
        // Update active sort button
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-sort="${sortBy}"]`)?.classList.add('active');
        
        // Toggle order if same sort criteria
        if (this.sortBy === sortBy) {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        } else {
            this.sortBy = sortBy;
            this.sortOrder = 'desc';
        }
        
        // Refresh grid with new sort
        this.updateCryptoGrid();
    }

    // Handle search
    handleSearch(query) {
        if (!query.trim()) {
            this.updateCryptoGrid();
            return;
        }
        
        const filteredCoins = CONFIG.SUPPORTED_COINS.filter(coin => {
            const coinName = cryptoAPI.getCoinName(coin).toLowerCase();
            const coinSymbol = coin.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            return coinName.includes(searchQuery) || coinSymbol.includes(searchQuery);
        });
        
        this.updateCryptoGrid(filteredCoins);
    }

    // Show coin detail page
    async showCoinPage(coin) {
        this.currentCoin = coin;
        this.currentPage = 'coin';
        
        // Hide home page, show coin page
        document.getElementById('homePage').classList.remove('active');
        document.getElementById('coinPage').classList.add('active');
        
        // Update browser history
        window.history.pushState({page: 'coin', coin}, '', `#${coin}`);
        
        await this.loadCoinDetails(coin);
        this.setupCoinPageIntervals();
    }

    // Show home page
    showHomePage() {
        this.currentPage = 'home';
        this.currentCoin = null;
        
        // Clear coin page intervals
        this.clearCoinPageIntervals();
        
        // Hide coin page, show home page
        document.getElementById('coinPage').classList.remove('active');
        document.getElementById('homePage').classList.add('active');
        
        // Update browser history
        window.history.pushState({page: 'home'}, '', '#');
        
        // Refresh home page data
        this.refreshAllData();
    }

    // Load coin details
    async loadCoinDetails(coin) {
        try {
            const coinData = await cryptoAPI.getCoinDetails(coin);
            
            // Update coin header
            this.updateCoinHeader(coin, coinData);
            
            // Update coin statistics
            this.updateCoinStats(coin, coinData);
            
            // Load chart
            await this.loadCoinChart(coin);
            
            // Setup prediction controls
            this.setupPredictionControls(coin);
            
        } catch (error) {
            console.error('Error loading coin details:', error);
        }
    }

    // Update coin header
    updateCoinHeader(coin, data) {
        const header = document.getElementById('coinHeader');
        if (!header) return;
        
        const changeClass = cryptoAPI.getChangeClass(data.changePct24h);
        const changeIcon = data.changePct24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        
        header.innerHTML = `
            <div class="coin-title">
                <div class="coin-logo">${coin.substr(0, 2)}</div>
                <div class="coin-name">
                    <h1>${data.name}</h1>
                    <span class="coin-symbol">${coin}</span>
                </div>
            </div>
            
            <div class="coin-price-info">
                <div class="current-price">${data.displayPrice}</div>
                <div class="price-change ${changeClass}">
                    <i class="fas ${changeIcon}"></i>
                    <span>${cryptoAPI.formatPercentage(data.changePct24h)}</span>
                </div>
            </div>
        `;
    }

    // Update coin statistics
    updateCoinStats(coin, data) {
        const stats = document.getElementById('coinStats');
        if (!stats) return;
        
        stats.innerHTML = `
            <h3>Statistics</h3>
            <div class="stat-row">
                <span class="stat-name">Market Cap</span>
                <span class="stat-value">${data.displayMarketCap}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Volume (24h)</span>
                <span class="stat-value">${data.displayVolume}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">High (24h)</span>
                <span class="stat-value">$${data.high24h.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Low (24h)</span>
                <span class="stat-value">$${data.low24h.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Open (24h)</span>
                <span class="stat-value">$${data.open24h.toFixed(2)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Supply</span>
                <span class="stat-value">${data.supply ? data.supply.toLocaleString() : 'N/A'}</span>
            </div>
            <div class="stat-row">
                <span class="stat-name">Last Update</span>
                <span class="stat-value">${new Date(data.lastUpdate * 1000).toLocaleTimeString()}</span>
            </div>
        `;
        
        // Update coin info
        const info = document.getElementById('coinInfo');
        if (info) {
            info.innerHTML = `
                <h3>About ${data.name}</h3>
                <p>${data.description}</p>
            `;
        }
    }

    // Load coin chart
    async loadCoinChart(coin, period = '24h') {
        try {
            if (!chartManager.currentChart) {
                chartManager.initChart('priceChart');
            }
            
            await chartManager.updateChart(coin, period);
            
            // Update active timeframe button
            document.querySelectorAll('.timeframe-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelector(`[data-period="${period}"]`)?.classList.add('active');
            
        } catch (error) {
            console.error('Error loading coin chart:', error);
        }
    }

    // Handle timeframe change
    handleTimeframeChange(period) {
        if (this.currentCoin) {
            this.loadCoinChart(this.currentCoin, period);
        }
    }

    // Setup prediction controls
    setupPredictionControls(coin) {
        const predictionType = document.getElementById('predictionType');
        const predictionStep = document.getElementById('predictionStep');
        
        if (predictionType && predictionStep) {
            // Update prediction steps based on current type
            this.updatePredictionSteps(predictionType.value);
        }
    }

    // Update prediction steps dropdown
    updatePredictionSteps(frequency) {
        const stepSelect = document.getElementById('predictionStep');
        if (!stepSelect) return;
        
        const steps = predictionService.getPredictionSteps(frequency);
        
        stepSelect.innerHTML = steps.map(step => 
            `<option value="${step.value}">${step.label}</option>`
        ).join('');
    }

    // Handle prediction request
    async handlePredictionRequest() {
        if (!this.currentCoin) return;
        
        const predictBtn = document.getElementById('predictBtn');
        const predictionResults = document.getElementById('predictionResults');
        const predictionType = document.getElementById('predictionType');
        const predictionStep = document.getElementById('predictionStep');
        
        if (!predictBtn || !predictionResults || !predictionType || !predictionStep) return;
        
        const frequency = predictionType.value;
        const timeStep = parseInt(predictionStep.value);
        
        try {
            // Show loading state
            predictBtn.disabled = true;
            predictBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Predicting...';
            
            // Get prediction
            const prediction = await predictionService.getPrediction(this.currentCoin, frequency, timeStep);
            
            if (prediction) {
                const formatted = predictionService.formatPredictionResults(prediction);
                this.displayPredictionResults(formatted);
            } else {
                throw new Error('No prediction data received');
            }
            
        } catch (error) {
            console.error('Prediction error:', error);
            predictionResults.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error getting prediction: ${error.message}</p>
                </div>
            `;
            predictionResults.classList.add('show');
        } finally {
            // Reset button
            predictBtn.disabled = false;
            predictBtn.innerHTML = '<i class="fas fa-brain"></i> Get Prediction';
        }
    }

    // Display prediction results
    displayPredictionResults(prediction) {
        const resultsContainer = document.getElementById('predictionResults');
        if (!resultsContainer || !prediction) return;
        
        resultsContainer.innerHTML = `
            <div class="prediction-data">
                <div class="prediction-item">
                    <span class="prediction-label">Open</span>
                    <span class="prediction-value">${prediction.open}</span>
                </div>
                <div class="prediction-item">
                    <span class="prediction-label">High</span>
                    <span class="prediction-value">${prediction.high}</span>
                </div>
                <div class="prediction-item">
                    <span class="prediction-label">Low</span>
                    <span class="prediction-value">${prediction.low}</span>
                </div>
                <div class="prediction-item">
                    <span class="prediction-label">Close</span>
                    <span class="prediction-value">${prediction.close}</span>
                </div>
                <div class="prediction-item">
                    <span class="prediction-label">Volume</span>
                    <span class="prediction-value">${prediction.volume}</span>
                </div>
            </div>
            <div class="prediction-meta">
                <p><strong>Prediction Type:</strong> ${prediction.frequency}</p>
                <p><strong>Time Step:</strong> ${prediction.timeStep}</p>
                <p><strong>Generated:</strong> ${new Date(prediction.timestamp).toLocaleString()}</p>
            </div>
        `;
        
        resultsContainer.classList.add('show');
    }

    // Setup auto-refresh intervals for coin page
    setupCoinPageIntervals() {
        this.clearCoinPageIntervals();
        
        // Refresh coin data every 30 seconds
        this.updateIntervals.set('coinData', setInterval(() => {
            if (this.currentCoin && this.currentPage === 'coin') {
                this.loadCoinDetails(this.currentCoin);
            }
        }, CONFIG.UPDATE_INTERVALS.prices));
    }

    // Clear coin page intervals
    clearCoinPageIntervals() {
        this.updateIntervals.forEach((interval) => {
            clearInterval(interval);
        });
        this.updateIntervals.clear();
    }

    // Refresh all data
    refreshAllData() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.classList.add('fa-spin');
            setTimeout(() => refreshBtn.classList.remove('fa-spin'), 1000);
        }
        
        if (this.currentPage === 'home') {
            this.updateMarketStats();
            this.updateCryptoGrid();
        } else if (this.currentPage === 'coin' && this.currentCoin) {
            this.loadCoinDetails(this.currentCoin);
        }
    }

    // Handle browser back/forward
    handlePopState(event) {
        if (event.state) {
            if (event.state.page === 'home') {
                this.showHomePage();
            } else if (event.state.page === 'coin' && event.state.coin) {
                this.showCoinPage(event.state.coin);
            }
        } else {
            this.showHomePage();
        }
    }
}

// Create global UI manager instance
const uiManager = new UIManager();

// Handle browser navigation
window.addEventListener('popstate', (event) => {
    uiManager.handlePopState(event);
});