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

        // Work-around for https://github.com/facebook/react/issues/6704
        const v = value === 0 ? '' : value;
        return (
            <progress className={`progress ${className}`} value={v} max={max}>
                {this.props.children}
            </progress>
        );
    }
}