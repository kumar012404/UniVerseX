const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error checking admin status.' });
    }
};

// @route   GET /api/admin/dashboard
// @desc    Get system-wide stats for admin dashboard
router.get('/dashboard', auth, adminAuth, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const workoutCount = await Workout.countDocuments();
        const dietCount = await Diet.countDocuments();

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                users: userCount,
                workouts: workoutCount,
                diets: dietCount
            },
            recentUsers
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/user/:id
// @desc    Delete a user and their data
router.delete('/user/:id', auth, adminAuth, async (req, res) => {
    try {
        // Find user by params.id
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own admin account.' });
        }

        // Remove user data
        await Workout.deleteMany({ user: req.params.id });
        await Diet.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User successfully deleted.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
