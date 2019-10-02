import React, { Component } from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArchiveIcon from '@material-ui/icons/Archive';
import ListAltIcon from '@material-ui/icons/ListAlt';
import DescriptionIcon from '@material-ui/icons/Description';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BookIcon from '@material-ui/icons/Book';
import MailIcon from '@material-ui/icons/Mail';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import CodeIcon from '@material-ui/icons/Code';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Category from '@material-ui/icons/Category';
import getRouter from '../../router/router';
import {Link, withRouter} from 'react-router-dom';
import {inject, observer} from "mobx-react";
import { pink } from '@material-ui/core/colors';
import Select from 'react-select'

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        opacity: 0,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    toolbarMain: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    profileBox: {
        display: 'flex',
        alignItems: 'center',
    },
    profileBoxUsername: {
        // marginRight: theme.spacing(2),
    },
    avatar: {
        margin: 10,
        color: '#fff',
        backgroundColor: pink[500],
    },
});

@inject('userStore', 'authStore')
@observer
class Main extends Component {

    state = {
        open: true
    };

    componentDidMount() {
        this.props.history.replace('/orders');
    }

    handleDrawerOpen = () => this.setState({open: true});
    handleDrawerClose = () => this.setState({open: false});

    handleLogout = () => this.props.authStore.logout().then(() => this.props.history.replace('/'));

    render() {
        const { classes } = this.props;
        const { currentUser } = this.props.userStore;






        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: this.state.open,
                    })}>
                    <Toolbar className={classes.toolbarMain}>
                        <Box>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: this.state.open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        </Box>
                        <Box className={classes.profileBox}>
                            <Typography className={classes.profileBoxUsername} variant="h6" noWrap>{currentUser.username}</Typography>
                            <Avatar className={classes.avatar}>{currentUser.username[0].toUpperCase()}</Avatar>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button key="Orders" component={Link} to='/orders'>
                            <ListItemIcon><ListAltIcon/></ListItemIcon>
                            <ListItemText primary="Замовлення" />
                        </ListItem>
                        <ListItem button key="Order categories" component={Link} to='/ordercategories'>
                            <ListItemIcon><Category/></ListItemIcon>
                            <ListItemText primary="Категорії" />
                        </ListItem>
                        <ListItem button key="Products" component={Link} to='/products'>
                            <ListItemIcon><ArchiveIcon/></ListItemIcon>
                            <ListItemText primary="Товари" />
                        </ListItem>
                        <ListItem button key="Ttns" component={Link} to='/ttns'>
                            <ListItemIcon><DescriptionIcon/></ListItemIcon>
                            <ListItemText primary="ЕН" />
                        </ListItem>
                        <ListItem button key="Registry" component={Link} to='/registries'>
                            <ListItemIcon><BookIcon/></ListItemIcon>
                            <ListItemText primary="Реєстри" />
                        </ListItem>
                        {/*<ListItem button key="Sms templates" component={Link} to='/smstemplates'>*/}
                            {/*<ListItemIcon><MailIcon/></ListItemIcon>*/}
                            {/*<ListItemText primary="Смс шаблони" />*/}
                        {/*</ListItem>*/}
                        <ListItem button key="Sms" component={Link} to='/sms'>
                            <ListItemIcon><MailIcon/></ListItemIcon>
                            <ListItemText primary="Смс" />
                        </ListItem>
                        <ListItem button key="Code generator" component={Link} to='/code'>
                            <ListItemIcon><CodeIcon/></ListItemIcon>
                            <ListItemText primary="Генератор коду" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button key="NP api keys" component={Link} to='/npapikeys'>
                            <ListItemIcon><VpnKeyIcon/></ListItemIcon>
                            <ListItemText primary="NP api keys" />
                        </ListItem>
                        <ListItem button key="Settings" component={Link} to='/settings'>
                            <ListItemIcon><SettingsIcon/></ListItemIcon>
                            <ListItemText primary="Налаштування" />
                        </ListItem>
                        <ListItem button key="Profile" component={Link} to='/profile'>
                            <ListItemIcon><AccountBoxIcon/></ListItemIcon>
                            <ListItemText primary="Профіль" />
                        </ListItem>
                        <ListItem button key="Logout" component="button" onClick={this.handleLogout}>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <ListItemText primary="Вихід" />
                        </ListItem>
                    </List>
                </Drawer>
                <main id="testmain" className={classes.content}>
                    <div className={classes.toolbar} />
                    {getRouter()}
                </main>
            </div>
        );
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
