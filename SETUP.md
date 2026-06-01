# Recipe Finder - Complete Setup & Running Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud URL)
- npm or yarn

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Make sure `.env` file exists with:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/recipe_finder
JWT_SECRET=super_secret_recipe_finder_token_key_123
```

### 3. Seed Database (First Time Only)
```bash
node seed.js
```

This will:
- Connect to MongoDB and seed initial recipes & users
- If MongoDB fails, it will use local JSON file fallback (db.json)
- Create admin account: `admin@recipe.com` / `adminpassword`
- Create user account: `maryam@gmail.com` / `userpassword`

### 4. Start Backend Server
```bash
npm run dev
```
Backend runs on: **http://localhost:5001**

## Frontend Setup

### 1. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create `.env.local` with:
```env
VITE_API_URL=http://localhost:5001/api
VITE_APP_NAME=Zaiqa Pakistan
```

### 3. Start Frontend Dev Server
```bash
npm run dev
```
Frontend runs on: **http://localhost:5173**

## Testing the Application

### Login Credentials

**Admin Account:**
- Email: `admin@recipe.com`
- Password: `adminpassword`

**User Account:**
- Email: `maryam@gmail.com`
- Password: `userpassword`

### Test CRUD Operations

#### 1. **View Recipes**
- Go to Home page
- All recipes should display with images
- Search recipes using the search bar

#### 2. **Add Recipe (Admin Only)**
- Login with admin account
- Go to `/admin` (Admin Dashboard)
- Click "Add New Recipe"
- Fill in all fields
- Click "Save Recipe"

#### 3. **Edit Recipe**
- On Admin Dashboard
- Click edit icon next to recipe
- Modify fields
- Click "Save Recipe"

#### 4. **Delete Recipe**
- On Admin Dashboard
- Click trash icon next to recipe
- Confirm deletion

#### 5. **Add to Favorites**
- View any recipe detail page
- Click heart icon to add favorite
- Go to Favorites page to see saved recipes

#### 6. **Add Reviews**
- View recipe detail page
- Add rating and comment
- Submit review

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:** 
1. Ensure MongoDB is running: `mongod`
2. Or use local fallback (will use db.json automatically)

### Issue: "Images not loading"
**Solution:**
- Make sure backend is running
- Images are served from `backend/public/images/`
- Check browser console for 404 errors

### Issue: "Admin Dashboard not accessible"
**Solution:**
1. Make sure you're logged in with admin account
2. Admin role is auto-assigned for `admin@recipe.com`
3. Check JWT token in localStorage

### Issue: "CORS errors"
**Solution:**
- Backend has CORS configured for localhost:5173
- Ensure backend is running on port 5001
- Clear browser cache and restart dev servers

## Database Structure

### Recipe Model
```javascript
{
  idMeal: "pk001",
  strMeal: "Chicken Biryani",
  strCategory: "Rice",
  strArea: "Pakistani",
  strMealThumb: "/images/biryani.jpeg",
  strDescription: "...",
  strInstructions: "...",
  prepTime: "40 min",
  cookTime: "50 min",
  servings: "6",
  tags: ["biryani", "rice"],
  ingredients: [{ ingredient: "Basmati rice", measure: "500g" }],
  reviews: [{ userId, userName, rating, comment }],
  averageRating: 4.5
}
```

### User Model
```javascript
{
  name: "Admin Demo",
  email: "admin@recipe.com",
  password: "hashed",
  role: "admin", // or "user"
  favorites: ["pk001", "pk002"]
}
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/favorites` - Get user favorites
- `POST /api/auth/favorites/add` - Add to favorites
- `POST /api/auth/favorites/remove` - Remove from favorites

### Recipes (Admin CRUD)
- `GET /api/recipes?q=search` - Get all recipes (search optional)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (admin only)
- `PUT /api/recipes/:id` - Update recipe (admin only)
- `DELETE /api/recipes/:id` - Delete recipe (admin only)
- `POST /api/recipes/:id/reviews` - Add review

## Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
npm start
```

---

**Happy Cooking! 🍽️**
