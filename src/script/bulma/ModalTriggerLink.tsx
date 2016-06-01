import * as React from 'react';

interface Props extends React.HTMLProps<HTMLAnchorElement> {
    modal: JSX.Element;
}

interface State {
    show: boolean;
}

export class ModalTriggerLink extends React.Component<Props, State> {
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
                <a {...this.props} onClick={this.open}>
                    { this.props.children }
                </a>
                { this.state.show && modal }
            </div>
        );
    }
}