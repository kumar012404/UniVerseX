const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route  POST /api/auth/register
// @desc   Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, age, weight, height, goal } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            name,
            email,
            password: hashedPassword,
            age: age || 0,
            weight: weight || 0,
            height: height || 0,
            goal: goal || 'maintain'
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                goal: user.goal,
                dailyCalorieGoal: user.dailyCalorieGoal,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  POST /api/auth/login
// @desc   Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                weight: user.weight,
                height: user.height,
                goal: user.goal,
                dailyCalorieGoal: user.dailyCalorieGoal,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  GET /api/auth/profile
// @desc   Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route  PUT /api/auth/profile
// @desc   Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, age, weight, height, goal, dailyCalorieGoal } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, age, weight, height, goal, dailyCalorieGoal },
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
