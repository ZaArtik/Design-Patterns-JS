import './singleton.scss';

class Singleton {
    // eslint-disable-line no-unused-vars

    constructor(userData = '') {
        if (Singleton.instance) {
            return Singleton.instance;
        }

        this.userInfo = userData;

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
    const newUser2 = new Singleton();
    console.log(newUser2);
};
