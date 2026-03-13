const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');

const Workout = require('../models/Workout'); // Import Workout model

// @route  POST /api/chat
// @desc   Chat with FitAI
router.post('/', auth, async (req, res) => {
    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Fetch user's recent workouts from the database
        const recentWorkouts = await Workout.find({ user: req.user.id })
            .sort({ date: -1 })
            .limit(5);

        let workoutsContext = 'The user currently has no logged workouts.';
        if (recentWorkouts.length > 0) {
            workoutsContext = 'Here are the user\'s recent logged workouts:\n';
            recentWorkouts.forEach((w, i) => {
                const dateSplit = new Date(w.date).toISOString().split('T')[0];
                workoutsContext += `${i + 1}. Date: ${dateSplit}, Name: ${w.name}, Exercises:\n`;
                w.exercises.forEach(ex => {
                    workoutsContext += `   - ${ex.name}: ${ex.sets} sets x ${ex.reps} reps, ${ex.weight} lbs\n`;
                });
            });
        }

        // Build conversation history and map 'bot' role to 'assistant' for API compatibility
        const validHistory = (history || []).map(msg => ({
            role: msg.role === 'bot' ? 'assistant' : msg.role,
            content: msg.content
        }));

        const messages = [
            {
                role: 'system',
                content: `You are FitAI, a professional fitness and nutrition assistant. 
                You help users with:
                - Workout plans and exercise advice
                - Nutrition and diet guidance
                - Calorie information for foods
                - Healthy lifestyle tips
                - Weight loss/gain strategies
                - Muscle building advice

                ${workoutsContext}
                
                Be encouraging, specific, and science-based. Keep responses concise and actionable.
                Always prioritize the user's health and safety.`
            },
            ...validHistory,
            { role: 'user', content: message }
        ];

        const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages,
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

        res.json({ reply });
    } catch (err) {
        console.error('Groq Error Detail:', err);
        res.status(500).json({ message: 'AI service error: ' + err.message });
    }
});

module.exports = router;
