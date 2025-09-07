# train_model_hourly.py
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tensorflow.keras.models import Sequential, save_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt
import os

# Configuration - Different for hourly data
LOOKBACK = 72  # 3 days of hourly data (24*3)
EPOCHS = 40    # Fewer epochs for faster training
BATCH_SIZE = 64 # Larger batch size for hourly data
TEST_SIZE = 0.2
FREQUENCY = 'hourly'

# LIST OF COINS TO TRAIN
COINS_TO_TRAIN = ['ETC', 'BTC', 'ETH']  # Edit this list

def load_data(coin):
    """Load hourly coin data"""
    file_path = f'data/hourly/{coin}-INR_HOURLY.csv'  # Adjust if your files have different names
    df = pd.read_csv(file_path)
    
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    elif 'timestamp' in df.columns:
        df['date'] = pd.to_datetime(df['timestamp'], unit='s')
    else:
        df['date'] = pd.date_range(start='2023-01-01', periods=len(df), freq='H')
    
    return df

def create_model():
    """Create LSTM model optimized for hourly data"""
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(LOOKBACK, 1)),
        Dropout(0.2),
        LSTM(32, return_sequences=False),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dropout(0.1),
        Dense(1)
    ])
    model.compile(optimizer=Adam(learning_rate=0.0005), loss='mse')  # Lower learning rate
    return model

def prepare_sequences(data, lookback):
    """Create sequences"""
    X, y = [], []
    for i in range(lookback, len(data)):
        X.append(data[i-lookback:i])
        y.append(data[i])
    return np.array(X), np.array(y)

