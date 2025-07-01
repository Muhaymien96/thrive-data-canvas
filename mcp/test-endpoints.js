// Simple test script for MCP server endpoints
// Run with: node mcp/test-endpoints.js

const BASE_URL = 'http://localhost:3100';

async function testEndpoint(method, endpoint, data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`${method} ${endpoint}: ${response.status} - ${response.ok ? '✅' : '❌'}`);
    if (!response.ok) {
      console.log(`   Error: ${result.error}`);
    }
    return result;
  } catch (error) {
    console.log(`${method} ${endpoint}: ❌ - ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Testing MCP Server Endpoints...\n');
  
  // Test health endpoint
  await testEndpoint('GET', '/health');
  
  // Test customers endpoints
  await testEndpoint('GET', '/customers');
  await testEndpoint('GET', '/customers?business_id=test');
  
  // Test businesses endpoints
  await testEndpoint('GET', '/businesses');
  await testEndpoint('GET', '/businesses?owner_id=test');
  
  // Test transactions endpoints
  await testEndpoint('GET', '/transactions');
  await testEndpoint('GET', '/transactions?business_id=test');
  
  // Test products endpoints
  await testEndpoint('GET', '/products');
  await testEndpoint('GET', '/products?business_id=test');
  
  // Test employees endpoints
  await testEndpoint('GET', '/employees');
  await testEndpoint('GET', '/employees?business_id=test');
  
  // Test suppliers endpoints
  await testEndpoint('GET', '/suppliers');
  await testEndpoint('GET', '/suppliers?business_id=test');
  
  // Test analytics endpoints
  await testEndpoint('GET', '/analytics/revenue');
  await testEndpoint('GET', '/analytics/revenue?business_id=test');
  await testEndpoint('GET', '/analytics/stock');
  await testEndpoint('GET', '/analytics/stock?business_id=test');
  
  // Test search endpoint
  await testEndpoint('GET', '/search?q=test&business_id=test');
  
  // Test 404 endpoint
  await testEndpoint('GET', '/nonexistent');
  
  console.log('\n✅ Endpoint testing completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
} 