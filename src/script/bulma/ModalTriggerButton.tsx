import * as React from 'react';
import { ModifiersProps, ButtonSyntaxProps, calcClassNames } from './Utils';

import { Button, ButtonProps } from './Button';

interface Props extends ButtonProps {
    modal: JSX.Element;
}

interface State {
    show: boolean;
}

export class ModalTriggerButton extends React.Component<Props & React.ClassAttributes<Button>, State> {
    state = {
        show: false
    };

    open = (e) => {
        this.setState({
            show: true
        });
    };

    close = (e) => {
        this.setState({
            show: false
        });
    };

    render() {
        const modal = React.cloneElement(this.props.modal, {
            show: this.state.show,
            onHide: this.close
        });

        return (
            <div>
                <Button {...this.props} onClick={this.open}>
                    { this.props.children }
                </Button>
                { this.state.show && modal }
            </div>
        );
    }
}