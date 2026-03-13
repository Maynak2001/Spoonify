const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;

    const exists = await Favorite.findOne({
      userId: req.user._id,
      recipeId
    });

    if (exists) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    await Favorite.create({
      userId: req.user._id,
      recipeId
    });

    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      userId: req.user._id,
      recipeId: req.params.recipeId
    });

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .populate({
        path: 'recipeId',
        populate: [
          { path: 'userId', select: 'username avatarUrl' },
          { path: 'categoryId', select: 'name' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(favorites.map(f => f.recipeId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
