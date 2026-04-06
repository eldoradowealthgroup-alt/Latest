import requests
import sys
import json
from datetime import datetime

class CitationLookupAPITester:
    def __init__(self, base_url="https://github-to-web-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.user_id = None
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
            "details": details
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            if success:
                data = response.json()
                details += f", Response: {data}"
            self.log_test("Root endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("Root endpoint", False, f"Error: {str(e)}")
            return False

    def test_register_user(self, email, password):
        """Test user registration"""
        try:
            response = requests.post(f"{self.base_url}/auth/register", json={
                "email": email,
                "password": password
            })
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                self.user_id = data.get('id')
                details += f", User ID: {self.user_id}"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("User registration", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("User registration", False, f"Error: {str(e)}")
            return False, {}

    def test_login_user(self, email, password):
        """Test user login"""
        try:
            response = requests.post(f"{self.base_url}/auth/login", json={
                "email": email,
                "password": password
            })
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", User ID: {data.get('id')}, Is Admin: {data.get('is_admin', False)}"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("User login", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("User login", False, f"Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login with admin/Money2026$"""
        try:
            response = requests.post(f"{self.base_url}/auth/login", json={
                "email": "admin",
                "password": "Money2026$"
            })
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                is_admin = data.get('is_admin', False)
                details += f", User ID: {data.get('id')}, Is Admin: {is_admin}"
                if not is_admin:
                    success = False
                    details += " - Admin flag not set correctly"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Admin login", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Admin login", False, f"Error: {str(e)}")
            return False, {}

    def test_get_profile(self, user_id):
        """Test get user profile"""
        try:
            response = requests.get(f"{self.base_url}/profile/{user_id}")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Profile: {data}"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Get user profile", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Get user profile", False, f"Error: {str(e)}")
            return False, {}

    def test_update_profile(self, user_id, profile_data):
        """Test update user profile"""
        try:
            response = requests.put(f"{self.base_url}/profile/{user_id}", json=profile_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                details += f", Updated profile: {data}"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Update user profile", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Update user profile", False, f"Error: {str(e)}")
            return False, {}

    def test_citation_search_valid(self):
        """Test citation search with valid citation number (87911938c)"""
        try:
            search_data = {
                "name": "Michael J. Thompson",
                "citation_number": "87911938c",
                "zip_code": "12345"
            }
            response = requests.post(f"{self.base_url}/citations/search", json=search_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                found = data.get('found', False)
                citations_count = len(data.get('citations', []))
                details += f", Found: {found}, Citations: {citations_count}"
                
                # Verify expected data
                if found and citations_count == 4 and data.get('name') == "Michael J. Thompson":
                    details += " - All expected data present"
                else:
                    success = False
                    details += " - Missing expected data"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Citation search (valid)", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Citation search (valid)", False, f"Error: {str(e)}")
            return False, {}

    def test_citation_search_invalid(self):
        """Test citation search with invalid citation number"""
        try:
            search_data = {
                "name": "John Doe",
                "citation_number": "invalid123",
                "zip_code": "54321"
            }
            response = requests.post(f"{self.base_url}/citations/search", json=search_data)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                found = data.get('found', True)  # Should be False
                message = data.get('message', '')
                details += f", Found: {found}, Message: {message}"
                
                # Verify not found response
                if not found and "not found" in message.lower():
                    details += " - Correct not found response"
                else:
                    success = False
                    details += " - Incorrect response format"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Citation search (invalid)", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Citation search (invalid)", False, f"Error: {str(e)}")
            return False, {}

    def test_admin_submissions(self):
        """Test admin submissions endpoint"""
        try:
            response = requests.get(f"{self.base_url}/admin/submissions")
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            
            if success:
                data = response.json()
                submissions_count = len(data) if isinstance(data, list) else 0
                details += f", Submissions count: {submissions_count}"
            else:
                details += f", Error: {response.text}"
                
            self.log_test("Admin submissions", success, details)
            return success, response.json() if success else {}
        except Exception as e:
            self.log_test("Admin submissions", False, f"Error: {str(e)}")
            return False, {}

    def test_duplicate_registration(self, email, password):
        """Test duplicate user registration should fail"""
        try:
            response = requests.post(f"{self.base_url}/auth/register", json={
                "email": email,
                "password": password
            })
            success = response.status_code == 400  # Should fail with 400
            details = f"Status: {response.status_code}"
            
            if success:
                details += " - Correctly rejected duplicate registration"
            else:
                details += " - Should have rejected duplicate registration"
                
            self.log_test("Duplicate registration prevention", success, details)
            return success
        except Exception as e:
            self.log_test("Duplicate registration prevention", False, f"Error: {str(e)}")
            return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            response = requests.post(f"{self.base_url}/auth/login", json={
                "email": "nonexistent@test.com",
                "password": "wrongpassword"
            })
            success = response.status_code == 401  # Should fail with 401
            details = f"Status: {response.status_code}"
            
            if success:
                details += " - Correctly rejected invalid credentials"
            else:
                details += " - Should have rejected invalid credentials"
                
            self.log_test("Invalid login rejection", success, details)
            return success
        except Exception as e:
            self.log_test("Invalid login rejection", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Citation Lookup API Tests")
        print("=" * 50)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed - stopping tests")
            return False
        
        # Test admin login first
        self.test_admin_login()
        
        # Test admin endpoints
        self.test_admin_submissions()
        
        # Generate unique test email
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_email = f"test_{timestamp}@example.com"
        test_password = "TestPass123!"
        
        # Test user registration
        success, user_data = self.test_register_user(test_email, test_password)
        if not success:
            print("❌ User registration failed - stopping user tests")
        else:
            user_id = user_data.get('id')
            
            # Test user login
            self.test_login_user(test_email, test_password)
            
            # Test profile operations
            self.test_get_profile(user_id)
            
            profile_data = {
                "name": "Test User",
                "address": "123 Test Street",
                "dob": "01/01/1990",
                "phone": "555-0123",
                "email": test_email
            }
            self.test_update_profile(user_id, profile_data)
            
            # Test duplicate registration
            self.test_duplicate_registration(test_email, test_password)
        
        # Test citation search (independent of user registration)
        self.test_citation_search_valid()
        self.test_citation_search_invalid()
        
        # Test error cases
        self.test_invalid_login()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed")
            return False

def main():
    tester = CitationLookupAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': f"{tester.tests_passed}/{tester.tests_run} tests passed",
            'success_rate': f"{(tester.tests_passed/tester.tests_run)*100:.1f}%",
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())