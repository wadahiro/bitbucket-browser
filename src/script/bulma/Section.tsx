import * as React from 'react';

export class Section extends React.Component<any, any> {
    static defaultProps = {
        className: '',
        style: {}
    };

    render() {
        const { className, style } = this.props;

        return (
            <section className={`section ${className}`} style={style}>
                { this.props.children }
            </section>
        );
    }
}