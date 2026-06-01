import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getLocalRecipeById } from '../services/localPakistaniRecipes';

// Extract base server URL from API_URL (remove /api if present)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '') || 'http://localhost:5001';

const getRecipeThumbnail = (recipe) => {
  if (!recipe) return '';
  
  // If strMealThumb is already a full URL (http/https), use it directly
  if (recipe.strMealThumb && recipe.strMealThumb.startsWith('http')) {
    return recipe.strMealThumb;
  }
  
  // If it's a backend path (/images/), prepend the server URL and encode
  if (recipe.strMealThumb && recipe.strMealThumb.startsWith('/images/')) {
    return encodeURI(`${API_BASE_URL}${recipe.strMealThumb}`);
  }
  
  // If it's a placeholder or empty, try to get from local recipes
  const isPlaceholder = typeof recipe.strMealThumb === 'string' && recipe.strMealThumb.includes('via.placeholder.com');
  if (isPlaceholder || !recipe.strMealThumb) {
    const localRecipe = getLocalRecipeById(recipe.idMeal);
    if (localRecipe?.strMealThumb) {
      return localRecipe.strMealThumb;
    }
  }

  return recipe.strMealThumb || '';
};

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  const thumbnail = getRecipeThumbnail(recipe);

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
      className="pk-region-card"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={thumbnail}
          alt={recipe.strMeal}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = encodeURI(`${API_BASE_URL}/images/biryani.jpeg`);
          }}
        />
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{recipe.strMeal}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {recipe.strCategory} • {recipe.strArea}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
