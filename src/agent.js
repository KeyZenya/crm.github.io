import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import commonStore from './stores/commonStore';
// import authStore from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://127.0.0.1:8000/api/v1';
const NP_API_ROOT = 'https://api.novaposhta.ua/v2.0/json';


const encode = encodeURIComponent;

const handleErrors = err => {
  if (err && err.response && err.response.status === 401) {
    // authStore.logout();
  }
  return err;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  if (commonStore.token) {
    req.set('Authorization', `JWT ${commonStore.token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
};

const np_requests = {
    post: (url, body) =>
        superagent
            .post(`${NP_API_ROOT}${url}`, body)
            .end(handleErrors)
            .then(responseBody),
};

const smsc_requests = {
    post: (url) =>
        superagent
            .post(`${url}`)
            .end(handleErrors)
            .then(responseBody),
};

const Auth = {
  current: (token) =>
    requests.post('/user/get/by/token', { token }),
  login: (username, password) =>
    requests.post('/token/login', { username, password }),
  verifyToken: token =>
      requests.post('/token/verify', { token }),
  refreshToken: token =>
        requests.post('/token/refresh', { token }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })

const Articles = {
  all: (page, lim = 10) =>
    requests.get(`/articles?${limit(lim, page)}`),
  byAuthor: (author, page, query) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page, lim = 10) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(lim, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Orders = {
  all: () =>
      requests.get('/order/list/'),
    getOrderById: id =>
        requests.get('/order/rud/' + id + '/'),
    saveOrderById: data =>
        requests.put('/order/rud/' + data.id + '/', data),
};

const Products = {
    all: () =>
        requests.get('/product/list/'),
    createProduct: data =>
        requests.post('/product/create/', data),
    deleteProductById: id =>
        requests.del('/product/rud/' + id + '/'),
    getProductById: id =>
        requests.get('/product/rud/' + id + '/'),
    saveProductById: data =>
        requests.put('/product/rud/' + data.id + '/', data),
};

const Ttns = {
    all: () =>
        requests.get('/ttn/list/'),
    create: data =>
        requests.post('/ttn/create/', data),
    updateTtnById: data =>
        requests.put('/ttn/rud/' + data.id + '/', data),
    deleteTtnById: id =>
        requests.del('/ttn/rud/' + id + '/'),
};

const Registries = {
    all: () =>
        requests.get('/registry/list/'),
    create: data =>
        requests.post('/registry/create/', data),
    deleteByRefs: data =>
        np_requests.post('/', data),
    deleteById: id =>
        requests.del('/registry/rud/' + id + '/'),
};

const OrderCategories = {
    all: () =>
        requests.get('/ordercategory/list/'),
    getOrderCategoryById: (id) =>
        requests.get('/ordercategory/rud/' + id + '/'),
    saveOrderCategoryById: data =>
        requests.put('/ordercategory/rud/' + data.id + '/', data),
    create: (data) =>
        requests.post('/ordercategory/create/', data),
};

const Sms = {
    all: () =>
        requests.get('/sms/list/'),
    create: data =>
        requests.post('/sms/create/', data),
};

const SmsTemplates = {
    all: () =>
        requests.get('/smstemplate/list/'),
    create: data =>
        requests.post('/smstemplate/create/', data),
};

const SMSC = {
    send: url =>
        smsc_requests.post(url),
};

const NP = {
    post: data =>
        np_requests.post('/', data),
    getNpApiKeys: () =>
      requests.get('/npapikey/list/'),
    create: data =>
        requests.post('/npapikey/create/', data),
};

const Settings = {
    getByUserId: id =>
        requests.get('/settings/rud/' + id + '/'),
    saveByUserId: (id, data) =>
        requests.put('/settings/rud/' + id + '/', data),
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
    Articles,
    Orders,
    Products,
    Sms,
    Registries,
    SMSC,
    Settings,
    SmsTemplates,
    Ttns,
    OrderCategories,
    NP,
    Auth,
    Comments,
    Profile,
    Tags,
};
