/**
 * My modules are consist of private fields ( to wich have acces only module methods )
 * and returned object with public fields and methods.
 * config - this is an object with main elements of module ( DOM, links );
 * info - this is an object with state of module, needed for optimize and manage the module;
 * helperElements - this is an object with elements or methods from other modules, which well be
 * used in this module
 * I use the localStorage to imitate AJAX call
 */

// NOTIFY MODULE
var notify = (function() {
    var config = {
        insertContainer: document.querySelector('.wrapper')
    };
    var info = {
        notifyActive: false,
        currentNotifyEl: null,
        hideTimeout: null
    };

    return {
        /**
         * Create notify template with indicated options
         *
         * @method createNotify
         * @param {Object} options Object with notify element options
         * @return {Object} Notify template and option with color and fz
         */
        createNotify: function(options) {
            var boldText = options.boldText || 'Default',
                text = options.text || 'Default';

            var template =
                '<div class="notify__info-wrapper"><strong>' +
                boldText +
                '</strong> ' +
                text +
                '</div>';

            return {
                template: template,
                options: options
            };
        },

        /**
         * Create notify element, append into it template and tune styles
         *
         * @method showNotify
         * @param {Object} options Obejct with template and notify element options
         */
        showNotify: function(options) {
            var self = this;

            if (info.notifyActive === true) {
                clearTimeout(info.hideTimeout);
                info.hideTimeout = setTimeout(function() {
                    info.currentNotifyEl.style.opacity = 0;
                    self.hideNotify(info.currentNotifyEl);
                }, 2000);

                return false;
            }

            var template = options.template || '',
                color = options.color || '#000',
                backgroundColor =
                    options.backgroundColor || 'rgba(250, 128, 114, 0.7)',
                fontSize = options.fontSize || '17px';

            var notifyInfoWrapper,
                notifyEl = document.createElement('div');

            notifyEl.classList.add('notify');
            notifyEl.style.backgroundColor = backgroundColor;
            notifyEl.style.opacity = 0;
            notifyEl.innerHTML = template;

            config.insertContainer.appendChild(notifyEl);

            setTimeout(function() {
                info.currentNotifyEl = notifyEl;
                notifyEl.style.opacity = 1;
            }, 0);

            info.hideTimeout = setTimeout(function() {
                notifyEl.style.opacity = 0;
                self.hideNotify(notifyEl);
            }, 2000);

            notifyInfoWrapper = document.querySelector('.notify__info-wrapper');
            notifyInfoWrapper.style.fontSize = fontSize;
            info.notifyActive = true;
        },

        /**
         * After 700 ms ( tranisition value of notify element ) remove element and do it
         * not active
         *
         * @method hideNotify
         * @param {Node} notifyEl Node of current notify element
         */
        hideNotify: function(notifyEl) {
            setTimeout(function() {
                config.insertContainer.removeChild(notifyEl);
                info.notifyActive = false;
            }, 700);
        }
    };
})();

