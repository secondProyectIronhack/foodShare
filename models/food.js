/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const FoodSchema = new Schema({
    name: {type: String, required:true},
    maxNumberOfDiners: {type: Number, required:true},
    date: Date,
    numberOfDiners: Number,
    description: String,
    ingredients: String
   //_creator      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
