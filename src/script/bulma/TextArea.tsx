import * as React from 'react';

export interface TextAreaProps extends React.Props<TextArea> {
    onClick?: (event: React.SyntheticEvent) => void;
    onChange?: (event: React.SyntheticEvent) => void;
    name?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export class TextArea extends React.Component<TextAreaProps, any> {
    render() {
        const { name, label, placeholder, size, type } = this.props;
        const isSize = size ? `is-${size}` : '';
        const isType = type ? `is-${type}` : '';

        return (
            <p className='control'>
                <label className='label'>{label}</label>
                <textarea className={`textarea ${isSize} ${isType}`}
                    name={name}
                    placeholder={placeholder}
                    value={this.props.value}
                    onChange={this.props.onChange} />
            </p>
        );
    }
}