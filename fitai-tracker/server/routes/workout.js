const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

// @route  POST /api/workout
// @desc   Add a new workout
router.post('/', auth, async (req, res) => {
    try {
        const { name, exercises, totalCaloriesBurned, notes } = req.body;

        const workout = new Workout({
            user: req.user.id,
            name,
            exercises,
            totalCaloriesBurned: totalCaloriesBurned || 0,
            notes
        });

        await workout.save();
        res.status(201).json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/workout
// @desc   Get all workouts for logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const workouts = await Workout.find({ user: req.user.id }).sort({ date: -1 });
        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/workout/:id
// @desc   Get a single workout
router.get('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  PUT /api/workout/:id
// @desc   Update a workout
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, exercises, totalCaloriesBurned, notes } = req.body;

        let workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        workout = await Workout.findByIdAndUpdate(
            req.params.id,
            { name, exercises, totalCaloriesBurned, notes },
            { new: true }
        );

        res.json(workout);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  DELETE /api/workout/:id
// @desc   Delete a workout
router.delete('/:id', auth, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) return res.status(404).json({ message: 'Workout not found' });
        if (workout.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Workout.findByIdAndDelete(req.params.id);
        res.json({ message: 'Workout removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
