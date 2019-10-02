import ArticleList from '../ArticleList';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, NavLink } from 'react-router-dom'
import { parse as qsParse } from 'query-string';

const YourFeedTab = props => {
    if (props.currentUser) {

        return (
            <li className="nav-item">
                <NavLink
                    className="nav-link"
                    isActive={
                        (match, location) => {
                            return location.search.match("tab=feed") ? 1 : 0;
                        }
                    }
                    to={{
                        pathname: "/",
                        search: "?tab=feed"
                    }}
                >
                    Your Feed
                </NavLink>
            </li>
        );
    }
    return null;
};

const GlobalFeedTab = props => {
    return (
        <li className="nav-item">
            <NavLink
                className="nav-link"
                isActive={
                    (match, location) => {
                        return !location.search.match(/tab=(feed|tag)/) ? 1 : 0;
                    }
                }
                to={{
                    pathname: "/",
                    search: "?tab=all"
                }}
            >
                Global Feed
            </NavLink>
        </li>
    );
};

const TagFilterTab = props => {
    if (!props.tag) {
        return null;
    }

    return (
        <li className="nav-item">
            <a href="" className="nav-link active">
                <i className="ion-pound" /> {props.tag}
            </a>
        </li>
    );
};

@inject('commonStore', 'userStore', 'ordersStore')
@withRouter
@observer
export default class MainView extends React.Component {

    componentWillMount() {
        this.props.ordersStore.setPredicate(this.getPredicate());
    }

    componentDidMount() {
        this.props.ordersStore.loadOrders();
    }

    componentDidUpdate(previousProps) {
        if (
            this.getTab(this.props) !== this.getTab(previousProps) ||
            this.getTag(this.props) !== this.getTag(previousProps)
        ) {
            this.props.ordersStore.setPredicate(this.getPredicate());
            this.props.ordersStore.loadOrders();
        }
    }

    getTag(props = this.props) {
        return qsParse(props.location.search).tag || "";
    }

    getTab(props = this.props) {
        return qsParse(props.location.search).tab || 'all';
    }

    getPredicate() {
        return { ordersList: true };
    }

    handleTabChange = (tab) => {
        if (this.props.location.query.tab === tab) return;
        this.props.router.push({ ...this.props.location, query: { tab } })
    };

    handleSetPage = page => {
        this.props.ordersStore.setPage(page);
        this.props.ordersStore.loadOrders();
    };

    render() {
        const { currentUser } = this.props.userStore;
        const { orders, isLoading, page, totalPagesCount } = this.props.ordersStore;
        console.log(orders);

        return (
            <div className="col-md-9">
                <div className="feed-toggle">
                    <ul className="nav nav-pills outline-active">

                        <YourFeedTab
                            currentUser={currentUser}
                            tab={this.getTab()}
                        />

                        <GlobalFeedTab
                            tab={this.getTab()}
                        />

                        <TagFilterTab tag={qsParse(this.props.location.search).tag} />

                    </ul>
                </div>
                {orders}
            </div>
        );
    }
};
