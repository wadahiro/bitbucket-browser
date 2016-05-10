import * as React from 'react';

export const Link = (props) => {
    return (
        <a {...props} href={props.to}>
            {props.children}
        </a>
    );
};