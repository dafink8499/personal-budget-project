const mongoose = require("mongoose");

const myBudgetSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    budget: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    }
}, { collection: 'myBudget'})

module.exports = mongoose.model('myBudget', myBudgetSchema)