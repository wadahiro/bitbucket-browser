import * as React from 'react';

export interface ModalLinkTriggerProps extends React.Props<ModalTriggerLink> {
    modal: any;
}

export class ModalTriggerLink extends React.Component<ModalLinkTriggerProps, any> {
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
                <a onClick={this.open}>
                    { this.props.children }
                </a>
                { this.state.show && modal }
            </div>
        );
    }
}