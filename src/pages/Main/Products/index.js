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
import CargoDescriptionSelect from "../../../components/NP/CargoDescriptionSelect";

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


@inject('ordersStore', 'productsStore', 'npStore', 'ttnsStore')
@observer
class Products extends Component {

    state = {
        editProductDialogOpen: false,
        editingProductId: 0,
        creating: false
    };

    componentDidMount() {
        this.props.ttnsStore.loadTtns();
    }

    handleEditProductDialogOpen = () => {
        this.setState({editProductDialogOpen: true});
    };

    handleEditProductDialogClose = () => {
        this.setState({editProductDialogOpen: false, creating: false});
    };

    handleEditingProductIdChange = (id) => {
        this.setState({editingProductId: id});
    };

    fetchEditingProduct = () => {
        this.props.productsStore.fetchProductById(this.state.editingProductId);
    };

    handleEditingProductNameChange = e => {
        this.props.productsStore.setFetchedProductProperty('name', e.target.value);
    };

    handleEditingProductBasePriceChange = e => {
        this.props.productsStore.setFetchedProductProperty('basePrice', e.target.value);
    };

    handleEditingProductPurchasePriceChange = e => {
        this.props.productsStore.setFetchedProductProperty('purchasePrice', e.target.value);
    };

    handleEditingProductAmountChange = e => {
        this.props.productsStore.setFetchedProductProperty('amount', e.target.value);
    };

    handleCargoDescriptionChange = (selectedOption) => {
        this.props.productsStore.setFetchedProductProperty('npDescriptionText', selectedOption.label);
        this.props.productsStore.setFetchedProductProperty('npDescription', selectedOption.value);
    };

    handleEditingProductWidthChange = e => {
        this.props.productsStore.setFetchedProductProperty('npWidth', e.target.value);
    };

    handleEditingProductLengthChange = e => {
        this.props.productsStore.setFetchedProductProperty('npLength', e.target.value);
    };

    handleEditingProductHeightChange = e => {
        this.props.productsStore.setFetchedProductProperty('npHeight', e.target.value);
    };

    handleEditingProductWeightChange = e => {
        this.props.productsStore.setFetchedProductProperty('npWeight', e.target.value);
    };

    handleSaveEditingProduct = () => {
        this.props.productsStore.saveProductById();
        this.handleEditProductDialogClose();
    };

    handleCreateEditingProduct = () => {
        this.props.productsStore.createProduct();
        this.handleEditProductDialogClose();
    };

    handleCreateProductOpen = () => {
        this.props.productsStore.clearFetchedProduct();
        this.setState({creating: true});
        this.handleEditProductDialogOpen();
    };

    handleDeleteProduct = () => {
        this.props.productsStore.deleteProduct();
        this.handleEditProductDialogClose();
    };

    render() {
        const { classes } = this.props;
        const { products, fetchedProduct, isLoading } = this.props.productsStore;

        const columns = [
            {
                name: "id",
                label: "Id",
                options: {
                    filter: true,
                    sort: true,
                },
            },
            {
                name: "name",
                label: "Назва",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "basePrice",
                label: "Ціна",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "purchasePrice",
                label: "закупочна ціна",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "npDescriptionText",
                label: "Опис",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "amount",
                label: "Кількість",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            // {
            //     name: "orderCategory",
            //     label: "Статус",
            //     options: {
            //         filter: true,
            //         sort: false,
            //         // customBodyRender: (value, tableMeta, updateValue) => (
            //         //     <FormControlLabel
            //         //         value={value}
            //         //         control={<Button variant="contained" color="primary" className={classes.button}>{value}</Button>}
            //         //         onChange={event => updateValue(event.target.value)}
            //         //     />
            //         // ),
            //     },
            // },
        ];

        const options = {
            filterType: 'checkbox',
            selectableRowsOnClick: false,
            responsive: 'stacked',
            onRowClick: rowData => {
                this.handleEditingProductIdChange(rowData[0]);
            },
            setRowProps: () => ({
                onDoubleClick: (row, dataIndex) => {
                    this.fetchEditingProduct();
                    this.handleEditProductDialogOpen();
                }
            })
        };

        return (
            <div>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleCreateProductOpen}
                        >
                            Створити
                        </Button>
                    </Paper>
                </Grid>
                <MUIDataTable
                    title={"Товари"}
                    data={products}
                    className={classes.table}
                    columns={columns}
                    options={options}
                />
                <Dialog open={this.state.editProductDialogOpen} onClose={this.handleEditProductDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Товар {fetchedProduct.id}</DialogTitle>
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
                                            name="name"
                                            label="Назва"
                                            value={fetchedProduct.name}
                                            onChange={this.handleEditingProductNameChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="basePrice"
                                            name="basePrice"
                                            label="Ціна"
                                            fullWidth
                                            value={fetchedProduct.basePrice}
                                            onChange={this.handleEditingProductBasePriceChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="name"
                                            name="name"
                                            label="Закупочна ціна"
                                            value={fetchedProduct.purchasePrice}
                                            onChange={this.handleEditingProductPurchasePriceChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="basePrice"
                                            name="basePrice"
                                            label="Кількість"
                                            fullWidth
                                            value={fetchedProduct.amount}
                                            onChange={this.handleEditingProductAmountChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CargoDescriptionSelect
                                            value={{value: fetchedProduct.npDescription, label: fetchedProduct.npDescriptionText}}
                                            onChange={this.handleCargoDescriptionChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            style={{width: "100%"}}
                                            label="Ширина"
                                            type="number"
                                            value={fetchedProduct.npWidth}
                                            onChange={this.handleEditingProductWidthChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            style={{width: "100%"}}
                                            label="Довжина"
                                            type="number"
                                            value={fetchedProduct.npLength}
                                            onChange={this.handleEditingProductLengthChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            style={{width: "100%"}}
                                            label="Висота"
                                            type="number"
                                            value={fetchedProduct.npHeight}
                                            onChange={this.handleEditingProductHeightChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            style={{width: "100%"}}
                                            label="Вага"
                                            type="number"
                                            value={fetchedProduct.npWeight}
                                            onChange={this.handleEditingProductWeightChange}
                                        />
                                    </Grid>
                                </Grid>
                        </DialogContent>
                    )}
                    <DialogActions>
                        {!this.state.creating ? (
                            <Button onClick={this.handleDeleteProduct} color="secondary">
                                Видалити
                            </Button>
                        ) : null}
                        <Button onClick={this.handleEditProductDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.state.creating ? this.handleCreateEditingProduct :this.handleSaveEditingProduct} color="primary">
                            Зберегти
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

Products.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Products);
