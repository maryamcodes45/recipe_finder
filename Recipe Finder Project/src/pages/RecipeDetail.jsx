import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getLocalRecipeById } from '../services/localPakistaniRecipes';
import { FaYoutube, FaArrowLeft, FaClock, FaUsers } from 'react-icons/fa';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('local');
  const navigate = useNavigate();

  const loadRecipe = useCallback(async () => {
    if (!id) {
      setError('No recipe ID provided');
      setLoading(false);
      return;
    }

    const local = getLocalRecipeById(id);
    if (local) {
      setRecipe(local);
      setSource('local');
      setError(null);
      setLoading(false);
      return;
    }

    const numericApi = /^\d+$/.test(id);
    if (!numericApi) {
      setError('Recipe not found');
      setRecipe(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSource('api');
      const data = await api.getRecipeById(id);
      if (!data) setError('Recipe not found');
      else setRecipe(data);
    } catch (err) {
      setError('Failed to load recipe. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ing && ing.trim()) {
        ingredients.push({ ingredient: ing, measure: measure || '' });
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="loading-text">Loading recipe…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrap" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-on-dark)', marginBottom: '1rem' }}>{error}</p>
        <button type="button" className="btn-ghost" onClick={() => navigate('/')}>
          Go home
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="page-wrap">
        <p className="empty-hint">Recipe not found</p>
      </div>
    );
  }

  const isLocal = source === 'local';

  return (
    <div className="page-wrap">
      <button type="button" className="btn-ghost" style={{ marginBottom: '1rem' }} onClick={() => navigate(-1)}>
        <FaArrowLeft aria-hidden /> Back
      </button>

      <p className="glass pk-detail-note">
        {isLocal ? (
          <>
            Curated <strong>Pakistani</strong> recipe in <Link to="/" className="pk-inline-link">Zaiqa Pakistan</Link> — full ingredients & steps below.
          </>
        ) : (
          <>
            Recipe source: <strong>{recipe.strArea}</strong> (TheMealDB). More dishes on{' '}
            <Link to="/" className="pk-inline-link">Zaiqa Pakistan</Link>.
          </>
        )}
      </p>

      <div className="recipe-detail-shell">
        <div className="recipe-detail-grid">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 420 }}
          />
          <div>
            {recipe.strMealAlternate ? (
              <p style={{ color: '#059669', fontWeight: 700, marginBottom: '0.35rem', fontSize: '1.1rem' }}>
                {recipe.strMealAlternate}
              </p>
            ) : null}
            <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {recipe.strMeal}
            </h1>

            {recipe.strDescription ? (
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>{recipe.strDescription}</p>
            ) : null}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {recipe.prepTime ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <FaClock aria-hidden /> Prep: {recipe.prepTime}
                </span>
              ) : null}
              {recipe.cookTime ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <FaClock aria-hidden /> Cook: {recipe.cookTime}
                </span>
              ) : null}
              {recipe.servings ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.9rem' }}>
                  <FaUsers aria-hidden /> Serves: {recipe.servings}
                </span>
              ) : null}
            </div>

            <p style={{ marginBottom: '0.5rem', color: '#475569' }}>
              <strong>Category:</strong> {recipe.strCategory}
            </p>
            <p style={{ marginBottom: '0.5rem', color: '#475569' }}>
              <strong>Cuisine:</strong> {recipe.strArea}
            </p>
            {recipe.strTags && (
              <p style={{ marginBottom: '0.5rem', color: '#475569' }}>
                <strong>Tags:</strong> {recipe.strTags}
              </p>
            )}
            {recipe.strYoutube && (
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  padding: '0.55rem 1rem',
                  background: '#dc2626',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}
              >
                <FaYoutube aria-hidden /> Watch on YouTube
              </a>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Ingredients</h2>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.65rem',
              listStyle: 'none',
            }}
          >
            {getIngredients().map((item, idx) => (
              <li
                key={idx}
                style={{
                  color: '#334155',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0.65rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <strong style={{ color: '#0f172a' }}>{item.measure}</strong>
                {' '}
                {item.ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Instructions</h2>
          <p style={{ lineHeight: 1.8, color: '#334155', whiteSpace: 'pre-wrap' }}>{recipe.strInstructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
