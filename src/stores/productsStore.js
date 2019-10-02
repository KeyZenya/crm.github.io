import { observable, action, computed } from 'mobx';
import agent from '../agent';

const LIMIT = 10;

export class ProductsStore {

    @observable isLoading = false;
    @observable page = 0;
    @observable totalPagesCount = 0;
    @observable productsRegistry = observable.map();
    @observable ordersCategoriesRegistry = observable.map();
    @observable predicate = {};
    @observable fetchedProduct = {
        name: '',
        basePrice: '',
        purchasePrice: '',
        amount: 0,
        npWeight: '',
        npWidth: '',
        npHeight: '',
        npLength: '',
        npDescriptionText: '',
        npDescription: '',
    };
    @observable miniTable = window.localStorage.getItem('miniTable') === "true";

    @computed get products() {
        return this.productsRegistry.values();
    };

    @computed get ordersCategories() {
        return this.ordersCategoriesRegistry.values();
    };

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

    @action loadProducts() {
        this.isLoading = true;
        agent.Products.all()
            .then(action((products) => {
                this.productsRegistry.clear();
                products.forEach(product => this.productsRegistry.set(product.id, product));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action fetchProductById(id) {
        this.isLoading = true;
        return agent.Products.getProductById(id)
            .then(action((product) => {
                this.fetchedProduct = product;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action saveProductById() {
        this.isLoading = true;
        return agent.Products.saveProductById(this.fetchedProduct)
            .then(action((product) => {
                this.fetchedProduct = product;
                this.productsRegistry.set(this.fetchedProduct.id, this.fetchedProduct);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action createProduct() {
        this.isLoading = true;
        return agent.Products.createProduct(this.fetchedProduct)
            .then(action((product) => {
                this.fetchedProduct = product;
                this.productsRegistry.set(this.fetchedProduct.id, this.fetchedProduct);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action deleteProduct() {
        this.isLoading = true;
        return agent.Products.deleteProductById(this.fetchedProduct.id)
            .then(() => {
                this.productsRegistry.delete(this.fetchedProduct.id);
            })
            .finally(action(() => { this.isLoading = false; }));
    }

    @action setFetchedProductProperty(name, value)
    {
        this.fetchedProduct[name] = value;
    }

    @action clearFetchedProduct()
    {
        this.fetchedProduct = {
            name: '',
            basePrice: '',
            purchasePrice: '',
            amount: 0,
            npWeight: '',
            npWidth: '',
            npHeight: '',
            npLength: '',
            npDescriptionText: '',
            npDescription: '',
        };
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

export default new ProductsStore();
