// Test script for Puppeteer MCP server endpoints
// Run with: node mcp/test-puppeteer.js

const BASE_URL = 'http://localhost:3101';

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
    
    console.log(`${method} ${endpoint}: ${response.status} - ${response.ok ? '✅' : '❌'}`);
    
    if (!response.ok) {
      const result = await response.json();
      console.log(`   Error: ${result.error}`);
    } else if (endpoint === '/screenshot') {
      console.log(`   Screenshot generated successfully`);
    } else if (endpoint === '/pdf') {
      console.log(`   PDF generated successfully`);
    } else {
      const result = await response.json();
      console.log(`   Response: ${JSON.stringify(result).substring(0, 100)}...`);
    }
    
    return response.ok;
  } catch (error) {
    console.log(`${method} ${endpoint}: ❌ - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🤖 Testing Puppeteer MCP Server Endpoints...\n');
  
  // Test health endpoint
  await testEndpoint('GET', '/health');
  
  // Test screenshot endpoint
  await testEndpoint('POST', '/screenshot', {
    url: 'https://example.com',
    width: 1200,
    height: 800,
    fullPage: false
  });
  
  // Test PDF generation
  await testEndpoint('POST', '/pdf', {
    url: 'https://example.com',
    format: 'A4',
    landscape: false
  });
  
  // Test web scraping
  await testEndpoint('POST', '/scrape', {
    url: 'https://example.com',
    selectors: [
      { name: 'title', css: 'h1', type: 'text' },
      { name: 'description', css: 'p', type: 'text' }
    ]
  });
  
  // Test form submission
  await testEndpoint('POST', '/submit-form', {
    url: 'https://httpbin.org/forms/post',
    formData: [
      { selector: 'input[name="custname"]', value: 'Test User', type: 'input' },
      { selector: 'input[name="custtel"]', value: '123-456-7890', type: 'input' }
    ]
  });
  
  // Test performance monitoring
  await testEndpoint('POST', '/performance', {
    url: 'https://example.com'
  });
  
  // Test browser automation
  await testEndpoint('POST', '/automate', {
    url: 'https://example.com',
    actions: [
      { type: 'wait', wait: 1000 },
      { type: 'getText', selector: 'h1' }
    ]
  });
  
  // Test 404 endpoint
  await testEndpoint('GET', '/nonexistent');
  
  console.log('\n✅ Puppeteer endpoint testing completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
} 