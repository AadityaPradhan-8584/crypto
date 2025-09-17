// ML Prediction Service
class PredictionService {
    constructor() {
        this.predictionEndpoint = CONFIG.PREDICTION_API;
        this.loadingStates = new Map();
    }

    // Get prediction from your Python backend
    async getPrediction(coin, frequency, timeStep) {
        const requestId = `${coin}_${frequency}_${timeStep}`;
        
        // Prevent duplicate requests
        if (this.loadingStates.get(requestId)) {
            return null;
        }

        this.loadingStates.set(requestId, true);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coin_symbol: coin,
                    frequency: frequency,
                    n: timeStep
                })
            });

            if (!response.ok) {
                throw new Error(`Prediction API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error('Prediction error:', error);
            throw error;
        } finally {
            this.loadingStates.set(requestId, false);
        }
    }

    // Format prediction results for display
    formatPredictionResults(predictionData) {
        if (!predictionData || !predictionData.prediction) {
            return null;
        }

        const prediction = predictionData.prediction;
        
        return {
            open: this.formatCurrency(prediction[0]),
            high: this.formatCurrency(prediction[1]),
            low: this.formatCurrency(prediction[2]),
            close: this.formatCurrency(prediction[3]),
            volume: this.formatVolume(prediction[4]),
            timestamp: predictionData.timestamp || new Date().toISOString(),
            frequency: predictionData.frequency,
            timeStep: predictionData.timeStep,
            confidence: predictionData.confidence || 'N/A'
        };
    }

    // Utility formatting methods
    formatCurrency(value) {
        if (typeof value !== 'number') return 'N/A';
        return `$${value.toFixed(2)}`;
    }

    formatVolume(value) {
        if (typeof value !== 'number') return 'N/A';
        
        if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
        } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(2)}K`;
        } else {
            return value.toFixed(2);
        }
    }

    // Get available prediction steps based on frequency
    getPredictionSteps(frequency) {
        if (frequency === 'hourly') {
            return Array.from({length: 24}, (_, i) => ({
                value: i + 1,
                label: `${i + 1} hour${i > 0 ? 's' : ''} from now`
            }));
        } else if (frequency === 'daily') {
            return Array.from({length: 30}, (_, i) => ({
                value: i + 1,
                label: `${i + 1} day${i > 0 ? 's' : ''} from now`
            }));
        }
        return [];
    }

    // Check if prediction is available for a coin
    async checkPredictionAvailability(coin, frequency) {
        try {
            const response = await fetch('/predict/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coin_symbol: coin,
                    frequency: frequency
                })
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.available || false;
        } catch (error) {
            console.error('Error checking prediction availability:', error);
            return false;
        }
    }

    // Get prediction history (if you want to implement this)
    async getPredictionHistory(coin, limit = 10) {
        try {
            const response = await fetch(`/predict/history/${coin}?limit=${limit}`);
            
            if (!response.ok) {
                return [];
            }

            const data = await response.json();
            return data.history || [];
        } catch (error) {
            console.error('Error fetching prediction history:', error);
            return [];
        }
    }

    // Calculate prediction accuracy (if you have historical predictions)
    calculateAccuracy(predictions, actualData) {
        if (!predictions || !actualData || predictions.length !== actualData.length) {
            return null;
        }

        let totalError = 0;
        let count = 0;

        predictions.forEach((pred, index) => {
            const actual = actualData[index];
            if (pred && actual) {
                const error = Math.abs(pred - actual) / actual;
                totalError += error;
                count++;
            }
        });

        if (count === 0) return null;

        const averageError = totalError / count;
        const accuracy = Math.max(0, (1 - averageError) * 100);
        
        return Math.round(accuracy * 100) / 100; // Round to 2 decimal places
    }
}

// Create global prediction service instance
const predictionService = new PredictionService();