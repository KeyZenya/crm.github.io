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


@inject('ttnsStore')
@observer
class Registries extends Component {

    state = {
        editTemplateDialogOpen: false,
        sendSmsDialogOpen: false,
        editingSmsId: 0,
        creating: false,
        phones: [],
    };

    componentDidMount() {
        this.props.ttnsStore.loadRegistries();
    }

    render() {
        const { classes } = this.props;
        const { registries, isLoading } = this.props.ttnsStore;

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
                name: "ref",
                label: "Ref",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "registryNumber",
                label: "Номер",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "date",
                label: "Створено",
                options: {
                    filter: true,
                    sort: false,
                }
            },
        ];

        const options = {
            filterType: 'checkbox',
            selectableRowsOnClick: false,
            responsive: 'stacked',
            // onRowClick: rowData => {
            //     this.handleEditingSmsIdChange(rowData[0]);
            // },
            // setRowProps: () => ({
            //     onDoubleClick: (row, dataIndex) => {
            //         // this.fetchEditingProduct();
            //         // this.handleSmsTemplateDialogOpen();
            //     }
            // })
            onRowsDelete: (rowsDeleted) => {
                const idsToDelete = rowsDeleted.data.map(d => registries[d.dataIndex].id);
                const refsToDelete = rowsDeleted.data.map(d => registries[d.dataIndex].ref);
                this.props.ttnsStore.deleteRegistries(idsToDelete, refsToDelete);
            }
        };

        return (
            <div>
                <MUIDataTable
                    title={"Реєстри"}
                    data={registries}
                    className={classes.table}
                    columns={columns}
                    options={options}
                />
            </div>

        );
    }
}

Registries.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Registries);