//  BASKET MODULE
var basket = (function() {
    // Some privates variables
    var basket = [];
    var config = {
        container: document.querySelector('.basket'),
        listContainer: document.querySelector('.basket__product-list'),
        openBtn: document.querySelector('.basket__icon-wrapper'),
        getItemsURL: 'The link to which the AJAX call will be made'
    };
    var helperElements = {
        dangerNotify: notify.createNotify({
            boldText: 'Product',
            text: 'is already in basket',
            backgroundColor: 'rgba(250, 128, 114, 0.7)'
        })
    };
    var info = {
        opened: false,
        changedBasket: true
    };

    // Return public methods and variables to work with them
    return {
        /**
         * Fill basket array by AJAX call, hang event handlers
         *
         * @method init
         */
        init: function() {
            var self = this;

            if (basket.length === 0) {
                // Some AJAX call to fill the basket of elements
                if (localStorage.getItem('basket')) {
                    var basketData = JSON.parse(localStorage.getItem('basket'));
                    basketData.forEach(function(el) {
                        basket.push(el);
                    });
                }
            }

            // Button that is responsible for the basket opening
            config.openBtn.onclick = function() {
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
            document.querySelector('.wrapper').onclick = function(event) {
                if (info.opened === true) {
                    var target = event.target;
                    if (!target.closest('.basket__product-item') && !target.closest('.basket')) {
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
        addItem: function(item) {
            // If we have same product in basket - exit from function
            if (
                basket.some(function(product) {
                    return item.id === product.id;
                })
            ) {
                notify.showNotify(helperElements.dangerNotify);
                return false;
            }

            info.changedBasket = true;
            basket.push(item);
            item.inBasket++;

            localStorage.setItem('basket', JSON.stringify(basket));
        },

        /**
         * Filters basket array by deleting product with the param id and
         * execute AJAX call to save the quantity of product in basket
         * rerender basket list
         *
         * @method removeItem
         * @param {Number} id Id of product object
         */
        removeItem: function(id) {
            info.changedBasket = true;
            basket = basket.filter(function(product) {
                if (id !== product.id) {
                    return true;
                }
            });
            // Some AJAX call to save the inBasket field
            localStorage.setItem('basket', JSON.stringify(basket));

            this.renderBasketList();
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
        plusItem: function(id, event) {
            var productQuantityInBasket = event.target.previousSibling;

            // Some AJAX call to save the inBasket field
            basket.forEach(function(product) {
                if (id === product.id) {
                    product.inBasket++;
                    productQuantityInBasket.innerHTML++;
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
        minusItem: function(id, event) {
            var self = this;
            var productQuantityInBasket = event.target.nextSibling;

            //Some AJAX call to save the inBasket field
            basket.forEach(function(product) {
                if (id === product.id) {
                    product.inBasket--;
                    if (product.inBasket === 0) {
                        self.removeItem(product.id);
                    }
                    productQuantityInBasket.innerHTML--;
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
        createBasketElement: function(item) {
            var template =
                '<div class="basket__product-image-wrapper">' +
                '<img src="' +
                item.imgUrl +
                '" alt="' +
                item.name +
                '" class="basket__image">' +
                '</div>' +
                '<div class="basket__product-info-wrapper">' +
                '<h4 class="basket__product-caption">' +
                item.name +
                '</h4>' +
                '<div class="basket__product-ingridients">' +
                item.ingridients +
                '</div>' +
                '<div class="basket__price-info-wrapper">' +
                '<div class="basket__product-price">$' +
                item.price +
                '</div>' +
                '<div class="basket__product-controller-wrapper">' +
                '<button class="basket__remove-product"onclick="basket.minusItem(' +
                item.id +
                ', event)">-</button>' +
                '<div class="basket__product-quantity">' +
                item.inBasket +
                '</div>' +
                '<button class="basket__add-product" onclick="basket.plusItem(' +
                item.id +
                ', event)">+</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<button class="basket__delete-product" onclick="basket.removeItem(' +
                item.id +
                ')"></button>';

            return template;
        },

        /**
         * Create li element with template and append it into DOM
         *
         * @method renderBasketElement
         * @param {Object} item A product object
         */
        renderBasketElement: function(item) {
            var template = this.createBasketElement(item);
            var li = document.createElement('li');
            li.classList.add('basket__product-item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

        /**
         * Clear basket list and render it again
         *
         * @method renderBasketList
         */
        renderBasketList: function() {
            var self = this;

            this.clearBasketList();

            basket.forEach(function(item) {
                self.renderBasketElement(item);
            });
        },

        /**
         * Delete all element's from ul basket list
         *
         * @method clearBasketList
         */
        clearBasketList: function() {
            var listContainer = config.listContainer,
                listContainerChildrens = [].slice.call(
                    listContainer.children,
                    0
                );

            listContainerChildrens.forEach(function(child) {
                listContainer.removeChild(child);
            });
        },

        getBasket: function() {
            return basket;
        }
    };
})();

// PRODUCT LIST MODULE
var productList = (function() {
    var products = [];
    var config = {
        container: document.querySelector('.product-list'),
        listContainer: document.querySelector('.product-list__wrapper'),
        getItemsURL: 'The link to which the AJAX call will be made'
    };
    var info = {
        data: productsData //AJAX CALL
    };

    return {
        /**
         * Add products to product array and render all products
         *
         * @method init
         */
        init: function() {
            var data = info.data;
            var self = this;
            data.forEach(function(item) {
                products.push(item);
            });

            products.forEach(function(item) {
                self.renderProductElement(item);
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
        addItemToSelectedList: function(id, context, fn) {
            var data = info.data;
            var productObj = data.filter(function(item) {
                return id === item.id;
            })[0];

            context[fn](productObj);
        },

        /**
         * Get the product object and create HTML template to insert into DOM
         *
         * @method createProductElement
         * @param {Obejct} item A product object
         * @return {String} HTML template of basket element
         */
        createProductElement: function(item) {
            var template =
                '<div class="product-list__image-wrapper">' +
                '<img src="' +
                item.imgUrl +
                '" alt="' +
                item.name +
                '" class="basket__image">' +
                '</div>' +
                '<div class="product-list__info-wrapper">' +
                '<h4 class="product-list__caption">' +
                item.name +
                '</h4>' +
                '<div class="product-list__ingridients">' +
                item.ingridients +
                '</div>' +
                '<div class="product-list__btn-wrapper">' +
                '<div class="product-list__price">$' +
                item.price +
                '</div>' +
                '<button class="product-list__add-btn" onclick="productList.addItemToSelectedList(' +
                item.id +
                ", basket, 'addItem')\">Add to cart</button>" +
                '</div>' +
                '</div>';

            return template;
        },

        /**
         * Create li element with template and append it into DOM
         *
         * @method renderProductElement
         * @param {Object} item A product object
         */
        renderProductElement: function(item) {
            var template = this.createProductElement(item);
            var li = document.createElement('li');
            li.classList.add('product-list__item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

        getProductList: function() {
            return products;
        }
    };
})();

basket.init();
productList.init();
