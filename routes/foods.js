const express  = require('express');
const Food = require('../models/food');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
const {authorizeFood, checkOwnership} = require('../middleware/food-authorization');

router.get('/new', (req, res) => {
  res.render('foods/new', { types: TYPES });
});

router.post('/', ensureLoggedIn('/login'), (req, res, next) => {
  const newFood = new Food({
    name: req.body.name,
    maxNumberOfDiners: req.body.maxNumberOfDiners,
    description: req.body.description,
    numberOfDiners: req.body.numberOfDiners,
    ingredients: req.body.ingredients,
    date: req.body.date,
    _creator: req.user._id
  });

  newFood.save( (err) => {
    if (err) {
      res.render('foods/new', {err, food: newFood);
    } else {
      res.redirect(`/foods/${newFood._id}`);
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
    authorizefood
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