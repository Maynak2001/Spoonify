const Recipe = require('../models/Recipe');
const cloudinary = require('../config/cloudinary');

exports.createRecipe = async (req, res) => {
  try {
    let imageUrl = '';
    
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'spoonify/recipes' },
          (error, result) => {
            if (error) reject(error);
            else { imageUrl = result.secure_url; resolve(); }
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const recipe = await Recipe.create({
      ...req.body,
      imageUrl,
      userId: req.user._id,
      ingredients: JSON.parse(req.body.ingredients),
      instructions: JSON.parse(req.body.instructions)
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const { category, difficulty, search, userId, page = 1, limit = 50 } = req.query;
    const query = {};

    if (category) query.categoryId = category;
    if (difficulty) query.difficulty = difficulty.toLowerCase();
    if (search) query.$text = { $search: search };
    if (userId) query.userId = userId;

    const recipes = await Recipe.find(query)
      .populate('userId', 'username avatarUrl')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Recipe.countDocuments(query);

    res.json({
      recipes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('userId', 'username avatarUrl fullName')
      .populate('categoryId', 'name');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let imageUrl = recipe.imageUrl;
    
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'spoonify/recipes' },
          (error, result) => {
            if (error) reject(error);
            imageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        imageUrl,
        ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : recipe.ingredients,
        instructions: req.body.instructions ? JSON.parse(req.body.instructions) : recipe.instructions,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
