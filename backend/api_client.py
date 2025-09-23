import requests, os
from datetime import datetime, timedelta

API_KEY = os.getenv("COINDESK_API_KEY")

def fetch_coin_24h_change(symbol: str):
    """
    Fetch last 24h percentage change for a given coin using CoinDesk API.
    """
    url = "https://data-api.coindesk.com/index/cc/v1/latest/tick"
    params = {
        "market": "cadli",
        "instruments": f"{symbol}-INR",
        "apply_mapping": "true",
        "api_key": API_KEY
    }
    
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        # The response structure: {'Data': {'BTC-INR': { ... }}, 'Err': {}}
        if 'Data' in data and data['Data']:
            coin_data = data['Data'].get(f"{symbol}-INR", {})
            
            # Get the current price - use MOVING_24_HOUR_OPEN or CURRENT_DAY_OPEN
            current_price = coin_data.get('MOVING_24_HOUR_OPEN', 0)
            
            # Get 24h change data - both absolute and percentage
            change_24h_absolute = coin_data.get('MOVING_24_HOUR_CHANGE', 0)
            change_24h_percentage = coin_data.get('MOVING_24_HOUR_CHANGE_PERCENTAGE', 0)
            
            # Determine if the change is positive or negative
            is_positive = change_24h_absolute >= 0
            
            return {
                "symbol": symbol,
                "price": current_price,
                "change24h": change_24h_percentage,
                "change_absolute": change_24h_absolute,
                "is_positive": is_positive
            }
        else:
            return {"symbol": symbol, "error": "No data in response"}
            
    except Exception as e:
        return {"symbol": symbol, "error": str(e)}

def fetch_coin_history(symbol: str, days: int = 30):
    """
    Fetch historical data for a coin using CoinDesk API.
    """
    url = "https://data-api.coindesk.com/index/cc/v1/historical/days"
    end_time = int(datetime.now().timestamp())
    start_time = int((datetime.now() - timedelta(days=days)).timestamp())
    
    params = {
        "market": "cadli",
        "instrument": f"{symbol}-INR",
        "start_ts": start_time,
        "end_ts": end_time,
        "api_key": API_KEY,
        "aggregate": 1,
        "fill": "true",
        "apply_mapping": "true",
        "response_format": "JSON"
    }
    
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        if 'Data' in data and isinstance(data['Data'], list):
            # Return only essential data for the graph
            simplified_data = []
            for day_data in data['Data']:
                simplified_data.append({
                    "timestamp": day_data.get('TIMESTAMP'),
                    "open": day_data.get('OPEN'),
                    "high": day_data.get('HIGH'),
                    "low": day_data.get('LOW'),
                    "close": day_data.get('CLOSE'),
                    "volume": day_data.get('VOLUME')
                })
            return simplified_data
        else:
            return {"error": "Unexpected API response format", "received_data": data}
            
    except Exception as e:
        return {"error": str(e)}

def fetch_multiple_coins_24h_change(symbols):
    """
    Fetch 24h change for multiple coins in a single API call.
    """
    url = "https://data-api.coindesk.com/index/cc/v1/latest/tick"
    instruments = ",".join([f"{symbol}-INR" for symbol in symbols])
    
    params = {
        "market": "cadli",
        "instruments": instruments,
        "apply_mapping": "true",
        "api_key": API_KEY
    }
    
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        
        results = []
        if 'Data' in data and data['Data']:
            for symbol in symbols:
                coin_key = f"{symbol}-INR"
                coin_data = data['Data'].get(coin_key, {})
                
                current_price = coin_data.get('MOVING_24_HOUR_OPEN', 0)
                change_24h_absolute = coin_data.get('MOVING_24_HOUR_CHANGE', 0)
                change_24h_percentage = coin_data.get('MOVING_24_HOUR_CHANGE_PERCENTAGE', 0)
                is_positive = change_24h_absolute >= 0
                
                results.append({
                    "symbol": symbol,
                    "price": current_price,
                    "change24h": change_24h_percentage,
                    "change_absolute": change_24h_absolute,
                    "is_positive": is_positive
                })
        
        return results
            
    except Exception as e:
        return {"error": str(e)}