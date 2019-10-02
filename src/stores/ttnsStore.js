import { observable, action, computed } from 'mobx';
import agent from '../agent';
import ordersStore from './ordersStore';
import commonStore from "./commonStore";

const LIMIT = 10;

export class TtnsStore {

    @observable isLoading = false;
    @observable page = 0;
    @observable totalPagesCount = 0;
    @observable ttnsRegistry = observable.map();
    @observable registriesRegistry = observable.map();
    @observable ordersCategoriesRegistry = observable.map();
    @observable predicate = {};
    @observable selectedTtnsRefs = [];
    @observable selectedTtnsIds = [];
    @observable miniTable = window.localStorage.getItem('miniTable') === "true";

    @computed get ttns() {
        return this.ttnsRegistry.values();
    };


    @computed get registries() {
        return this.registriesRegistry.values();
    };

    @computed get ordersCategories() {
        return this.ordersCategoriesRegistry.values();
    };


    @action setSetectedTtns(ids, refs)
    {
        this.selectedTtnsIds = ids;
        this.selectedTtnsRefs = refs;
    }

    @action createRegistryFromSelectedTtns()
    {
        let ttn;
        this.isLoading = true;
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: 'ScanSheet',
            calledMethod: 'insertDocuments',
            methodProperties: {
                DocumentRefs: this.selectedTtnsRefs
            }
        };
        agent.NP.post(data)
            .then(action((res) => {
                const ttnsString = {
                    ttns: this.selectedTtnsRefs
                };
                const rData = {
                    ref: res.data[0]['Ref'],
                    registryNumber: res.data[0]['Number'],
                    ttns: JSON.stringify(ttnsString),
                    date: res.data[0]['Date']
                };
                agent.Registries.create(rData)
                    .then(action((reg) => {
                        this.registriesRegistry.set(reg.id, reg);
                        this.selectedTtnsIds.forEach((id) => {
                            ttn = this.ttnsRegistry.get(id);
                            ttn.registry = reg.id;
                            agent.Ttns.updateTtnById(ttn);
                            this.ttnsRegistry.set(id, ttn);
                        });
                    }))
                    .finally(action(() => { this.isLoading = false; }));
            }));
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

    @action loadTtns() {
        this.isLoading = true;
        agent.Ttns.all()
            .then(action((ttns) => {
                this.ttnsRegistry.clear();
                ttns.forEach(ttn => this.ttnsRegistry.set(ttn.id, ttn));
                ordersStore.loadTtnStatuses(this.ttns);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadRegistries() {
        this.isLoading = true;
        agent.Registries.all()
            .then(action((registries) => {
                this.registriesRegistry.clear();
                registries.forEach(registry => this.registriesRegistry.set(registry.id, registry));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action deleteRegistries(ids, refs)
    {
        this.isLoading = true;
        ids.forEach((id) => {
            agent.Registries.deleteById(id)
                .then(action(() => {
                    this.registriesRegistry.delete(id);
                }));
        });
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: 'ScanSheet',
            calledMethod: 'deleteScanSheet',
            methodProperties: {
                ScanSheetRefs: refs
            }
        };
        agent.Registries.deleteByRefs(data)
            .finally(action(() => { this.isLoading = false; }));
    }

    @action fetchOrderById(id) {
        this.isLoading = true;
        return agent.Orders.getOrderById(id)
            .then(action((order) => {
                this.fetchedOrder = order;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action saveOrderById() {
        this.isLoading = true;
        return agent.Orders.saveOrderById(this.fetchedOrder)
            .then(action((order) => {
                this.fetchedOrder = order;
            }))
            .finally(action(() => { this.isLoading = false; }));
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

export default new TtnsStore();
