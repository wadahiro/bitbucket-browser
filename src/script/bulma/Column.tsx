import * as React from 'react';

export class Column extends React.Component<any, any> {
    static defaultProps = {
        size: 0,
        offset: 0
    }

    render() {
        const { size, offset, type, style } = this.props;

        const isSize = `is-${size}`;
        const isOffset = `is-offset-${offset}`;

        return (
            <div className={`column ${isSize} ${isOffset}`} style={style}>
                { this.props.children }
            </div>
        );
    }
}