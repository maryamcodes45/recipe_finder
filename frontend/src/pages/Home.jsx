import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion as Motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import PakistanHero from '../components/PakistanHero';
import PakistaniDishChips from '../components/PakistaniDishChips';

const Home = () => {
  const recipesRef = useRef(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChipId, setSelectedChipId] = useState(null);
  const [error, setError] = useState(null);

  const scrollToRecipes = () => {
    recipesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const loadDiscovery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getRecipes();
      setRecipes(data);
      setSelectedChipId(null);
    } catch (e) {
      console.error(e);
      setError('Could not load recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscovery();
  }, [loadDiscovery]);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setSelectedChipId(null);
    try {
      const data = await apiService.getRecipes(query);
      setRecipes(data);
    } catch (e) {
      console.error(e);
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChipSelect = async (chip) => {
    setLoading(true);
    setError(null);
    setSelectedChipId(chip.id);
    try {
      const data = await apiService.getRecipes(chip.tag);
      setRecipes(data);
    } catch (e) {
      console.error(e);
      setError('Could not filter recipes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PakistanHero onExploreClick={scrollToRecipes} />
      <div className="page-wrap">
        <section ref={recipesRef} id="recipes">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              Our Recipe Collection
            </h2>
            <SearchBar onSearch={handleSearch} />
          </div>

          <PakistaniDishChips selectedId={selectedChipId} onSelect={handleChipSelect} />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
