import * as React from 'react';
import { Type, type, Size, size } from './Utils';

interface Props extends React.Props<any> {
    value: number;
    max: number;
    type?: Type;
    size?: Size;
}

export const ProgressBar = (props: Props) => {
    return (
        <progress className={`progress ${type(props.type)} ${size(props.size)}`} value={String(props.value) } max={props.max}>
            {props.children}
        </progress>
    );
};