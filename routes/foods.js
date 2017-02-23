/*jshint esversion: 6*/
const express  = require('express');
const Food = require('../models/food');
const router   = express.Router();
const { ensureLoggedIn }  = require('connect-ensure-login');
const {authorizeFood, checkOwnership} = require('../middleware/food-authorization');
const User = require('../models/user');
router.get('/new', (req, res) => {
  res.render('cookFood/new');
});
router.get('/show', (req,res, next) => {
   Food.find({}, function(error,foods){
    if(error){
      return next(err);
    }else{
      res.render('cookFood/show',
      {listOfFoods: foods}
      );
    }
  });
})
router.post('/new', (req, res, next) => {
  const { name, maxNumberOfDiners, description, ingredients, date, location} = req.body;
   const foodSubmission = {
     name: name,
     maxNumberOfDiners: maxNumberOfDiners,
     description: description,
     ingredients: ingredients,
     date: date,
     _creator: req.session.currentUser._id,
     location: location,
     numberOfDiners: 0,
   };
   console.log(foodSubmission)
   if(name === ''){
     res.render('cookFood/new', {errorMessage:'Name of food required'});
   }
   if(maxNumberOfDiners === ''){
     res.render('cookFood/new', {errorMessage:'Max Number of diners required'});
   }
   if(date === ''){
     res.render('cookFood/new', {errorMessage:'Date required'});
   }
  const theFood = new Food(foodSubmission);
  theFood.save( (err) => {
    if (err) {
      res.render('cookFood/new');
      return;
    } else {
          User.updateOne(
            { _id: req.session.currentUser._id },
            { $push: { "foodToCook": theFood._id }}, function(err, user){
              if (err) return next(err);
               res.redirect('/');
               return;
            }
          );
      }
  })
});

router.post('/add-food',(req,res,next) => {
  let foodId = req.body.foodId;
  Food.findById(foodId, (err, foodPicked)=>{
    if (err){
      return next(err);
    }else{
       console.log(foodPicked);
      if(foodPicked.numberOfDiners < foodPicked.maxNumberOfDiners){
        foodPicked.numberOfDiners++;
          User.updateOne(
          { _id: req.session.currentUser._id },
          { $push: { "foodToEat": foodId }}, function(err, user){
            if (err){
             return next(err);
            }else{
              return res.status(202).send("updated footToEat");            }
          }
        );
      }else{
       return res.status(202).send("eres mongolo");
    }
    }
  });
})
router.get('/profile-books', (req,res,next) =>{
  //console.log(req.session.currentUser)
  let listOfFoodsToEat = [];
  User.findOne({_id:req.session.currentUser._id})
 // .populate("foodToCook")
  .populate("foodToEat")
  .exec((err,user) =>{
    if(!user){
      return next(err);
    }else{
      console.log(user.foodToEat);
      console.log(user.foodToCook);
      res.render('cookFood/profile',
      { tittle: 'Your books',
        listOfFoodsToEat: user.foodToEat });
    }
  })
})
router.get('/profile-cooks', (req,res,next) =>{
  //console.log(req.session.currentUser)
  let listOfFoodsToEat = [];
  User.findOne({_id:req.session.currentUser._id})
  .populate("foodToCook")
  //.populate("foodToEat")
  .exec((err,user) =>{
    if(!user){
      return next(err);
    }else{
      res.render('cookFood/profile',
      { tittle: 'Your cooks',
        listOfFoodsToEat: user.foodToCook });
    }
  })
})

module.exports = router;
