import React, { Component } from 'react';
import Select from 'react-select';
import agent from '../../agent';
import commonStore from "../../stores/commonStore";

export default class WarehouseSelect extends Component {

    state = {
        options: []
    };

    componentDidMount()
    {
        this.loadOptions(this.props.cpRef);
    }

    componentWillReceiveProps(nextProps) {
        // if(this.props.cpRef !== nextProps.cpRef && this.props.cpRef !== 'emptyDefault')
        // {
        //     this.props.onCounterpartyChange();
        //     this.loadOptions(nextProps.cpRef);
        // }
        // if(this.props.cityRef !== nextProps.cityRef)
        // {
        //     this.loadOptions(nextProps.cpRef);
        // }
    }

    loadOptions = Ref => {
        const data = {
            apiKey: commonStore.npApiKey,
            modelName: 'Counterparty',
            calledMethod: 'getCounterpartyContactPersons',
            methodProperties: {
                Ref: Ref
            }
        };
        agent.NP.post(data)
            .then((response) => {
                return response.data;
            }).then((contactPersons) => {
            const options = [];
            contactPersons.forEach((cp) => {
                options.push({
                    label: cp['Description'] + ' ' + cp['Phones'],
                    phones: cp['Phones'],
                    value: cp['Ref']
                })
            });
            this.setState({options: options});
        });
    };

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
