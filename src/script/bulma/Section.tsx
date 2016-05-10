import * as React from 'react';

export class Section extends React.Component<any, any> {
    static defaultProps = {
        className: ''
    };

    render() {
        const { className } = this.props;

        return (
            <section className={`section ${className}`}>
                { this.props.children }
            </section>
        );
    }
}