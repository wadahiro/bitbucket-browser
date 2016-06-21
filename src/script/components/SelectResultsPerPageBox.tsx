import * as React from 'react';
import * as _ from 'lodash';
const Select = require('react-select');

import * as B from '../bulma';
import * as API from '../webapis';
import { Settings } from '../Settings';

export interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    settings: Settings;
    onChange: (settings: Settings) => void;
}

export default class SelectResultsPerPageBox extends React.Component<Props, void> {
    handleChange = (e) => {
        const newResultsPerPage = e.target.value;
        const { settings, onChange } = this.props;

        onChange(Object.assign({}, settings, {
            resultsPerPage: Object.assign({}, settings.resultsPerPage, {
                value: newResultsPerPage
            })
        }));
    };

    render() {
        const { settings } = this.props;

        const options = settings.resultsPerPage.options.map(x => ({ label: x, value: x }));

        return (
            <B.Control>
                <B.Select options={options} value={settings.resultsPerPage.value} onChange={this.handleChange} />
            </B.Control>
        );
    }
}
