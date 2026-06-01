import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Automatic token attachment from localStorage
const storedToken = localStorage.getItem('token');
if (storedToken) {
    setAuthToken(storedToken);
}

export const apiService = {
    // Auth API
    login: async(email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            setAuthToken(data.token);
        }
        return data;
    },

    signup: async(name, email, password) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            setAuthToken(data.token);
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        setAuthToken(null);
    },

    // Favorites API
    getFavorites: async() => {
        const { data } = await api.get('/auth/favorites');
        return data;
    },

    addFavorite: async(recipeId) => {
        const { data } = await api.post('/auth/favorites/add', { recipeId });
        return data;
    },

    removeFavorite: async(recipeId) => {
        const { data } = await api.post('/auth/favorites/remove', { recipeId });
        return data;
    },

    // Recipes API
    getRecipes: async(query = '') => {
        const { data } = await api.get(`/recipes?q=${query}`);
        return data;
    },

    getRecipeById: async(id) => {
        const safeId = encodeURIComponent(id);
        const { data } = await api.get(`/recipes/${safeId}`);
        return data;
    },

    createRecipe: async(recipeData) => {
        const { data } = await api.post('/recipes', recipeData);
        return data;
    },

    updateRecipe: async(id, recipeData) => {
        const { data } = await api.put(`/recipes/${id}`, recipeData);
        return data;
    },

    deleteRecipe: async(id) => {
        const { data } = await api.delete(`/recipes/${id}`);
        return data;
    },

    addReview: async(id, rating, comment) => {
        const { data } = await api.post(`/recipes/${id}/reviews`, { rating, comment });
        return data;
    },
};