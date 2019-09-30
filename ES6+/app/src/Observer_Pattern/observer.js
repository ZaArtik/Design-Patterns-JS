// Importing styles, templates and other helper modules
import '../Basket_Template/basket.scss';
import basketTemplate from '../Basket_Template/basket-template';

// Importing modules

// HTML Custom element implementation
class BasketTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = basketTemplate;
    }
}

customElements.define('basket-template', BasketTemplate);
document.querySelector('.wrapper').appendChild(new BasketTemplate());
