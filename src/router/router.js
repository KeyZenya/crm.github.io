import React from 'react';
import AsyncComponent from '../components/AsyncComponent';
import { Route, Switch } from 'react-router-dom';

// const Home = AsyncComponent(() => import('../pages/Main/Home'));
// const Antd = AsyncComponent(() => import('../pages/Main/Antd'));
// const User = AsyncComponent(() => import('../pages/Main/User'));
import { createNotFoundRoute } from '../utils/router';
const Orders = AsyncComponent(() => import('../pages/Main/Orders'));
const Ttns = AsyncComponent(() => import('../pages/Main/Ttns'));
const Products = AsyncComponent(() => import('../pages/Main/Products'));
const Sms = AsyncComponent(() => import('../pages/Main/Sms'));
const Settings = AsyncComponent(() => import('../pages/Main/Settings'));
const Registries = AsyncComponent(() => import('../pages/Main/Registries'));
const CodeGenerator = AsyncComponent(() => import('../pages/Main/CodeGenerator'));
const NpApiKeys = AsyncComponent(() => import('../pages/Main/NpApiKeys'));
const OrderCategories = AsyncComponent(() => import('../pages/Main/OrderCategories'));
const getRouter = () => (
    <div>
        <Switch>
            <Route path='/orders' component={Orders} />
            <Route path='/products' component={Products} />
            <Route path='/ttns' component={Ttns} />
            <Route path='/sms' component={Sms} />
            <Route path='/settings' component={Settings} />
            <Route path='/registries' component={Registries} />
            <Route path='/code' component={CodeGenerator} />
            <Route path='/npapikeys' component={NpApiKeys} />
            <Route path='/ordercategories' component={OrderCategories} />
            {createNotFoundRoute()}
        </Switch>
    </div>
);
export default getRouter;
