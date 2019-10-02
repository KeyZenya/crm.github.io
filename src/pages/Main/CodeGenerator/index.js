import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Grid from "@material-ui/core/Grid/Grid";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import TextField from "@material-ui/core/TextField/TextField";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import List from "@material-ui/core/List/List";
import Product from "../Orders/Product";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import CitySelect from "../../../components/NP/CitySelect";
import WarehouseSelect from "../../../components/NP/WarehouseSelect";
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Editor from 'react-simple-code-editor';


import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
        marginTop: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
    listItem: {
        padding: theme.spacing(1, 0),
    },
    total: {
        fontWeight: '700',
    },
    title: {
        marginTop: theme.spacing(2),
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});


@inject('ttnsStore', 'productsStore', 'commonStore')
@observer
class CodeGenerator extends Component {

    state = {
        code: '',
    };

    componentDidMount() {
        this.props.productsStore.loadProducts();

    }

    generateCrmCode(productId)
    {
        const product = this.props.productsStore.productsRegistry.get(productId);
        const id = product.id;
        const price = product.basePrice;
        const host = window.location.origin;
        const token = this.props.commonStore.token;
        return `Crm connection: \n\n\n <?php
$phone = $_REQUEST['phone'];
$data = array(
\t'customerName' => $_REQUEST['name'],
\t'phone' => preg_replace("/[^0-9]/", "", $phone),
\t'products' => '{"products":[{"id":${id},"price":${price},"amount":1}]}',
\t'site' => $_SERVER['HTTP_HOST'],
\t'orderCategory' => 1
);
$url = '${host}/api/v1/order/create/';
$ch = curl_init($url);
$postString = json_encode($data);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postString);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json; charset=utf-8',
    'Authorization: JWT ${token}'
));
$response = curl_exec($ch);
curl_close($ch);
?> \n\n\n Index: \n\n\n <?php
//*********************** Главная страница *************************
session_start();
$period_cookie = 2592000; // 30 дней (2592000 секунд)
 
if($_GET){
    setcookie("utm_source",$_GET['utm_source'],time()+$period_cookie);
    setcookie("utm_medium",$_GET['utm_medium'],time()+$period_cookie);
    setcookie("utm_term",$_GET['utm_term'],time()+$period_cookie);
    setcookie("utm_content",$_GET['utm_content'],time()+$period_cookie);
    setcookie("utm_campaign",$_GET['utm_campaign'],time()+$period_cookie);
}
 
if(!isset($_SESSION['utms'])) {
    $_SESSION['utms'] = array();
    $_SESSION['utms']['utm_source'] = '';
    $_SESSION['utms']['utm_medium'] = '';
    $_SESSION['utms']['utm_term'] = '';
    $_SESSION['utms']['utm_content'] = '';
    $_SESSION['utms']['utm_campaign'] = '';
}
$_SESSION['utms']['utm_source'] = $_GET['utm_source'] ? $_GET['utm_source'] : $_COOKIE['utm_source'];
$_SESSION['utms']['utm_medium'] = $_GET['utm_medium'] ? $_GET['utm_medium'] : $_COOKIE['utm_medium'];
$_SESSION['utms']['utm_term'] = $_GET['utm_term'] ? $_GET['utm_term'] : $_COOKIE['utm_term'];
$_SESSION['utms']['utm_content'] = $_GET['utm_content'] ? $_GET['utm_content'] : $_COOKIE['utm_content'];
$_SESSION['utms']['utm_campaign'] = $_GET['utm_campaign'] ? $_GET['utm_campaign'] : $_COOKIE['utm_campaign'];
?>`;
    }

    handleProductChange = (selectedOption) => {
        this.setState({code: this.generateCrmCode(selectedOption.value)});
    };

    render() {
        const { classes } = this.props;
        const { products } = this.props.productsStore;



        const productsOptions = products.map((product) => {
            return { value: product.id, label: product.name};
        });


        return (
            <div>
                <Select
                    options={productsOptions}
                    onChange={this.handleProductChange}
                />
                <Editor
                    value={this.state.code}
                    highlight={code => highlight(code, languages.js)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 15,
                    }}
                />
            </div>

        );
    }
}

CodeGenerator.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CodeGenerator);
