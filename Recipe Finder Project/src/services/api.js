import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const api = {
    searchRecipes: async(query) => {
        const { data } = await axios.get(`${BASE_URL}/search.php?s=${query}`);
        return data.meals || [];
    },
    getRecipeById: async(id) => {
        const { data } = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
        return data.meals ? data.meals[0] : null;
    },
    getCategories: async() => {
        const { data } = await axios.get(`${BASE_URL}/categories.php`);
        return data.categories || [];
    },
    getRecipesByCategory: async(category) => {
        const { data } = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
        return data.meals || [];
    },
    getRandomRecipe: async() => {
        const { data } = await axios.get(`${BASE_URL}/random.php`);
        return data.meals ? data.meals[0] : null;
    }
};