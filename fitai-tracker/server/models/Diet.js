const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodName: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true,
        default: 0
    },
    protein: {
        type: Number,
        default: 0
    },
    carbs: {
        type: Number,
        default: 0
    },
    fat: {
        type: Number,
        default: 0
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        default: 'snack'
    },
    quantity: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: 'serving'
    },
    date: {
        type: Date,
        default: Date.now
    },
    detectedByAI: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Diet', dietSchema);
