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
   //req.session.currentUser.foodToCook.push()

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
      console.log(theFood);
        //req.session.currentUser.foodToCook.push(newFood._id).update((err)=>{
          User.updateOne(
            { _id: req.session.currentUser._id },
            { $push: { "foodToCook": theFood._id }}, function(err, user){
              if (err) return next(err);
               res.redirect('/');
               return;
            }
          );
        //res.redirect(`/${newFood._id}`);
      }
  })
});

/*router.get('/:id', (req, res, next) => {
  food.findById(req.params.id, (err, food) => {
    if (err){ return next(err); }

    food.populate('_creator', (err, food) => {
      if (err){ return next(err); }
      return res.render('foods/show', { food });
    });
  });
});*/

/*router.get('/:id/edit', [
    ensureLoggedIn('/login'),
    authorizeFood
  ], (req, res, next) => {
  food.findById(req.params.id, (err, food) => {
    if (err)       { return next(err) }
    if (!food) { return next(new Error("404")) }
    return res.render('foods/edit', { food})
  });
});*/






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
      }else{}
      return res.status(202).send("eres mongolo");
    }
});
})

router.get('/profile', (req,res,next) =>{
  console.log(req.session.currentUser)
  User
  .findOne({_id: req.session.currentUser._id})
  .exec((err,user)=>{
    if(!user){
      return next(err);
    }else{
      console.log(user)
      let listOfFoodsToEat = [];
      if(user.foodToEat.length !== 0){
        user.foodToEat.map((item) =>{
          Food.find({id: item})
          .sort({date: -1})
          .exec((err, foods)=>{
            listOfFoodsToEat.add(foods);
            console.log(listOfFoodsToEat)
          });
        }); 
      }
      console.log('kjdsadjdhfdj')
      res.render('cookFood/profile',{
        name : user.name,
       listOfFoods:listOfFoodsToEat
      });
    }
    
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



/*  Food.findByIdAndUpdate(req.params.id, updates, (err, food) => {
    if (err)       { return res.render('foods/edit', { food, errors: food.errors }); }
    if (!food) { return next(new Error("404")); }
    return res.redirect(`/foods/${food._id}`);
  });*/
});



module.exports = router;
