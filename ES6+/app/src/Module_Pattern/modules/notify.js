const Notify = (function getNotifyPublicProperties() {
    const config = {};
    const info = {
        notifyActive: false,
        currentNotifyEl: null,
        hideTimeout: null
    };

    return {
        /**
         * Init config in separate func, because - render elements happen later
         * than config fields assignments
         *
         * @method initConfig
         */
        initConfig() {
            config.insertContainer = document.querySelector('.wrapper');
        },

        /**
         * Create notify template with indicated options
         *
         * @method createNotify
         * @param {Object} options Object with notify element options
         * @return {Object} Notify template and option with color and fz
         */
        createNotify(options) {
            this.initConfig();

            const boldText = options.boldText || 'Default';
            const text = options.text || 'Default';

            const template = `
            <div class="notify__info-wrapper">
                <strong>${boldText}</strong> ${text}
            </div>
            `;

            return {
                template,
                options
            };
        },

        /**
         * Create notify element, append into it template and tune styles
         *
         * @method showNotify
         * @param {Object} options Obejct with template and notify element options
         */
        showNotify(options) {
            if (info.notifyActive === true) {
                clearTimeout(info.hideTimeout);
                info.hideTimeout = setTimeout(() => {
                    info.currentNotifyEl.style.opacity = 0;
                    this.hideNotify(info.currentNotifyEl);
                }, 2000);

                return false;
            }

            let notifyInfoWrapper = null;
            const template = options.template || '';
            const color = options.color || '#000';
            const backgroundColor =
                options.backgroundColor || 'rgba(250, 128, 114, 0.7)';
            const fontSize = options.fontSize || '17px';

            const notifyEl = document.createElement('div');

            notifyEl.classList.add('notify');
            notifyEl.style.backgroundColor = backgroundColor;
            notifyEl.style.opacity = 0;
            notifyEl.style.color = color;
            notifyEl.innerHTML = template;

            config.insertContainer.appendChild(notifyEl);

            setTimeout(() => {
                info.currentNotifyEl = notifyEl;
                notifyEl.style.opacity = 1;
            }, 0);

            info.hideTimeout = setTimeout(() => {
                notifyEl.style.opacity = 0;
                this.hideNotify(notifyEl);
            }, 2000);

            notifyInfoWrapper = document.querySelector('.notify__info-wrapper');
            notifyInfoWrapper.style.fontSize = fontSize;
            info.notifyActive = true;

            return this;
        },

        /**
         * After 700 ms ( tranisition value of notify element ) remove element and do it
         * not active
         *
         * @method hideNotify
         * @param {Node} notifyEl Node of current notify element
         */
        hideNotify(notifyEl) {
            setTimeout(() => {
                config.insertContainer.removeChild(notifyEl);
                info.notifyActive = false;
            }, 700);
        }
    };
})();

export default Notify;
