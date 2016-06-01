import * as React from 'react';

interface Props {
    show: boolean;
    onHide: (e: React.SyntheticEvent) => void;
    keyboard?: boolean;
}

export class Modal extends React.Component<Props, void> {
    static defaultProps = {
        show: false,
        onHide: null,
        keyboard: false
    };

    componentWillMount() {
        if (this.props.keyboard) {
            document.addEventListener('keydown', this._handleEscKey, false);
        }
    }

    componentWillUnmount() {
        if (this.props.keyboard) {
            document.removeEventListener('keydown', this._handleEscKey, false);
        }
    }

    close = (e) => {
        if (this.props.onHide) {
            this.props.onHide(e);
        }
    };

    _handleEscKey = (e: KeyboardEvent) => {
        if (this.props.onHide && e.keyCode === 27) {
            this.props.onHide(null);
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