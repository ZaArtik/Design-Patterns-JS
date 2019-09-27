// As we don't work with API, import data from our folder
import productsData from '../products';

/**
 * I was do the productList like field in global object, because in templates, when i hang
 * event handlers to events, they don't see module
 */

window.ProductList = (function getProductListPublicProperties() {
    const products = [];
    const config = {};
    const info = {
        // AJAX CALL
        data: productsData
    };

    return {
        /**
         * Init config in separate func, because - render elements happen later
         * than config fields assignments
         *
         * @method initConfig
         */
        initConfig() {
            config.container = document.querySelector('.product-list');
            config.listContainer = document.querySelector(
                '.product-list__wrapper'
            );
            config.getItemsURL = 'The link to which the AJAX call will be made';
        },

        /**
         * Add products to product array and render all products
         *
         * @method init
         */
        init() {
            const { data } = info;

            this.initConfig();

            data.forEach(item => {
                products.push(item);
            });

            products.forEach(item => {
                this.renderProductElement(item);
            });
        },

        /**
         * Add product to list by selected function
         *
         * @method addItemToSelectedList
         * @param {Number} id Id of product object
         * @param {Object} context Object in context of which will be executed fn
         * @param {String} fn Function, which will be executed
         */
        addItemToSelectedList(id, context, fn) {
            const { data } = info;
            const productObj = data.filter(item => id === item.id)[0];

            context[fn](productObj);
        },

        /**
         * Get the product object and create HTML template to insert into DOM
         *
         * @method createProductElement
         * @param {Obejct} item A product object
         * @return {String} HTML template of basket element
         */
        createProductElement(item) {
            const template = `
                <div class="product-list__image-wrapper">
                    <img src="${item.imgUrl}" alt="${item.name}" class="basket__image">
                </div>
                <div class="product-list__info-wrapper">
                    <h4 class="product-list__caption">${item.name}</h4>
                    <div class="product-list__ingridients">${item.ingridients}</div>
                    <div class="product-list__btn-wrapper">
                        <div class="product-list__price">$${item.price}</div>
                        <button class="product-list__add-btn" 
                                onclick="ProductList.addItemToSelectedList(${item.id}, 
                                            Basket, 'addItem')">Add to cart</button>
                    </div>
                </div>
            `;

            return template;
        },

        /**
         * Create li element with template and append it into DOM
         *
         * @method renderProductElement
         * @param {Object} item A product object
         */
        renderProductElement(item) {
            const template = this.createProductElement(item);
            const li = document.createElement('li');
            li.classList.add('product-list__item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

        getProductList() {
            return products;
        }
    };
})();

export default window.ProductList;
