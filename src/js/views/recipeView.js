import { elements } from "./base";
import { Fraction } from 'fractional';

const formatCount = count => {
    if(count){
        const [int, dec] = count.toString().split('.').map(el => parseInt(el, 10));

        if(!dec) return count;

        if(int === 0) {
            const fr = new Fraction(count);
            return `${fr.numerator}/${fr.denominator}`
        } else {
            const fr = new Fraction(count - int);
            return `${int} ${fr.numerator}/${fr.denominator}`
        }
    }
    return '?';
}

//To be called for each and every ingredient there is on the recipe, how many each recipe has
const createIngredient = ingredient =>  `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredients}
        </div>
    </li>
`;

//So we we clear the recipe when calling for another
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
}

//The master funcion of this module, to render the recipe
export const renderRecipe = recipe => {
    //Each img url, title, author, url will be replaces for the respective object we get from the object created with the class made un Recipe.js
    const markup = `
    <figure class="recipe__fig">
        <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn-decrease">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn-increase">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart-outlined"></use>
            </svg>
        </button>
    </div>



    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(el => createIngredient(el)).join(' ')}
        </ul>

        <button class="btn-small recipe__btn recipe__btn--add">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>
    `;

    //this is to specify where all the code above should be put
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
}


//Function to use when the user changes the quantity in servings
export const updateServingsIngredients = recipe => {

    //servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings              //picks the place where de servings is shown in the fist time and changes it for the new servings ammount
    
    //ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));                  //Gathers all the elements that have the recipe_count class, which are the ingredients in the place where they are calculated based on this info, the servings
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count)                                   //To store and show the new count property on the ingredients object in each one
    })
}