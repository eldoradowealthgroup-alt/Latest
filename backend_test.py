#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CitationLookupAPITester:
    def __init__(self, base_url="https://github-to-web-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if not success:
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        test_email = f"test_user_{datetime.now().strftime('%H%M%S')}@example.com"
        test_data = {
            "email": test_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, test_data)
        if success:
            return response.get('id'), test_email, "TestPass123!"
        return None, test_email, "TestPass123!"

    def test_admin_login(self):
        """Test admin login"""
        admin_data = {
            "email": "admin",
            "password": "Money2026$"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_data)
        if success and response.get('is_admin'):
            self.log_test("Admin Login - Admin Flag Check", True, "is_admin=True")
            return True
        elif success:
            self.log_test("Admin Login - Admin Flag Check", False, "is_admin=False")
        return False

    def test_user_login(self, email, password):
        """Test user login"""
        login_data = {
            "email": email,
            "password": password
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if success:
            return response.get('id')
        return None

    def test_invalid_login(self):
        """Test invalid login credentials"""
        invalid_data = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        return self.run_test("Invalid Login", "POST", "auth/login", 401, invalid_data)

    def test_profile_operations(self, user_id):
        """Test profile get and update operations"""
        if not user_id:
            self.log_test("Profile Operations", False, "No user_id provided")
            return False

        # Test get profile
        get_success, profile = self.run_test("Get Profile", "GET", f"profile/{user_id}", 200)
        
        # Test update profile
        profile_data = {
            "name": "Test User",
            "address": "123 Test St",
            "dob": "1990-01-01",
            "phone": "555-0123",
            "email": "test@example.com",
            "ssn": "123-45-6789"
        }
        
        update_success, _ = self.run_test("Update Profile", "PUT", f"profile/{user_id}", 200, profile_data)
        
        return get_success and update_success

    def test_citation_search(self):
        """Test citation search functionality"""
        # Test with valid citation
        search_data = {
            "name": "Test User",
            "citation_number": "87911938c",
            "zip_code": "12345"
        }
        
        success, response = self.run_test("Citation Search - Valid", "POST", "citations/search", 200, search_data)
        
        if success and response.get('found'):
            citations = response.get('citations', [])
            self.log_test("Citation Search - Results Check", len(citations) > 0, f"Found {len(citations)} citations")
        
        # Test with invalid citation
        invalid_search = {
            "name": "Test User",
            "citation_number": "invalid123",
            "zip_code": "12345"
        }
        
        invalid_success, invalid_response = self.run_test("Citation Search - Invalid", "POST", "citations/search", 200, invalid_search)
        
        if invalid_success and not invalid_response.get('found'):
            self.log_test("Citation Search - Invalid Results Check", True, "Correctly returned no results")
        
        return success

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        # Test get submissions
        submissions_success, submissions = self.run_test("Get Submissions", "GET", "admin/submissions", 200)
        
        # Test get audit logs
        audit_success, audit_logs = self.run_test("Get Audit Logs", "GET", "admin/audit-logs", 200)
        
        # Test CSV export (this returns a file, so we just check status)
        export_success, _ = self.run_test("Export CSV", "GET", "admin/submissions/export", 200)
        
        return submissions_success and audit_success and export_success

    def test_record_action(self):
        """Test recording user action"""
        action_data = {
            "user_id": "test-user-id",
            "action": "payment_attempted"
        }
        
        return self.run_test("Record Action", "POST", "admin/record-action", 200, action_data)

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Citation Lookup API Tests")
        print("=" * 50)
        
        # Basic connectivity tests
        self.test_health_check()
        self.test_root_endpoint()
        
        # Authentication tests
        user_id, test_email, test_password = self.test_user_registration()
        self.test_admin_login()
        
        if user_id:
            logged_in_user_id = self.test_user_login(test_email, test_password)
            self.test_profile_operations(logged_in_user_id)
        
        self.test_invalid_login()
        
        # Citation search tests
        self.test_citation_search()
        
        # Admin functionality tests
        self.test_admin_endpoints()
        self.test_record_action()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = CitationLookupAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())