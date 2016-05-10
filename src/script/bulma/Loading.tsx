import * as React from 'react';
import * as B from '../bulma';

export class Loading extends React.Component<any, any> {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <B.Icon iconClassName='fa fa-refresh' spin={3}>
            </B.Icon>
        );
    }
}