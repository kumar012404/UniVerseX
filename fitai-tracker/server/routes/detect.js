const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function fileToGenerativePart(buffer, mimeType) {
    return {
        inlineData: {
            data: buffer.toString('base64'),
            mimeType
        }
    };
}

router.post('/', auth, upload.single('image'), async (req, res) => {
    const modelsToTry = [
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
    ];

    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    console.log(`Received image: ${req.file.originalname}, size: ${req.file.size} bytes`);

    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);
    const prompt = `Analyze this food image. Return ONLY a JSON object:
    {
      "foodName": "name",
      "calories": 100,
      "protein": 10,
      "carbs": 20,
      "fat": 5,
      "servingSize": "1 serving",
      "confidence": "high",
      "description": "description"
    }`;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Step 1: Calling Gemini API with model: ${modelName}`);
            const apiKey = process.env.GEMINI_API_KEY.trim();
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            console.log(`Step 2: Received response from ${modelName}`);

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.log(`Error: No JSON found in response from ${modelName}`);
                throw new Error('AI could not identify food clearly.');
            }

            const nutritionData = JSON.parse(jsonMatch[0]);
            console.log(`Step 3: Successfully parsed nutrition data for ${nutritionData.foodName}`);
            return res.json({ ...nutritionData, imageProcessed: true });

        } catch (err) {
            console.error(`Error details for ${modelName}:`, err.message);

            if (err.message.includes('429')) {
                console.log(`Status 429: Rate limit hit on ${modelName}.`);
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    return res.status(500).json({ message: 'AI limit reached. Please wait 1 minute.' });
                }
                console.log('Waiting 2 seconds before retry with next model...');
                await sleep(2000);
                continue;
            }

            if (err.message.includes('SAFETY')) {
                console.log('Status: Rejected by safety filters.');
                return res.status(500).json({ message: 'Image rejected by AI safety filters.' });
            }

            console.log(`Status 404 or other: Model ${modelName} might not be available. Trying next...`);
            continue;
        }
    }

    return res.status(500).json({ message: 'AI is over capacity. Please wait 1 minute for a cooldown.' });
});

module.exports = router;
