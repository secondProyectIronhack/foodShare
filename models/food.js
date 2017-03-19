/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FoodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    maxNumberOfDiners: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    numberOfDiners: {
        type: Number,
        required: true
    },
    description: {
        String,
        required: false
    },
    ingredients: {
        String,
        required: false
    },
    _creator: {
        String,
        required: false
    },
    location: {
        type: String,
        required: true
    }
});

const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
