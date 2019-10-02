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


@inject('settingsStore')
@observer
class Settings extends Component {

    state = {
    };

    componentDidMount() {
        this.props.settingsStore.loadSettings();
    }

    handleSettingsCityChange = (selectedOption) => {
        this.props.settingsStore.setSettingsProperty('senderCity', selectedOption.value);
        this.props.settingsStore.setSettingsProperty('senderCityName', selectedOption.label);
    };

    handlePrevCityChange = () => {
        this.props.settingsStore.setSettingsProperty('senderWarehouseName', '');
        this.props.settingsStore.setSettingsProperty('senderWarehouse', '');
    };

    handleWarehouseChange = (selectedOption) => {
        this.props.settingsStore.setSettingsProperty('senderWarehouseName', selectedOption.label);
        this.props.settingsStore.setSettingsProperty('senderWarehouse', selectedOption.value);
    };

    handleSaveSettings = () => {
      this.props.settingsStore.saveSettings();
    };

    handleNpApiKeyChange = (selectedOption) => {
      this.props.commonStore.setNpApiKey((selectedOption.value));
    };



    render() {
        const { classes } = this.props;
        const { settings } = this.props.settingsStore;
        return (
            <div>
                <Paper className={classes.paper}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography>Місто</Typography>
                            <CitySelect
                                value={{ value: settings.senderCity, label: settings.senderCityName }}
                                onChange={this.handleSettingsCityChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Відділення</Typography>
                            <WarehouseSelect
                                value={{ label: settings.senderWarehouseName, value: settings.senderWarehouse }}
                                onChange={this.handleWarehouseChange}
                                cityRef={settings.senderCity}
                                onCityChange={this.handlePrevCityChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={this.handleSaveSettings}>Зберегти</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </div>

        );
    }
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
