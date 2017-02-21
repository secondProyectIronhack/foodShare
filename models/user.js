/*jshint esversion: 6*/

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
    name:       {type: String, required :true},
    email:       {type: String, required :true},
    password:    {type: String, required: true},
    //imgUrl:      { type: String, default: "" },
    foodToCook:  [],
    foodToEat:   []
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
