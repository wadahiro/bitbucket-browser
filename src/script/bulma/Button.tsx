import * as React from 'react';

export interface ButtonProps extends React.Props<Button> {
    onClick?: (event: React.SyntheticEvent) => void;
    type?: '' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: '' | 'small' | 'medium' | 'large';
    loading?: boolean;
    className?: string;
}

export class Button extends React.Component<ButtonProps, any> {
    static defaultProps = {
        type: '',
        size: '',
        className: ''
    };

    render() {
        const { size, type, loading, onClick, className } = this.props;
        
        const isLoading = loading ? 'is-loading' : '';

        return (
            <button className={`button is-${size} is-${type} ${isLoading} ${className}`}
                onClick={onClick}>
                { this.props.children }
            </button>
        );
    }
}