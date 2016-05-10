import * as React from 'react';

export interface ContainerProps extends React.Props<Container> {
    isFluid?: boolean;
}

export class Container extends React.Component<ContainerProps, any> {
    static defaultProps = {
        isFluid: false
    };
    render() {
        return (
            <div className={`container ${this.props.isFluid ? 'is-fluid' : ''}`}>
                { this.props.children }
            </div>
        );
    }
}