def plot_results(coin, df, train_pred, test_pred, split_idx, metrics):
    """Create plots for hourly data"""
    os.makedirs(f'plots/{FREQUENCY}', exist_ok=True)
    
    dates = df['date'].values
    train_start_idx = LOOKBACK
    train_end_idx = split_idx
    test_start_idx = split_idx
    
    # For hourly data, show only last 2 weeks in zoomed view
    train_pred_dates = dates[train_start_idx:train_end_idx]
    test_pred_dates = dates[test_start_idx:test_start_idx + len(test_pred)]
    
    train_pred = train_pred[:len(train_pred_dates)]
    test_pred = test_pred[:len(test_pred_dates)]
    
    plt.figure(figsize=(15, 12))
    
    # Full data plot
    plt.subplot(3, 1, 1)
    plt.plot(dates, df['price_close'], label='Actual', color='blue', alpha=0.7, linewidth=0.5)
    plt.plot(train_pred_dates, train_pred.flatten(), label='Train Predicted', color='green', alpha=0.7, linewidth=0.5)
    plt.plot(test_pred_dates, test_pred.flatten(), label='Test Predicted', color='red', alpha=0.7, linewidth=0.5)
    plt.axvline(x=dates[split_idx], color='black', linestyle='--', label='Train/Test Split')
    plt.title(f'{coin} Hourly Price Prediction\nTest MAE: {metrics["test_mae"]:.2f}')
    plt.xlabel('Date')
    plt.ylabel('Price (INR)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Last month zoom
    plt.subplot(3, 1, 2)
    last_month_idx = max(0, len(dates) - 720)  # Last 720 hours (30 days)
    plt.plot(dates[last_month_idx:], df['price_close'].values[last_month_idx:], 
             label='Actual', color='blue', alpha=0.7, linewidth=1)
    
    # Find corresponding predictions
    pred_mask = (train_pred_dates >= dates[last_month_idx]) | (test_pred_dates >= dates[last_month_idx])
    pred_dates = np.concatenate([train_pred_dates, test_pred_dates])[pred_mask]
    pred_values = np.concatenate([train_pred.flatten(), test_pred.flatten()])[pred_mask]
    
    plt.plot(pred_dates, pred_values, label='Predicted', color='red', alpha=0.7, linewidth=1)
    plt.title('Last 30 Days Zoom')
    plt.xlabel('Date')
    plt.ylabel('Price (INR)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Last week zoom
    plt.subplot(3, 1, 3)
    last_week_idx = max(0, len(dates) - 168)  # Last 168 hours (7 days)
    plt.plot(dates[last_week_idx:], df['price_close'].values[last_week_idx:], 
             label='Actual', color='blue', alpha=0.7, linewidth=2)
    
    pred_mask = (train_pred_dates >= dates[last_week_idx]) | (test_pred_dates >= dates[last_week_idx])
    pred_dates = np.concatenate([train_pred_dates, test_pred_dates])[pred_mask]
    pred_values = np.concatenate([train_pred.flatten(), test_pred.flatten()])[pred_mask]
    
    plt.plot(pred_dates, pred_values, label='Predicted', color='red', alpha=0.7, linewidth=2)
    plt.title('Last 7 Days Zoom')
    plt.xlabel('Date')
    plt.ylabel('Price (INR)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(f'plots/{FREQUENCY}/{coin}_prediction.png', dpi=300, bbox_inches='tight')
    plt.close()

def train_coin(coin):
    """Train model for a single coin"""
    print(f"\n=== Training {coin} ({FREQUENCY}) ===")
    
    try:
        df = load_data(coin)
        prices = df['price_close'].values
        
        if len(prices) < LOOKBACK + 200:  # More data required for hourly
            print(f"Skip {coin}: Not enough data ({len(prices)} samples)")
            return None
        
        print(f"Loaded {len(prices)} hourly price points")
        
        scaler = MinMaxScaler(feature_range=(0, 1))
        scaled_prices = scaler.fit_transform(prices.reshape(-1, 1)).flatten()
        
        split_idx = int(len(scaled_prices) * (1 - TEST_SIZE))
        train_data = scaled_prices[:split_idx]
        test_data = scaled_prices[split_idx - LOOKBACK:]
        
        X_train, y_train = prepare_sequences(train_data, LOOKBACK)
        X_test, y_test = prepare_sequences(test_data, LOOKBACK)
        
        X_train = X_train.reshape(X_train.shape[0], LOOKBACK, 1)
        X_test = X_test.reshape(X_test.shape[0], LOOKBACK, 1)
        
        print(f"Train: {X_train.shape[0]} samples, Test: {X_test.shape[0]} samples")
        
        model = create_model()
        early_stop = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
        
        history = model.fit(
            X_train, y_train,
            epochs=EPOCHS,
            batch_size=BATCH_SIZE,
            validation_data=(X_test, y_test),
            callbacks=[early_stop],
            verbose=1,
            shuffle=False
        )
        
        train_pred = model.predict(X_train, verbose=0)
        test_pred = model.predict(X_test, verbose=0)
        
        train_pred = scaler.inverse_transform(train_pred)
        test_pred = scaler.inverse_transform(test_pred)
        y_train_actual = scaler.inverse_transform(y_train.reshape(-1, 1))
        y_test_actual = scaler.inverse_transform(y_test.reshape(-1, 1))
        
        metrics = {
            'train_mae': mean_absolute_error(y_train_actual, train_pred),
            'test_mae': mean_absolute_error(y_test_actual, test_pred),
            'train_rmse': np.sqrt(mean_squared_error(y_train_actual, train_pred)),
            'test_rmse': np.sqrt(mean_squared_error(y_test_actual, test_pred)),
            'history': history
        }
        
        print(f"\n{coin} Results:")
        print(f"Train MAE: {metrics['train_mae']:.2f}, RMSE: {metrics['train_rmse']:.2f}")
        print(f"Test MAE:  {metrics['test_mae']:.2f}, RMSE:  {metrics['test_rmse']:.2f}")
        
        plot_results(coin, df, train_pred, test_pred, split_idx, metrics)
        
        os.makedirs(f'models/{FREQUENCY}', exist_ok=True)
        model.save(f'models/{FREQUENCY}/{coin}_model.h5')
        print(f"✓ Model saved: models/{FREQUENCY}/{coin}_model.h5")
        
        return {'coin': coin, **metrics}
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return None

def main():
    """Main function"""
    print(f"Training {FREQUENCY} data...")
    print(f"Coins: {COINS_TO_TRAIN}")
    
    results = []
    for coin in COINS_TO_TRAIN:
        result = train_coin(coin)
        if result:
            results.append(result)
    
    if results:
        print(f"\n{'='*80}")
        print(f"HOURLY RESULTS SUMMARY")
        print(f"{'='*80}")
        print(f"{'Coin':<6} {'Train MAE':<10} {'Test MAE':<10} {'Train RMSE':<10} {'Test RMSE':<10}")
        print(f"{'-'*80}")
        
        for res in results:
            print(f"{res['coin']:<6} {res['train_mae']:<10.2f} {res['test_mae']:<10.2f} "
                  f"{res['train_rmse']:<10.2f} {res['test_rmse']:<10.2f}")
    
    print(f"\nComplete! Successful: {len(results)}/{len(COINS_TO_TRAIN)}")

if __name__ == "__main__":
    main()