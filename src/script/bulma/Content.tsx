import * as React from 'react';

export class Content extends React.Component<any, any> {
    render() {
        return (
            <div className='content'>
                { this.props.children }
            </div>
        );
    }
}