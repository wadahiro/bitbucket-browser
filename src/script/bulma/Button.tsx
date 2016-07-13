import * as React from 'react';
import { ModifiersProps, ButtonSyntaxProps, calcClassNames } from './Utils';

export interface ButtonProps extends React.HTMLProps<HTMLAnchorElement>, ModifiersProps, ButtonSyntaxProps {
}

export class Button extends React.Component<ButtonProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <a {...this.props} className={`button ${className}`}>
                { this.props.children }
            </a>
        );
    }
}