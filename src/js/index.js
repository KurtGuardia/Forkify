import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
import List from './models/List';
import * as listView from './views/listView';


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

  
  //Pretty much do everythinh
  if (id) {
    
    //Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

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

["hashchange", "load"].forEach(event =>           //hashchange looks for change at the end of the url, this happens when we click into another recipe, and load for when we initialize the page.
  window.addEventListener(event, controlRecipe)
);

/**
 * Shopping List (right side)
 */
const controlList = () => {
  if(!state.list) state.list = new List();
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredients);
    listView.renderItem(item);
  })
}

//Handling shopping list buttons
elements.shopping.addEventListener('click', e => {
  const item = e.target.closest('.shopping__list').dataset.itemid;
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(item);
  }
  listView.deleteItem(item)
})

//Handling recipe button clicks
elements.recipe.addEventListener('click', e=> {                     //the place we look for clicks, in order to delegate the task
  if(e.target.matches('.btn-decrease, .btn-decrease *')){           //if the event (click) matches exactly the selected class or the child elements of that class
    //Decrease button clicked
    if(state.recipe.servings > 1) {                                 //This is made to avoid having negative quantities 
    state.recipe.updateServings('dec');                             //Using Method created in Recipe module get new data
    recipeView.updateServingsIngredients(state.recipe);             //Using Metho created in recipeVies module to dispay in UI
    }
  } else if(e.target.matches('.btn-increase, .btn-increase *')){    //The same for the increase button
    //Increase button clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }
  console.log(state.recipe);
});

window.l = new List();