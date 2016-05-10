import * as React from 'react';

export class Columns extends React.Component<any, any> {
    static defaultProps = {
        type: null,
    }
    
    render() {
        const { type } = this.props;
        const isType = type ? `is-${type}` : ''
        
        return (
            <div className={`columns ${isType}`}>
                { this.props.children }
            </div>
        );
    }
}