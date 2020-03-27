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
    };

    calcServing() {
        //No actual reason for this number, it's just four.
        this.servings = 4;
    }










}