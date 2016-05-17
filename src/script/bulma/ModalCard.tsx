import * as React from 'react';

interface Props extends React.Props<ModalCard> {
    show: boolean;
    showClose?: boolean;
    onHide: (e: React.SyntheticEvent) => void;
    title: string;
    footer?: JSX.Element;
}

export class ModalCard extends React.Component<Props, any> {
    static defaultProps = {
        show: false,
        showClose: true,
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
        const { title, showClose } = this.props;

        // wrap modal-card in a div for IE 11.
        // see http://stackoverflow.com/questions/31354137/element-is-not-horizontally-centered-in-ie11-with-flexbox-when-parent-has-flex-f
        return (
            <div style={modalStyle} className={`modal ${show}`}>
                <div className='modal-background'></div>
                <div>
                    <div className='modal-card'>
                        <div>
                            <header className='modal-card-head'>
                                <p className='modal-card-title'>{title}</p>
                                { showClose &&
                                    <button className='delete' onClick={this.close}></button>
                                }
                            </header>
                        </div>
                        <div>
                            <section className='modal-card-body'>
                                {this.props.children}
                            </section>
                        </div>
                        {this.props.footer &&
                            <div>
                                <footer className='modal-card-foot'>
                                    {this.props.footer}
                                </footer>
                            </div>
                        }
                    </div>
                </div>
            </div >
        );
    }
}