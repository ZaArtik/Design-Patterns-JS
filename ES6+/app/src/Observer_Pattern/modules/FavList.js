// Custom modules
import GlobalState from '../globalState';
import { FavoriteListTemplate } from '../customElements';
import productsData from '../../templates/Basket_Template/products';

// Observer
import favListObserver from '../observers/favListObserver';

/**
 * I use Singleton implementation of this class, because we have
 * same FavoriteList block in each page of web-app
 *
 * @class Header
 * @constructor
 * @param {}
 */
export default class FavoriteList {
    constructor(favoriteData = 'favoriteData') {
        // Singleton pattern implementation
        if (FavoriteList.instance) {
            return FavoriteList.instance;
        }

        this.FavoriteData = favoriteData;
        FavoriteList.instance = this;

        this._config = {
            maincontent: document.querySelector('.maincontent')
        };
        this._info = {
            favList: []
        };
        this._state = {
            isOnPage: false
        };
    }

    initConfig() {
        [, this._config.favListLink] = document.querySelectorAll(
            '.header__menu-link'
        );
    }

    init() {
        this.initConfig();

        this._config.favListLink.onclick = () => {
            this.openFavListPage();
        };

        this.renderAllProdOfFavList();

        if (GlobalState.activePage === 'favList') {
            document
                .querySelectorAll('.product-list__favorite-star')
                .forEach(el => {
                    el.onclick = () => {
                        this.removeFromFavoriteList(+el.dataset.product_id);
                    };
                });
        }

        favListObserver.subscribe(({ id, toDelete }) => {
            if (!toDelete) {
                productsData.forEach(product => {
                    if (
                        product.id === id &&
                        !this._info.favList.some(
                            favProd => favProd.id === product.id
                        )
                    ) {
                        this._info.favList.push(product);
                    }
                });
            } else {
                this._info.favList = this._info.favList.filter(
                    favProd => favProd.inFavList
                );
            }
        });
    }

    createFavListProductElement(item) {
        const template = `
        <div class="product-list__image-wrapper">
            <div class="product-list__favorite-star ${
                item.inFavList ? 'product-list__favorite-star--active' : ''
            }" data-product_id="${item.id}"></div>
            <img src="${item.imgUrl}" alt="${
            item.name
        }" class="product-list__image">
        </div>
        <div class="product-list__info-wrapper">
            <h4 class="product-list__caption">${item.name}</h4>
            <div class="product-list__ingridients">${item.ingridients}</div>
            <div class="product-list__btn-wrapper">
                <div class="product-list__price">$${item.price}</div>
                <button class="product-list__add-btn" onclick="console.log('Not in this implementation :D')">Add to cart</button>
            </div>
        </div>
    `;

        return template;
    }

    renderFavListProductElement(item) {
        const template = this.createFavListProductElement(item);
        const li = document.createElement('li');
        li.classList.add('product-list__item');
        li.innerHTML = template;

        document.querySelector('.favorite-list__wrapper').appendChild(li);
    }

    renderAllProdOfFavList() {
        this.clearElementsFromFavList();
        this._info.favList.forEach(el => {
            this.renderFavListProductElement(el);
        });
    }

    clearElementsFromFavList() {
        const listNode = document.querySelector('.favorite-list__wrapper');
        if (listNode && listNode.childNodes) {
            while (listNode.firstChild) {
                listNode.removeChild(listNode.firstChild);
            }
        }
    }

    openFavListPage() {
        if (!GlobalState.activePage !== 'favList') {
            this._config.maincontent.innerHTML = '';
            this._config.maincontent.appendChild(new FavoriteListTemplate());

            GlobalState.activePage = 'favList';
            this.init();
        }
    }

    removeFromFavoriteList(id) {
        document
            .querySelectorAll('.product-list__favorite-star')
            .forEach(el => {
                if (+el.dataset.product_id === id) {
                    el.closest('.product-list__item').remove();
                }
            });

        this._info.favList = this._info.favList.filter(
            favProd => favProd.id !== id
        );

        favListObserver.broadcast(id);
    }
}
