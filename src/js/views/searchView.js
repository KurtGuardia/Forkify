/* Imported stuff */
import { elements } from './base';



/*No all are going to be exported, some are just for the module use */

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {                   //takes the input field and blanks it out
    elements.searchInput.value = '';
};

export const clearResults = () => {                  //Grabs the whole list displayed and turns it to blank
    elements.searchResList.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {   //A well-thought algoritm for the titles to not be more than one line in the interface
    const newTitle = [];                            //We create an empty array for the new title
    if (title.length > limit) {                     //check if the title is longer than the established limit we put ourselves
        title.split(' ').reduce((acc, cur) => {     //split the title in individual words. This produces an Array so we can pass the method .reduce
            if (acc + cur.length <= limit) {        //In this callback func if the accumulator (thing we use to check how many characters we used) + the current word's lenght is lesser than the limit
              newTitle.push(cur);                   //Is so, push it to the newTitle array
            }
            return acc + cur.length;                //this is like the 'else', so if we have reached the limit it doesn't push to the newTitle array, just does this instead
        }, 0);                                      //0 is where the acc starts

        //return the result
        return `${newTitle.join(' ')} ...`;         //We use the method join, with a space, to use the storaged words in the newTitle array, and also three dots at the end.
    }
    return title;                                   //again this works as an 'else'
}   

const renderRecipe = recipe => {
    const markup = `                                 
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>        
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;                                               //that's how it should look
    elements.searchResList.insertAdjacentHTML('beforeend', markup)         //Here we put the markup with each and every result in its place in the DOM
}

export const renderResults = recipes => {           //Here we will get all the recipies to work with

    recipes.forEach(renderRecipe);                  //There's no need to specify the element or anything, just passing the function it will work for all of the elements in the array each by one

}