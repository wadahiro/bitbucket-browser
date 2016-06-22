import * as React from 'react';
import { ColumnTypeProps, calcGridClassNames } from './Utils';

interface Props extends React.HTMLProps<HTMLDivElement>, ColumnTypeProps {
}

export class Column extends React.Component<Props, void> {
    render() {
        const className = calcGridClassNames(this.props);

        return (
            <div {...this.props} className={`column ${className}`}>
                { this.props.children }
            </div>
        );
    }
}