const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const FoodSchema = new Schema({
    name: {type: String, required:true},
    maxNumberOfDiners: {type: Number, required:true},
    date: Date,
    numberOfDiners: Number,
    description: String,
    ingredients: String
});

const Fodd = mongoose.model('Food', UserSchema);
module.exports = Food;