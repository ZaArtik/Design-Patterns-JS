// Importing styles, templates and other helper modules
import '../templates/Basket_Template/basket.scss';
import '../templates/FavList_Template/header.scss';
import '../templates/FavList_Template/favList.scss';

// Importing modules
import productList from './modules/productList';
import Header from './modules/Header';
import FavoriteList from './modules/FavList';

// File with custom elements
import customElements from './customElements';

console.log(customElements);

const header = new Header();
const favList = new FavoriteList();

new Promise(resolve => {
    header.init();
    resolve();
}).then(() => {
    productList.init();
    favList.init();
});

// const pubsub = {};

// (function(q) {
//     const topics = {};
//     let subUid = -1;

//     q.publish = function(topic, args) {
//         if (!topics[topic]) {
//             return false;
//         }

//         const subscibers = topics[topic];
//         let len = subscibers ? subscibers.length : 0;

//         while (len) {
//             len -= 1;
//             subscibers[len].func(topic, args);
//         }

//         return this;
//     };

//     q.subscribe = function(topic, func) {
//         if (!topics[topic]) {
//             topics[topic] = [];
//         }

//         const token = (subUid += 1).toString();
//         topics[topic].push({
//             token,
//             func
//         });

//         return token;
//     };

//     q.unsubscribe = function(token) {
//         Object.keys(topics).forEach(topic => {
//             if (topics[topic]) {
//                 topics[topic].forEach((el, idx) => {
//                     console.log(el);
//                     if (el.token === token) {
//                         topics[topic].splice(idx, 1);
//                     }
//                 });
//             }
//         });
//         return this;
//     };

//     q.getTopics = function() {
//         return topics;
//     };
// })(pubsub);

// const grid = {
//     addEntry(data) {
//         if (data !== undefined) {
//             console.log(`Entry: ${data.title} \nChangenet ${data.changenet}
//  / ${data.percentage}% added`);
//         }
//     },

//     updateCounter(timestamp) {
//         console.log(`Data is refreshed at: ${timestamp}`);
//     }
// };

// const gridUpdate = (topics, data) => {
//     grid.addEntry(data);
//     grid.updateCounter(data.timestamp);
// };

// const gridSubscription = pubsub.subscribe('gridUpdated', gridUpdate);
// console.log(gridSubscription);

// pubsub.publish('gridUpdated', {
//     title: 'Microsoft shares',
//     changenet: 4,
//     percentage: 33,
//     timestamp: '17:34:12'
// });
