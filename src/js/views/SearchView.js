import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const cleanInput = () => {
    elements.searchInput.value = "";
};

export const clearResult = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsAndPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const renderResult = (recipes, page = 1, resultPerPage = 10) => {
    const start = (page - 1) * resultPerPage;
    const end = page * resultPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page,recipes.length, resultPerPage);
    
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup); 
};

export const recipeTitle = (title, limit = 17) => {
    let newTitle = [];

    if(title.length > limit){
        title.split(' ').reduce((accumulator, current) => {
            if (current.length + accumulator <= limit){
                newTitle.push(current);
            }
            return accumulator + current.length;

        }, 0);
        newTitle = `${newTitle.join(' ')} ...`;
    }
    else{
        newTitle = title;
    }

    return newTitle;
}

const renderButtons = (page, numberOfResult, resultPerPage) => {
    const pages = Math.ceil(numberOfResult / resultPerPage);
    let button;

    if (page === 1 && pages > 1){
        button = createButton(page, 'next');
    }
    else if (page < pages){
        button = `${createButton(page, 'prev')}${createButton(page, 'next')}`;
    }
    else if(page === pages)
    {
        button = createButton(page, 'prev');
    }
    elements.searchResultsAndPages.insertAdjacentHTML('afterbegin', button);

}

const createButton = (pageNumber, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? pageNumber - 1 : pageNumber + 1}>
    <span>Page ${type === 'prev' ? pageNumber - 1 : pageNumber + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`




