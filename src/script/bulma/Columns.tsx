import * as React from 'react';
import { ColumnsTypeProps, calcGridClassNames } from './Utils';

interface Props extends React.HTMLProps<HTMLDivElement>, ColumnsTypeProps {
}

export class Columns extends React.Component<Props, void> {
    render() {
        const className = calcGridClassNames(this.props);

        return (
            <div {...this.props} className={`columns ${className}`}>
                { this.props.children }
            </div>
        );
    }
}