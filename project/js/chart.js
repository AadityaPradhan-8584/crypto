// Chart Management
class ChartManager {
    constructor() {
        this.currentChart = null;
        this.chartCanvas = null;
    }

    // Initialize chart
    initChart(canvasId) {
        this.chartCanvas = document.getElementById(canvasId);
        if (!this.chartCanvas) {
            console.error(`Chart canvas with id '${canvasId}' not found`);
            return;
        }

        // Set up chart context
        const ctx = this.chartCanvas.getContext('2d');
        
        // Default chart configuration
        const defaultConfig = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Price',
                    data: [],
                    borderColor: CONFIG.CHART_COLORS.neutral,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: CONFIG.CHART_COLORS.neutral,
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: (context) => {
                                const dataPoint = context[0];
                                return new Date(dataPoint.parsed.x).toLocaleString();
                            },
                            label: (context) => {
                                const value = context.parsed.y;
                                return `Price: $${value.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            displayFormats: {
                                minute: 'HH:mm',
                                hour: 'MMM DD HH:mm',
                                day: 'MMM DD',
                                month: 'MMM YYYY'
                            }
                        },
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(148, 163, 184, 0.8)',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        position: 'right',
                        grid: {
                            color: 'rgba(148, 163, 184, 0.1)',
                            borderDash: [2, 2]
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(148, 163, 184, 0.8)',
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                onHover: (event, elements) => {
                    this.chartCanvas.style.cursor = elements.length > 0 ? 'crosshair' : 'default';
                }
            }
        };

        this.currentChart = new Chart(ctx, defaultConfig);
        return this.currentChart;
    }

    // Update chart with new data
    async updateChart(coin, period = '24h') {
        if (!this.currentChart) {
            console.error('Chart not initialized');
            return;
        }

        try {
            const historicalData = await cryptoAPI.getHistoricalData(coin, period);
            
            if (!historicalData || historicalData.length === 0) {
                console.error('No historical data available');
                return;
            }

            // Prepare data for Chart.js
            const labels = historicalData.map(point => new Date(point.time));
            const prices = historicalData.map(point => point.close);
            
            // Determine chart color based on price trend
            const firstPrice = prices[0];
            const lastPrice = prices[prices.length - 1];
            const trendColor = lastPrice >= firstPrice ? 
                CONFIG.CHART_COLORS.bullish : 
                CONFIG.CHART_COLORS.bearish;

            // Update chart data
            this.currentChart.data.labels = labels;
            this.currentChart.data.datasets[0].data = prices;
            this.currentChart.data.datasets[0].borderColor = trendColor;
            this.currentChart.data.datasets[0].pointHoverBackgroundColor = trendColor;

            // Update chart label
            this.currentChart.data.datasets[0].label = `${coin} Price`;

            // Update time scale based on period
            this.updateTimeScale(period);

            // Animate the update
            this.currentChart.update('active');
            
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }

    // Update time scale configuration
    updateTimeScale(period) {
        if (!this.currentChart) return;

        let timeUnit;
        let displayFormat;
        let stepSize;

        switch (period) {
            case '1h':
                timeUnit = 'minute';
                displayFormat = 'HH:mm';
                stepSize = 10;
                break;
            case '24h':
                timeUnit = 'hour';
                displayFormat = 'HH:mm';
                stepSize = 4;
                break;
            case '7d':
                timeUnit = 'day';
                displayFormat = 'MMM DD';
                stepSize = 1;
                break;
            case '30d':
                timeUnit = 'day';
                displayFormat = 'MMM DD';
                stepSize = 5;
                break;
            case '1y':
                timeUnit = 'month';
                displayFormat = 'MMM YYYY';
                stepSize = 2;
                break;
            default:
                timeUnit = 'hour';
                displayFormat = 'HH:mm';
                stepSize = 4;
        }

        this.currentChart.options.scales.x.time.unit = timeUnit;
        this.currentChart.options.scales.x.time.displayFormats[timeUnit] = displayFormat;
        this.currentChart.options.scales.x.ticks.stepSize = stepSize;
    }

    // Create mini chart for coin cards
    createMiniChart(canvasId, data, isPositive = true) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 120;
        canvas.height = 40;

        const color = isPositive ? CONFIG.CHART_COLORS.bullish : CONFIG.CHART_COLORS.bearish;
        
        const config = {
            type: 'line',
            data: {
                labels: data.map((_, index) => index),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    borderWidth: 1.5,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: {
                    point: { radius: 0 }
                }
            }
        };

        new Chart(ctx, config);
    }

    // Destroy current chart
    destroyChart() {
        if (this.currentChart) {
            this.currentChart.destroy();
            this.currentChart = null;
        }
    }
}

// Create global chart manager instance
const chartManager = new ChartManager();