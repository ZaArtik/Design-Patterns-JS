var basket = (function() {
    // Some privates variables
    var basket = [];
    var config = {
        container: document.querySelector('.basket'),
        listContainer: document.querySelector('.basket__product-list'),
        openBtn: document.querySelector('.basket__icon-wrapper'),
        getItemsURL: 'The link to which the AJAX call will be made'
    };
    var info = {
        opened: false,
        changedBasket: true
    };

    // Return public methods and variables to work with them
    return {
        init: function() {
            var self = this;

            if (basket.length === 0) {
                console.log('Empty basket, calling AJAX');
                // Some AJAX call to fill the basket of elements
            }

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
        },

        addItem: function(item) {
            info.changedBasket = true;
            basket.push(item);
            console.log(item);
            if (info.opened) {
                this.renderBasketElement(item);
            }
        },

        removeItem: function(id) {
            info.changedBasket = true;
            basket = basket.filter(function(product) {
                if (id !== product.id) {
                    return true;
                }
            });
            this.renderBasketList();
        },

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
                '<button class="basket__remove-product"></button>' +
                '<div class="basket__product-quantity"></div>' +
                '<button class="basket__add-product"></button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="basket__delete-product" onclick="basket.removeItem('+ 
                item.id +
                ')"></div>';

            return template;
        },

        renderBasketElement: function(item) {
            var template = this.createBasketElement(item);
            var li = document.createElement('li');
            li.classList.add('basket__product-item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

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

        renderBasketList: function() {
            var self = this;

            this.clearBasketList();

            basket.forEach(function(item) {
                self.renderBasketElement(item);
            });
        },

        getBasket: function() {
            return basket;
        }
    };
})();

var productList = (function() {
    var products = [];
    var config = {
        container: document.querySelector('.product-list'),
        listContainer: document.querySelector('.product-list__wrapper'),
        getItemsURL: 'The link to which the AJAX call will be made'
    };
    var info = {
        data: productsData //AJAX CALL
    }

    return {
        init: function() {
            var data = info.data;
            var self = this;
            data.forEach(function(item) {
                products.push(item);
            });

            products.forEach(function(item) {
                self.renderProductList(item);
            });
        },

        addItemToSelectedList: function(id, context, fn) {
            var data = info.data;
            var productObj = data.filter(function(item){
                return id === item.id;
            })[0];

            context[fn](productObj);
        },

        renderProductList: function(item) {
            var template = this.createProductElement(item);
            var li = document.createElement('li');
            li.classList.add('product-list__item');
            li.innerHTML = template;

            config.listContainer.appendChild(li);
        },

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
                ', basket, \'addItem\')">Add to cart</button>' +
                '</div>' +
                '</div>';

            return template;
        },

        getProductList: function() {
            return products;
        }
    };
})();

basket.init();
productList.init();

console.time('Add item to basket');
basket.addItem({
    id: 0,
    name: 'Apple',
    type: 'Fruit',
    imgUrl: 'assets/orange.png',
    price: '2.75'
});
console.timeEnd('Add item to basket');