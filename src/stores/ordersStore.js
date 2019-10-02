import { observable, action, computed } from 'mobx';
import agent from '../agent';
import productsStore from './productsStore';
import commonStore from './commonStore';
import ttnsStore from './ttnsStore';
import npStore from './npStore';

const LIMIT = 10;

export class OrdersStore {

    @observable isLoading = false;
    @observable page = 0;
    @observable totalPagesCount = 0;
    @observable ordersRegistry = observable.map();
    @observable ordersCategoriesRegistry = observable.map();
    @observable predicate = {};
    @observable fetchedOrder = {
        id: 0,
        customerName: '',
        phone: '',
        comment: '',
        apiKey: '',
        products: '{"products":[{"id":0,"price":0,"amount":0}]}',
        paymentName: '',
        payment: '',
        deliveryName: '',
        delivery: '',
        cityName: '',
        cityRef: 'emptyDefault',
        npDepartureName: '',
        npDepartureRef: '',
        ttn: 0,
        created: '2019-01-01',
        sent: '2019-01-01',
        updated: '2019-01-01',
        site: '',
        orderCategoryName: '',
        orderCategory: 0,
        utmSource: '',
        utmMedium: '',
        utmTerm: '',
        utmContent: '',
        utmCampaign: '',
    };

    @observable createTtnData = {
        PayerType: '',
        PaymentMethod: '',
        DateTime: '',
        CargoType: '',
        VolumeGeneral: 0,
        Weight: 0,
        ServiceType: 'WarehouseWarehouse',
        SeatsAmount: 1,
        Width: 0,
        Height: 0,
        Length: 0,
        Description: '',
        DescriptionName: '',
        Cost: 0,
        CitySenderName: '',
        CitySender: '',
        Sender: '',
        SenderAddressName: '',
        SenderAddress: '',
        ContactSender: '',
        SendersPhone: '',
        CityRecipient: '',
        Recipient: '',
        RecipientAddress: '',
        ContactRecipient: '',
        RecipientsPhone: '',
    };

    @observable fetchedOrderCategory = {
        id: 0,
        name: '',
        status: '',
        color: '#3570e3'
    };

    @observable payments = {
        pre: 'Передоплата',
        cod: 'Накладений платіж'
    };

    @observable deliveries = {
        np: 'Нова пошта',
        up: 'Укр пошта'
    };

    @observable finalTtnData = {};
    @observable fetchedOrderStartingOrderCategory = 0;
    @observable miniTable = window.localStorage.getItem('miniTable') === "true";

