import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;                                           //this id is unique and we get it form the <a> element rendered when searched
    }

    
    async getRecipe() {
        try {   
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);        //This will return a Promise, after checking the result we can then storage the info we need:
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error); 
            alert('Something went wrong :(');  
        }
    }

    calcTime() {
        //Arbitrary we chose to spend 15 mins for every 3 igredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15; 
    }

    calcServing() {
        //No actual reason for this number, it's just four.
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'onunce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];         //All of the measures that we can get and DON'T want
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];                                          //The measures we want and will replace the ones above if necesary
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {             //to apply this to all elements inside the 

            //Uniform measures
            let ingredients = el.toLowerCase();                         //To avoid Capital letters prblemes
            unitsLong.forEach((unit, i) => {                            //We search fot the long versions
                ingredients = ingredients.replace(unit, unitsShort[i])  //in the ingredients we replace the ones that look alike the long measures with the equivalent in short version, using the index of the long in the short
            })

            //Remove parentesis
            ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');   //to remove parenthesis

            //Parse ingredients
            const arrIng = ingredients.split(' ');                      //To store all ingredients in an Array, individually
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));        //To store where the in the Array (index) you can get the units (tbsp, oz, cup, etc)

            let objIng;                   //Main object
            
            if(unitIndex > -1){
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex);            //For us to know if there's one or two elements in the array that are the number (4 is just one but 4 1/3 are two elements than mean one)
                let count;
                
                if(arrCount.length === 1){
                    count = eval(arrIng[0].replace('-', '+'));        //if theres a - in there, we switch it to a +, and then evaluate the sum (4-1/30 => 4+1/3 => 4.333)
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));   //If theres a space between numbers we join them with a + and then evaluate the sum (4 1/3 => 4+1/3 => 4.333)
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredients: arrIng.slice(unitIndex + 1).join(' ')      //joinin Array elements with a space, after the measure unit
                }
                
            } else if (parseInt(arrIng[0], 10)){
                //no unit but 1st is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredients: arrIng.slice(1).join(' ')                  //joinin Array elements with a space, after the first element
                }

            } else if (unitIndex === -1){
                //no unit nor number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredients
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;         //Here we store the new serving depending on if it is 'dec' or not

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings)                                      //we mutate de .count proprety on that object by multiplying for the new varaible (0.75 [3/4] if we change form 4 to 3) 
        })

        //This is set up last so it does't bother the forEach loop 
        this.servings = newServings;
    }







}