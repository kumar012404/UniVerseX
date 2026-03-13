const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    goal: {
        type: String,
        enum: ['lose_weight', 'gain_muscle', 'maintain', 'improve_fitness'],
        default: 'maintain'
    },
    dailyCalorieGoal: {
        type: Number,
        default: 2000
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
