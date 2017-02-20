/*jshint esversion: 6*/

const express  = require('express');
const Food = require('../models/food');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
const {authorizeFood, checkOwnership} = require('../middleware/food-authorization');

router.get('/new', (req, res) => {
  res.render('cookFood/new');
});

router.post('/new', (req, res, next) => {
  const { name, maxNumberOfDiners, description, ingredients, date} = req.body;
   //_creator: req.user._id
console.log("HOLA CARACOLA")
   const foodSubmission = {
     name: name,
     maxNumberOfDiners: maxNumberOfDiners,
     description: description,
     ingredients: ingredients,
     date: date
   };
  const theFood = new Food(foodSubmission);
  theFood.save( (err) => {
    if (err) {
      res.render('/new');
      return;
    } else {
      console.log("hola");
      //res.redirect(`/${newFood._id}`);
      res.redirect('/new');
    }
  });
});

router.get('/:id', checkOwnership, (req, res, next) => {
  food.findById(req.params.id, (err, food) => {
    if (err){ return next(err); }

    food.populate('_creator', (err, food) => {
      if (err){ return next(err); }
      return res.render('foods/show', { food });
    });
  });
});

router.get('/:id/edit', [
    ensureLoggedIn('/login'),
    authorizeFood
  ], (req, res, next) => {
  food.findById(req.params.id, (err, food) => {
    if (err)       { return next(err) }
    if (!food) { return next(new Error("404")) }
    return res.render('foods/edit', { food})
  });
});

router.post('/:id', [
    ensureLoggedIn('/login'),
    authorizeFood
  ], (req, res, next) => {
  const updates = {
    name: req.body.name,
    maxNumberOfDiners: req.body.maxNumberOfDiners,
    description: req.body.description,
    numberOfDiners: req.body.numberOfDiners,
    ingredients: req.body.ingredients,
    date: req.body.date,
    _creator: req.user._id
  };

  Food.findByIdAndUpdate(req.params.id, updates, (err, food) => {
    if (err)       { return res.render('foods/edit', { food, errors: food.errors }); }
    if (!food) { return next(new Error("404")); }
    return res.redirect(`/foods/${food._id}`);
  });
});



module.exports = router;
