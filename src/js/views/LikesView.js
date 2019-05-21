import {elements} from './base';
import {recipeTitle} from './SearchView';

export const toggleLikeBtn = isLiked => {

    let iconString;

    if (isLiked === true) {
        
        iconString = 'icon-heart';
    } else {
        iconString = 'icon-heart-outlined'
    }
     
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    
};

export const toggleLikeMenu = numberOfLikes => {
    if (numberOfLikes > 0) {
        elements.likesMenu.style.visibility = 'visible';
    } else {
        elements.likesMenu.style.visibility = 'hidden';
    }
};


export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${recipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {

    const element = document.querySelector(`.likes__link[href*="${id}"]`);

    if (element) {
        element.parentElement.removeChild(element);
    }
}
