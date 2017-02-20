const Food = require('../models/food.js');

function authorizeFood(req, res, next){
  Food.findById(req.params.id, (err, food) => {
    // If there's an error, forward it
    if (err)      { return next(err) }
    // If there is no food, return a 404
    if (!food){ return next(new Error('404')) }
    // If the food belongs to the user, next()
    if (food.belongsTo(req.user)){
      return next()
    } else {
      return res.redirect(`/foods/${food._id}`)
    }
  });
}
function checkOwnership(req, res, next){
  Food.findById(req.params.id, (err, food) => {
    if (err){ return next(err) }
    if (!food){ return next(new Error('404')) }

    if (food.belongsTo(req.user)){
      res.locals.foodIsCurrentUsers = true;
    } else {
      res.locals.foodIsCurrentUsers = false;
    }
    return next()
  });
}

module.exports = {
  authorizeFood,
  checkOwnership
};  