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
import { SketchPicker, SliderPicker } from 'react-color';

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
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
    },
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    },
    popover: {
        position: 'absolute',
        zIndex: '2',
    },
    cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    },
});


@inject('ordersStore')
@observer
class OrderCategories extends Component {

    state = {
        editTemplateDialogOpen: false,
        sendSmsDialogOpen: false,
        displayColorPicker: false,
        creating: false,
    };

    componentDidMount() {
        this.props.ordersStore.loadOrderCategories();
    }

    handleSmsTemplateDialogOpen = () => this.setState({editTemplateDialogOpen: true});
    handleSmsTemplateDialogClose = () => this.setState({editTemplateDialogOpen: false});
    handleSendSmsDialogOpen = () => this.setState({sendSmsDialogOpen: true});
    handleSendSmsDialogClose = () => this.setState({sendSmsDialogOpen: false});
    handleCreateOrderCategoryDialogOpen = () => {
      this.setState({creating: true});
        this.handleSmsTemplateDialogOpen();
    };

    handleFetchedOrderCategoryNameChange = (e) => this.props.ordersStore.setFetchedOrderCategoryProperty('name', e.target.value);
    handleFetchedOrderCategoryColorChange = (color) => this.props.ordersStore.setFetchedOrderCategoryProperty('color', color.hex);

    handleEditingSmsIdChange = (id) => this.setState({editingSmsId: id});

    handleCreateOrderCategory = () => {
        this.props.ordersStore.createOrderCategory();
        this.handleSmsTemplateDialogClose();
    };

    handleSaveOrderCategory = () => {
        this.props.ordersStore.saveOrderCategoryById();
        this.handleSmsTemplateDialogClose();
    };

    fetchOrderCategoryById = (id) => {
        this.props.ordersStore.fetchOrderCategoryById(id);
    };

    render() {
        const { classes } = this.props;
        const { ordersCategories, fetchedOrderCategory } = this.props.ordersStore;

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
                name: "color",
                label: "Колір",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => (
                        <Button variant="contained" style={{backgroundColor: `${value}`}}>{value}</Button>
                    ),
                },
            },
        ];

        const options = {
            filterType: 'checkbox',
            selectableRowsOnClick: false,
            responsive: 'stacked',
            onRowClick: rowData => {
            },
            setRowProps: (row, dataIndex) => ({
                onDoubleClick: () => {
                    this.fetchOrderCategoryById(row[0]);
                    this.setState({creating: false});
                    this.handleSmsTemplateDialogOpen();
                }
            })
        };
        return (
            <div>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.handleCreateOrderCategoryDialogOpen}
                        >
                            Додати категорію
                        </Button>
                    </Paper>
                </Grid>
                <MUIDataTable
                    title={"Категорії"}
                    data={ordersCategories}
                    className={classes.table}
                    columns={columns}
                    options={options}
                />
                <Dialog
                    fullWidth={true}
                    maxWidth={'xs'}
                    open={this.state.editTemplateDialogOpen}
                    onClose={this.handleSmsTemplateDialogClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Новий шаблон</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="orderCategoryName"
                                    name="orderCategoryName"
                                    label="Назва"
                                    fullWidth
                                    value={fetchedOrderCategory.name}
                                    onChange={this.handleFetchedOrderCategoryNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" style={{backgroundColor: `${fetchedOrderCategory.color}`}}>{fetchedOrderCategory.color}</Button>
                            </Grid>
                            <Grid item xs={12} justify={"center"}>
                                <SketchPicker color={ fetchedOrderCategory.color } onChange={ this.handleFetchedOrderCategoryColorChange } />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSmsTemplateDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.state.creating ? this.handleCreateOrderCategory : this.handleSaveOrderCategory} color="primary">
                            Зберегти
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

OrderCategories.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderCategories);
