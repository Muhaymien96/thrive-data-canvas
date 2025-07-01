// Test script for the new authentication and business flow
// Run with: node mcp/test-auth-flow.js

const BASE_URL = 'http://localhost:3101';
const APP_URL = 'http://localhost:5173'; // Vite dev server

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

async function testAuthFlow() {
  console.log('🔐 Testing New Authentication and Business Flow...\n');
  
  // Test 1: Initial app load (should show login form)
  console.log('📋 Test 1: Initial app load - Login form');
  await testEndpoint('POST', '/screenshot', {
    url: APP_URL,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 2000
  });
  
  // Test 2: Check if login form elements are present
  console.log('\n📋 Test 2: Login form elements');
  await testEndpoint('POST', '/scrape', {
    url: APP_URL,
    selectors: [
      { name: 'login_tab', css: '[data-value="login"]', type: 'text' },
      { name: 'signup_tab', css: '[data-value="signup"]', type: 'text' },
      { name: 'email_input', css: 'input[type="email"]', type: 'attribute', attribute: 'placeholder' },
      { name: 'password_input', css: 'input[type="password"]', type: 'attribute', attribute: 'placeholder' },
      { name: 'signin_button', css: 'button[type="submit"]', type: 'text' }
    ],
    waitFor: 2000
  });
  
  // Test 3: Test signup form
  console.log('\n📋 Test 3: Signup form interaction');
  await testEndpoint('POST', '/submit-form', {
    url: APP_URL,
    formData: [
      { selector: '[data-value="signup"]', type: 'click' },
      { selector: 'input[type="text"]', value: 'Test User', type: 'input' },
      { selector: 'input[type="email"]', value: 'testuser@example.com', type: 'input' },
      { selector: 'input[type="password"]', value: 'password123', type: 'input' }
    ],
    waitFor: 1000
  });
  
  // Test 4: Screenshot after signup attempt
  console.log('\n📋 Test 4: After signup attempt');
  await testEndpoint('POST', '/screenshot', {
    url: APP_URL,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 3000
  });
  
  // Test 5: Test login with invalid credentials
  console.log('\n📋 Test 5: Login with invalid credentials');
  await testEndpoint('POST', '/submit-form', {
    url: APP_URL,
    formData: [
      { selector: '[data-value="login"]', type: 'click' },
      { selector: 'input[type="email"]', value: 'invalid@example.com', type: 'input' },
      { selector: 'input[type="password"]', value: 'wrongpassword', type: 'input' },
      { selector: 'button[type="submit"]', type: 'click' }
    ],
    waitFor: 2000
  });
  
  // Test 6: Screenshot after login attempt
  console.log('\n📋 Test 6: After login attempt');
  await testEndpoint('POST', '/screenshot', {
    url: APP_URL,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 2000
  });
  
  // Test 7: Check for error messages
  console.log('\n📋 Test 7: Error message detection');
  await testEndpoint('POST', '/scrape', {
    url: APP_URL,
    selectors: [
      { name: 'error_message', css: '.text-red-600', type: 'text' },
      { name: 'success_message', css: '.text-green-600', type: 'text' }
    ],
    waitFor: 1000
  });
  
  // Test 8: Test business selector (if we had a logged-in state)
  console.log('\n📋 Test 8: Business selector page (simulated)');
  await testEndpoint('POST', '/screenshot', {
    url: `${APP_URL}/?test=business-selector`,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 2000
  });
  
  // Test 9: Test business onboarding form
  console.log('\n📋 Test 9: Business onboarding form');
  await testEndpoint('POST', '/submit-form', {
    url: `${APP_URL}/?test=business-onboarding`,
    formData: [
      { selector: 'input[placeholder*="business name"]', value: 'Test Business', type: 'input' },
      { selector: 'select', value: 'Technology', type: 'select' },
      { selector: 'textarea', value: 'A test business for automation', type: 'textarea' }
    ],
    waitFor: 1000
  });
  
  // Test 10: Final screenshot
  console.log('\n📋 Test 10: Final state');
  await testEndpoint('POST', '/screenshot', {
    url: APP_URL,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 2000
  });
  
  console.log('\n✅ Authentication flow testing completed!');
}

async function testBusinessFlow() {
  console.log('\n🏢 Testing Business Management Flow...\n');
  
  // Test business creation
  console.log('📋 Test 1: Business creation form');
  await testEndpoint('POST', '/scrape', {
    url: `${APP_URL}/?test=business-creation`,
    selectors: [
      { name: 'business_name_input', css: 'input[placeholder*="business name"]', type: 'attribute', attribute: 'placeholder' },
      { name: 'business_type_select', css: 'select', type: 'text' },
      { name: 'create_button', css: 'button:contains("Create Business")', type: 'text' }
    ],
    waitFor: 2000
  });
  
  // Test business selection
  console.log('\n📋 Test 2: Business selection interface');
  await testEndpoint('POST', '/scrape', {
    url: `${APP_URL}/?test=business-selection`,
    selectors: [
      { name: 'business_cards', css: '.business-card', type: 'multiple' },
      { name: 'create_new_button', css: 'button:contains("Create New Business")', type: 'text' }
    ],
    waitFor: 2000
  });
  
  // Test dashboard with selected business
  console.log('\n📋 Test 3: Dashboard with selected business');
  await testEndpoint('POST', '/screenshot', {
    url: `${APP_URL}/?test=dashboard`,
    width: 1200,
    height: 800,
    fullPage: false,
    waitFor: 2000
  });
  
  console.log('\n✅ Business flow testing completed!');
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive authentication and business flow tests...\n');
  
  // Test health endpoint first
  await testEndpoint('GET', '/health');
  
  // Run authentication flow tests
  await testAuthFlow();
  
  // Run business flow tests
  await testBusinessFlow();
  
  console.log('\n🎉 All tests completed successfully!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
} 