const axios = require('axios');

const API_URL = 'http://localhost:8000/api/v1';
const TEST_USER = {
    username: 'admin@regenesys.com',
    password: 'password123' // Replace with your actual local testing password
};

async function runTests() {
    console.log('🚀 Starting Local System Integration Test...\n');

    try {
        // 1. Test Login
        console.log('Checking Authentication...');
        const loginData = new URLSearchParams();
        loginData.append('username', TEST_USER.username);
        loginData.append('password', TEST_USER.password);

        const loginRes = await axios.post(`${API_URL}/auth/login`, loginData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const token = loginRes.data.access_token;
        console.log('✅ Login Successful! Token received.\n');

        const authHeaders = { Authorization: `Bearer ${token}` };

        // 2. Test Document Listing
        console.log('Checking Document List...');
        const docsRes = await axios.get(`${API_URL}/documents`, { headers: authHeaders });
        console.log(`✅ Successfully fetched ${docsRes.data.length} documents. No 403 error!\n`);

        // 3. Test RAG Chat
        console.log('Testing RAG Chat Response...');
        const chatRes = await axios.post(`${API_URL}/chat/ask`, {
            question: "Hello, what programmes do you offer?"
        }, { headers: authHeaders });

        if (chatRes.data.answer) {
            console.log('✅ Chat response received successfully!');
            console.log('AI Answer Sample:', chatRes.data.answer.substring(0, 100) + '...\n');
        }

        console.log('✨ ALL LOCAL TESTS PASSED! The system is ready for deployment.');

    } catch (error) {
        console.error('❌ TEST FAILED!');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Error Details:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        console.log('\nHint: Make sure your local backend (Uvicorn) is running on port 8000.');
    }
}

runTests();
