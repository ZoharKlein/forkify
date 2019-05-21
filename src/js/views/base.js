export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResultsList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchResultsAndPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementsStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
    <div class="${elementsStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div> 
    `;
    parent.insertAdjacentHTML('afterBegin', loader);

}

export const cleanLoader = () => {
    const loader = document.querySelector(`.${elementsStrings.loader}`);

    if (loader){
        loader.parentElement.removeChild(loader);
    }
}