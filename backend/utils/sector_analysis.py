import yfinance as yf
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class SectorAnalysisService:
    """Service for sector analysis and diversification"""
    
    @staticmethod
    def get_sector_info(symbol: str) -> Dict:
        """Get sector information for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            return {
                'symbol': symbol,
                'sector': info.get('sector', 'Unknown'),
                'industry': info.get('industry', 'Unknown')
            }
        except Exception as e:
            logger.error(f"Error getting sector info for {symbol}: {str(e)}")
            return {
                'symbol': symbol,
                'sector': 'Unknown',
                'industry': 'Unknown'
            }
    
    @staticmethod
    def calculate_sector_distribution(positions: List[Dict]) -> List[Dict]:
        """Calculate sector distribution of portfolio"""
        sector_values = {}
        total_value = sum(p['total_value'] for p in positions)
        
        for position in positions:
            if position['type'] == 'crypto':
                sector = 'Cryptocurrency'
            elif position['type'] == 'etf':
                # ETFs don't have a single sector, display as "ETF (ticker)"
                sector = f"ETF ({position['symbol']})"
            else:
                sector_info = SectorAnalysisService.get_sector_info(position['symbol'])
                sector = sector_info['sector']
                # If sector is Unknown for a stock, it might be an ETF or special asset
                if sector == 'Unknown':
                    # Check if it's actually an ETF by looking at quoteType
                    try:
                        ticker = yf.Ticker(position['symbol'])
                        quote_type = ticker.info.get('quoteType', '')
                        if quote_type == 'ETF':
                            sector = f"ETF ({position['symbol']})"
                    except:
                        pass
            
            if sector not in sector_values:
                sector_values[sector] = 0
            sector_values[sector] += position['total_value']
        
        # Convert to percentage
        distribution = []
        for sector, value in sector_values.items():
            percentage = (value / total_value * 100) if total_value > 0 else 0
            distribution.append({
                'sector': sector,
                'value': round(value, 2),
                'percentage': round(percentage, 2)
            })
        
        # Sort by percentage descending
        distribution.sort(key=lambda x: x['percentage'], reverse=True)
        
        return distribution
