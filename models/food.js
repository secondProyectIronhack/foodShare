/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const FoodSchema = new Schema({
    name: {type: String, required:true},
    maxNumberOfDiners: {type: Number, required:true},
    date: {type: Date, required:true},
    numberOfDiners: Number,
    description: String,
    ingredients: String,
    _creator: String
});

const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
