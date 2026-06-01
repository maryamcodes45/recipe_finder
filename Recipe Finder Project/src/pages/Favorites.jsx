import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
  const { user } = useAuth();
  const favorites = user?.favorites || [];

  return (
    <div className="page-wrap">
      <h1 className="hero-title" style={{ marginBottom: '1.5rem' }}>
        Your Pakistani picks
      </h1>
      {favorites.length === 0 ? (
        <div
          className="glass"
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            color: 'var(--text-on-dark)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <p style={{ marginBottom: '0.75rem', fontSize: '1.05rem' }}>No saved recipes yet.</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Explore the home page and tap the heart on dishes you love — you need to be logged in.
          </p>
          <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            Browse recipes
          </Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
