import './App.css';
import { useState, useEffect } from 'react';


function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const apiKey = '8a723e27ca5f45ef9af829fdf8ebdd24';

  useEffect(() => {
    if (query) {
      fetchRecipes();
    }
  }, [page]);

  /* i added some hardcoded in recipes to make it look nicer */
  const [featured] = useState([
    {
      id: 1,
      title: "No-Bake Hot Chocolate Dip",
      image: "https://www.allrecipes.com/thmb/W30jvWF5avX87Iu3c5bHdbLDrus=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11855155_No-Bake-Hot-Chocolate-Dip_Peyton-Beckwith_4x3-83e6132ca34f4de08ec74a294bbf00a5.jpg", 
      sourceUrl: "https://www.allrecipes.com/no-bake-hot-chocolate-dip-recipe-11855155",
    },
    {
      id: 2,
      title: "Soft Christmas Cookies",
      image: "https://www.allrecipes.com/thmb/ijRhS-1QhAMI4bSg1AFBe2U_fro=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/56142_Soft-Christmas-Cookies-4x3-97b047070e9b40e6ab48ca21e772693c.jpg",
      sourceUrl: "https://www.allrecipes.com/recipe/10110/soft-christmas-cookies/",
    },
    {
      id: 3,
      title: "Nutella Puff Pastry Christmas Tree",
      image: "https://www.allrecipes.com/thmb/FBYlDbsTVzIYdTx8Lsw134rtIQw=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/256100-nutella-pastry-christmas-tree-VAT-Beauty-4x3-c670ad8d4d654ec883e8de390bf23123.jpg",
      sourceUrl: "https://www.allrecipes.com/recipe/256100/nutella-pastry-christmas-tree/",
    }
  ]);

  /* get info from api */
  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=18&offset=${(page - 1) * 18}&apiKey=${apiKey}`
      );
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        alert("no recipes found, try a different keyword!");
        return;
      }

      const recipedetails = await Promise.all(
        data.results.map(async (recipe) => {
          try {
            const res = await fetch(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
            );
            const recipeinfo = await res.json();

            return {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              sourceUrl: recipeinfo.sourceUrl,
            };
          } catch (error) {
            console.error('error fetching details for the recipe ${recipe.id}', error);
            return {
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              sourceUrl: "https://spoonacular.com",
            };
          }
        })
      );

      setRecipes(recipedetails);
    } catch (error) {
      console.error("error fetching recipes:", error);
      alert("couldn’t load recipes, api may be at limit");
    }
  };

  return (
    <div>
      {/* header part */}
      <div className="headerSection">
        <img src="https://i.pinimg.com/originals/02/a7/53/02a75345b83dc3c4a7b52ef281451460.gif" className="bow left-bow" />
        <img src="https://i.pinimg.com/originals/02/a7/53/02a75345b83dc3c4a7b52ef281451460.gif" className="bow right-bow" />

        <h1>QuickChef🍽️</h1>
        <p className="headersentence">✨Search for your new favorite recipes!✨</p>
      
        {/* the search button */}
        <input
          type="text"
          placeholder="Enter keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchRecipes();
            }
          }}
        />
        <button onClick={() => {
          setPage(1); /* i added so the page gets reset to 1 after a new search */
          fetchRecipes();
        }} className="searchButton">search</button>
      </div>

      {/* back to homepage button */}
      {recipes.length > 0 && (
        <button onClick={() => setRecipes([])} className="clear-button">
          🔙 Back to Homepage
        </button>
      )}

      {/* for the hardcoded christmas recipes */}
      {recipes.length === 0 && (
        <div>
          <h2>🎄Christmas Favorites:</h2>
          <div className="recipe-grid">
            {featured.map((recipe) => (
              <div key={recipe.id} className="recipe-card featured-recipes">
                <h3>{recipe.title}</h3>
                <img src={recipe.image} width="200" />
                <p>
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                    See recipe!
                  </a>
                </p>
              </div>
            ))}
          </div>  
        </div>
      )}

      {/* heres the actual recipe cards */}
      <div className="recipe-grid">
        {recipes.length > 0 &&
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <img src={recipe.image} width="200" />
              <p>
                {recipe.sourceUrl ? (
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                    See recipe!
                  </a>
                ) : (
                  <p>No recipe link available right now :c</p>
                )}
              </p>
            </div>
          ))
        }
      </div>

      {/* i added pages */}
      {recipes.length > 0 && (
        <div className="pagebuttons">
          {page > 1 && (
            <button onClick={() => setPage(page - 1)} className="pagesfooter">⬅️Previous</button>
          )}
          <button onClick={() => setPage(page + 1)} className="pagesfooter">Next➡️</button>
        </div>
      )}

    </div>
  );
}

export default App;