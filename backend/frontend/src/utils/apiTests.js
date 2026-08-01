/**
 * API Integration Test Script
 * 
 * Run this in your browser console or use it to verify API connectivity
 * 
 * Usage:
 * 1. Make sure backend is running on http://localhost:5001
 * 2. Open browser dev tools (F12)
 * 3. Go to Application/Local Storage and set a test token
 * 4. Run these tests
 */

const API_BASE_URL = 'http://localhost:5001/api';

// Test Configuration
const TEST_CONFIG = {
  // Create these users first via the UI or API
  admin: { email: 'admin@test.com', password: 'admin123' },
  vendor: { email: 'vendor@test.com', password: 'vendor123' },
  user: { email: 'user@test.com', password: 'user123' },
};

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    return { status: response.status, data: result };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// Test Suite
const APITests = {
  // Auth Tests
  async testAdminLogin() {
    console.log('🧪 Testing Admin Login...');
    const result = await apiCall('/auth/admin/login', 'POST', TEST_CONFIG.admin);
    console.log(result.status === 200 ? '✅ Admin Login Works' : '❌ Admin Login Failed', result);
    return result.data?.token;
  },

  async testVendorLogin() {
    console.log('🧪 Testing Vendor Login...');
    const result = await apiCall('/auth/vendor/login', 'POST', TEST_CONFIG.vendor);
    console.log(result.status === 200 ? '✅ Vendor Login Works' : '❌ Vendor Login Failed', result);
    return result.data?.token;
  },

  async testUserLogin() {
    console.log('🧪 Testing User Login...');
    const result = await apiCall('/auth/user/login', 'POST', TEST_CONFIG.user);
    console.log(result.status === 200 ? '✅ User Login Works' : '❌ User Login Failed', result);
    return result.data?.token;
  },

  // Admin Tests
  async testGetUsers(token) {
    console.log('🧪 Testing Get Users (Admin)...');
    const result = await apiCall('/admin/users', 'GET', null, token);
    console.log(result.status === 200 ? '✅ Get Users Works' : '❌ Get Users Failed', result);
  },

  async testGetVendors(token) {
    console.log('🧪 Testing Get Vendors (Admin)...');
    const result = await apiCall('/admin/vendors', 'GET', null, token);
    console.log(result.status === 200 ? '✅ Get Vendors Works' : '❌ Get Vendors Failed', result);
  },

  // Vendor Tests
  async testVendorGetProducts(token) {
    console.log('🧪 Testing Vendor Get Products...');
    const result = await apiCall('/vendor/products', 'GET', null, token);
    console.log(result.status === 200 ? '✅ Vendor Get Products Works' : '❌ Vendor Get Products Failed', result);
  },

  // User Tests
  async testUserGetVendors(token) {
    console.log('🧪 Testing User Get Vendors...');
    const result = await apiCall('/user/vendors', 'GET', null, token);
    console.log(result.status === 200 ? '✅ User Get Vendors Works' : '❌ User Get Vendors Failed', result);
  },

  async testUserGetProducts(token) {
    console.log('🧪 Testing User Get Products...');
    const result = await apiCall('/user/products', 'GET', null, token);
    console.log(result.status === 200 ? '✅ User Get Products Works' : '❌ User Get Products Failed', result);
  },

  async testUserGetOrders(token) {
    console.log('🧪 Testing User Get Orders...');
    const result = await apiCall('/user/orders', 'GET', null, token);
    console.log(result.status === 200 ? '✅ User Get Orders Works' : '❌ User Get Orders Failed', result);
  },

  async testUserGetGuestList(token) {
    console.log('🧪 Testing User Get Guest List...');
    const result = await apiCall('/user/guests', 'GET', null, token);
    console.log(result.status === 200 ? '✅ User Get Guest List Works' : '❌ User Get Guest List Failed', result);
  },

  // Run All Tests
  async runAll() {
    console.log('🚀 Starting API Integration Tests...\n');

    // Test Auth
    const adminToken = await this.testAdminLogin();
    const vendorToken = await this.testVendorLogin();
    const userToken = await this.testUserLogin();

    console.log('\n📋 Testing Admin Endpoints...');
    if (adminToken) {
      await this.testGetUsers(adminToken);
      await this.testGetVendors(adminToken);
    }

    console.log('\n📋 Testing Vendor Endpoints...');
    if (vendorToken) {
      await this.testVendorGetProducts(vendorToken);
    }

    console.log('\n📋 Testing User Endpoints...');
    if (userToken) {
      await this.testUserGetVendors(userToken);
      await this.testUserGetProducts(userToken);
      await this.testUserGetOrders(userToken);
      await this.testUserGetGuestList(userToken);
    }

    console.log('\n✨ All Tests Completed!');
  }
};

// Export for use in browser console
window.APITests = APITests;

console.log('🎯 API Test Suite Loaded!');
console.log('Usage: APITests.runAll()');
console.log('Or run individual tests: APITests.testAdminLogin()');
