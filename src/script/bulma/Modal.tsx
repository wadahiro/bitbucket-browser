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

        // wrap modal-container in a div for IE 11.
        // see http://stackoverflow.com/questions/31354137/element-is-not-horizontally-centered-in-ie11-with-flexbox-when-parent-has-flex-f
        return (
            <div style={modalStyle} className={`modal ${show}`}>
                <div className='modal-background'></div>
                <div>
                    <div className='modal-container'>
                        <div className='modal-content'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <button className='modal-close' onClick={this.close}></button>
            </div>
        );
    }
}