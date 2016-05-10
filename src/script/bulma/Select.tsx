import * as React from 'react';

export interface SelectProps extends React.Props<Select> {
    onClick?: (event: React.SyntheticEvent) => void;
    onChange?: (event: React.SyntheticEvent) => void;
    name?: string;
    label?: string;
    value?: string;
    options?: Option[];
    placeholder?: string;
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export interface Option {
    label: string;
    value: string;
}

export class Select extends React.Component<SelectProps, any> {
    static defaultProps = {
        type: '',
        size: '',
        options: []
    };

    render() {
        const { name, label, value, options, placeholder, size, type } = this.props;
        const isSize = size ? `is-${size}` : '';
        const isType = type ? `is-${type}` : '';

        return (
            <p className='control'>
                <label className='label'>{label}</label>
                <span className='select'>
                    <select className={`${isSize} ${isType}`}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={this.props.onChange}>
                        { options.map(x => {
                            return <option key={x.value} value={x.value}>{x.label}</option>;
                        }) }
                    </select>
                </span>
            </p>
        );
    }
}