//8aa5543dda7035e0f09915e013892f0b - api id
//https://www.food2fork.com/api/search - search query

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import {elements, renderLoader, cleanLoader} from './views/base';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/ListView';
import * as LikesView from './views/LikesView';
import Likes from './models/Likes';

/**global state of the app
* - search object
* - Current recipe object
* - Shoping list object
* - Liked recipes
*/
const state = {};

//** Search controller */
const controlSearch = async () => {
    //1. Get the query from the veiw.
    const query = SearchView.getInput();
    console.log(query);

    if (query){

        //2. New search object and add to state.
        state.search = new Search(query);

        //3. Preapre the UI for result
        SearchView.cleanInput();
        SearchView.clearResult();
        renderLoader(elements.searchResults);

        try{
            //4. Search for recipe
            await state.search.getResulet();
            cleanLoader();

            //5. Render the result on UI
            SearchView.renderResult(state.search.recipes);

        } catch (error){
            alert('error with the results from search!!!');
            cleanLoader();
        }
    }


}
//const search = new Search('pasta');

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResultsAndPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    console.log(btn);
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        SearchView.clearResult();
        SearchView.renderResult(state.search.recipes, goToPage);
    }
});

//search.getResulet();

//** Recipe controller */

const controlRecipe = async () => {
    //get ID from url
    const recipeID = window.location.hash.replace('#','');

    //if ID chages
    if (recipeID){
        //1. prepare the UI for changes
        RecipeView.clearRecipeData();
        renderLoader(elements.recipe);

        if (state.search){
            SearchView.highlightSelected(recipeID);
        }

        //2. create new recipe object
        state.recipe = new Recipe(recipeID);

        try{
            //3. get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcAmountOfServing();
            state.recipe.calcCookingTime();

            //4. render the data to the UI
            cleanLoader();
            RecipeView.renderRecipe(state.recipe, state.likes.isLiked(recipeID));

        } catch(error) {
            alert('error with the recipe!!!');
            console.log(error);
        }

    }
}

['hashchange','load'].forEach(event => addEventListener(event, controlRecipe));



//** ShoppingList controller */
const controlList = () => {
    if (!state.list) {
        state.list = new List();
    }

    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        ListView.renderItem(item);
    });

}

elements.shoppingList.addEventListener('click', event => {

    const id = event.target.closest('.shopping__item').dataset.itemid;

    if (event.target.matches('.shopping__delete, shopping__delete *')) {
        state.list.deleteItem(id);
        ListView.deleteItem(id);
    } else if (event.target.matches('shopping_count-value, shopping_count-value *')) {
        const newCount =  parseFloat(event.target.value);
        state.list.updateCount(id, newCount);
    }
});


//** Likes controller */
// change that to if on render recipe
const controlLike = () => {

    if (!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author,
            state.recipe.img);
        LikesView.toggleLikeBtn(true);
        LikesView.renderLike(newLike);

    } else {
        state.likes.deleteLike(currentID);
        LikesView.toggleLikeBtn(false);
        LikesView.deleteLike(currentID);
    }
    LikesView.toggleLikeMenu(state.likes.getNumbersOfLikes());
}


// Resotre from storage likes recipes

window.addEventListener('load', () => {

    state.likes = new Likes();
    state.likes.readStorage();
    LikesView.toggleLikeMenu(state.likes.getNumbersOfLikes());

    state.likes.likes.forEach(like => {
        LikesView.renderLike(like);
    })
});

elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            RecipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        RecipeView.updateServingsIngredients(state.recipe);

    } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Add to shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        // Add Like
        controlLike();
    }

});
