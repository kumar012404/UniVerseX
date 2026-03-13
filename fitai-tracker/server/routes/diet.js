const express = require('express');
const router = express.Router();
const Diet = require('../models/Diet');
const auth = require('../middleware/auth');

// @route  POST /api/diet
// @desc   Log a food item
router.post('/', auth, async (req, res) => {
    try {
        const { foodName, calories, protein, carbs, fat, mealType, quantity, unit, detectedByAI, imageUrl } = req.body;

        const diet = new Diet({
            user: req.user.id,
            foodName,
            calories,
            protein: protein || 0,
            carbs: carbs || 0,
            fat: fat || 0,
            mealType: mealType || 'snack',
            quantity: quantity || 1,
            unit: unit || 'serving',
            detectedByAI: detectedByAI || false,
            imageUrl
        });

        await diet.save();
        res.status(201).json(diet);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/diet
// @desc   Get all food logs for user (today by default)
router.get('/', auth, async (req, res) => {
    try {
        const { date } = req.query;

        let query = { user: req.user.id };

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const dietLogs = await Diet.find(query).sort({ date: -1 });

        // Calculate totals
        const totals = dietLogs.reduce((acc, item) => {
            acc.calories += item.calories;
            acc.protein += item.protein;
            acc.carbs += item.carbs;
            acc.fat += item.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        res.json({ dietLogs, totals });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  DELETE /api/diet/:id
// @desc   Delete a food log
router.delete('/:id', auth, async (req, res) => {
    try {
        const diet = await Diet.findById(req.params.id);
        if (!diet) return res.status(404).json({ message: 'Food log not found' });
        if (diet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Diet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food log removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/diet/summary
// @desc   Get weekly calorie summary
router.get('/summary', auth, async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = await Diet.find({
            user: req.user.id,
            date: { $gte: sevenDaysAgo }
        });

        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
