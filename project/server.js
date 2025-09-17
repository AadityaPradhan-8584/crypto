// Simple Express server to serve the app and handle predictions
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Prediction endpoint
app.post('/predict', (req, res) => {
    const { coin_symbol, frequency, n } = req.body;
    
    if (!coin_symbol || !frequency || !n) {
        return res.status(400).json({ 
            error: 'Missing required parameters: coin_symbol, frequency, n' 
        });
    }

    // Spawn Python process to run prediction
    const pythonProcess = spawn('python', ['predict.py'], {
        env: { ...process.env, 
            COIN_SYMBOL: coin_symbol,
            FREQUENCY: frequency,
            N: n.toString()
        }
    });

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python script error:', error);
            return res.status(500).json({ 
                error: 'Prediction failed', 
                details: error 
            });
        }

        try {
            // Parse the prediction result
            const lines = result.trim().split('\n');
            const predictionData = {};
            
            lines.forEach(line => {
                if (line.includes(':')) {
                    const [key, value] = line.split(':');
                    const cleanKey = key.trim().replace(/\s+/g, '_').toLowerCase();
                    const cleanValue = value.trim().replace(/[₹$,]/g, '');
                    predictionData[cleanKey] = parseFloat(cleanValue) || cleanValue;
                }
            });

            res.json({
                prediction: [
                    predictionData.price_open || 0,
                    predictionData.price_high || 0,
                    predictionData.price_low || 0,
                    predictionData.price_close || 0,
                    predictionData.volume || 0
                ],
                timestamp: new Date().toISOString(),
                frequency,
                timeStep: n,
                coin: coin_symbol
            });
        } catch (parseError) {
            console.error('Error parsing prediction result:', parseError);
            res.status(500).json({ 
                error: 'Error parsing prediction result',
                raw_output: result
            });
        }
    });
});

// Check prediction availability
app.post('/predict/check', (req, res) => {
    const { coin_symbol, frequency } = req.body;
    const fs = require('fs');
    
    const modelDir = frequency.toUpperCase();
    const modelPath = path.join(__dirname, 'model', modelDir, `${coin_symbol}_model.h5`);
    const scalerPath = path.join(__dirname, 'model', modelDir, `${coin_symbol}_scaler.pkl`);
    
    const available = fs.existsSync(modelPath) && fs.existsSync(scalerPath);
    
    res.json({ available });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});