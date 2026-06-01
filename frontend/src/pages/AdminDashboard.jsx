
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  
  // Form fields
  const [strMeal, setStrMeal] = useState('');
  const [strMealAlternate, setStrMealAlternate] = useState('');
  const [strCategory, setStrCategory] = useState('Curry');
  const [strArea, setStrArea] = useState('Pakistani');
  const [strMealThumb, setStrMealThumb] = useState('');
  const [strDescription, setStrDescription] = useState('');
  const [strInstructions, setStrInstructions] = useState('');
  const [strYoutube, setStrYoutube] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [ingredients, setIngredients] = useState([{ ingredient: '', measure: '' }]);
  const [formError, setFormError] = useState('');

  // API base for serving images when recipe.strMealThumb is a backend path
  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace('/api', '') || 'http://localhost:5001';

  const getThumbnail = (recipe) => {
    if (!recipe) return '';
    if (recipe.strMealThumb && recipe.strMealThumb.startsWith('http')) return recipe.strMealThumb;
    if (recipe.strMealThumb && recipe.strMealThumb.startsWith('/images/')) return encodeURI(`${API_BASE_URL}${recipe.strMealThumb}`);
    return recipe.strMealThumb || '';
  };

  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRecipes();
  }, [user, navigate]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRecipe(null);
    setStrMeal('');
    setStrMealAlternate('');
    setStrCategory('Curry');
    setStrArea('Pakistani');
    setStrMealThumb('');
    setStrDescription('');
    setStrInstructions('');
    setStrYoutube('');
    setPrepTime('');
    setCookTime('');
    setServings('');
    setTagsInput('');
    setIngredients([{ ingredient: '', measure: '' }]);
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe);
    setStrMeal(recipe.strMeal || '');
    setStrMealAlternate(recipe.strMealAlternate || '');
    setStrCategory(recipe.strCategory || 'Curry');
    setStrArea(recipe.strArea || 'Pakistani');
    setStrMealThumb(recipe.strMealThumb || '');
    setStrDescription(recipe.strDescription || '');
    setStrInstructions(recipe.strInstructions || '');
    setStrYoutube(recipe.strYoutube || '');
    setPrepTime(recipe.prepTime || '');
    setCookTime(recipe.cookTime || '');
    setServings(recipe.servings || '');
    setTagsInput(recipe.tags ? recipe.tags.join(', ') : '');
    setIngredients(recipe.ingredients && recipe.ingredients.length > 0 
      ? recipe.ingredients.map(i => ({ ingredient: i.ingredient, measure: i.measure }))
      : [{ ingredient: '', measure: '' }]
    );
    setFormError('');
    setShowModal(true);
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { ingredient: '', measure: '' }]);
  };

  const removeIngredientRow = (index) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!strMeal.trim() || !strInstructions.trim()) {
      setFormError('Recipe Name and Instructions are required.');
      return;
    }

    // Clean ingredients
    const cleanedIngredients = ingredients.filter(i => i.ingredient.trim() !== '');

    const recipeData = {
      strMeal,
      strMealAlternate,
      strCategory,
      strArea,
      strMealThumb,
      strDescription,
      strInstructions,
      strYoutube,
      prepTime,
      cookTime,
      servings,
      tags: tagsInput.split(',').map(t => t.trim()).filter(t => t !== ''),
      ingredients: cleanedIngredients
    };

    try {
      if (editingRecipe) {
        await apiService.updateRecipe(editingRecipe.idMeal, recipeData);
      } else {
        await apiService.createRecipe(recipeData);
      }
      setShowModal(false);
      fetchRecipes();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to save recipe.');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await apiService.deleteRecipe(id);
        fetchRecipes();
      } catch (err) {
        console.error(err);
        alert('Failed to delete recipe.');
      }
    }
  };

  // Stats calculation
  const totalRecipes = recipes.length;
  const totalReviews = recipes.reduce((acc, r) => acc + (r.reviews?.length || 0), 0);
  
  // Find top category
  const categoriesCount = recipes.reduce((acc, r) => {
    if (r.strCategory) {
      acc[r.strCategory] = (acc[r.strCategory] || 0) + 1;
    }
    return acc;
  }, {});
  let topCategory = 'N/A';
  let maxCount = 0;
  Object.keys(categoriesCount).forEach(cat => {
    if (categoriesCount[cat] > maxCount) {
      maxCount = categoriesCount[cat];
      topCategory = cat;
    }
  });

  const filteredRecipes = recipes.filter(r => 
    r.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.strCategory && r.strCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="hero-title" style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your Pakistani recipes database</p>
        </div>
        <button className="btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPlus /> Add New Recipe
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TOTAL RECIPES</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>{totalRecipes}</h3>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TOTAL REVIEWS</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#eab308', marginTop: '0.5rem' }}>{totalReviews}</h3>
        </div>
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>TOP CATEGORY</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', marginTop: '0.5rem' }}>{topCategory}</h3>
        </div>
      </div>

      {/* Recipes Management List */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Manage Recipes</h2>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '0.4rem 0.8rem', width: '100%', maxWidth: '300px' }}>
            <FaSearch style={{ color: '#94a3b8', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading recipes...</p>
        ) : filteredRecipes.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No recipes found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>IMAGE</th>
                  <th style={{ padding: '1rem 0.5rem' }}>NAME</th>
                  <th style={{ padding: '1rem 0.5rem' }}>CATEGORY</th>
                  <th style={{ padding: '1rem 0.5rem' }}>CUISINE</th>
                  <th style={{ padding: '1rem 0.5rem' }}>RATING</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecipes.map((recipe) => (
                  <tr key={recipe.idMeal} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem' }}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <img
                        src={getThumbnail(recipe)}
                        alt={recipe.strMeal}
                        style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = encodeURI(`${API_BASE_URL}/images/biryani.jpeg`); }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{recipe.strMeal}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{recipe.strCategory}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{recipe.strArea}</td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#eab308', fontWeight: 700 }}>
                      {recipe.averageRating > 0 ? `★ ${recipe.averageRating}` : 'No ratings'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                          onClick={() => openEditModal(recipe)}
                          style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '1.1rem' }}
                          title="Edit Recipe"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(recipe.idMeal, recipe.strMeal)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}
                          title="Delete Recipe"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {showModal && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '1.5rem',
              overflowY: 'auto'
            }}
          >
            <Motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: 'white',
                borderRadius: '15px',
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                <FaTimes />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
                {editingRecipe ? 'Edit Pakistani Recipe' : 'Add New Pakistani Recipe'}
              </h2>

              {formError && (
                <div style={{ color: '#dc2626', background: 'rgba(220,38,38,0.1)', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Recipe Name *</label>
                    <input
                      type="text"
                      value={strMeal}
                      onChange={(e) => setStrMeal(e.target.value)}
                      required
                      placeholder="e.g. Peshawari Karahi"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Alternate / Urdu Name</label>
                    <input
                      type="text"
                      value={strMealAlternate}
                      onChange={(e) => setStrMealAlternate(e.target.value)}
                      placeholder="e.g. پشاورى کڑاہی"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
                    <select
                      value={strCategory}
                      onChange={(e) => setStrCategory(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Curry">Curry</option>
                      <option value="Rice">Rice</option>
                      <option value="Kebab">Kebab</option>
                      <option value="Stew">Stew</option>
                      <option value="Grill">Grill</option>
                      <option value="Lentils">Lentils</option>
                      <option value="Bread">Bread</option>
                      <option value="Snack">Snack</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Vegetable">Vegetable</option>
                      <option value="Beverage">Beverage</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Cuisine Area</label>
                    <input
                      type="text"
                      value={strArea}
                      onChange={(e) => setStrArea(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={strMealThumb}
                    onChange={(e) => setStrMealThumb(e.target.value)}
                    placeholder="e.g. /images/beef-nihari.jpg or https://image-url"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description</label>
                  <textarea
                    rows="3"
                    value={strDescription}
                    onChange={(e) => setStrDescription(e.target.value)}
                    placeholder="Brief description about the recipe..."
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Prep Time</label>
                    <input
                      type="text"
                      value={prepTime}
                      onChange={(e) => setPrepTime(e.target.value)}
                      placeholder="e.g. 20 min"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Cook Time</label>
                    <input
                      type="text"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      placeholder="e.g. 45 min"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Servings</label>
                    <input
                      type="text"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      placeholder="e.g. 4"
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>YouTube Video URL</label>
                  <input
                    type="text"
                    value={strYoutube}
                    onChange={(e) => setStrYoutube(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. nihari, curry, spicy"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                {/* Ingredients dynamic section */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ingredients List</label>
                  {ingredients.map((ing, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Ingredient (e.g. Mutton)"
                        value={ing.ingredient}
                        onChange={(e) => handleIngredientChange(idx, 'ingredient', e.target.value)}
                        style={{ flex: 2, padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        placeholder="Measure (e.g. 500g)"
                        value={ing.measure}
                        onChange={(e) => handleIngredientChange(idx, 'measure', e.target.value)}
                        style={{ flex: 1, padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeIngredientRow(idx)}
                        disabled={ingredients.length === 1}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: ingredients.length === 1 ? '#cbd5e1' : '#ef4444',
                          cursor: ingredients.length === 1 ? 'not-allowed' : 'pointer',
                          fontSize: '1rem',
                          padding: '0.5rem'
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredientRow}
                    style={{
                      border: '1px dashed var(--primary)',
                      background: 'none',
                      color: 'var(--primary)',
                      borderRadius: '8px',
                      padding: '0.4rem 1rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '0.25rem',
                      fontWeight: 600
                    }}
                  >
                    <FaPlus /> Add Ingredient
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>Instructions *</label>
                  <textarea
                    rows="6"
                    value={strInstructions}
                    onChange={(e) => setStrInstructions(e.target.value)}
                    required
                    placeholder="Step-by-step instructions..."
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '0.65rem 1.5rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '0.65rem 1.75rem' }}
                  >
                    Save Recipe
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
