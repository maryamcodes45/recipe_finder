import { PAKISTANI_RECIPES_RAW } from '../data/pakistaniRecipesFull';

/** Flattens ingredients into TheMealDB-style strIngredientN / strMeasureN for UI reuse */
export function normalizeRecipe(raw) {
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
  };
  raw.ingredients.forEach((row, idx) => {
    const n = idx + 1;
    if (n > 20) return;
    base[`strIngredient${n}`] = row.ingredient;
    base[`strMeasure${n}`] = row.measure || '';
  });
  return base;
}

const CACHE = PAKISTANI_RECIPES_RAW.map(normalizeRecipe);

export function getAllLocalRecipes() {
  return CACHE;
}

export function getLocalRecipeById(id) {
  return CACHE.find((r) => r.idMeal === id) || null;
}

export function searchLocalRecipes(query) {
  const q = query.trim().toLowerCase();
  if (!q) return CACHE;
  return CACHE.filter((r) => {
    const blob = [
      r.strMeal,
      r.strMealAlternate,
      r.strDescription,
      r.strTags,
      r.strCategory,
      r.strInstructions,
    ]
      .join(' ')
      .toLowerCase();
    return blob.includes(q);
  });
}

export function filterByQuickTag(tag) {
  if (!tag) return CACHE;
  return CACHE.filter((r) => r.tags && r.tags.includes(tag));
}

export function randomLocalRecipe() {
  if (CACHE.length === 0) return null;
  return CACHE[Math.floor(Math.random() * CACHE.length)];
}

export const LOCAL_RECIPE_COUNT = CACHE.length;
