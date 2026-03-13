const Groq = require('groq-sdk');
require('dotenv').config();

async function test() {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            model: 'llama-3.2-11b-vision-preview',
            messages: [{ role: 'user', content: 'Say "Groq is working"' }],
        });
        console.log('Response:', completion.choices[0].message.content);
    } catch (err) {
        console.error('Groq Test Error:', err.message);
    }
}

test();
