import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {inject, observer} from "mobx-react";
import { observable } from 'mobx';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from "mui-datatables";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DescriptionIcon from '@material-ui/icons/Description';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Select from 'react-select'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MuiSelect from '@material-ui/core/Select';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import CitySelect from '../../../components/NP/CitySelect';
import WarehouseSelect from '../../../components/NP/WarehouseSelect';
import SenderContactPersonSelect from '../../../components/NP/SenderContactPersonSelect';
import Product from './Product';
import CircularProgress from '@material-ui/core/CircularProgress';
import ttnsStore from "../../../stores/ttnsStore";


import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    button: {
        margin: theme.spacing(1),
    },
    productChip: {
        margin: theme.spacing(1),
    },
    paper: {
        padding: theme.spacing(2),
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
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

// class TableProduct extends Component {
//     render() {
//         return (
//             <Chip label="Basic" />
//         )
//     }
// }


@inject('ordersStore', 'productsStore', 'npStore', 'ttnsStore', 'settingsStore', 'commonStore')
@observer
class Orders extends Component {

    state = {
        editOrderDialogOpen: false,
        editOrderTtnDialogOpen: false,
        errorApiKeySnackbarOpen: false,
        editingOrderId: -1,
        editingOrder: {},
        addingProduct: {},
        addingProductAmount: 1,
    };


    componentWillMount() {
    }

    async componentDidMount() {
        await this.props.ordersStore.loadOrderCategories();
        this.props.settingsStore.loadSettings();
        await this.props.ordersStore.loadOrders();
        await this.props.productsStore.loadProducts();
        this.props.npStore.loadTypesOfPayers();
        this.props.npStore.loadTypesOfPayersForRedelivery();
        this.props.npStore.loadPaymentForms();
        this.props.npStore.loadCargoTypes();
        this.props.npStore.loadSendDates();
        this.props.npStore.loadSenderCounterparties();
        this.props.npStore.loadRecipientCounterparties();
        this.props.ttnsStore.loadTtns();
    }



    handleErrorApiKeySnackbarOpen = () => {
        this.setState({errorApiKeySnackbarOpen: true});
    };

    handleErrorApiKeySnackbarClose = () => {
        this.setState({errorApiKeySnackbarOpen: false});
    };

    getPredicate() {
        return { ordersList: true };
    }

    handleEditOrderDialogOpen = () => {
        this.setState({editOrderDialogOpen: true});
    };

    handleEditOrderDialogClose = () => {
        this.setState({editOrderDialogOpen: false});
        this.props.ordersStore.injectEditedOrderToAll();
    };

    handleEditOrderTtnDialogOpen = () => {
        this.props.ordersStore.loadEditingOrderToTtn();
        this.setState({editOrderTtnDialogOpen: true});
    };

    handleEditOrderTtnDialogClose = () => {
        this.setState({editOrderTtnDialogOpen: false});
    };

    handleEditingOrderIdChange = (id) => {
        this.setState({editingOrderId: id});
    };

    handleEditingOrderPropertyChange = e => {
        this.props.ordersStore.setFetchedOrderProperty(e.target.name, e.target.value);
    };

    handleEditingOrderDeliveryChange = optionSelected => {
        this.props.ordersStore.setFetchedOrderProperty('delivery', optionSelected.value);
        this.props.ordersStore.setFetchedOrderProperty('deliveryName', optionSelected.label);
    };

    handleEditingOrderPaymentChange = optionSelected => {
        this.props.ordersStore.setFetchedOrderProperty('payment', optionSelected.value);
        this.props.ordersStore.setFetchedOrderProperty('paymentName', optionSelected.label);
    };

    handleCityChange = (selectedOption) => {
        this.props.ordersStore.setFetchedOrderProperty('cityName', selectedOption.label);
        this.props.ordersStore.setFetchedOrderProperty('cityRef', selectedOption.value);
    };

    handlePrevCityChange = () => {
        this.props.ordersStore.setFetchedOrderProperty('npDepartureName', '');
        this.props.ordersStore.setFetchedOrderProperty('npDepartureRef', '');
    };

    handleWarehouseChange = (selectedOption) => {
        this.props.ordersStore.setFetchedOrderProperty('npDepartureName', selectedOption.label);
        this.props.ordersStore.setFetchedOrderProperty('npDepartureRef', selectedOption.value);
    };

    handleSenderCityChange = (selectedOption) => {
        this.props.ordersStore.setTtnDataProperty('CitySenderName', selectedOption.label);
        this.props.ordersStore.setTtnDataProperty('CitySender', selectedOption.value);
    };

    handleSenderPrevCityChange = () => {
        this.props.ordersStore.setTtnDataProperty('SenderAddressName', '');
        this.props.ordersStore.setTtnDataProperty('SenderAddress', '');
    };

    handleSenderWarehouseChange = (selectedOption) => {
        this.props.ordersStore.setTtnDataProperty('SenderAddressName', selectedOption.label);
        this.props.ordersStore.setTtnDataProperty('SenderAddress', selectedOption.value);
    };

    handlePrevCounterpartyChange = () => {
        this.props.ordersStore.setTtnDataProperty('ContactSender', '');
    };

    handleSenderContactPersonChange = (selectedOption) => {
        this.props.ordersStore.setTtnDataProperty('ContactSender', selectedOption.value);
        this.props.ordersStore.setTtnDataProperty('SendersPhone', selectedOption.phones);
    };

    handleOrderCategoryChange = (selectedOption) => {
        this.props.ordersStore.setFetchedOrderProperty('orderCategory', selectedOption.value);
        this.props.ordersStore.setFetchedOrderProperty('orderCategoryName', selectedOption.label);
    };

    handleProductDelete = (id) => {
        this.props.ordersStore.removeProduct(id);
    };

    handleAddingProductChange = (selectedOption) => {
        this.setState({addingProduct: selectedOption});
        // this.setState({addingProductPrice: selectedOption.price * this.state.addingProductAmount});
    };

    handleAddingProductAmountChange = e => {
        this.setState({addingProductAmount: e.target.value});
        // this.setState({addingProductPrice: selectedOption.price * this.state.addingProductAmount});
    };

    handleAddProduct = () => {
        this.props.ordersStore.addProduct(this.state.addingProduct, this.state.addingProductAmount);
    };

    handleSenderCounterpartiesChange = (selectedOption) => {
        this.props.ordersStore.setTtnDataProperty('Sender', selectedOption.value);
    };

    handleSeatsAmountChange = e => {
        this.props.ordersStore.setTtnDataProperty('SeatsAmount', e.target.value);
    };

    handleVolumeChange = e => {
        this.props.ordersStore.setTtnDataProperty('VolumeGeneral', e.target.value);
    };

    fetchEditingOrder = (id) => {
        const ak = this.props.ordersStore.ordersRegistry.get(id).apiKey;
        if(ak === this.props.commonStore.npApiKey || ak === '')
        {
            this.handleEditOrderDialogOpen();
        } else {
            this.handleErrorApiKeySnackbarOpen();
        }
        this.props.ordersStore.fetchOrderById(id);

    };

    handleSaveEditingOrder = () => {
        this.props.ordersStore.saveOrderById();
        this.handleEditOrderDialogClose();
    };

    handleCreateTtn = () => {
        this.props.ordersStore.createTtnForFetchedOrder();
        this.handleEditOrderTtnDialogClose();
    };

    handleDeleteTtn = () => {
        this.props.ordersStore.deleteTtnForFetchedOrder();
    };

    render() {
        const { classes } = this.props;
        const { settings } = this.props.settingsStore;
        const { orders, ordersCategories, isLoading, miniTable, fetchedOrder, createTtnData} = this.props.ordersStore;
        const { products } = this.props.productsStore;
        const { senderCounterparties, typesOfPayers, typesOfPayersForRedelivery, paymentForms, cargoTypes, sendDates } = this.props.npStore;


        const payments = {
            pre: 'Передоплата',
            cod: 'Накладений платіж'
        };

        const deliveries = {
            np: 'Нова пошта',
            up: 'Укр пошта'
        };

        this.handleSenderCityChange({
            value: settings.senderCity,
            label: settings.senderCityName
        });

        this.handleSenderWarehouseChange({
            value: settings.senderWarehouse,
            label: settings.senderWarehouseName
        });

        const columns = [
            {
                name: "id",
                label: "Id",
                options: {
                    filter: false,
                    sort: true,
                },
            },
            {
                name: "customerName",
                label: "Ім'я",
                options: {
                    sort: true,
                    filter: false,
                    filterType: 'dropdown'
                }
            },
            {
                name: "phone",
                label: "Телефон",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "orderCategory",
                label: "Статус",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <Button
                            size="small"
                            variant="contained"
                            style={{backgroundColor: this.props.ordersStore.ordersCategoriesRegistry.get(value).color}}
                        >
                            {this.props.ordersStore.ordersCategoriesRegistry.get(value).name}
                            </Button>
                    ),
                },
            },
            {
                name: "orderCategoryName",
                label: "Статус",
                options: {
                    filter: true,
                    display: false
                }
            },
            {
                name: "apiKey",
                label: "Апі ключ",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "comment",
                label: "Коментар",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "products",
                label: "Товари",
                options: {
                    filter: false,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <div>
                            {JSON.parse(value).products.map((product, i) => {

                                return (<Chip
                                    className={classes.productChip}
                                    color='primary'
                                    size='small'
                                    label={this.props.productsStore.productsRegistry.get(product.id).name}
                                />)
                            })}
                        </div>
                    ),
                }
            },
            {
                name: "payment",
                label: "Оплата",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <span>{payments[value]}</span>
                    ),
                }
            },
            {
                name: "delivery",
                label: "Доставка",
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <span>{deliveries[value]}</span>
                    ),
                }
            },
            {
                name: "cityName",
                label: "Місто",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "ttn",
                label: "ЕН",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "npInfo",
                label: "ЕН статус",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "created",
                label: "Створено",
                options: {
                    filter: true,
                    filterType: 'textField',
                    sort: true,
                }
            },
            {
                name: "sent",
                label: "Відправлено",
                options: {
                    filter: true,
                    filterType: 'textField',
                    sort: true,
                }
            },
            {
                name: "updated",
                label: "Оновлено",
                options: {
                    filter: true,
                    filterType: 'textField',
                    sort: true,
                }
            },
            {
                name: "site",
                label: "Сайт",
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "utmSource",
                label: "utmSource",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "utmMedium",
                label: "utmMedium",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "utmTerm",
                label: "utmTerm",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "utmContent",
                label: "utmContent",
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "utmCampaign",
                label: "utmCampaign",
                options: {
                    filter: false,
                    sort: true,
                }
            },

        ];


        const options = {
            selectableRowsOnClick: false,
            responsive: 'scrollMaxHeight',
            onRowClick: rowData => {
                this.handleEditingOrderIdChange(rowData[0]);
            },
            setRowProps: (row, dataIndex) => ({
                onDoubleClick: () => {
                    this.fetchEditingOrder(row[0]);
                }
            }),
            onRowsDelete: (rowsDeleted) => {
                const idsToDelete = rowsDeleted.data.map(d => orders[d.dataIndex].id); // array of all ids to to be deleted

            }
        };

        const deliveryOptions = [
            { value: 'np', label: 'Нова пошта' },
            { value: 'up', label: 'Укр пошта' },
        ];

        const paymentOptions = [
            { value: 'pre', label: 'Передоплата' },
            { value: 'cod', label: 'Накладений платіж' },
        ];

        const orderCategoriesOptions = ordersCategories.map((cat) => {
           return { value: cat.id, label: cat.name};
        });

        const productsOptions = products.map((product) => {
            return { value: product.id, label: product.name, price: product.basePrice};
        });

        const deliveryTechnologiesOptions = [
            { value: 'WarehouseWarehouse', label: 'Відділення-Відділення' },
            // { value: 'WarehouseDoors', label: 'Відділення-Адреса' }
        ];

        const selectOptions = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
        ];

        const senderCounterpartiesOptions = senderCounterparties.map((cp) => {
            return { value: cp.Ref, label: cp.Description};
        });

        const typesOfPayersOptions = typesOfPayers.map((tp) => {
            return { value: tp.Ref, label: tp.Description};
        });

        const typesOfPayersForRedeliveryOptions = typesOfPayersForRedelivery.map((tpfr) => {
            return { value: tpfr.Ref, label: tpfr.Description};
        });

        const paymentFormsOptions = paymentForms.map((pf) => {
            return { value: pf.Ref, label: pf.Description};
        });

        const cargoTypesOptions = cargoTypes.map((ct) => {
            return { value: ct.Ref, label: ct.Description};
        });

        const sendDatesOptions = sendDates.map((sd) => {
            return { value: sd, label: sd};
        });

        return (
            <div>
                {/*<Grid item xs={12}>*/}
                    {/*<Paper className={classes.paper}>*/}
                    {/*</Paper>*/}
                {/*</Grid>*/}
                <MUIDataTable
                    title={"Замовлення"}
                    data={orders}
                    columns={columns}
                    options={options}
                />
                <Dialog open={this.state.editOrderDialogOpen} onClose={this.handleEditOrderDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Замовлення №42</DialogTitle>
                    {isLoading ? (
                        <DialogContent>
                            <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
                                <CircularProgress color="secondary" />
                            </Grid>
                        </DialogContent>
                    ) : (
                        <DialogContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="name"
                                            name="customerName"
                                            label="Замовник"
                                            value={fetchedOrder.customerName}
                                            onChange={this.handleEditingOrderPropertyChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="phone"
                                            name="phone"
                                            label="Телефон"
                                            fullWidth
                                            value={fetchedOrder.phone}
                                            onChange={this.handleEditingOrderPropertyChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="comment"
                                            name="comment"
                                            label="Коментар"
                                            fullWidth
                                            value={fetchedOrder.comment}
                                            onChange={this.handleEditingOrderPropertyChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            disabled
                                            id="apikey"
                                            name="apikey"
                                            label="Api key"
                                            value={fetchedOrder.apiKey}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ExpansionPanel>
                                            <ExpansionPanelSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                            >
                                                <Typography className={classes.heading}>Товари</Typography>
                                            </ExpansionPanelSummary>
                                            <ExpansionPanelDetails>
                                                <Grid item xs={12}>
                                                <List disablePadding>
                                                    {JSON.parse(fetchedOrder.products).products.map(product => (
                                                        <Product
                                                            key={product.id}
                                                            product={product}
                                                            onDelete={() => this.handleProductDelete(product.id)}
                                                        />
                                                    ))}
                                                    <ListItem className={classes.listItem}>
                                                        <Grid item xs={4}>
                                                            <Select
                                                                options={productsOptions}
                                                                onChange={this.handleAddingProductChange}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <TextField
                                                                style={{width: "100%"}}
                                                                value={this.state.addingProductAmount}
                                                                onChange={this.handleAddingProductAmountChange}
                                                                label="Кількість"
                                                                type="number"
                                                                margin="small"
                                                            />
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            <Button variant="contained" color="secondary" onClick={this.handleAddProduct}>Додати</Button>
                                                        </Grid>
                                                    </ListItem>
                                                </List>
                                                </Grid>
                                            </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Select options={deliveryOptions} value={{label: fetchedOrder.deliveryName, value: fetchedOrder.delivery }} onChange={this.handleEditingOrderDeliveryChange} placeholder={"Доставка"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Select options={paymentOptions} value={{label: fetchedOrder.paymentName, value: fetchedOrder.payment }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Оплата"}/>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <CitySelect value={{ label: fetchedOrder.cityName, value: fetchedOrder.cityRef }} onChange={this.handleCityChange}/>
                                        {/*<Select value={{label: fetchedOrder.cityName, value: fetchedOrder.cityRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Населений пункт"}/>*/}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <WarehouseSelect
                                            value={{ label: fetchedOrder.npDepartureName, value: fetchedOrder.npDepartureRef }}
                                            onChange={this.handleWarehouseChange}
                                            cityRef={fetchedOrder.cityRef}
                                            onCityChange={this.handlePrevCityChange}
                                        />
                                        {/*<Select options={selectOptions} value={{label: fetchedOrder.npDepartureName, value: fetchedOrder.npDepartureRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Відділення"}/>*/}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <List>
                                            {fetchedOrder.ttn ? (
                                                <ListItem dense>
                                                    <ListItemIcon>
                                                        <DescriptionIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={`ЕН ${fetchedOrder.ttn}`} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="comments" onClick={this.handleDeleteTtn}>
                                                            <HighlightOffIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ) : (
                                                <ListItem dense>
                                                    <ListItemIcon>
                                                        <DescriptionIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={"Немає ЕН"} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton edge="end" aria-label="comments" onClick={this.handleEditOrderTtnDialogOpen}>
                                                            <AddCircleOutlineIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )}
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl style={{width: "100%"}}>
                                            <InputLabel htmlFor="age-simple">Статус</InputLabel>
                                            <Select
                                                value={{ label: fetchedOrder.orderCategoryName, value: fetchedOrder.orderCategory }}
                                                onChange={this.handleOrderCategoryChange}
                                                options={orderCategoriesOptions}/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="site"
                                            name="site"
                                            label="Сайт"
                                            fullWidth
                                            disabled
                                            value={fetchedOrder.site}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Створено"
                                            fullWidth
                                            value={fetchedOrder.created}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Відправлено"
                                            fullWidth
                                            value={fetchedOrder.sent}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Оновлено"
                                            fullWidth
                                            value={fetchedOrder.updated}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="utmSource"
                                            fullWidth
                                            value={fetchedOrder.utmSource}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="utmMedium"
                                            fullWidth
                                            value={fetchedOrder.utmMedium}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="utmTerm"
                                            fullWidth
                                            value={fetchedOrder.utmTerm}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="utmContent"
                                            fullWidth
                                            value={fetchedOrder.utmContent}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="utmCampaign"
                                            fullWidth
                                            value={fetchedOrder.utmCampaign}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                        </DialogContent>
                    )}
                    <DialogActions>
                        <Button onClick={this.handleEditOrderDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.handleSaveEditingOrder} color="primary">
                            Зберегти
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.editOrderTtnDialogOpen} onClose={this.handleEditOrderTtnDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Замовлення №42 - ЕН</DialogTitle>
                    <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Відправник
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={senderCounterpartiesOptions}
                                        onChange={this.handleSenderCounterpartiesChange}
                                        defaultValue={senderCounterpartiesOptions[0]}
                                        placeholder={"Контрагент"}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SenderContactPersonSelect
                                        value={{ label: createTtnData.ContactSender, value: createTtnData.ContactSender }}
                                        onChange={this.handleSenderContactPersonChange}
                                        cpRef={createTtnData.Sender}
                                        onCounterpartyChange={this.handlePrevCounterpartyChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CitySelect value={{ label: createTtnData.CitySenderName, value: createTtnData.CitySender }} onChange={this.handleSenderCityChange}/>
                                    {/*<Select value={{label: fetchedOrder.cityName, value: fetchedOrder.cityRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Населений пункт"}/>*/}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <WarehouseSelect
                                        value={{ label: createTtnData.SenderAddressName, value: createTtnData.SenderAddress }}
                                        onChange={this.handleSenderWarehouseChange}
                                        cityRef={createTtnData.CitySender}
                                        onCityChange={this.handleSenderPrevCityChange}
                                    />
                                    {/*<Select options={selectOptions} value={{label: fetchedOrder.npDepartureName, value: fetchedOrder.npDepartureRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Відділення"}/>*/}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Одержувач
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fetchedOrder.customerName}
                                        onChange={this.handleEditingOrderPropertyChange}
                                        label="Одержувач"
                                        fullWidth
                                        autoComplete="billing address-line1"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        value={fetchedOrder.phone}
                                        onChange={this.handleEditingOrderPropertyChange}
                                        label="Тефон одержувача"
                                        fullWidth
                                        autoComplete="billing address-line1"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CitySelect value={{ label: fetchedOrder.cityName, value: fetchedOrder.cityRef }} onChange={this.handleCityChange}/>
                                    {/*<Select value={{label: fetchedOrder.cityName, value: fetchedOrder.cityRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Населений пункт"}/>*/}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <WarehouseSelect
                                        value={{ label: fetchedOrder.npDepartureName, value: fetchedOrder.npDepartureRef }}
                                        onChange={this.handleWarehouseChange}
                                        cityRef={fetchedOrder.cityRef}
                                        onCityChange={this.handlePrevCityChange}
                                    />
                                    {/*<Select options={selectOptions} value={{label: fetchedOrder.npDepartureName, value: fetchedOrder.npDepartureRef }} onChange={this.handleEditingOrderPaymentChange} placeholder={"Відділення"}/>*/}
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Загальна інформація
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={deliveryTechnologiesOptions}
                                        defaultValue={deliveryTechnologiesOptions[0]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={typesOfPayersOptions}
                                        defaultValue={typesOfPayersOptions[1]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={typesOfPayersForRedeliveryOptions}
                                        defaultValue={typesOfPayersForRedeliveryOptions[1]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={paymentFormsOptions}
                                        defaultValue={paymentFormsOptions[1]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={sendDatesOptions}
                                        defaultValue={sendDatesOptions[0]}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Select
                                        options={cargoTypesOptions}
                                        defaultValue={cargoTypesOptions[1]}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Select
                                        defaultValue={{ value: createTtnData.Description, label: createTtnData.DescriptionName}}
                                        placeholder={"Опис відправлення"}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={true}/>
                                        }
                                        label="Зворотня доставка"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        label="Сума зворотньої доставки"
                                        type="number"
                                        value={createTtnData.Cost}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        label="Ширина"
                                        type="number"
                                        value={createTtnData.Width}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        label="Довжина"
                                        type="number"
                                        value={createTtnData.Length}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        label="Висота"
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        value={createTtnData.Height}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        id="standard-number"
                                        label="Об'єм"
                                        type="number"
                                        value={createTtnData.VolumeGeneral}
                                        onChange={this.handleVolumeChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        id="standard-number"
                                        label="Вага"
                                        type="number"
                                        value={createTtnData.Weight}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        style={{width: "100%"}}
                                        id="standard-number"
                                        label="Кількість місць"
                                        type="number"
                                        value={createTtnData.SeatsAmount}
                                        onChange={this.handleSeatsAmountChange}
                                    />
                                </Grid>
                            </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleEditOrderTtnDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.handleCreateTtn} color="primary">
                            Створити
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.state.errorApiKeySnackbarOpen}
                    autoHideDuration={2000}
                    onClose={this.handleErrorApiKeySnackbarClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleErrorApiKeySnackbarClose}
                        variant="error"
                        message="Немає доступу(змініть апі ключ)"
                    />
                </Snackbar>
            </div>

        );
    }
}

Orders.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Orders);
