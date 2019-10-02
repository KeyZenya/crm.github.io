// import Loading from './Loading/Loading';

import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const AsyncComponent = importComponent => {
    return class extends Component {
        constructor(props) {
            super(props);

            this.state = {
                component: null
            };
        }

        componentDidMount() {
            importComponent().then(cmp => {
                this.setState({ component: cmp.default });
            });
        }

        render() {
            const C = this.state.component;

            return C ? <C {...this.props} /> : <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            ><CircularProgress color="secondary" /></Grid>;
        }
    };
};
export default AsyncComponent;
