import * as React from 'react';

export class Tab extends React.Component<any, any> {
    
    render() {
        return (
            <div className='tabs'>
                <ul>
                    <li className='is-active'><a>Pictures</a></li>
                    <li><a>Music</a></li>
                    <li><a>Videos</a></li>
                    <li><a>Documents</a></li>
                </ul>
            </div>
        );
    }
}