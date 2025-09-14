import os
import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import (
    mean_squared_error, 
    mean_absolute_error, 
    r2_score
)
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Reshape
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam

# --- Configuration ---
# -----------------------------------------------------------------------------
COINS = ['ADA', 'BNB', 'BTC', 'ETC', 'ETH', 'LINK', 'LTC', 'SOL', 'USDT', 'XMR'] 
FREQUENCY = 'DAILY'
SEQUENCE_LENGTH = 90  # 90 days of daily data
FORECAST_HORIZON = 30 # Predict the next 30 days

# --- Directory Paths ---
# -----------------------------------------------------------------------------
DATA_DIR = os.path.join('data', FREQUENCY)
MODEL_DIR = os.path.join('model', FREQUENCY)
PLOT_DIR = os.path.join('plot', FREQUENCY)
COLUMNS_TO_PREDICT = ['price_open', 'price_high', 'price_low', 'price_close', 'volume']
NUM_FEATURES = len(COLUMNS_TO_PREDICT)

# --- Helper Functions ---
# -----------------------------------------------------------------------------
def create_directories():
    """Creates the necessary output directories if they don't exist."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(PLOT_DIR, exist_ok=True)
    for coin in COINS:
        os.makedirs(os.path.join(PLOT_DIR, coin), exist_ok=True)
    print("Output directories created/verified.")

def create_sequences(data, sequence_length, forecast_horizon):
    """
    Creates sequences for a multivariate regression model.
    X: Input features for the lookback period.
    y: Regression targets (all features) for the forecast horizon.
    """
    X, y = [], []
    for i in range(len(data) - sequence_length - forecast_horizon + 1):
        X.append(data[i:(i + sequence_length)])
        y.append(data[i + sequence_length : i + sequence_length + forecast_horizon])
        
    return np.array(X), np.array(y)

def calculate_mape(y_true, y_pred):
    """Calculates Mean Absolute Percentage Error, handling potential zeros in y_true."""
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    # Avoid division by zero
    mask = y_true != 0
    return np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100

def build_multivariate_model(input_shape):
    """
    Builds the multivariate LSTM model using the best hyperparameters found from tuning.
    """
    # Best hyperparameters from tuner search:
    # - lstm1_units: 192
    # - lstm2_units: 96
    # - dropout: 0.3
    # - dense_units: 32
    # - learning_rate: 0.001
    
    model = Sequential([
        LSTM(192, return_sequences=True, input_shape=input_shape),
        Dropout(0.3),
        LSTM(96, return_sequences=False),
        Dropout(0.3),
        Dense(32, activation='relu'),
        # The output needs to be flattened first before being reshaped
        Dense(FORECAST_HORIZON * NUM_FEATURES),
        Reshape((FORECAST_HORIZON, NUM_FEATURES))
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='mean_squared_error'
    )
    return model

# --- Main Training Function ---
# -----------------------------------------------------------------------------
def train_model_for_coin(coin_symbol):
    print(f"\n--- Starting DAILY Multivariate Process for {coin_symbol} ---")

    # 1. Load and Prepare Data
    csv_path = os.path.join(DATA_DIR, f'{coin_symbol}-INR_{FREQUENCY}.csv')
    if not os.path.exists(csv_path):
        print(f"Data file not found for {coin_symbol}. Skipping.")
        return

    df = pd.read_csv(csv_path, parse_dates=['date'], index_col='date')
    columns_to_drop = ['crypto_symbol', 'currency', 'total_index_updates', 'unit', 'market', 'instrument', 'data_type', 'timestamp', 'quote_volume']
    df.drop(columns=columns_to_drop, inplace=True, errors='ignore')
    
    # Ensure columns are in a consistent order and drop any remaining NaNs
    df = df[COLUMNS_TO_PREDICT].dropna()

    # 2. Scale Data
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(df)

    scaler_path = os.path.join(MODEL_DIR, f'{coin_symbol}_scaler.pkl')
    with open(scaler_path, 'wb') as f: pickle.dump(scaler, f)
    print(f"Scaler saved to {scaler_path}")

    # 3. Create Sequences
    X, y = create_sequences(scaled_features, SEQUENCE_LENGTH, FORECAST_HORIZON)
    if len(X) == 0:
        print(f"Not enough data to create sequences for {coin_symbol}. Skipping.")
        return

    # 4. Split Data
    split_index = int(len(X) * 0.8)
    X_train, X_test = X[:split_index], X[split_index:]
    y_train, y_test = y[:split_index], y[split_index:]

    # 5. Build and Train Model
    model = build_multivariate_model(input_shape=(X_train.shape[1], X_train.shape[2]))
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)

    print(f"Training daily multivariate model for {coin_symbol}...")
    history = model.fit(
        X_train, y_train,
        epochs=25, # Increased epochs for daily data
        batch_size=32, 
        validation_split=0.1,
        callbacks=[early_stopping], 
        verbose=1
    )

    model_path = os.path.join(MODEL_DIR, f'{coin_symbol}_model.h5')
    model.save(model_path)
    print(f"Model saved to {model_path}")

    # 6. Evaluate Model
    predictions_scaled = model.predict(X_test)

    # Inverse transform regression predictions
    predictions_inv = scaler.inverse_transform(predictions_scaled.reshape(-1, NUM_FEATURES)).reshape(predictions_scaled.shape)
    y_test_inv = scaler.inverse_transform(y_test.reshape(-1, NUM_FEATURES)).reshape(y_test.shape)
    
    # 7. Save Results and Plots
    coin_plot_dir = os.path.join(PLOT_DIR, coin_symbol)
    
    # --- Evaluation (on 'price_close', which is the 4th column, index 3) ---
    close_price_actual = y_test_inv[:, :, 3]
    close_price_pred = predictions_inv[:, :, 3]

    rmse = np.sqrt(mean_squared_error(close_price_actual, close_price_pred))
    mae = mean_absolute_error(close_price_actual, close_price_pred)
    mape = calculate_mape(close_price_actual, close_price_pred)
    r2 = r2_score(close_price_actual, close_price_pred)
    
    with open(os.path.join(coin_plot_dir, 'regression_metrics.txt'), 'w') as f:
        f.write(f'--- Regression Metrics for price_close ---\n')
        f.write(f'Root Mean Squared Error (RMSE): {rmse}\n')
        f.write(f'Mean Absolute Error (MAE): {mae}\n')
        f.write(f'Mean Absolute Percentage Error (MAPE): {mape:.2f}%\n')
        f.write(f'R-squared (R2): {r2}\n')

    # Plot Price Prediction
    plt.figure(figsize=(15, 7))
    plt.plot(close_price_actual[:, 0], color='blue', label='Actual Price (First Day of Forecast)')
    plt.plot(close_price_pred[:, 0], color='red', label='Predicted Price (First Day of Forecast)', alpha=0.7)
    plt.title(f'{coin_symbol}-INR Daily Close Price Prediction (Test Set)')
    plt.xlabel('Time Step')
    plt.ylabel('Price (INR)')
    plt.legend()
    plt.grid(True)
    plt.savefig(os.path.join(coin_plot_dir, 'price_prediction.png'))
    plt.close()

    print(f"Evaluation complete for {coin_symbol}. Metrics and plots saved.")

# --- Main Execution ---
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    create_directories()
    for coin in COINS:
        train_model_for_coin(coin)
    print("\n--- All training processes complete. ---")
