import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/styles';
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import CitySelect from "../../../components/NP/CitySelect";
import WarehouseSelect from "../../../components/NP/WarehouseSelect";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import TextField from "@material-ui/core/TextField/TextField";

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


@inject('npStore', 'commonStore')
@observer
class NpApiKeys extends Component {

    state = {
        createNpApiKeyDialogOpen: false,
    };

    componentDidMount() {
        this.props.npStore.loadNpApiKeys();
    }

    handleCreateNpApiKeyDialogOpen = () => {
        this.setState({createNpApiKeyDialogOpen: true});
    };

    handleCreateNpApiKeyDialogClose = () => {
        this.setState({createNpApiKeyDialogOpen: false});
    };

    handleCreateNpApiKey = () => {
        this.props.npStore.createNpApiKey();
        this.handleCreateNpApiKeyDialogClose();
    };

    handleNpApiKeyNameChange = e => this.props.npStore.setNpApiKeyName(e.target.value);
    handleNpApiKeyKeyChange = e => this.props.npStore.setNpApiKeyKey(e.target.value);

    handleNpApiKeyChange = (selectedOption) => {
        this.props.commonStore.setNpApiKey(selectedOption.value);
        this.props.commonStore.setNpApiKeyId(selectedOption.id);
    };

    render() {
        const { classes } = this.props;
        const { npApiKeys, npApiKey } = this.props.npStore;

        const npApiKeysOptions = npApiKeys.map((npApiKey) => {
            return { value: npApiKey.key, label: npApiKey.key};
        });
        return (
            <div>
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography>Np api key</Typography>
                            <Select
                                value={{ label: this.props.commonStore.npApiKey, value: this.props.commonStore.key }}
                                options={npApiKeysOptions}
                                onChange={this.handleNpApiKeyChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="secondary" onClick={this.handleCreateNpApiKeyDialogOpen}>Додати</Button>
                        </Grid>
                    </Grid>
                </Paper>
                <Dialog open={this.state.createNpApiKeyDialogOpen} onClose={this.handleCreateNpApiKeyDialogClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Новий апі ключ</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="npApiKeyName"
                                    name="npApiKeyName"
                                    label="Назва"
                                    fullWidth
                                    value={npApiKey.name}
                                    onChange={this.handleNpApiKeyNameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="smsTemplateVal"
                                    name="smsTemplateVal"
                                    label="Ключ"
                                    fullWidth
                                    value={npApiKey.key}
                                    onChange={this.handleNpApiKeyKeyChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateNpApiKeyDialogClose} color="primary">
                            Відмінити
                        </Button>
                        <Button onClick={this.handleCreateNpApiKey} color="primary">
                            Зберегти
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

NpApiKeys.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NpApiKeys);
