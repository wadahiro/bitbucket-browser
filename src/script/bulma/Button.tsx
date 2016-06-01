import * as React from 'react';
import { ModifiersProps, ButtonSyntaxProps, calcClassNames } from './Utils';

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement>, ModifiersProps, ButtonSyntaxProps {
}

export class Button extends React.Component<ButtonProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <button {...this.props} className={`button ${className}`}>
                { this.props.children }
            </button>
        );
    }
}