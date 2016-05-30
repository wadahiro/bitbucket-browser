import * as React from 'react';
import { ModifiersProps, calcClassNames } from './Utils';

interface Props extends ModifiersProps {
}

export class Label extends React.Component<Props, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <label {...this.props} className={`label ${className}`}>
                { this.props.children }
            </label>
        );
    }
}