import { observable, action, computed } from 'mobx';
import agent from '../agent';
import ordersStore from './ordersStore';
import commonStore from './commonStore';

const LIMIT = 10;

export class npStore {

    @observable isLoading = false;
    @observable page = 0;
    @observable totalPagesCount = 0;
    @observable senderCounterpartiesRegistry = observable.map();
    @observable recipientCounterpartiesRegistry = observable.map();
    @observable ordersCategoriesRegistry = observable.map();
    @observable predicate = {};
    @observable fetchedOrderStartingOrderCategory = 0;
    @observable miniTable = window.localStorage.getItem('miniTable') === "true";
    @observable typesOfPayersRegistry = observable.map();
    @observable typesOfPayersForRedeliveryRegistry = observable.map();
    @observable paymentFormsRegistry = observable.map();
    @observable cargoTypesRegistry = observable.map();
    @observable sendDatesRegistry = observable.map();
    @observable npApiKeysRegistry = observable.map();
    @observable npApiKey = {
        id: 0,
        name: '',
        key: '',
    };

    @computed get senderCounterparties() {
        return this.senderCounterpartiesRegistry.values();
    };

    @computed get ordersCategories() {
        return this.ordersCategoriesRegistry.values();
    };

    @computed get typesOfPayers() {
        return this.typesOfPayersRegistry.values();
    };

    @computed get typesOfPayersForRedelivery() {
        return this.typesOfPayersForRedeliveryRegistry.values();
    };

    @computed get paymentForms() {
        return this.paymentFormsRegistry.values();
    };

    @computed get cargoTypes() {
        return this.cargoTypesRegistry.values();
    };

    @computed get sendDates() {
        return this.sendDatesRegistry.values();
    };

    @computed get npApiKeys() {
        return this.npApiKeysRegistry.values();
    };

    @action setNpApiKeyName(name)
    {
        this.npApiKey.name = name;
    }

    @action setNpApiKeyKey(key)
    {
        this.npApiKey.key = key;
    }

    @action createNpApiKey()
    {
        this.isLoading = true;
        agent.NP.create(this.npApiKey)
            .then(action(npApiKey => {
               this.npApiKey = npApiKey;
               this.npApiKeysRegistry.set(npApiKey.id, npApiKey);
            }))
            .finally(action(() => { this.isLoading = false; }))
    }

    @action loadSendDates() {
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        let yyyy = today.getFullYear();
        if(dd<10)
            dd='0'+dd;
        if(mm<10)
            mm='0'+mm;
        const value1 = dd+'.'+mm+'.'+yyyy;
        today.setDate(today.getDate()+1);
        dd = today.getDate();
        mm = today.getMonth()+1;
        yyyy = today.getFullYear();
        if(dd<10)
            dd='0'+dd;
        if(mm<10)
            mm='0'+mm;
        var value2 = dd+'.'+mm+'.'+yyyy;
        today.setDate(today.getDate()+1);
        dd = today.getDate();
        mm = today.getMonth()+1;
        yyyy = today.getFullYear();
        if(dd<10)
            dd='0'+dd;
        if(mm<10)
            mm='0'+mm;
        const value3 = dd+'.'+mm+'.'+yyyy;
        this.sendDatesRegistry.set('1', value1);
        this.sendDatesRegistry.set('2', value2);
        this.sendDatesRegistry.set('3', value3);
        ordersStore.setTtnDataProperty('DateTime', value1);
    }

