import * as React from 'react';

export interface InputTextProps extends React.Props<InputText> {
    onClick?: (event: React.SyntheticEvent) => void;
    onChange?: (event: React.SyntheticEvent) => void;
    name?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    type?: 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export class InputText extends React.Component<InputTextProps, any> {
    static defaultProps = {
        type: null,
        size: null
    };
    TEXT_TYPE = 'text';

    render() {
        const { name, label, placeholder, size, type } = this.props;
        const isSize = size ? `is-${size}` : '';
        const isType = type ? `is-${type}` : '';

        return (
            <p className='control'>
                <label className='label'>{label}</label>
                <input className={`input ${isSize} ${isType}`}
                    type={this.TEXT_TYPE}
                    name={name}
                    placeholder={placeholder}
                    value={this.props.value}
                    onChange={this.props.onChange} />
            </p>
        );
    }
}

export class InputPassword extends InputText {
    constructor(props) {
        super(props);
        this.TEXT_TYPE = 'password';
    }
}