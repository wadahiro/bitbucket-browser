import * as React from 'react';
import { calcClassNames, ModifiersProps } from './Utils';

export interface Props extends React.HTMLProps<HTMLInputElement>, ModifiersProps {
}

export class InputText extends React.Component<Props, void> {
    TEXT_TYPE = 'text';

    render() {
        const className = calcClassNames(this.props);

        return (
            <input {...this.props} className={`input ${className}`}
                type={this.TEXT_TYPE}/>
        );
    }
}

export class InputPassword extends InputText {
    constructor(props) {
        super(props);
        this.TEXT_TYPE = 'password';
    }
}