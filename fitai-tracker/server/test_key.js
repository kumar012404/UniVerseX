const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    try {
        const apiKey = process.env.GEMINI_API_KEY.trim();
        console.log('Testing key:', apiKey.substring(0, 5) + '...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

        const result = await model.generateContent('Say "API is working"');
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (err) {
        console.error('Gemini Test Error:', err);
    }
}

test();
