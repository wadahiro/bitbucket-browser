import * as React from 'react';
import { calcClassNames, ModifiersProps } from './Utils';

export interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement>, ModifiersProps {
}

export class TextArea extends React.Component<TextAreaProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <textarea {...this.props} className={`textarea ${className}`}/>
        );
    }
}