import * as React from 'react';
import { calcClassNames, ModifiersProps } from './Utils';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement>, ModifiersProps {
}

export class Checkbox extends React.Component<CheckboxProps, void> {
    render() {
        const { label } = this.props;
        const className = calcClassNames(this.props);

        return (
            <p className='control'>
                <label className={`checkbox ${className}`}>
                    <input {...this.props} type='checkbox'  />
                    {label}
                </label>
            </p>
        );
    }
}