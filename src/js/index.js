import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';



/** Global state of the app 
 * - Search objetc
 * -Current recipe object
 * - shopping list object
 * - Liked recipes
*/
const state = {};

const controlSearch = async () => {
    
        //1) Get query from the view
    const query = searchView.getInput();

    if (query) {

        //2) New search object and add to stage
        state.search = new Search(query)            //Brought from the exported class

        //3) Prepare UI for results
        searchView.clearInput();                    //To erase the input field
        searchView.clearResults();
        renderLoader(elements.searchRes)

        //4) Search for recipes
        await state.search.getResults();            //This method returns a Promise and in step 5) we need the results to be compleated, that's why we need to wait this method to be done

        //5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);        //state.search.result is an array that we get thanks to the method getResults(), and contains all the results of the search. We pass it to the renderResults that we made in the other module
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})