    @action loadSenderCounterparties() {
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: 'Counterparty',
            calledMethod: 'getCounterparties',
            methodProperties: {
                CounterpartyProperty: 'Sender'
            }
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((cp) => {
                    this.senderCounterpartiesRegistry.set(cp.Ref, cp);
                });
                ordersStore.setTtnDataProperty('Sender', res.data[0].Ref);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadRecipientCounterparties() {
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: 'Counterparty',
            calledMethod: 'getCounterparties',
            methodProperties: {
                CounterpartyProperty: 'Recipient'
            }
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((cp) => {
                    this.recipientCounterpartiesRegistry.set(cp.Ref, cp);
                });
                ordersStore.setTtnDataProperty('Recipient', res.data[0].Ref);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadNpApiKeys()
    {
        this.isLoading = true;
        agent.NP.getNpApiKeys()
            .then(action((npApiKeys) => {
                npApiKeys.forEach((npApiKey) => {
                    this.npApiKeysRegistry.set(npApiKey.id, npApiKey);
                });
                // commonStore.setNpApiKey(npApiKeys[0].key);
            }))
            .finally(action(() => { this.isLoading = false; }));

    }

    @action loadTypesOfPayers() {
        this.isLoading = true;
        const data = {
            modelName: "Common",
            calledMethod: "getTypesOfPayers",
            methodProperties: {}
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((tp) => {
                    this.typesOfPayersRegistry.set(tp.Ref, tp);
                });
                ordersStore.setTtnDataProperty('PayerType', res.data[1].Ref);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadTypesOfPayersForRedelivery() {
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: "Common",
            calledMethod: "getTypesOfPayersForRedelivery",
            methodProperties: {}
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((tpfr) => {
                    this.typesOfPayersForRedeliveryRegistry.set(tpfr.Ref, tpfr);
                });
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadPaymentForms() {
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: "Common",
            calledMethod: "getPaymentForms",
            methodProperties: {}
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((pf) => {
                    this.paymentFormsRegistry.set(pf.Ref, pf);
                });
                ordersStore.setTtnDataProperty('PaymentMethod', res.data[1].Ref);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadCargoTypes() {
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: "Common",
            calledMethod: "getCargoTypes",
            methodProperties: {}
        };
        agent.NP.post(data)
            .then(action((res) => {
                res.data.forEach((ct) => {
                    this.cargoTypesRegistry.set(ct.Ref, ct);
                });
                ordersStore.setTtnDataProperty('CargoType', res.data[1].Ref);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    clear() {
        this.ordersRegistry.clear();
        this.page = 0;
    }

    @action setPage(page) {
        this.page = page;
    }

    @action setPredicate(predicate) {
        if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return;
        this.clear();
        this.predicate = predicate;
    }

    $req() {
        if (this.predicate.ordersList) return agent.Orders.all();
        if (this.predicate.favoritedBy) return agent.Orders.favoritedBy(this.predicate.favoritedBy, this.page, LIMIT);
        if (this.predicate.tag) return agent.Orders.byTag(this.predicate.tag, this.page, LIMIT);
        if (this.predicate.author) return agent.Orders.byAuthor(this.predicate.author, this.page, LIMIT);
        return agent.Orders.all();
    }

    @action loadOrders() {
        this.isLoading = true;
        return this.$req()
            .then(action((orders) => {
                this.ordersRegistry.clear();
                orders.forEach(order => this.ordersRegistry.set(order.id, order));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadOrderCategories() {
        this.isLoading = true;
        agent.OrderCategories.all()
            .then(action((categories) => {
                this.ordersCategoriesRegistry.clear();
                categories.forEach(cat => this.ordersCategoriesRegistry.set(cat.id, cat));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action fetchOrderById(id) {
        this.isLoading = true;
        return agent.Orders.getOrderById(id)
            .then(action((order) => {
                this.fetchedOrder = order;
                this.fetchedOrderStartingOrderCategory = this.fetchedOrder.orderCategory;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action saveOrderById() {
        this.isLoading = true;
        const today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1;
        const yyyy = today.getFullYear();
        if(dd<10)
            dd='0'+dd;
        if(mm<10)
            mm='0'+mm;
        const updated = yyyy+'-'+mm+'-'+dd;
        this.fetchedOrder.updated = updated;
        if(this.fetchedOrderStartingOrderCategory !== this.fetchedOrder.orderCategory)
        {
            if(this.fetchedOrder.orderCategory === 2)
            {
                this.fetchedOrder.sent = updated;
            }
            if(this.fetchedOrder.orderCategory === 1 || this.fetchedOrder.orderCategory === 3 || this.fetchedOrder.orderCategory === 7)
            {
                this.fetchedOrder.sent = null;
            }
        }
        return agent.Orders.saveOrderById(this.fetchedOrder)
            .then(action((order) => {
                this.fetchedOrder = order;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action injectEditedOrderToAll()
    {
        // const foundIndex = this.orders.findIndex(x => x.id === this.fetchedOrder.id);
        this.ordersRegistry.set(this.fetchedOrder.id, this.fetchedOrder);
    }

    @action setFetchedOrderProperty(name, value)
    {
        this.fetchedOrder[name] = value;
    }

    @action removeProduct(id)
    {
        const parsedProducts = JSON.parse(this.fetchedOrder.products);
        const newProducts = {
            products: parsedProducts.products.filter(product => product.id !== id)
        };
        this.fetchedOrder.products = JSON.stringify(newProducts);
    }

    @action addProduct(product, amount)
    {
        const parsedProducts = JSON.parse(this.fetchedOrder.products);
        parsedProducts.products.push({id: product.value, price: product.price * amount, amount: amount});
        this.fetchedOrder.products = JSON.stringify(parsedProducts);
    }

    @action setFetchedOrderCustomerName(name)
    {
        this.fetchedOrder.customerName = name;
    }
    @action setFetchedOrderPhone(phone)
    {
        this.fetchedOrder.phone = phone;
    }
    @action setFetchedOrderComment(comment)
    {
        this.fetchedOrder.comment = comment;
    }
    @action setFetchedOrderApiKey(apiKey)
    {
        this.fetchedOrder.apiKey = apiKey;
    }
    @action setFetchedOrderProducts(products)
    {
        this.fetchedOrder.products = products;
    }
    @action setFetchedOrderPayment(payment)
    {
        this.fetchedOrder.payment = payment;
    }
    @action setFetchedOrderDelivery(delivery)
    {
        this.fetchedOrder.delivery = delivery;
    }
    @action setFetchedOrderCityName(cityName)
    {
        this.fetchedOrder.cityName = cityName;
    }
    @action setFetchedOrderCityRef(cityRef)
    {
        this.fetchedOrder.cityRef = cityRef;
    }
    @action setFetchedOrderNpDepartureName(npDepartureName)
    {
        this.fetchedOrder.customerName = npDepartureName;
    }
    @action setFetchedOrderNpDepartureRef(npDepartureRef)
    {
        this.fetchedOrder.customerName = npDepartureRef;
    }
    @action setFetchedOrderTtn(ttn)
    {
        this.fetchedOrder.ttn = ttn;
    }
    @action setFetchedOrderSent(sent)
    {
        this.fetchedOrder.sent = sent;
    }
    @action setFetchedOrderUpdated(updated)
    {
        this.fetchedOrder.updated = updated;
    }
    @action setFetchedOrderOrderCategory(orderCategory)
    {
        this.fetchedOrder.orderCategory = orderCategory;
    }


    @action getFetchedOrder() {
        return this.fetchedOrder;
    }

    @action loadArticle(slug, { acceptCached = false } = {}) {
        if (acceptCached) {
            const article = this.getArticle(slug);
            if (article) return Promise.resolve(article);
        }
        this.isLoading = true;
        return agent.Articles.get(slug)
            .then(action(({ article }) => {
                this.articlesRegistry.set(article.slug, article);
                return article;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action makeFavorite(slug) {
        const article = this.getArticle(slug);
        if (article && !article.favorited) {
            article.favorited = true;
            article.favoritesCount++;
            return agent.Articles.favorite(slug)
                .catch(action(err => {
                    article.favorited = false;
                    article.favoritesCount--;
                    throw err;
                }));
        }
        return Promise.resolve();
    }

    @action unmakeFavorite(slug) {
        const article = this.getArticle(slug);
        if (article && article.favorited) {
            article.favorited = false;
            article.favoritesCount--;
            return agent.Articles.unfavorite(slug)
                .catch(action(err => {
                    article.favorited = true;
                    article.favoritesCount++;
                    throw err;
                }));
        }
        return Promise.resolve();
    }

    @action createArticle(article) {
        return agent.Articles.create(article)
            .then(({ article }) => {
                this.articlesRegistry.set(article.slug, article);
                return article;
            })
    }

    @action updateArticle(data) {
        return agent.Articles.update(data)
            .then(({ article }) => {
                this.articlesRegistry.set(article.slug, article);
                return article;
            })
    }

    @action deleteArticle(slug) {
        this.articlesRegistry.delete(slug);
        return agent.Articles.del(slug)
            .catch(action(err => { this.loadArticles(); throw err; }));
    }

    @action setMiniTable(miniTable) {
        this.miniTable = miniTable;
        window.localStorage.setItem('miniTable', this.miniTable);
    }
}

export default new npStore();
