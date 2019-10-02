import React, { Component } from 'react';

import AsyncSelect from 'react-select/async';
import agent from '../../agent';
import commonStore from "../../stores/commonStore";

const load = inputValue => {
    const data = {
        apiKey: commonStore.npApiKey,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
            CityName: inputValue
        }
    };
    return agent.NP.post(data)
        .then((response) => {
            return response.data[0]['Addresses'];
        }).then((addresses) => {
            const options = [];
            addresses.forEach((address) => {
                options.push({
                    label: address['Present'],
                    value: address['DeliveryCity']
                })
            });
            return options;
        });
};

const promiseOptions = inputValue =>
    new Promise(resolve => {
        resolve(load(inputValue));
    });

export default class CitySelect extends Component {
    render() {
        return (
            <AsyncSelect value={this.props.value} defaultOptions loadOptions={promiseOptions} onChange={this.props.onChange}/>
        );
    }
}
