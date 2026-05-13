import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
      className="pk-region-card"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
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
