import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {                               //To toggle the like button on each recipe
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';  //isLikes will be either True or False

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);    //To match the end of the correct icon
}

export const toggleLikeMenu = numLikes => {                                         //To toggle the like heart on top if there are likes
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';      //If there are likes (numLikes > 0) visible on the CSS property visibility
}

export const renderLike = like => {                                         //To render the like inside that menu with the argument of the recipe being liked/seen
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    
    elements.likesList.insertAdjacentHTML('beforeend', markup);             //inert this on the correct place in the HTML
}

export const deleteLike = id => {                                           //To delete
    const el = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;     //To get the parent of the specific disliked recipe
    if(el) el.parentElement.removeChild(el);                                            //To remove in html we always have to go up and remove a child
}