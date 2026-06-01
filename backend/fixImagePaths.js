import fs from 'fs';
import path from 'path';

// Read the db.json file
const dbPath = './data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Update image paths to use /images/ instead of /src/images/
data.recipes = data.recipes.map(recipe => {
    if (recipe.strMealThumb && recipe.strMealThumb.startsWith('/src/images/')) {
        recipe.strMealThumb = recipe.strMealThumb.replace('/src/images/', '/images/');
    }
    return recipe;
});

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
console.log('✅ Updated image paths in db.json');