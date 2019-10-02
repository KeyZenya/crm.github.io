import Header from './Header';
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import AsyncComponent from './AsyncComponent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
const Login = AsyncComponent(() => import('../pages/Login'));
const Home = AsyncComponent(() => import('./Home'));
const Main = AsyncComponent(() => import('../pages/Main'));
const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink,
        error: red,
        // Used by `getContrastText()` to maximize the contrast between the background and
        // the text.
        contrastThreshold: 3,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});

@inject('userStore', 'commonStore', 'authStore')
@withRouter
@observer
export default class App extends React.Component {

  componentWillMount() {
    if (!this.props.commonStore.token) {
      this.props.commonStore.setAppLoaded();
    }
    if(this.props.commonStore.autoLogin !== "true")
    {
        this.props.commonStore.setAppLoaded();
    }
  }

  componentDidMount() {
    if (this.props.commonStore.token && this.props.commonStore.autoLogin === "true") {
        this.props.authStore.verifyToken().finally(() => this.props.commonStore.setAppLoaded());
    }
  }

  render() {
    if (this.props.commonStore.appLoaded) {
      return (
          <ThemeProvider theme={theme}>
              <Route component={this.props.userStore.currentUser == null ? Login : Main} />
          </ThemeProvider>
      );
    }
    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{height: "100vh"}}
        >
            <CircularProgress color="secondary" />
        </Grid>
    );
  }
}
