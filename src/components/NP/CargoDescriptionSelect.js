import React, { Component } from 'react';

import AsyncSelect from 'react-select/async';
import agent from '../../agent';
import commonStore from "../../stores/commonStore";

const load = inputValue => {

    const data = {
        apiKey: commonStore.npApiKey,
        modelName: "Common",
        calledMethod: "getCargoDescriptionList",
        methodProperties: {
            FindByString: inputValue
        }
    };
    return agent.NP.post(data)
        .then((response) => {
            return response.data;
        }).then((descriptions) => {
            const options = [];
            descriptions.forEach((description) => {
                options.push({
                    label: description['Description'],
                    value: description['Ref']
                });
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
