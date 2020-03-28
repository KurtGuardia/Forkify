import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";

/** Global state of the app
 * - Search objetc
 * -Current recipe object
 * - shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * Search Stuff (left side)
 */

const controlSearch = async () => {
  //1) Get query from the view
  const query = searchView.getInput();

  if (query) {
    //2) New search object and add to stage
    state.search = new Search(query); //Brought from the exported class

    //3) Prepare UI for results
    searchView.clearInput(); //To erase the input field
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      //4) Search for recipes
      await state.search.getResults(); //This method returns a Promise and in step 5) we need the results to be compleated, that's why we need to wait this method to be done

      //5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result); //state.search.result is an array that we get thanks to the method getResults(), and contains all the results of the search. We pass it to the renderResults that we made in the other module
    } catch (error) {
      alert("Something went wrong :(");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  //searchResPages is the parent of where we put the buttons
  const btn = e.target.closest(".btn-inline"); //.closest gives us the element with the specified class closest to where we clicked (so no problem on clicking the letters or the icon inside the button, we always get the button)

  if (btn) {
    const goToPages = parseInt(btn.dataset.goto, 10); //goto is the dataset we made for the respective button, so it tells us what that button is made for
    searchView.clearResults(); //So the new results don't drop off under the first results, and also erase the button we just clicked
    searchView.renderResults(state.search.result, goToPages); //Same as step 5 in controlSearch, but with the new page attached as the second argument
  }
});

/**
 * Recipe stuff (front of browser)
 */
const controlRecipe = async () => {
  //Get ID from the url
  const id = window.location.hash.replace("#", "");
  console.log(id);

  //Pretty much do everythinh
  if (id) {
    
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    //Create new recipe object
    state.recipe = new Recipe(id);

    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();

      //Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      //alert("Something went wrong :(");
      console.log(error);
    }
  }
};

["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);
