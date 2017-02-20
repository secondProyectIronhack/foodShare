/*jshint esversion: 6*/

const express = require('express');
const router = express.Router();
const Food = require('../models/food');

/* GET home page. */
router.get('/', function(req, res, next) {
    Food
    .find({})
    .populate('_creator')
    .exec( (err, foods) => {
        res.render('index', { foods });
    });
});

module.exports = router;
