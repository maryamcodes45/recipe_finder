import { api } from './api';
import { PAKISTANI_DISCOVERY_TERMS } from '../data/pakistaniFood';

function mergeUniqueMeals(arrays) {
  const map = new Map();
  for (const list of arrays) {
    if (!list) continue;
    for (const meal of list) {
      if (meal?.idMeal) map.set(meal.idMeal, meal);
    }
  }
  return [...map.values()];
}

/** Aggregates several searches to mimic a “Pakistani discovery” feed. */
export async function fetchPakistaniDiscovery(limit = 30) {
  const results = await Promise.all(
    PAKISTANI_DISCOVERY_TERMS.map((term) => api.searchRecipes(term))
  );
  return mergeUniqueMeals(results).slice(0, limit);
}

/** One random-ish pick from discovery pool (reshuffles client-side). */
export async function fetchPakistaniSpotlight() {
  const pool = await fetchPakistaniDiscovery(40);
  if (pool.length === 0) return null;
  const i = Math.floor(Math.random() * pool.length);
  return pool[i];
}

export async function searchPakistani(query) {
  return api.searchRecipes(query);
}
