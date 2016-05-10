import * as React from 'react';

export const Title = (props) => {
    return (
        <h1 className='title'>
            {props.children}
        </h1>
    );
};