import * as React from 'react';

export interface ContainerProps {
    isFluid?: boolean;
}

export class Container extends React.Component<ContainerProps, void> {
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