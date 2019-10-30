/**
 * I use Singleton implementation of this class, because we have
 * same Header block in each page of web-app
 *
 * @class Header
 * @constructor
 * @param {}
 */
export default class Header {
    constructor(headerData = 'headerData') {
        // Singleton pattern implementation
        if (Header.instance) {
            return Header.instance;
        }

        this.headerData = headerData;
        Header.instance = this;

        this._config = {
            header: document.querySelector('.header'),
            menu: document.querySelector('.header__menu')
        };
        this._info = {
            menuItems: [
                {
                    name: 'Product list',
                    isActive: 'active'
                },
                {
                    name: 'Favorite list'
                },
                {
                    name: 'Contacts'
                },
                {
                    name: 'About Us'
                }
            ],
            logoItem: {
                url: 'assets/logo3.png'
            }
        };
        this._state = {};
    }

    /**
     * Render header element, menu items, set logo image
     *
     * @method init
     */
    init() {
        this._info.menuItems.forEach(el => {
            this.renderMenuElement(el);
        });

        this.renderLogoElement(this._info.logoItem);
    }

    /**
     * Get the menu item object and ceate HTML template to insert into DOM
     *
     * @method createMenuElement
     * @param {Object} item A menu item object
     * @return {String} HTML template of menu item
     */
    createMenuElement(item) {
        const template = `<a href="#" class="header__menu-link ${item.main ? item.isActive : ''}">${item.name}</a>`;
        return template;
    }

    /**
     * Create li element with template and append it into DOM
     *
     * @method renderMenuElement
     * @param {Object} item A menu item object
     */
    renderMenuElement(item) {
        const template = this.createMenuElement(item);
        const li = document.createElement('li');
        li.classList.add('header__menu-item');
        li.innerHTML = template;

        this._config.menu.appendChild(li);
    }

    /**
     * Get the menu item product and create HTML template to insert into DOM
     *
     * @method createLogoElement
     * @param {Object} item A menu item object
     */
    createLogoElement(item) {
        const template = `<img src="${item.url}" alt="" class="header__logo" />`;
        return template;
    }

    /**
     * Create image element with template and append it into DOM
     *
     * @method renderLogoElement
     * @param {Object} item A menu item object
     */
    renderLogoElement(item) {
        const template = this.createLogoElement(item);
        document.querySelector('.header__logo-wrapper').innerHTML = template;
    }
}
