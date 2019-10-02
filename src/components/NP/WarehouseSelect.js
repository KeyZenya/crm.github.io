import React, { Component } from 'react';
import Select from 'react-select';
import agent from '../../agent';
import commonStore from "../../stores/commonStore";

export default class WarehouseSelect extends Component {

    state = {
        options: [],
        cityRef: 'emptyDefault'
    };

    componentWillReceiveProps(nextProps) {
        // console.log('--------------------');
        // console.log(this.props.cityRef);
        // console.log(nextProps.cityRef);
        // console.log('--------------------');
        if(this.props.cityRef !== nextProps.cityRef && this.props.cityRef !== 'emptyDefault')
        {
            this.props.onCityChange();
            this.loadOptions(nextProps.cityRef);
        }
        if(this.props.cityRef !== nextProps.cityRef)
        {
            this.loadOptions(nextProps.cityRef);
        }
    }

    loadOptions = cityRef => {
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties: {
                CityRef: cityRef
            }
        };
        agent.NP.post(data)
            .then((response) => {
                return response.data;
            }).then((warehouses) => {
                const options = [];
                warehouses.forEach((warehouse) => {
                    options.push({
                        label: warehouse['Description'],
                        value: warehouse['Ref']
                    })
                });
                this.setState({options: options});
            });
    };

    // handleChange = (selectedOption) => {
    //     this.props.onChange(selectedOption);
    // };

    render() {
        return (
            <Select
                value={this.props.value}
                options={this.state.options}
                onChange={this.props.onChange}
            />
        );
    }
}
