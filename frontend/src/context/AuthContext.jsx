import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

// Hook is colocated with provider for this small app (react-refresh prefers components-only files).
// eslint-disable-next-line react-refresh/only-export-components -- context hook must live with provider
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    try {
      const data = await apiService.signup(name, email, password);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error('Signup context error:', err);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiService.login(email, password);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error('Login context error:', err);
      return false;
    }
  };

  const logout = () => {
    apiService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  const addFavorite = async (recipe) => {
    if (!user) return;
    const recipeId = recipe?.idMeal || recipe;
    try {
      const updatedFavorites = await apiService.addFavorite(recipeId);
      const updatedUser = { ...user, favorites: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Add favorite context error:', err);
    }
  };

  const removeFavorite = async (recipeId) => {
    if (!user) return;
    try {
      const updatedFavorites = await apiService.removeFavorite(recipeId);
      const updatedUser = { ...user, favorites: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Remove favorite context error:', err);
    }
  };

  const isFavorite = (recipeId) => {
    return user?.favorites?.includes(recipeId) || false;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};