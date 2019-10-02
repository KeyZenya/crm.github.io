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


@inject('ordersStore', 'productsStore', 'npStore', 'ttnsStore', 'smsStore')
@observer
class SmsTemplates extends Component {

    state = {
        editTemplateDialogOpen: false,
        sendSmsDialogOpen: false,
        editingSmsId: 0,
        creating: false,
        phones: [],
    };

    componentDidMount() {
        this.props.ordersStore.loadOrders();
        this.props.ttnsStore.loadTtns();
        this.props.smsStore.loadSms();
        this.props.smsStore.loadSmsTemplates();
    }

    handleSmsTemplateDialogOpen = () => this.setState({editTemplateDialogOpen: true});
    handleSmsTemplateDialogClose = () => this.setState({editTemplateDialogOpen: false});
    handleSendSmsDialogOpen = () => this.setState({sendSmsDialogOpen: true});
    handleSendSmsDialogClose = () => this.setState({sendSmsDialogOpen: false});

    handleEditingSmsIdChange = (id) => this.setState({editingSmsId: id});

    handleSmsTemplateNameChange = e => this.props.smsStore.setSmsTemplateName(e.target.value);
    handleSmsTemplateTextChange = e => this.props.smsStore.setSmsTemplateText(e.target.value);
    handleAddTtnToSmsTemplate = () => this.props.smsStore.addTtnToSmsTemplate();
    handleAddSentToSmsTemplate = () => this.props.smsStore.addSentToSmsTemplate();
    handleCreateSmsTemplate = () => {
        this.props.smsStore.createSmsTemplate();
        this.handleSmsTemplateDialogClose();
    };
    handleSendSmsTextChange = e => this.props.smsStore.setSmsText(e.target.value);

    handleSelectSmsTemplate = selectedOption => {
        this.props.smsStore.setSmsText(selectedOption.value);
    };

    handlePhonesChange = selectedOptions => {
        const phones = [];
        selectedOptions.forEach((option) => {
            phones.push({phone: option.value, order: option.order});
            this.setState({phones});
        });
    };

    handleSendSms = () => {
        this.props.smsStore.sendSmsToPhones(this.state.phones);
        this.handleSendSmsDialogClose();
    };

    render() {
        const { classes } = this.props;
        const { sms, smsTemplates, smsTemplate, sendSms, isLoading } = this.props.smsStore;
        const { orders } = this.props.ordersStore;

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
                name: "order",
                label: "Замовлення",
                options: {
                    filter: true,
                    sort: false,
                }
            },
            {
                name: "text",
                label: "Текст",
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
            onRowClick: rowData => {
                this.handleEditingSmsIdChange(rowData[0]);
            },
            setRowProps: () => ({
                onDoubleClick: (row, dataIndex) => {
                    // this.fetchEditingProduct();
                    this.handleSmsTemplateDialogOpen();
                }
            })
        };

        const smsTemplatesOptions = smsTemplates.map((st) => {
            return { value: st.text, label: st.name};
        });

        const phonesOptions = orders.map((order) => {
            return { value: order.phone, order: order, label: order.id + '. ' + order.customerName + ' '  + order.phone};
        });

        return (
            <div>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleSendSmsDialogOpen}
                        >
                            Написати
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            onClick={this.handleSmsTemplateDialogOpen}
                        >
                            Додати шаблон
                        </Button>
                    </Paper>
                </Grid>
                <MUIDataTable
                    title={"Смс"}
                    data={sms}
                    className={classes.table}
                    columns={columns}
                    options={options}
                />
                <Dialog open={this.state.editTemplateDialogOpen} onClose={this.handleSmsTemplateDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Новий шаблон</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="smsTemplateName"
                                    name="smsTemplateName"
                                    label="Назва"
                                    fullWidth
                                    value={smsTemplate.name}
                                    onChange={this.handleSmsTemplateNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleAddTtnToSmsTemplate}
                                >
                                    ЕН
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleAddSentToSmsTemplate}
                                >
                                    Відправлено
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <TextareaAutosize
                                    rows={4}
                                    fullWidth
                                    style={{width: '100%'}}
                                    placeholder="Текст повідомлення"
                                    value={smsTemplate.text}
                                    onChange={this.handleSmsTemplateTextChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSmsTemplateDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.handleCreateSmsTemplate} color="primary">
                            Зберегти
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.sendSmsDialogOpen} onClose={this.handleSendSmsDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Смс</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Select
                                        options={smsTemplatesOptions}
                                        placeholder="З шаблону"
                                        onChange={this.handleSelectSmsTemplate}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Select
                                        options={phonesOptions}
                                        placeholder="Телефони"
                                        isMulti
                                        onChange={this.handlePhonesChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextareaAutosize
                                        rows={4}
                                        fullWidth
                                        style={{width: '100%'}}
                                        placeholder="Текст повідомлення"
                                        value={sendSms.text}
                                        onChange={this.handleSendSmsTextChange}
                                    />
                                </Grid>
                                {/*<Grid item xs={12}>*/}
                                    {/*<FormControlLabel*/}
                                        {/*control={<Checkbox color="secondary" name="saveAddress" value="yes" />}*/}
                                        {/*label="Зберегти як шаблон"*/}
                                    {/*/>*/}
                                {/*</Grid>*/}
                            </Grid>

                        </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSendSmsDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.handleSendSms} color="primary">
                            Відправити
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

SmsTemplates.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SmsTemplates);
