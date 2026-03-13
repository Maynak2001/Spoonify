const express = require('express');
const { addRating, getRecipeRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, addRating);
router.get('/:recipeId', getRecipeRatings);

module.exports = router;
