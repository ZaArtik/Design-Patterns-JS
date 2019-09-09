var Singleton = (function() {
    var instance;

    function initUser(userData) {
        var logInInfo = new Date();

        var userInfo = userData;

        return {
            getUserInfo: function() {
                return userInfo;
            },
        }
    };

    return {
        getInstance: function(userData) {
            if (!instance) {
                instance = initUser(userData);
            }

            return instance;
        }
    }
}());

var btn = document.querySelector('.register-btn');
var newUser;
btn.onclick = function(e) {
    /**
     * Some ajax
     */
    e.preventDefault();

    var userData = {
        userId: 0,
        userLogin: document.querySelector('.input-login').value,
        userPassword: document.querySelector('.input-password').value,
        userName: document.querySelector('.input-name').value,
        userPhone: document.querySelector('.input-phone').value,
        userProfession: document.querySelector('.input-profession').value
    }
    newUser = Singleton.getInstance(userData);
    console.log(newUser.getUserInfo());
};


