import * as React from 'react';

export class Box extends React.Component<any, any> {
    render() {
        return (
            <div className='box'>
                { this.props.children }
            </div>
        );
    }
}