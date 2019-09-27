// Importing styles, templates and other helper modules
import './module.scss';
import moduleTemplate from './module-template';

// Importing modules
import Basket from './modules/basket';
import ProductList from './modules/productList';

// HTML Custom element implementation
class ModuleTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = moduleTemplate;
    }
}

customElements.define('module-template', ModuleTemplate);
document.querySelector('.wrapper').appendChild(new ModuleTemplate());

// Init modules
Basket.init();
ProductList.init();
