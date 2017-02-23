/*jshint esversion: 6*/

const express = require('express');
const router = express.Router();
const Food = require('../models/food');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
