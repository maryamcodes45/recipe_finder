import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe.js';
import { fallbackRecipes } from '../models/dbFallback.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_recipe_finder_token_key_123';

// Auth Middleware
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Admin Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// GET ALL RECIPES (Optional Search query '?q=...')
router.get('/', async (req, res) => {
  const { q } = req.query;
  try {
    let recipes;
    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (q) {
        const searchRegex = new RegExp(q, 'i');
        query = {
          $or: [
            { strMeal: searchRegex },
            { strCategory: searchRegex },
            { strDescription: searchRegex },
            { tags: searchRegex }
          ]
        };
      }
      recipes = await Recipe.find(query).sort({ createdAt: -1 });
    } else {
      let query = {};
      if (q) {
        const searchRegex = new RegExp(q, 'i');
        query = {
          $or: [
            { strMeal: searchRegex },
            { strCategory: searchRegex },
            { strDescription: searchRegex },
            { tags: searchRegex }
          ]
        };
      }
      recipes = await fallbackRecipes.find(query);
    }
    res.json(recipes);
  } catch (err) {
    console.error('Fetch recipes error:', err);
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
});

// GET RECIPE BY ID
router.get('/:id', async (req, res) => {
  try {
    let recipe;
    if (mongoose.connection.readyState === 1) {
      recipe = await Recipe.findOne({ idMeal: req.params.id });
    } else {
      recipe = await fallbackRecipes.findOne({ idMeal: req.params.id });
    }
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    console.error('Fetch single recipe error:', err);
    res.status(500).json({ message: 'Server error fetching recipe' });
  }
});

// CREATE RECIPE (Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  const {
    strMeal,
    strMealAlternate,
    strCategory,
    strArea,
    strMealThumb,
    strDescription,
    strInstructions,
    strYoutube,
    tags,
    prepTime,
    cookTime,
    servings,
    ingredients
  } = req.body;

  try {
    // Generate a unique idMeal
    const randomId = 'pk_' + Math.floor(100000 + Math.random() * 900000);
    const recipeData = {
      idMeal: randomId,
      strMeal,
      strMealAlternate: strMealAlternate || '',
      strCategory,
      strArea: strArea || 'Pakistani',
      strMealThumb: strMealThumb || '/images/default-recipe.jpg',
      strDescription: strDescription || '',
      strInstructions,
      strYoutube: strYoutube || '',
      tags: tags || [],
      prepTime: prepTime || '',
      cookTime: cookTime || '',
      servings: servings || '',
      ingredients: ingredients || [],
      reviews: []
    };

    let recipe;
    if (mongoose.connection.readyState === 1) {
      recipe = await Recipe.create(recipeData);
    } else {
      recipe = await fallbackRecipes.create(recipeData);
    }

    res.status(201).json(recipe);
  } catch (err) {
    console.error('Create recipe error:', err);
    res.status(500).json({ message: 'Server error creating recipe' });
  }
});

// UPDATE RECIPE (Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  const updateData = req.body;

  try {
    let recipe;
    if (mongoose.connection.readyState === 1) {
      recipe = await Recipe.findOne({ idMeal: req.params.id });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      recipe.strMeal = updateData.strMeal || recipe.strMeal;
      recipe.strMealAlternate = updateData.strMealAlternate !== undefined ? updateData.strMealAlternate : recipe.strMealAlternate;
      recipe.strCategory = updateData.strCategory || recipe.strCategory;
      recipe.strArea = updateData.strArea || recipe.strArea;
      recipe.strMealThumb = updateData.strMealThumb !== undefined ? updateData.strMealThumb : recipe.strMealThumb;
      recipe.strDescription = updateData.strDescription !== undefined ? updateData.strDescription : recipe.strDescription;
      recipe.strInstructions = updateData.strInstructions || recipe.strInstructions;
      recipe.strYoutube = updateData.strYoutube !== undefined ? updateData.strYoutube : recipe.strYoutube;
      recipe.tags = updateData.tags || recipe.tags;
      recipe.prepTime = updateData.prepTime || recipe.prepTime;
      recipe.cookTime = updateData.cookTime || recipe.cookTime;
      recipe.servings = updateData.servings || recipe.servings;
      recipe.ingredients = updateData.ingredients || recipe.ingredients;

      await recipe.save();
    } else {
      recipe = await fallbackRecipes.findOneAndUpdate(req.params.id, updateData);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
    }
    res.json(recipe);
  } catch (err) {
    console.error('Update recipe error:', err);
    res.status(500).json({ message: 'Server error updating recipe' });
  }
});

// DELETE RECIPE (Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    let recipe;
    if (mongoose.connection.readyState === 1) {
      recipe = await Recipe.findOneAndDelete({ idMeal: req.params.id });
    } else {
      recipe = await fallbackRecipes.findOneAndDelete(req.params.id);
    }
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error('Delete recipe error:', err);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
});

// ADD REVIEW & RATING
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Please provide a rating between 1 and 5 stars' });
  }
  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Please provide a comment' });
  }

  try {
    let recipe;
    if (mongoose.connection.readyState === 1) {
      recipe = await Recipe.findOne({ idMeal: req.params.id });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      // Check if user already reviewed this recipe
      const alreadyReviewed = recipe.reviews.find(
        (r) => r.userId.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this recipe' });
      }

      const review = {
        userId: req.user.id,
        userName: req.user.name,
        rating: Number(rating),
        comment: comment
      };

      recipe.reviews.push(review);
      await recipe.save();
    } else {
      recipe = await fallbackRecipes.findOne({ idMeal: req.params.id });
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }

      const alreadyReviewed = recipe.reviews && recipe.reviews.find(
        (r) => r.userId.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'You have already reviewed this recipe' });
      }

      const review = {
        userId: req.user.id,
        userName: req.user.name,
        rating: Number(rating),
        comment: comment
      };

      recipe = await fallbackRecipes.addReview(req.params.id, review);
    }

    res.status(201).json(recipe);
  } catch (err) {
    console.error('Add review error:', err);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

export default router;
