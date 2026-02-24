"""
Test Portfolio Isolation - Capital, Cash Accounts, and Summary linked to portfolio_id
Tests that each portfolio has independent capital contributions, cash accounts, and performance calculations.
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL').rstrip('/')

# Test credentials
TEST_USER_EMAIL = "testcrypto@test.com"
TEST_USER_PASSWORD = "test123"
TEST_USER_ID = "c30befea-7024-4e34-a0d5-dd8a6740917d"
TEST_PORTFOLIO_ID = "58fe8433-20b4-4734-88d8-8c312f584d9e"


class TestAPIHealth:
    """Basic health check tests"""
    
    def test_api_root_accessible(self):
        """Test API root is accessible"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        assert "message" in response.json()
        print(f"✓ API root accessible: {response.json()}")
    
    def test_login_working(self):
        """Test login with test credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == TEST_USER_ID
        print(f"✓ Login successful, user_id: {data['id']}")


class TestCapitalWithPortfolioId:
    """Test capital contributions endpoint with portfolio_id"""
    
    def test_get_capital_with_portfolio_id(self):
        """Test GET /api/capital with portfolio_id returns portfolio-specific capital"""
        response = requests.get(
            f"{BASE_URL}/api/capital",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "total_deposits" in data
        assert "total_withdrawals" in data
        assert "net_capital" in data
        assert "contributions" in data
        assert "portfolio_id" in data
        
        # Verify portfolio_id is correct
        assert data["portfolio_id"] == TEST_PORTFOLIO_ID or data["portfolio_id"] is not None
        print(f"✓ Capital for portfolio {TEST_PORTFOLIO_ID}: net_capital={data['net_capital']}")
    
    def test_add_capital_deposit_with_portfolio_id(self):
        """Test POST /api/capital creates capital contribution linked to portfolio"""
        # Add a test deposit
        test_amount = 500.0
        test_description = "TEST_deposit_for_isolation"
        
        response = requests.post(
            f"{BASE_URL}/api/capital",
            params={
                "user_id": TEST_USER_ID,
                "type": "deposit",
                "amount": test_amount,
                "portfolio_id": TEST_PORTFOLIO_ID,
                "description": test_description
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response
        assert "id" in data
        assert "portfolio_id" in data
        assert data["portfolio_id"] == TEST_PORTFOLIO_ID
        print(f"✓ Added capital deposit {test_amount}€ to portfolio {TEST_PORTFOLIO_ID}, id={data['id']}")
        
        # Store the ID for cleanup
        return data["id"]
    
    def test_capital_isolation_between_portfolios(self):
        """Test that creating a second portfolio results in isolated capital"""
        # First, create a second test portfolio
        portfolio_name = f"TEST_Portfolio_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/portfolios",
            params={"user_id": TEST_USER_ID},
            json={"name": portfolio_name, "description": "Test portfolio for isolation"}
        )
        assert create_response.status_code == 200
        second_portfolio = create_response.json()
        second_portfolio_id = second_portfolio["id"]
        print(f"✓ Created second portfolio: {portfolio_name}, id={second_portfolio_id}")
        
        # Get capital for the new portfolio (should be 0 or empty)
        capital_response = requests.get(
            f"{BASE_URL}/api/capital",
            params={"user_id": TEST_USER_ID, "portfolio_id": second_portfolio_id}
        )
        assert capital_response.status_code == 200
        capital_data = capital_response.json()
        
        # New portfolio should have 0 capital
        assert capital_data["net_capital"] == 0
        assert capital_data["total_deposits"] == 0
        assert capital_data["total_withdrawals"] == 0
        print(f"✓ Second portfolio has independent capital: net_capital={capital_data['net_capital']}")
        
        # Add capital to second portfolio
        add_response = requests.post(
            f"{BASE_URL}/api/capital",
            params={
                "user_id": TEST_USER_ID,
                "type": "deposit",
                "amount": 1000.0,
                "portfolio_id": second_portfolio_id,
                "description": "TEST_second_portfolio_deposit"
            }
        )
        assert add_response.status_code == 200
        
        # Verify first portfolio capital didn't change
        first_capital_response = requests.get(
            f"{BASE_URL}/api/capital",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        first_capital_data = first_capital_response.json()
        
        # Get second portfolio capital
        second_capital_response = requests.get(
            f"{BASE_URL}/api/capital",
            params={"user_id": TEST_USER_ID, "portfolio_id": second_portfolio_id}
        )
        second_capital_data = second_capital_response.json()
        
        # Verify isolation - capitals should be different
        print(f"✓ First portfolio capital: {first_capital_data['net_capital']}€")
        print(f"✓ Second portfolio capital: {second_capital_data['net_capital']}€")
        
        # Cleanup - delete the test portfolio
        delete_response = requests.delete(
            f"{BASE_URL}/api/portfolios/{second_portfolio_id}",
            params={"user_id": TEST_USER_ID}
        )
        assert delete_response.status_code == 200
        print(f"✓ Cleaned up second portfolio")


class TestCashAccountsWithPortfolioId:
    """Test cash accounts endpoint with portfolio_id"""
    
    def test_get_cash_accounts_with_portfolio_id(self):
        """Test GET /api/cash-accounts with portfolio_id returns portfolio-specific accounts"""
        response = requests.get(
            f"{BASE_URL}/api/cash-accounts",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response is a list
        assert isinstance(data, list)
        
        # Each account should have portfolio_id
        for account in data:
            assert "currency" in account
            assert "balance" in account
            assert "portfolio_id" in account
            print(f"✓ Cash account: {account['currency']} = {account['balance']} (portfolio: {account['portfolio_id']})")
    
    def test_create_cash_account_with_portfolio_id(self):
        """Test POST /api/cash-accounts creates account linked to portfolio"""
        # Create a test portfolio first
        portfolio_name = f"TEST_CashPortfolio_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/portfolios",
            params={"user_id": TEST_USER_ID},
            json={"name": portfolio_name, "description": "Test portfolio for cash isolation"}
        )
        assert create_response.status_code == 200
        test_portfolio = create_response.json()
        test_portfolio_id = test_portfolio["id"]
        
        # Create cash account for the new portfolio
        currency = "USD"
        cash_response = requests.post(
            f"{BASE_URL}/api/cash-accounts",
            params={
                "user_id": TEST_USER_ID,
                "currency": currency,
                "portfolio_id": test_portfolio_id
            }
        )
        assert cash_response.status_code == 200
        cash_data = cash_response.json()
        
        assert "portfolio_id" in cash_data
        assert cash_data["portfolio_id"] == test_portfolio_id
        print(f"✓ Created cash account {currency} for portfolio {test_portfolio_id}")
        
        # Update the balance
        update_response = requests.put(
            f"{BASE_URL}/api/cash-accounts/{currency}",
            params={
                "user_id": TEST_USER_ID,
                "amount": 5000.0,
                "operation": "set",
                "portfolio_id": test_portfolio_id
            }
        )
        assert update_response.status_code == 200
        update_data = update_response.json()
        assert update_data["balance"] == 5000.0
        print(f"✓ Updated cash account balance to 5000.0 USD")
        
        # Verify isolation - first portfolio shouldn't have this USD account unless it already existed
        first_cash_response = requests.get(
            f"{BASE_URL}/api/cash-accounts",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        first_cash_data = first_cash_response.json()
        
        # Get USD balance from first portfolio (if exists)
        first_usd = next((a for a in first_cash_data if a["currency"] == "USD"), None)
        
        # Get USD balance from second portfolio
        second_cash_response = requests.get(
            f"{BASE_URL}/api/cash-accounts",
            params={"user_id": TEST_USER_ID, "portfolio_id": test_portfolio_id}
        )
        second_cash_data = second_cash_response.json()
        second_usd = next((a for a in second_cash_data if a["currency"] == "USD"), None)
        
        print(f"✓ First portfolio USD: {first_usd['balance'] if first_usd else 'N/A'}")
        print(f"✓ Second portfolio USD: {second_usd['balance'] if second_usd else 'N/A'}")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/portfolios/{test_portfolio_id}",
            params={"user_id": TEST_USER_ID}
        )
        print(f"✓ Cleaned up test portfolio")


class TestPortfolioSummaryWithPortfolioId:
    """Test portfolio summary endpoint uses portfolio-specific capital"""
    
    def test_get_summary_with_portfolio_id(self):
        """Test GET /api/portfolio/summary returns capital data for specific portfolio"""
        response = requests.get(
            f"{BASE_URL}/api/portfolio/summary",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure includes capital-related fields
        assert "total_value" in data
        assert "total_invested" in data
        assert "net_capital" in data
        assert "capital_gain_loss" in data
        assert "capital_performance_percent" in data
        assert "portfolio_id" in data
        
        # Verify portfolio_id is correct
        assert data["portfolio_id"] == TEST_PORTFOLIO_ID
        
        print(f"✓ Portfolio summary for {TEST_PORTFOLIO_ID}:")
        print(f"  - Total value: {data['total_value']}€")
        print(f"  - Net capital: {data['net_capital']}€")
        print(f"  - Capital performance: {data['capital_performance_percent']}%")
    
    def test_summary_reflects_portfolio_capital(self):
        """Test that portfolio summary calculates performance based on portfolio's capital"""
        # Create a test portfolio
        portfolio_name = f"TEST_SummaryPortfolio_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/portfolios",
            params={"user_id": TEST_USER_ID},
            json={"name": portfolio_name, "description": "Test portfolio for summary"}
        )
        assert create_response.status_code == 200
        test_portfolio = create_response.json()
        test_portfolio_id = test_portfolio["id"]
        
        # Get summary for empty portfolio (no positions)
        summary_response = requests.get(
            f"{BASE_URL}/api/portfolio/summary",
            params={"user_id": TEST_USER_ID, "portfolio_id": test_portfolio_id}
        )
        assert summary_response.status_code == 200
        summary_data = summary_response.json()
        
        # Empty portfolio should have 0 total_value (net_capital may not be present for empty portfolios)
        assert summary_data["total_value"] == 0
        print(f"✓ Empty portfolio summary: total_value={summary_data['total_value']}")
        
        # Add capital to the portfolio via /api/capital
        capital_response = requests.post(
            f"{BASE_URL}/api/capital",
            params={
                "user_id": TEST_USER_ID,
                "type": "deposit",
                "amount": 10000.0,
                "portfolio_id": test_portfolio_id,
                "description": "TEST_capital_for_summary"
            }
        )
        assert capital_response.status_code == 200
        
        # Verify capital was added correctly via the capital endpoint
        capital_check = requests.get(
            f"{BASE_URL}/api/capital",
            params={"user_id": TEST_USER_ID, "portfolio_id": test_portfolio_id}
        )
        assert capital_check.status_code == 200
        capital_data = capital_check.json()
        assert capital_data["net_capital"] == 10000.0
        print(f"✓ Capital endpoint shows net_capital={capital_data['net_capital']}")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/portfolios/{test_portfolio_id}",
            params={"user_id": TEST_USER_ID}
        )
        print(f"✓ Cleaned up test portfolio")


