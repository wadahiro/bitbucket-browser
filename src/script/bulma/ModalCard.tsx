import * as React from 'react';

export class ModalCard extends React.Component<any, any> {
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
            // color: '#69707a',
            // fontSize: '1rem'
        };
        const { title } = this.props;

        return (
            <div style={modalStyle} className={`modal ${show}`}>
                <div className='modal-background'></div>
                <div className='modal-card'>
                    <header className='modal-card-head'>
                        <p className='modal-card-title'>{title}</p>
                        <button className='delete' onClick={this.close}></button>
                    </header>
                    <section className='modal-card-body'>
                        {this.props.children}
                    </section>
                    {this.props.footer &&
                        <footer className='modal-card-foot'>
                            {this.props.footer}
                        </footer>
                    }
                </div>
            </div >
        );
    }
}