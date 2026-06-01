import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { getLocalRecipeById } from '../services/localPakistaniRecipes';
import { useAuth } from '../context/AuthContext';
import { FaYoutube, FaArrowLeft, FaClock, FaUsers, FaHeart, FaRegHeart } from 'react-icons/fa';

function normalizeRecipe(raw) {
  if (!raw) return null;
  const base = {
    idMeal: raw.idMeal,
    strMeal: raw.strMeal,
    strMealAlternate: raw.strMealAlternate || '',
    strCategory: raw.strCategory,
    strArea: raw.strArea || 'Pakistani',
    strTags: raw.strTags || '',
    strMealThumb: raw.strMealThumb,
    strDescription: raw.strDescription || '',
    strInstructions: raw.strInstructions,
    strYoutube: raw.strYoutube || '',
    tags: raw.tags || [],
    prepTime: raw.prepTime || '',
    cookTime: raw.cookTime || '',
    servings: raw.servings || '',
    reviews: raw.reviews || [],
    averageRating: raw.averageRating || 0,
  };
  if (raw.ingredients && Array.isArray(raw.ingredients)) {
    raw.ingredients.forEach((row, idx) => {
      const n = idx + 1;
      if (n > 20) return;
      base[`strIngredient${n}`] = row.ingredient;
      base[`strMeasure${n}`] = row.measure || '';
    });
  }
  return base;
}

const RecipeDetail = () => {
  const { id } = useParams();
  const { user, addFavorite, removeFavorite, isFavorite } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const navigate = useNavigate();

  // Resolve thumbnail URLs similar to other components (backend /images paths and encoding)
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '') || 'http://localhost:5001';
  const getRecipeThumbnail = (recipeData) => {
    if (!recipeData) return '';
    const isPlaceholder = typeof recipeData.strMealThumb === 'string' && recipeData.strMealThumb.includes('via.placeholder.com');
    if (isPlaceholder || !recipeData.strMealThumb) {
      const localRecipe = getLocalRecipeById(recipeData.idMeal);
      if (localRecipe?.strMealThumb) {
        return localRecipe.strMealThumb;
      }
    }
    if (recipeData.strMealThumb && recipeData.strMealThumb.startsWith('/images/')) {
      return encodeURI(`${API_BASE_URL}${recipeData.strMealThumb}`);
    }
    return recipeData.strMealThumb || '';
  };

  const loadRecipe = useCallback(async () => {
    if (!id) {
      setError('No recipe ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRecipeById(id);
      if (!data) {
        setError('Recipe not found');
      } else {
        setRecipe(normalizeRecipe(data));
      }
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);
    
    try {
      const updated = await apiService.addReview(id, rating, comment);
      setRecipe(normalizeRecipe(updated));
      setComment('');
      setRating(5);
      setReviewSuccess('Review added successfully!');
    } catch (err) {
      console.error(err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

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

  const thumbnail = getRecipeThumbnail(recipe);

  return (
    <div className="page-wrap">
      <button type="button" className="btn-ghost" style={{ marginBottom: '1rem' }} onClick={() => navigate(-1)}>
        <FaArrowLeft aria-hidden /> Back
      </button>

      <p className="glass pk-detail-note">
        Curated <strong>Pakistani</strong> recipe in <Link to="/" className="pk-inline-link">Zaiqa Pakistan</Link> — full ingredients & steps below.
      </p>

      <div className="recipe-detail-shell">
        <div className="recipe-detail-grid">
          <img
            src={thumbnail}
            alt={recipe.strMeal}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', maxHeight: 420 }}
          />
          <div>
            {recipe.strMealAlternate ? (
              <p style={{ color: '#059669', fontWeight: 700, marginBottom: '0.35rem', fontSize: '1.1rem' }}>
                {recipe.strMealAlternate}
              </p>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {recipe.strMeal}
              </h1>
              {user && (
                <button
                  type="button"
                  onClick={() => isFavorite(recipe.idMeal) ? removeFavorite(recipe.idMeal) : addFavorite(recipe.idMeal)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.75rem',
                    color: isFavorite(recipe.idMeal) ? '#ef4444' : '#cbd5e1',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem',
                    transition: 'transform 0.1s ease',
                  }}
                  title={isFavorite(recipe.idMeal) ? "Remove from Favorites" : "Add to Favorites"}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isFavorite(recipe.idMeal) ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </div>

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

        {/* Reviews and Ratings Section */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            User Reviews & Comments ({recipe.reviews?.length || 0})
            {recipe.averageRating > 0 && (
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#eab308', background: 'rgba(234,179,8,0.1)', padding: '0.2rem 0.6rem', borderRadius: '8px', marginLeft: '0.5rem' }}>
                ★ {recipe.averageRating} / 5
              </span>
            )}
          </h2>

          {/* Review Submission Form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="glass" style={{ padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Write a Review</h3>
              
              {reviewError && (
                <div style={{ color: '#dc2626', background: 'rgba(220,38,38,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div style={{ color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem' }}>
                  {reviewSuccess}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '2rem',
                        color: star <= rating ? '#eab308' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Your Comment</label>
                <textarea
                  id="comment"
                  rows="4"
                  placeholder="Share your experience cooking this Pakistani dish..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                Submit Review
              </button>
            </form>
          ) : (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px', marginBottom: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You must be logged in to leave a review.</p>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>Log In</Link>
            </div>
          )}

          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recipe.reviews && recipe.reviews.length > 0 ? (
              recipe.reviews.map((r, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#0f172a' }}>{r.userName}</strong>
                    <span style={{ color: '#eab308', fontWeight: 700 }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6 }}>{r.comment}</p>
                  {r.createdAt && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: '0.5rem' }}>
                      {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first to review this recipe!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
