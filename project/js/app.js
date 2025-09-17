// Main Application
class CryptoDashboardApp {
    constructor() {
        this.isInitialized = false;
        this.updateIntervals = new Map();
        
        this.init();
    }

    // Initialize the application
    async init() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing CryptoDesk Dashboard...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }

            // Initialize components
            await this.initializeApp();
            
            // Set up auto-refresh intervals
            this.setupAutoRefresh();
            
            // Handle initial route
            this.handleInitialRoute();
            
            this.isInitialized = true;
            console.log('CryptoDesk Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Error initializing application:', error);
            this.showError('Failed to initialize application. Please refresh the page.');
        }
    }

    // Initialize app components
    async initializeApp() {
        // Load initial data
        await Promise.all([
            uiManager.updateMarketStats(),
            uiManager.updateCryptoGrid()
        ]);
    }

    // Set up auto-refresh intervals
    setupAutoRefresh() {
        // Update prices every 30 seconds
        this.updateIntervals.set('prices', setInterval(() => {
            if (uiManager.currentPage === 'home') {
                uiManager.updateCryptoGrid();
            }
        }, CONFIG.UPDATE_INTERVALS.prices));

        // Update market stats every 5 minutes
        this.updateIntervals.set('marketStats', setInterval(() => {
            uiManager.updateMarketStats();
        }, CONFIG.UPDATE_INTERVALS.market_stats));

        // Update charts every minute (when on coin page)
        this.updateIntervals.set('charts', setInterval(() => {
            if (uiManager.currentPage === 'coin' && uiManager.currentCoin) {
                const activeTimeframe = document.querySelector('.timeframe-btn.active')?.dataset.period || '24h';
                uiManager.loadCoinChart(uiManager.currentCoin, activeTimeframe);
            }
        }, CONFIG.UPDATE_INTERVALS.charts));
    }

    // Handle initial route based on URL hash
    handleInitialRoute() {
        const hash = window.location.hash.slice(1); // Remove #
        
        if (hash && CONFIG.SUPPORTED_COINS.includes(hash.toUpperCase())) {
            // Show specific coin page
            uiManager.showCoinPage(hash.toUpperCase());
        } else {
            // Show home page
            uiManager.showHomePage();
            // Clear any invalid hash
            if (hash) {
                window.history.replaceState({page: 'home'}, '', '#');
            }
        }
    }

    // Show error message
    showError(message) {
        const errorHTML = `
            <div class="error-overlay">
                <div class="error-modal">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="error-btn">Refresh Page</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    // Clean up intervals
    destroy() {
        this.updateIntervals.forEach(interval => clearInterval(interval));
        this.updateIntervals.clear();
        uiManager.clearCoinPageIntervals();
        
        if (chartManager.currentChart) {
            chartManager.destroyChart();
        }
    }

    // Handle visibility change (pause updates when tab is not visible)
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, clear intervals
            this.updateIntervals.forEach(interval => clearInterval(interval));
        } else {
            // Page is visible again, restart intervals
            this.setupAutoRefresh();
            
            // Refresh data immediately
            uiManager.refreshAllData();
        }
    }

    // Handle online/offline status
    handleConnectionChange() {
        if (navigator.onLine) {
            // Back online, refresh data
            uiManager.refreshAllData();
            this.showNotification('Connection restored', 'success');
        } else {
            // Gone offline
            this.showNotification('Connection lost. Data may not be current.', 'warning');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentNode.remove()"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Get application status
    getStatus() {
        return {
            initialized: this.isInitialized,
            currentPage: uiManager.currentPage,
            currentCoin: uiManager.currentCoin,
            activeIntervals: this.updateIntervals.size,
            lastUpdate: new Date().toISOString()
        };
    }
}

// Initialize the application
const app = new CryptoDashboardApp();

// Handle page lifecycle events
document.addEventListener('visibilitychange', () => {
    app.handleVisibilityChange();
});

// Handle connection changes
window.addEventListener('online', () => {
    app.handleConnectionChange();
});

window.addEventListener('offline', () => {
    app.handleConnectionChange();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.destroy();
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    app.showNotification('An unexpected error occurred. Please refresh if the problem persists.', 'warning');
});

// Expose app instance globally for debugging
window.cryptoDashboard = app;