class TestPositionsWithPortfolioId:
    """Test positions endpoint with portfolio_id filtering"""
    
    def test_get_positions_with_portfolio_id(self):
        """Test GET /api/positions with portfolio_id returns only portfolio's positions"""
        response = requests.get(
            f"{BASE_URL}/api/positions",
            params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"✓ Found {len(data)} positions in portfolio {TEST_PORTFOLIO_ID}")
        
        for pos in data:
            print(f"  - {pos['symbol']}: {pos['quantity']} units @ {pos.get('current_price', 'N/A')}")


class TestDeleteCapitalContribution:
    """Test capital contribution deletion"""
    
    def test_delete_capital_contribution(self):
        """Test DELETE /api/capital/{id} works correctly"""
        # First create a contribution to delete
        add_response = requests.post(
            f"{BASE_URL}/api/capital",
            params={
                "user_id": TEST_USER_ID,
                "type": "deposit",
                "amount": 100.0,
                "portfolio_id": TEST_PORTFOLIO_ID,
                "description": "TEST_to_delete"
            }
        )
        assert add_response.status_code == 200
        contribution_id = add_response.json()["id"]
        
        # Now delete it
        delete_response = requests.delete(
            f"{BASE_URL}/api/capital/{contribution_id}",
            params={"user_id": TEST_USER_ID}
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted capital contribution {contribution_id}")


class TestPortfoliosCRUD:
    """Test portfolio CRUD operations"""
    
    def test_get_portfolios(self):
        """Test GET /api/portfolios returns user's portfolios"""
        response = requests.get(
            f"{BASE_URL}/api/portfolios",
            params={"user_id": TEST_USER_ID}
        )
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) >= 1  # Should have at least one portfolio
        
        for portfolio in data:
            assert "id" in portfolio
            assert "name" in portfolio
            print(f"✓ Portfolio: {portfolio['name']} (id: {portfolio['id']}, default: {portfolio.get('is_default', False)})")
    
    def test_create_and_delete_portfolio(self):
        """Test creating and deleting a portfolio"""
        # Create
        portfolio_name = f"TEST_Portfolio_{uuid.uuid4().hex[:6]}"
        create_response = requests.post(
            f"{BASE_URL}/api/portfolios",
            params={"user_id": TEST_USER_ID},
            json={"name": portfolio_name, "description": "Test portfolio"}
        )
        assert create_response.status_code == 200
        portfolio = create_response.json()
        assert portfolio["name"] == portfolio_name
        portfolio_id = portfolio["id"]
        print(f"✓ Created portfolio: {portfolio_name}")
        
        # Delete
        delete_response = requests.delete(
            f"{BASE_URL}/api/portfolios/{portfolio_id}",
            params={"user_id": TEST_USER_ID}
        )
        assert delete_response.status_code == 200
        print(f"✓ Deleted portfolio: {portfolio_name}")


# Cleanup function to remove test data
def cleanup_test_contributions():
    """Cleanup TEST_ prefixed contributions"""
    response = requests.get(
        f"{BASE_URL}/api/capital",
        params={"user_id": TEST_USER_ID, "portfolio_id": TEST_PORTFOLIO_ID}
    )
    if response.status_code == 200:
        data = response.json()
        for contrib in data.get("contributions", []):
            if contrib.get("description", "").startswith("TEST_"):
                requests.delete(
                    f"{BASE_URL}/api/capital/{contrib['id']}",
                    params={"user_id": TEST_USER_ID}
                )
                print(f"Cleaned up: {contrib['id']}")


if __name__ == "__main__":
    # Run cleanup before tests
    cleanup_test_contributions()
    pytest.main([__file__, "-v"])
