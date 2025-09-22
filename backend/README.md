# Crypto Prediction API Backend

A Flask-based REST API backend for the crypto prediction application.

## Setup

1. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Run the server:
\`\`\`bash
python app.py
\`\`\`

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Data
- `GET /api/coins` - Get cryptocurrency data
- `GET /api/global-stats` - Get global market statistics

### Predictions (Requires Authentication)
- `POST /api/prediction` - Generate AI prediction
- `GET /api/predictions/history` - Get prediction history
- `POST /api/prediction/accuracy` - Calculate prediction accuracy

### User
- `GET /api/user/profile` - Get user profile

### Utility
- `GET /api/health` - Health check

## TODO: Replace Mock Functions

The following functions need to be replaced with real implementations:

1. **`get_real_crypto_data()`** - Replace with real cryptocurrency API calls (CoinGecko, CoinMarketCap, Binance)
2. **`generate_ai_prediction()`** - Implement real ML/AI prediction model using TensorFlow, PyTorch, or external ML APIs
3. **User Authentication** - Add proper password hashing, email validation, and database integration
4. **Database Integration** - Replace mock data structures with real database (PostgreSQL, MongoDB, etc.)
5. **Rate Limiting** - Add API rate limiting for production use
6. **Logging** - Add proper logging and monitoring

## Environment Variables

Create a `.env` file with:
\`\`\`
SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-url
COINGECKO_API_KEY=your-api-key
