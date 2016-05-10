import * as React from 'react';

import { Button, ButtonProps } from './Button';

export interface ModalButtonTriggerProps extends ButtonProps {
    modal: any;
}

export class ModalTriggerButton extends React.Component<ModalButtonTriggerProps, any> {
    static defaultProps = {
        type: '',
        size: ''
    };

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