import * as React from 'react';
import { ModifiersProps, calcClassNames } from './Utils';

export interface SelectProps extends React.HTMLProps<HTMLSelectElement>, ModifiersProps {
}

export interface Option {
    label: string;
    value: string;
}

export class Select extends React.Component<SelectProps, void> {
    static defaultProps = {
        options: []
    };

    render() {
        const { name, label, value, options, placeholder } = this.props;
        const className = calcClassNames(this.props);

        return (
            <span className='select'>
                <select {...this.props} className={`${className}`}>
                    { options.map(x => {
                        return <option key={x.value} value={x.value}>{x.label}</option>;
                    }) }
                </select>
            </span>
        );
    }
}