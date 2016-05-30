import * as React from 'react';
import { calcClassNames, HelpersProps } from './Utils';

export interface ButtonGroupProps extends HelpersProps {
}

export class ButtonGroup extends React.Component<ButtonGroupProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <p className={`control is-grouped ${className}`}>
                { this.props.children }
            </p>
        );
    }
}