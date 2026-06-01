import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve('data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory and file exist
export function initLocalDB(defaultRecipes = [], defaultUsers = []) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    // Hash default user passwords if writing for the first time
    const seededUsers = defaultUsers.map(user => {
      const salt = bcrypt.genSaltSync(10);
      return {
        ...user,
        _id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
        password: bcrypt.hashSync(user.password, salt),
        createdAt: new Date().toISOString()
      };
    });
    const seededRecipes = defaultRecipes.map(r => ({
      ...r,
      _id: 'rec_' + Math.floor(100000 + Math.random() * 900000),
      reviews: [],
      averageRating: 0,
      createdAt: new Date().toISOString()
    }));
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: seededUsers, recipes: seededRecipes }, null, 2), 'utf8');
    console.log('Local DB Fallback initialized successfully.');
  }
}

function readData() {
  if (!fs.existsSync(DB_FILE)) {
    return { users: [], recipes: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    console.error('Error reading JSON DB file:', e);
    return { users: [], recipes: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing JSON DB file:', e);
  }
}

// RECIPE CRUD FALLBACKS
export const fallbackRecipes = {
  find: async (query = {}) => {
    const data = readData();
    let result = [...data.recipes];
    if (query.$or) {
      // Simple regex search matching model
      const regexes = query.$or.map(q => Object.values(q)[0]);
      result = result.filter(recipe => {
        return regexes.some(reg => {
          const pattern = new RegExp(reg.source, 'i');
          return pattern.test(recipe.strMeal) || 
                 pattern.test(recipe.strCategory) || 
                 pattern.test(recipe.strDescription) || 
                 (recipe.tags && recipe.tags.some(t => pattern.test(t)));
        });
      });
    }
    return result;
  },

  findOne: async (filter) => {
    const data = readData();
    const key = Object.keys(filter)[0];
    const val = filter[key];
    return data.recipes.find(r => r[key] === val) || null;
  },

  create: async (recipeData) => {
    const data = readData();
    const newRecipe = {
      ...recipeData,
      _id: 'rec_' + Math.floor(100000 + Math.random() * 900000),
      reviews: [],
      averageRating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.recipes.push(newRecipe);
    writeData(data);
    return newRecipe;
  },

  findOneAndUpdate: async (idMeal, updateBody) => {
    const data = readData();
    const idx = data.recipes.findIndex(r => r.idMeal === idMeal);
    if (idx === -1) return null;
    
    const updated = {
      ...data.recipes[idx],
      ...updateBody,
      updatedAt: new Date().toISOString()
    };
    data.recipes[idx] = updated;
    writeData(data);
    return updated;
  },

  findOneAndDelete: async (idMeal) => {
    const data = readData();
    const idx = data.recipes.findIndex(r => r.idMeal === idMeal);
    if (idx === -1) return null;
    const deleted = data.recipes[idx];
    data.recipes.splice(idx, 1);
    writeData(data);
    return deleted;
  },

  addReview: async (idMeal, review) => {
    const data = readData();
    const idx = data.recipes.findIndex(r => r.idMeal === idMeal);
    if (idx === -1) return null;

    const recipe = data.recipes[idx];
    if (!recipe.reviews) recipe.reviews = [];
    
    // Add unique ID to review
    const newReview = {
      ...review,
      _id: 'rev_' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString()
    };
    recipe.reviews.push(newReview);

    // Recompute average
    const sum = recipe.reviews.reduce((acc, r) => acc + r.rating, 0);
    recipe.averageRating = parseFloat((sum / recipe.reviews.length).toFixed(1));

    data.recipes[idx] = recipe;
    writeData(data);
    return recipe;
  }
};

// USER AUTH FALLBACKS
export const fallbackUsers = {
  findOne: async (filter) => {
    const data = readData();
    const key = Object.keys(filter)[0];
    const val = filter[key];
    return data.users.find(u => u[key] === val) || null;
  },

  findById: async (id) => {
    const data = readData();
    return data.users.find(u => u._id === id || u.id === id) || null;
  },

  create: async (userData) => {
    const data = readData();
    const salt = bcrypt.genSaltSync(10);
    const newUser = {
      ...userData,
      _id: 'usr_' + Math.floor(100000 + Math.random() * 900000),
      password: bcrypt.hashSync(userData.password, salt),
      favorites: [],
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },

  addFavorite: async (userId, recipeId) => {
    const data = readData();
    const idx = data.users.findIndex(u => u._id === userId || u.id === userId);
    if (idx === -1) return null;
    
    const user = data.users[idx];
    if (!user.favorites) user.favorites = [];
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
    }
    data.users[idx] = user;
    writeData(data);
    return user.favorites;
  },

  removeFavorite: async (userId, recipeId) => {
    const data = readData();
    const idx = data.users.findIndex(u => u._id === userId || u.id === userId);
    if (idx === -1) return null;

    const user = data.users[idx];
    if (!user.favorites) user.favorites = [];
    user.favorites = user.favorites.filter(id => id !== recipeId);
    data.users[idx] = user;
    writeData(data);
    return user.favorites;
  }
};
