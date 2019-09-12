// Importing styles, templates and other helper modules
import './singleton.scss';
import singletonTemplate from './singleton-template';

// HTML Custom element implementation
class SingletonTemplate extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = singletonTemplate;
    }
}

customElements.define('singleton-template', SingletonTemplate);
document.querySelector('.wrapper').appendChild(new SingletonTemplate());


// Code of Design Pattern
class Singleton {
    // eslint-disable-line no-unused-vars

    constructor(userData = '') {
        if (Singleton.instance) {
            return Singleton.instance;
        }

        this.userInfo = userData;

        // Since protected classes cannot be imitated in these classes,
        // we store the instance implementation in a static property
        Singleton.instance = this;

        return this;
    }

    getUserInfo() {
        return this.userInfo;
    }
}

const btn = document.querySelector('.register-btn');
let newUser;
btn.onclick = function (e) {
    /**
     * Some ajax
     */
    e.preventDefault();

    const userData = {
        userId: 0,
        userLogin: document.querySelector('.input-login').value,
        userPassword: document.querySelector('.input-password').value,
        userName: document.querySelector('.input-name').value,
        userPhone: document.querySelector('.input-phone').value,
        userProfession: document.querySelector('.input-profession').value
    };
    newUser = new Singleton(userData);
    console.log(newUser);
};
