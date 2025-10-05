    const BIN_ID = "68e1aa3dd0ea881f40957eb0"; // e.g. 6719e70fabc123456789abcd
    const API_KEY = "$2a$10$oPLF86wNe14gxbkuTwwH1OGQtfg2prfS0vl1AYNOhK/UNll28PcrK"; // from your JSONBin dashboard
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/68e1aa3dd0ea881f40957eb0`;

    const recipeForm = document.getElementById('recipeForm');
    const recipeList = document.getElementById('recipeList');
    const pantryInput = document.getElementById('pantryInput');
    const filterBtn = document.getElementById('filterBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    // Load recipes from localStorage or start empty
    let recipes = [];

async function loadRecipes() {
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    recipes = data.record || [];
    displayRecipes();
  } catch (error) {
    console.error("Error loading recipes:", error);
    recipeList.innerHTML = "<p>⚠️ Couldn't load recipes. Try again later.</p>";
  }
}

async function saveRecipes() {
  try {
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(recipes)
    });
  } catch (error) {
    console.error("Error saving recipes:", error);
  }
}


    function displayRecipes(list = recipes) {
      recipeList.innerHTML = '';
      if (list.length === 0) {
        recipeList.innerHTML = '<p>No recipes found.</p>';
        return;
      }

      list.forEach((recipe, index) => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.innerHTML = `
          <h3>${recipe.name}</h3>
          <small>Ingredients: ${recipe.ingredients.join(', ')}</small>
          <p>${recipe.instructions}</p>
        `;
        recipeList.appendChild(div);
      });
    }

    function deleteRecipe(index) {
      if (confirm('Delete this recipe?')) {
        recipes.splice(index, 1);
        saveRecipes();
        displayRecipes();
      }
    }

    recipeForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = recipeName.value.trim();
  const ingredients = recipeIngredients.value.split(',').map(i => i.trim().toLowerCase());
  const instructions = recipeInstructions.value.trim();

  recipes.push({ name, ingredients, instructions });
  await saveRecipes(); // save to JSONBin
  displayRecipes(); // refresh list
  recipeForm.reset();
});


    filterBtn.addEventListener('click', () => {
      const pantryItems = pantryInput.value.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
      if (pantryItems.length === 0) {
        displayRecipes();
        return;
      }
      const filtered = recipes.filter(recipe => 
        pantryItems.every(item => recipe.ingredients.includes(item))
      );
      displayRecipes(filtered);
    });

    clearFilterBtn.addEventListener('click', () => {
      pantryInput.value = '';
      displayRecipes();
    });

    // Initial display
    loadRecipes();
