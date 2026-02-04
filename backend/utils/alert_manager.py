import logging
from typing import List, Dict
from datetime import datetime

logger = logging.getLogger(__name__)

class AlertManager:
    """Service for managing price and volatility alerts"""
    
    @staticmethod
    def check_price_alerts(current_price: float, alerts: List[Dict]) -> List[Dict]:
        """Check if any price alerts should be triggered"""
        triggered = []
        
        for alert in alerts:
            if not alert.get('is_active', True) or alert.get('is_triggered', False):
                continue
            
            alert_type = alert['alert_type']
            target_value = alert['target_value']
            
            should_trigger = False
            
            if alert_type == 'price_above' and current_price >= target_value:
                should_trigger = True
            elif alert_type == 'price_below' and current_price <= target_value:
                should_trigger = True
            
            if should_trigger:
                triggered.append({
                    'alert_id': alert['id'],
                    'symbol': alert['symbol'],
                    'type': alert_type,
                    'target': target_value,
                    'current': current_price,
                    'message': f"{alert['symbol']} has reached {current_price} (target: {target_value})"
                })
        
        return triggered
    
    @staticmethod
    def check_volatility_alerts(volatility: float, alerts: List[Dict]) -> List[Dict]:
        """Check if any volatility alerts should be triggered"""
        triggered = []
        
        for alert in alerts:
            if not alert.get('is_active', True) or alert.get('is_triggered', False):
                continue
            
            if alert['alert_type'] == 'volatility_high' and volatility >= alert['target_value']:
                triggered.append({
                    'alert_id': alert['id'],
                    'symbol': alert['symbol'],
                    'type': 'volatility_high',
                    'target': alert['target_value'],
                    'current': volatility,
                    'message': f"{alert['symbol']} volatility is {volatility}% (threshold: {alert['target_value']}%)"
                })
        
        return triggered
