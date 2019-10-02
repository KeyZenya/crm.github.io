import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import MUIDataTable from "mui-datatables";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid/";

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
});


@inject('ordersStore', 'productsStore', 'npStore', 'ttnsStore')
@observer
class Registries extends Component {

    state = {
        editOrderDialogOpen: false,
        editOrderTtnDialogOpen: false,
        printingTtnId: -1,
        editingOrder: {},
        addingProduct: {},
        addingProductAmount: 1,
        selectedTtnIds: [],
        selectedTtnRefs: []
    };

    componentDidMount() {
        this.props.ttnsStore.loadTtns();
    }

    handlePrintingTtnIdChange = (id) => {
        this.setState({printingTtnId: id});
    };

    handleCreateRegistryFromTtns = () => {
        this.props.ttnsStore.createRegistryFromSelectedTtns();
    };

    handlePrintTtns = () => {

    };

    render() {
        const { classes } = this.props;
        const { ttns } = this.props.ttnsStore;

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
                name: "ttnNumber",
                label: "Номер",
                options: {
                    filter: true,
                    sort: false,
                }
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
                name: "deliveryDate",
                label: "Дата доставки",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "registry",
                label: "Реєстр",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "deliveryCosts",
                label: "Вартість доставки",
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
            onRowClick: rowData => {
                this.handlePrintingTtnIdChange(rowData[0]);
            },
            setRowProps: () => ({
                onDoubleClick: (row, dataIndex) => {
                    const ttn = this.props.ttnsStore.ttnsRegistry.get(this.state.printingTtnId);
                    const url = `https://my.novaposhta.ua/orders/printMarking100x100/orders/${ttn.ttnNumber}/type/pdf/apiKey/9d1f260416fcc08c389f38af1eaf299b/zebra`;
                    const win = window.open(url, '_blank');
                    win.focus();
                }
            }),
            onRowsSelect: currentRowsSelected => {
                const ids = currentRowsSelected.map(r => ttns[r.dataIndex].id);
                const refs = currentRowsSelected.map(r => ttns[r.dataIndex].ref);
                this.props.ttnsStore.setSetectedTtns(ids, refs);
            },
        };

        return (
            <div>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleCreateRegistryFromTtns}
                        >
                            До реєстру
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handlePrintTtns}
                        >
                            Друк
                        </Button>
                    </Paper>
                </Grid>
                <MUIDataTable
                    title={"ЕН"}
                    data={ttns}
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
