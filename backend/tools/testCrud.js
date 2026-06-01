const API = process.env.API_URL || 'http://localhost:5001/api';

async function run() {
  console.log('Running backend CRUD smoke test against', API);

  // Create a temporary admin user
  const adminEmail = `admin_demo_${Date.now()}@example.com`;
  const signupResp = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Crud Tester', email: adminEmail, password: 'password123' })
  });
  const signup = await signupResp.json();
  if (!signup.token) {
    console.error('Signup failed', signup);
    return process.exitCode = 1;
  }
  const token = signup.token;
  console.log('Signed up test admin:', adminEmail);

  // Create a recipe
  const newRecipe = {
    strMeal: 'Auto Test Dish',
    strCategory: 'Test',
    strArea: 'Pakistani',
    strMealThumb: '/images/biryani.jpeg',
    strInstructions: 'Test instructions',
    ingredients: [{ ingredient: 'Test', measure: '1' }]
  };

  const createResp = await fetch(`${API}/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(newRecipe)
  });
  const created = await createResp.json();
  if (createResp.status !== 201) {
    console.error('Create failed', created);
    return process.exitCode = 1;
  }
  console.log('Created recipe idMeal=', created.idMeal || created._id || '(no id)');

  // Update the recipe
  const updateResp = await fetch(`${API}/recipes/${created.idMeal || created._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ strMeal: 'Updated Auto Test Dish' })
  });
  const updated = await updateResp.json();
  if (updateResp.status !== 200) {
    console.error('Update failed', updated);
    return process.exitCode = 1;
  }
  console.log('Updated recipe ->', updated.strMeal || '(no name)');

  // Delete the recipe
  const delResp = await fetch(`${API}/recipes/${created.idMeal || created._id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  const delRes = await delResp.json();
  if (delResp.status !== 200) {
    console.error('Delete failed', delRes);
    return process.exitCode = 1;
  }
  console.log('Deleted recipe:', delRes.message || delRes);

  // List recipes
  const listResp = await fetch(`${API}/recipes`);
  const list = await listResp.json();
  console.log('Recipes count after test:', Array.isArray(list) ? list.length : '(not array)');

  console.log('CRUD smoke test completed successfully.');
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exitCode = 1;
});
