const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');

exports.addRating = async (req, res) => {
  try {
    const { recipeId, rating, review } = req.body;

    const existingRating = await Rating.findOne({
      recipeId,
      userId: req.user._id
    });

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
      await existingRating.save();
    } else {
      await Rating.create({
        recipeId,
        userId: req.user._id,
        rating,
        review
      });
    }

    const ratings = await Rating.find({ recipeId });
    const avgRating = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length;

    await Recipe.findByIdAndUpdate(recipeId, {
      averageRating: avgRating,
      ratingCount: ratings.length
    });

    res.json({ message: 'Rating added', averageRating: avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipeRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ recipeId: req.params.recipeId })
      .populate('userId', 'username avatarUrl')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
