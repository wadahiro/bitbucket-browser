import * as React from 'react';

export interface CheckboxProps extends React.Props<Checkbox> {
    onClick?: (event: React.SyntheticEvent) => void;
    onChange?: (event: React.SyntheticEvent) => void;
    name?: string;
    label?: string;
    checked?: boolean;
    placeholder?: string;
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export class Checkbox extends React.Component<CheckboxProps, any> {
    static defaultProps = {
        type: '',
        size: ''
    };

    render() {
        const { name, checked, label, placeholder, size, type, onChange } = this.props;
        const isSize = size ? `is-${size}` : '';
        const isType = type ? `is-${type}` : '';

        return (
            <p className='control'>
                <label className='checkbox'>
                    <input name={name} type='checkbox' checked={checked} onChange={onChange}/>
                    {label}
                </label>
            </p>
        );
    }
}