import * as React from 'react';
import { ModifiersProps, calcClassNames } from './Utils';

interface Props extends ModifiersProps {
    value: number;
    max: number;
}

export class ProgressBar extends React.Component<Props, void> {
    render() {
        const { value, max } = this.props;
        const className = calcClassNames(this.props);

        return (
            <progress className={`progress ${className}`} value={String(value) } max={max}>
                {this.props.children}
            </progress>
        );
    }
}