    @computed get orders() {
        return this.ordersRegistry.values();
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


    @action loadOrderCategories() {
        this.isLoading = true;
        agent.OrderCategories.all()
            .then(action((categories) => {
                this.ordersCategoriesRegistry.clear();
                categories.forEach(cat => this.ordersCategoriesRegistry.set(cat.id, cat));
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action loadOrders() {
        this.isLoading = true;
            agent.Orders.all()
                .then(action((orders) => {
                    this.ordersRegistry.clear();

                    orders.forEach(order => {
                        const name = this.ordersCategoriesRegistry.get(order.orderCategory).name;
                        order.orderCategoryName = name;
                        this.ordersRegistry.set(order.id, order);
                    });
                })).finally(action(() => { this.isLoading = false; }));


    }

    @action loadTtnStatuses(ttns)
    {
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: "TrackingDocument",
            calledMethod: "getStatusDocuments",
            methodProperties: {
                Documents: [],
            }
        };

        const ttnRefs = [];
        ttns.forEach(ttn => {
            ttnRefs.push(ttn.id);
            data.methodProperties.Documents.push(
                {
                    DocumentNumber: ttn.ttnNumber,
                    Phone:""
                })
        });
        this.isLoading = true;
        let ttn, order;
        // console.log(this.orders);
        console.log(ttnRefs);
        agent.NP.post(data)
            .then(action((res) => {
                console.log(res);
                res.data.forEach((info, index) => {
                    this.orders.forEach(order => {
                        if(order.ttn == ttnRefs[index])
                        {
                            order.npInfo = info.Status
                            this.ordersRegistry.set(order.id, order);
                        }
                    });
                   // console.log(ttnsStore.ttnsRegistry.entries(ttnNumber, "20450168380374"));
                });
            }))
            .finally(action(() => { this.isLoading = false; }));
    }


    @action clearCreateTtnData()
    {
        this.createTtnData = {
            // PayerType: '',
            // PaymentMethod: '',
            // DateTime: '',
            // CargoType: '',
            VolumeGeneral: 0,
            Weight: 0,
            // ServiceType: 'WarehouseWarehouse',
            SeatsAmount: 1,
            Width: 0,
            Height: 0,
            Length: 0,
            // Description: '',
            // DescriptionName: '',
            Cost: 0,
            // CitySenderName: '',
            // CitySender: '',
            // Sender: '',
            // SenderAddress : '',
            // SenderAddressName: '',
            // ContactSender: '',
            // SendersPhone: '',
            // CityRecipient: '',
            // Recipient: '',
            // RecipientAddress: '',
            // ContactRecipient: '',
            // RecipientsPhone: '',
        };
    }

    @action loadEditingOrderToTtn() {
        this.createTtnData = {
            ...this.createTtnData,
            VolumeGeneral: 0,
            Weight: 0,
            SeatsAmount: 1,
            Width: 0,
            Height: 0,
            Length: 0,
            Cost: 0,
        };
        const parsedProducts = JSON.parse(this.fetchedOrder.products);
        const firstProduct = productsStore.productsRegistry.get(parsedProducts.products[0]['id']);
        this.createTtnData.Description = firstProduct['npDescription'];
        this.createTtnData.DescriptionName = firstProduct['npDescriptionText'];
        this.createTtnData.Width = firstProduct['npWidth'];
        this.createTtnData.Height = firstProduct['npHeight'];
        this.createTtnData.Length = firstProduct['npLength'];
        this.createTtnData.VolumeGeneral = this.createTtnData.Width * this.createTtnData.Height * this.createTtnData.Length / 1000000;
        if(parsedProducts.products.length > 1)
        {
            this.createTtnData.Description = 'c57bf972-3bb3-11e3-b441-0050568002cf';
            this.createTtnData.DescriptionName = 'Побутові речі';
            this.createTtnData.Width = 0;
            this.createTtnData.Height = 0;
            this.createTtnData.Length = 0;
            this.createTtnData.VolumeGeneral = 0;
        }
        parsedProducts.products.forEach((product) => {
            this.createTtnData.Cost += product.price;
            this.createTtnData.Weight += productsStore.productsRegistry.get(product['id'])['npWeight'];
        });
    }

    @action fetchOrderById(id) {
        this.isLoading = true;
        return agent.Orders.getOrderById(id)
            .then(action((order) => {
                this.fetchedOrder = order;
                this.fetchedOrder.paymentName = this.payments[this.fetchedOrder.payment];
                this.fetchedOrder.deliveryName = this.deliveries[this.fetchedOrder.delivery];
                this.fetchedOrder.orderCategoryName = this.ordersCategoriesRegistry.get(order.orderCategory).name;
                this.fetchedOrderStartingOrderCategory = this.fetchedOrder.orderCategory;
                console.log(this.fetchedOrder);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action fetchOrderCategoryById(id) {
        this.isLoading = true;
        return agent.OrderCategories.getOrderCategoryById(id)
            .then(action((orderCategory) => {
                this.fetchedOrderCategory = orderCategory;
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action saveOrderCategoryById() {
        this.isLoading = true;
        // this.fetchedOrderCategory.status = this.cyrill_to_latin(this.fetchedOrderCategory.name);
        return agent.OrderCategories.saveOrderCategoryById(this.fetchedOrderCategory)
            .then(action((orderCategory) => {
                this.fetchedOrderCategory = orderCategory;
                this.ordersCategoriesRegistry.set(orderCategory.id, orderCategory);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    cyrill_to_latin(text) {
        const arrru = new Array ('Я','я','Ю','ю','Ч','ч','Ш','ш','Щ','щ','Ж','ж','А','а','Б','б','В','в','Г','г','Д','д','Е','е','Ё','ё','З','з','И','и','Й','й','К','к','Л','л','М','м','Н','н', 'О','о','П','п','Р','р','С','с','Т','т','У','у','Ф','ф','Х','х','Ц','ц','Ы','ы','Ь','ь','Ъ','ъ','Э','э');
        const arren = new Array ('Ya','ya','Yu','yu','Ch','ch','Sh','sh','Sh','sh','Zh','zh','A','a','B','b','V','v','G','g','D','d','E','e','E','e','Z','z','I','i','J','j','K','k','L','l','M','m','N','n', 'O','o','P','p','R','r','S','s','T','t','U','u','F','f','H','h','C','c','Y','y','`','`','\'','\'','E', 'e');
        for(let i=0; i<arrru.length; i++){
            let reg = new RegExp(arrru[i], "g");
            text = text.replace(reg, arren[i]);
        }
        return text;
    }

    @action createOrderCategory() {
        this.isLoading = true;
        this.fetchedOrderCategory.status = this.cyrill_to_latin(this.fetchedOrderCategory.name);
        return agent.OrderCategories.create(this.fetchedOrderCategory)
            .then(action((orderCategory) => {
                this.fetchedOrderCategory = orderCategory;
                this.ordersCategoriesRegistry.set(orderCategory.id, orderCategory);
            }))
            .finally(action(() => { this.isLoading = false; }));
    }

    @action createTtnForFetchedOrder()
    {
        this.isLoading = true;
        const recipientName = this.fetchedOrder.customerName;
        var cpData = {
            apiKey: '9d1f260416fcc08c389f38af1eaf299b',
            modelName: 'ContactPerson',
            calledMethod: 'save',
            methodProperties: {
                CounterpartyRef: this.createTtnData.Recipient,
                FirstName: recipientName.split(' ')[0],
                LastName: recipientName.split(' ')[1],
                Phone: this.fetchedOrder.phone
            }
        };
        if(recipientName.split(' ')[2])
        {
            cpData.methodProperties.LastName = recipientName.split(' ')[2];
            cpData.methodProperties.MiddleName = recipientName.split(' ')[1];
        }
        this.finalTtnData = {
            apiKey: '9d1f260416fcc08c389f38af1eaf299b',
            modelName: 'InternetDocument',
            calledMethod: 'save',
            methodProperties: {
                PayerType: this.createTtnData.PayerType,
                PaymentMethod: this.createTtnData.PaymentMethod,
                DateTime: this.createTtnData.DateTime,
                CargoType: this.createTtnData.CargoType,
                VolumeGeneral: this.createTtnData.VolumeGeneral,
                Weight: this.createTtnData.Weight,
                ServiceType: this.createTtnData.ServiceType,
                SeatsAmount: this.createTtnData.SeatsAmount,
                Description: this.createTtnData.Description,
                Cost: this.createTtnData.Cost,
                CitySender: this.createTtnData.CitySender,
                Sender: this.createTtnData.Sender,
                SenderAddress: this.createTtnData.SenderAddress,
                ContactSender: this.createTtnData.ContactSender,
                SendersPhone: this.createTtnData.SendersPhone,
                CityRecipient: this.fetchedOrder.cityRef,
                Recipient: this.createTtnData.Recipient,
                RecipientAddress: this.fetchedOrder.npDepartureRef,
                RecipientsPhone: this.fetchedOrder.phone
            }
        };
        agent.NP.post(cpData)
            .then(action((res) => {
                this.finalTtnData.methodProperties.ContactRecipient = res.data[0]['Ref'];
                agent.NP.post(this.finalTtnData)
                    .then(action((res) => {
                        const ttnData = {
                            ref: res.data[0]['Ref'],
                            deliveryCosts: res.data[0]['CostOnSite'],
                            deliveryDate: res.data[0]['EstimatedDeliveryDate'].split('.')[2] + '-' + res.data[0]['EstimatedDeliveryDate'].split('.')[1] + '-' + res.data[0]['EstimatedDeliveryDate'].split('.')[0],
                            ttnNumber: res.data[0]['IntDocNumber'],
                            documentType: res.data[0]['TypeDocument'],
                            encodedData: JSON.stringify(this.finalTtnData.methodProperties)
                        };
                        agent.Ttns.create(ttnData)
                            .then(action((res) => {
                                ttnsStore.ttnsRegistry.set(res.id, res);
                                this.fetchedOrder.ttn = res.id;
                                this.fetchedOrder.apiKey = commonStore.npApiKey;
                                console.log(this.fetchedOrder);
                                this.saveOrderById();
                            }))
                            .finally(action(() => { this.isLoading = false; }));
                    }));
        }));

    }

    @action deleteTtnForFetchedOrder() {
        this.isLoading = true;
        console.log(ttnsStore.ttnsRegistry.values());
        const ttn = ttnsStore.ttnsRegistry.get(this.fetchedOrder.ttn);
        const rtData = {
            apiKey: '9d1f260416fcc08c389f38af1eaf299b',
            modelName: 'InternetDocument',
            calledMethod: 'delete',
            methodProperties: {
                DocumentRefs: ttn.ref
            }
        };
        agent.NP.post(rtData)
            .then(action((res) => {
                agent.Ttns.deleteTtnById(this.fetchedOrder.ttn)
                    .then(action((res) => {
                                        this.fetchOrderById(this.fetchedOrder.id)
                                            .then(action(() => {
                                                this.fetchedOrder.apiKey = '';
                                                this.saveOrderById();
                                            }))
                                            .finally(action(() => { this.isLoading = false; }));
                    }));
            }));

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

    @action setFetchedOrderCategoryProperty(name, value)
    {
        this.fetchedOrderCategory[name] = value;
    }

    @action setTtnDataProperty(name, value)
    {
        this.createTtnData[name] = value;
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

export default new OrdersStore();
