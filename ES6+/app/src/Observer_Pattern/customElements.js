// In this file is implemented custom elements, because it quantity increased
import headerTemplate from '../templates/FavList_Template/header-template';
import productListTemplate from '../templates/FavList_Template/product-list-template';
import favoriteListTemplate from '../templates/FavList_Template/favorite-list-template';

// Header template
document.querySelector('.header').innerHTML = headerTemplate;

// Product list custom element
class ProductListTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = productListTemplate;
    }
}

customElements.define('product-list-template', ProductListTemplate);
document.querySelector('.maincontent').appendChild(new ProductListTemplate());

// Favorite list custom element
class FavoriteListTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = favoriteListTemplate;
    }
}

customElements.define('favorite-list-template', FavoriteListTemplate);

export { ProductListTemplate, FavoriteListTemplate };
