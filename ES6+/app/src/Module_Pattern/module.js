// Importing styles, templates and other helper modules
import '../templates/Basket_Template/basket.scss';
import basketTemplate from '../templates/Basket_Template/basket-template';

// Importing modules
import Basket from './modules/basket';
import ProductList from './modules/productList';

// HTML Custom element implementation
class BasketTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = basketTemplate;
    }
}

customElements.define('basket-template', BasketTemplate);
document.querySelector('.wrapper').appendChild(new BasketTemplate());

// Init modules
Basket.init();
ProductList.init();
