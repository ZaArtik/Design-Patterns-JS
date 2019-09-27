// Helper custom modules
import Notify from './notify';

/**
 * I was do the basket module Basket like field in global object, because in templates, when i hang
 * event handlers to events, they don't see module
 */

window.Basket = (function getBasketPublicProperties() {
    // Some privates variables
    let basket = [];
    const config = {};
    const helperElements = {
        dangerNotify: Notify.createNotify({
            boldText: 'Product',
            text: 'is already in basket',
            backgroundColor: 'rgba(250, 128, 114, 0.7)'
        })
    };
    const info = {
        opened: false,
        changedBasket: true
    };

    return {
        /**
         * Init config in separate func, because - render elements happen later
         * than config fields assignments
         *
         * @method initConfig
         */
        initConfig() {
            config.container = document.querySelector('.basket');
            config.listContainer = document.querySelector(
                '.basket__product-list'
            );
            config.openBtn = document.querySelector('.basket__icon-wrapper');
            config.getItemsURL = 'The link to which the AJAX call will be made';
        },

        /**
         * Fill basket array by AJAX call, hang event handlers
         *
         * @method init
         */
        init() {
            const self = this;

            this.initConfig();

            if (basket.length === 0) {
                // Some AJAX call to fill the basket of elements
                if (localStorage.getItem('basket')) {
                    const basketData = JSON.parse(
                        localStorage.getItem('basket')
                    );
                    basketData.forEach(el => {
                        basket.push(el);
                    });
                }
            }

            // Button that is responsible for the basket opening
            config.openBtn.onclick = function openBasket() {
                if (info.opened) {
                    info.opened = false;

                    config.container.classList.remove('basket--active');
                } else {
                    info.opened = true;

                    config.container.classList.add('basket--active');

                    if (info.changedBasket) {
                        info.changedBasket = false;
                        self.renderBasketList();
                    }
                }
            };

            // Close basket if user click on other place
            document.querySelector('.wrapper').onclick = function closeBasket(
                event
            ) {
                if (info.opened === true) {
                    const { target } = event;

                    if (
                        !target.closest('.basket__product-item') &&
                        !target.closest('.basket')
                    ) {
                        info.opened = false;
                        config.container.classList.remove('basket--active');
                    }
                }
            };
        },

        /**
         * Checks if basket have element, pushing new product object to basket array
         *
         * @method addItem
         * @param {Object} item A product object
         */
        addItem(item) {
            // If we have same product in basket - exit from function
            if (basket.some(product => item.id === product.id)) {
                Notify.showNotify(helperElements.dangerNotify);
                return false;
            }

            info.changedBasket = true;
            item.inBasket += 1;
            basket.push(item);

            localStorage.setItem('basket', JSON.stringify(basket));

            return this;
        },

        /**
         * Filters basket array by deleting product with the param id and
         * execute AJAX call to save the quantity of product in basket
         * rerender basket list
         *
         * @method removeItem
         * @param {Number} id Id of product object
         */
        removeItem(id) {
            info.changedBasket = true;
            basket = basket.filter(product => {
                if (id !== product.id) {
                    return true;
                }

                return false;
            });
            // Some AJAX call to save the inBasket field
            localStorage.setItem('basket', JSON.stringify(basket));

            this.renderBasketList();

            return this;
        },

        /**
         * Execute AJAX call, search same product object and change inBasket field
         * Search product quantity in HTML DOM and change value
         * This approach consumes less resources, than it was used renderBasketList function
         *
         * @method plusItem
         * @param {Number} id Id of product ojbect
         * @param {Object} event Event object
         */
        plusItem(id, event) {
            const productQuantityInBasket = event.target.previousElementSibling;
            // Some AJAX call to save the inBasket field
            basket.forEach(product => {
                if (id === product.id) {
                    product.inBasket += 1;
                    productQuantityInBasket.innerText =
                        +productQuantityInBasket.innerText + 1;
                }
            });

            localStorage.setItem('basket', JSON.stringify(basket));
        },

        /**
         * Execute AJAX call, search same product object and change inBasket field
         * Search product quantity in HTML DOM and change value
         * If inBasket value of product object equal 0, call removeItem method to
         * delete product from basket list
         *
         * @method minusItem
         * @param {Number} id Id of product ojbect
         * @param {Object} event Event object
         */
        minusItem(id, event) {
            const productQuantityInBasket = event.target.nextElementSibling;

            // Some AJAX call to save the inBasket field
            basket.forEach(product => {
                if (id === product.id) {
                    product.inBasket -= 1;
                    if (product.inBasket === 0) {
                        this.removeItem(product.id);
                    }
                    productQuantityInBasket.innerHTML -= 1;
                }
            });

            localStorage.setItem('basket', JSON.stringify(basket));
        },

        /**
         * Get the product object and create HTML template to insert into DOM
         *
         * @method createBasketElement
         * @param {Object} item A product object
         * @return {String} HTML template of basket element
         */
        createBasketElement(item) {
            const template = `
            <div class="basket__product-image-wrapper">
                <img src="${item.imgUrl}" alt="${item.name}" class="basket__image">
            </div>
            <div class="basket__product-info-wrapper">
                <h4 class="basket__product-caption">${item.name}</h4>
                <div class="basket__product-ingridients">${item.ingridients}</div>
                <div class="basket__price-info-wrapper">
                    <div class="basket__product-price">$${item.price}</div>
                    <div class="basket__product-controller-wrapper">
                        <button class="basket__remove-product"onclick="Basket.minusItem(${item.id}, event)">-</button>
                        <div class="basket__product-quantity">${item.inBasket}</div>
                        <button class="basket__add-product" onclick="Basket.plusItem(${item.id}, event)">+</button>
                    </div>
                </div>
            </div>
            <button class="basket__delete-product" onclick="Basket.removeItem(${item.id})"></button>
            `;

            return template;
        },

        /**
         * Create li element with template and append it into DOM
         *
         * @method renderBasketElement
         * @param {Object} item A product object
         */
        renderBasketElement(item) {
            const template = this.createBasketElement(item);
            const li = document.createElement('li');
            li.classList.add('basket__product-item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

        /**
         * Clear basket list and render it again
         *
         * @method renderBasketList
         */
        renderBasketList() {
            this.clearBasketList();

            basket.forEach(item => {
                this.renderBasketElement(item);
            });
        },

        /**
         * Delete all element's from ul basket list
         *
         * @method clearBasketList
         */
        clearBasketList() {
            const { listContainer } = config;
            const listContainerChildrens = [...listContainer.children];

            listContainerChildrens.forEach(child => {
                listContainer.removeChild(child);
            });
        },

        getBasket() {
            return basket;
        }
    };
})();

export default window.Basket;
