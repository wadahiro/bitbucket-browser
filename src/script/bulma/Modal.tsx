import * as React from 'react';

export class Modal extends React.Component<any, any> {
    static defaultProps = {
        show: false,
        onHide: null
    };

    close = (e) => {
        if (this.props.onHide) {
            this.props.onHide(e);
        }
    };

    render() {
        const show = this.props.show ? 'is-active' : '';
        const modalStyle = {
            color: '#69707a',
            fontSize: '1rem'
        };

        return (
            <div style={modalStyle} className={`modal ${show}`}>
                <div className='modal-background'></div>
                <div className='modal-container'>
                    <div className='modal-content'>
                        {this.props.children}
                    </div>
                </div>
                <button className='modal-close' onClick={this.close}></button>
            </div>
        );
    }
}