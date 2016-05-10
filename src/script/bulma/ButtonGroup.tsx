import * as React from 'react';

export interface ButtonGroupProps extends React.Props<ButtonGroup> {
    float?: 'left' | 'right';
}

export class ButtonGroup extends React.Component<ButtonGroupProps, any> {
    render() {
        const { float } = this.props;
        const isFloat = float ? `is-pulled-${float}` : '';
        
        return (
            <p className={`control is-grouped ${isFloat}`}>
                { this.props.children }
            </p>
        );
    }
}