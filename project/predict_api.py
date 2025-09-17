#!/usr/bin/env python3
"""
Modified predict.py to work as an API endpoint
Reads parameters from environment variables
"""
import os
import sys
from dotenv import load_dotenv
load_dotenv()

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import warnings
warnings.filterwarnings("ignore", category=UserWarning, message="Trying to unpickle estimator MinMaxScaler from version*")

import pandas as pd
import numpy as np
import pickle
import requests
from tensorflow.keras.models import load_model
from datetime import datetime

# --- Configuration --- #
MODEL_BASE_DIR = 'model'
API_KEY = os.getenv("COINDESK_API_KEY") or 'da3f7a681558318ac0d2be9df5f07deae6e723c2321dc638e42a8f27b1f12ce5'
COLUMNS_TO_PREDICT = ['price_open', 'price_high', 'price_low', 'price_close', 'volume']

# --- API Function --- #
def get_latest_data_from_api(instrument, limit, time_unit):
    """
    Fetches the latest data from CoinDesk API and formats it for the multivariate model.
    """
    if not API_KEY:
        print("Error: COINDESK_API_KEY not found. Please set it in your .env file.")
        return None

    api_endpoint = 'hours' if time_unit == 'hour' else 'days'
    url = f'https://data-api.coindesk.com/index/cc/v1/historical/{api_endpoint}'

    params = {
        'market': 'cadli', 'instrument': instrument, 'limit': limit,
        'aggregate': 1, 'fill': 'true', 'apply_mapping': 'true',
        'response_format': 'JSON', 'to_ts': int(datetime.now().timestamp()),
        'api_key': API_KEY
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if 'Data' not in data or not data['Data']:
            print("API response did not contain 'Data'.")
            return None

        df = pd.DataFrame(data['Data'])
        # Rename uppercase API columns to the lowercase names the model was trained on
        df.rename(columns={
            'OPEN': 'price_open', 'HIGH': 'price_high', 'LOW': 'price_low',
            'CLOSE': 'price_close', 'VOLUME': 'volume'
        }, inplace=True)
        
        # Ensure all required columns are present after renaming
        if not all(col in df.columns for col in COLUMNS_TO_PREDICT):
            print("Error: API response missing one or more required columns after renaming.")
            return None
            
        return df[COLUMNS_TO_PREDICT]

    except requests.exceptions.RequestException as e:
        print(f"API request failed: {e}")
        return None
    except KeyError as e:
        print(f"Error processing API data, key not found: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# --- Core Prediction Function --- #
def predict_values(coin_symbol, frequency, n):
    """
    Predicts the full set of values (O,H,L,C,V) for a given future time step.
    """
    frequency = frequency.lower()
    if frequency == 'hourly':
        params = {'seq_len': 168, 'horizon': 24, 'subdir': 'HOURLY', 'unit': 'hour'}
        if not 1 <= n <= params['horizon']: return None
    elif frequency == 'daily':
        params = {'seq_len': 90, 'horizon': 30, 'subdir': 'DAILY', 'unit': 'day'}
        if not 1 <= n <= params['horizon']: return None
    else:
        return None

    model_path = os.path.join(MODEL_BASE_DIR, params['subdir'], f'{coin_symbol}_model.h5')
    scaler_path = os.path.join(MODEL_BASE_DIR, params['subdir'], f'{coin_symbol}_scaler.pkl')

    if not all(os.path.exists(p) for p in [model_path, scaler_path]):
        print(f"Error: Model or scaler file not found for {coin_symbol}/{frequency}.")
        return None
        
    try:
        model = load_model(model_path, compile=False) 
        with open(scaler_path, 'rb') as f:
            scaler = pickle.load(f)
    except Exception as e:
        print(f"Error loading model or scaler: {e}")
        return None

    instrument = f'{coin_symbol}-INR'
    latest_data = get_latest_data_from_api(instrument, params['seq_len'], params['unit'])

    if latest_data is None or len(latest_data) < params['seq_len']:
        print("Could not fetch sufficient recent data for prediction.")
        return None

    # Scale the 5-feature input data
    scaled_input = scaler.transform(latest_data)
    input_sequence = np.array([scaled_input])

    # The model predicts all 5 features for the entire forecast horizon
    full_forecast_scaled = model.predict(input_sequence, verbose=0)[0]

    # Inverse transform the scaled predictions back to their original values
    full_forecast_inr = scaler.inverse_transform(full_forecast_scaled)

    # Return the full set of predicted values for the nth step
    return full_forecast_inr[n - 1]

# --- Main Execution --- #
if __name__ == '__main__':
    # Get parameters from environment variables (set by Node.js server)
    coin_symbol = os.getenv('COIN_SYMBOL', 'BTC')
    frequency = os.getenv('FREQUENCY', 'hourly')
    n = int(os.getenv('N', '1'))

    predicted_values = predict_values(coin_symbol, frequency, n)

    if predicted_values is not None:
        print(f"\n--- Predicted {coin_symbol} values for the {n}th {'hour' if frequency == 'hourly' else 'day'} from now ---")
        # Create a dictionary for clear output
        results = dict(zip(COLUMNS_TO_PREDICT, predicted_values))
        for key, value in results.items():
            if key == 'volume':
                print(f"{key:>12}: {value:,.2f}")
            else:
                print(f"{key:>12}: ₹{value:,.2f}")
    else:
        print("Prediction failed")
        sys.exit(1)