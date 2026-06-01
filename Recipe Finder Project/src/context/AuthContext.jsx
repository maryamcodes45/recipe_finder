import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Hook is colocated with provider for this small app (react-refresh prefers components-only files).
// eslint-disable-next-line react-refresh/only-export-components -- context hook must live with provider
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const signup = (email, password, name) => {
    const userData = { email, name, favorites: [] };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem(`password_${email}`, password);
    setUser(userData);
    return true;
  };

  const login = (email, password) => {
    const storedPassword = localStorage.getItem(`password_${email}`);
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedPassword === password && JSON.parse(storedUser).email === email) {
      setUser(JSON.parse(storedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const addFavorite = (recipe) => {
    if (user && !user.favorites.some(fav => fav.idMeal === recipe.idMeal)) {
      const updated = { ...user, favorites: [...user.favorites, recipe] };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const removeFavorite = (recipeId) => {
    if (user) {
      const updated = { ...user, favorites: user.favorites.filter(fav => fav.idMeal !== recipeId) };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  const isFavorite = (recipeId) => user?.favorites?.some(fav => fav.idMeal === recipeId) || false;

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};