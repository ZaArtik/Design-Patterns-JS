// As we don't work with API, import data from our folder
import GlobalState from '../globalState';
import { ProductListTemplate } from '../customElements';
import productsData from '../../templates/Basket_Template/products';

// Observers
import favListObserver from '../observers/favListObserver';

/**
 * version for observer pattern, without adding to basket functionality
 *
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
            config.maincontent = document.querySelector('.maincontent');
            config.container = document.querySelector('.product-list');
            config.getItemsURL = 'The link to which the AJAX call will be made';
            [config.productListLink] = document.querySelectorAll(
                '.header__menu-link'
            );
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

            document
                .querySelectorAll('.product-list__favorite-star')
                .forEach(el => {
                    el.onclick = () => {
                        productsData.forEach(product => {
                            if (product.id === +el.dataset.product_id) {
                                if (product.inFavList === false) {
                                    this.addToFavoriteList(el, product);
                                } else {
                                    this.removeFromFavoriteList(el, product);
                                }
                            }
                        });
                    };
                });

            config.productListLink.onclick = () => {
                this.openProductListPage();
            };

            favListObserver.subscribe(id => {
                productsData.forEach(product => {
                    if (product.id === id) {
                        product.inFavList = false;
                    }
                });
            });
        },

        addToFavoriteList(starElement, product) {
            product.inFavList = true;
            favListObserver.broadcast({ id: +starElement.dataset.product_id });
            starElement.classList.add('product-list__favorite-star--active');
        },

        removeFromFavoriteList(starElement, product) {
            product.inFavList = false;
            favListObserver.broadcast({
                id: +starElement.dataset.product_id,
                toDelete: true
            });
            starElement.classList.remove('product-list__favorite-star--active');
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
         * <img src="assets/star.png" alt="add to favorite
         * list" class="product-list__favorite-star">
         * Get the product object and create HTML template to insert into DOM
         *
         * @method createProductElement
         * @param {Obejct} item A product object
         * @return {String} HTML template of basket element
         */
        createProductElement(item) {
            const template = `
                <div class="product-list__image-wrapper">
                    <div class="product-list__favorite-star ${
                        item.inFavList
                            ? 'product-list__favorite-star--active'
                            : ''
                    }" data-product_id="${item.id}"></div>
                    <img src="${item.imgUrl}" alt="${
                item.name
            }" class="product-list__image">
                </div>
                <div class="product-list__info-wrapper">
                    <h4 class="product-list__caption">${item.name}</h4>
                    <div class="product-list__ingridients">${
                        item.ingridients
                    }</div>
                    <div class="product-list__btn-wrapper">
                        <div class="product-list__price">$${item.price}</div>
                        <button class="product-list__add-btn" onclick="console.log('Not in this implementation :D')">Add to cart</button>
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

            document.querySelector('.product-list__wrapper').appendChild(li);
        },

        openProductListPage() {
            if (GlobalState.activePage !== 'productList') {
                config.maincontent.innerHTML = '';
                config.maincontent.appendChild(new ProductListTemplate());

                products.forEach(item => {
                    this.renderProductElement(item);
                });

                document
                    .querySelectorAll('.product-list__favorite-star')
                    .forEach(el => {
                        el.onclick = () => {
                            productsData.forEach(product => {
                                if (product.id === +el.dataset.product_id) {
                                    if (product.inFavList === false) {
                                        this.addToFavoriteList(el, product);
                                    } else {
                                        this.removeFromFavoriteList(
                                            el,
                                            product
                                        );
                                    }
                                }
                            });
                        };
                    });
                GlobalState.activePage = 'productList';
            }
        },

        getProductList() {
            return products;
        }
    };
})();

export default window.ProductList;
