import * as React from 'react';
import * as B from '../bulma';

export class UnauthorizedIcon extends React.Component<any, any> {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        const color = '#e84135';
        return (
            <B.Icon iconClassName='fa fa-exclamation-circle' color={color} lineHeight={20}>
            </B.Icon>
        );
    }
}