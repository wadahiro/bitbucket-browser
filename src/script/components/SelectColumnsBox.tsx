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

export default class SelectColumnsBox extends React.Component<Props, void> {
    handleCheck = (e) => {
        const columnName = e.target.name;
        const { settings, onChange } = this.props;

        const items = Object.assign({}, settings.items, {
            [columnName]: Object.assign({}, settings.items[columnName], {
                visible: e.target.checked
            })
        });

        const checked = Object.keys(items).find(x => items[x].enabled !== false && items[x].visible !== false);
        if (!checked) {
            // Don't allow no check
            return;
        }

        onChange(Object.assign({}, settings, {
            items
        }));
    };

    render() {
        const { settings } = this.props;

        const columns = Object.keys(settings.items).filter(x => settings.items[x].enabled !== false);

        return (
            <div>
                <div>
                    { columns.map(x => {
                        const col = settings.items[x];
                        return <B.Checkbox key={x}
                            name={x}
                            label={col.displayName}
                            checked={col.visible !== false}
                            onChange={this.handleCheck} />
                    }) }
                </div>
            </div>
        );
    }
}
