import axios from 'axios';
import {key} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){

        try{
            const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            
            this.title = result.data.recipe.title;
            this.publisher = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;

            //ADDING AFTER
            this.amountOfFood = 0;

        } catch (error){
            alert(error);
        }
    }

    //Estimated time by ingredients (15 min to 3 ingredients)
    calcCookingTime(ingredientPerPeriods = 3){
        const numberOfIngredients = this.ingredients.length;
        const periods = Math.ceil(numberOfIngredients / ingredientPerPeriods);

        this.time = periods * 15;
    }

    calcAmountOfServing(gramPerPepole = 500){

        let sum = 0;
        let calcWay;

        this.ingredients.map(current => {
            
            switch (current.unit) {
                            
                case 'tbsp': 
                    calcWay = 14.3;
                    break;
                    
                case 'cup': 
                    calcWay = 226.8;
                    break;
                    
                case 'oz': 
                    calcWay = 28;
                    break;
                    
                case 'pound': 
                    calcWay = 453.59237;
                    break;
                    
                case 'kg': 
                    calcWay = 1000;
                    break;
                    
                case 'g': 
                    calcWay = 1;
                    break;
                case '':
                    calcWay = 400;
                    break;

            }
            sum +=  calcWay * current.count;
            
        });

        this.servings = Math.round(sum / gramPerPepole);
        
    };
  
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    
    updateServings(type) {
        const newServings = type === 'inc' ? this.servings + 1 : this.servings - 1;

        this.ingredients.forEach(ingredient => {
            ingredient.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
