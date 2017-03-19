/*jshint esversion: 6*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    foodToCook: [{
        type: ObjectId,
        ref: 'Food'
    }],
    foodToEat: [{
        type: ObjectId,
        ref: 'Food'
    }]
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
