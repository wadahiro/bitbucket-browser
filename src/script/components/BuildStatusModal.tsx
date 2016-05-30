import * as React from 'react';
import * as B from '../bulma';

import * as API from '../webapis';

interface Props {
    show?: boolean;
    onHide?: (e: React.SyntheticEvent) => void;
    buildStatus: API.BuildStatus;
    cancelLabel?: string;
}

interface State {
    showButtons: boolean;
}

export class BuildStatusModal extends React.Component<Props, State> {
    static defaultProps = {
        submitLabel: 'Delete',
        cancelLabel: 'Cancel',
        showButtons: true
    };

    state = {
        showButtons: false
    };

    render() {
        const { show, buildStatus, onHide, cancelLabel } = this.props;
        const { showButtons } = this.state;

        return (
            <B.ModalCard show={show} onHide={onHide} title='Build Status'>
                <B.Content>
                    { buildStatus.values.map(x => {
                        let iconClassName;
                        let color;
                        if (x.state === 'SUCCESSFUL') {
                            iconClassName = 'fa fa-check-circle-o';
                            color = '#14892c'
                        } else if (x.state === 'FAILED') {
                            iconClassName = 'fa fa-exclamation-triangle';
                            color = '#d04437';
                        } else {
                            iconClassName = 'fa fa-spinner';
                            color = '#4a6785';
                        }
                        const style = {
                            fontSize: 'small'
                        };

                        const figure = <B.Icon iconClassName={iconClassName} size={32} color={color} />;
                        const title = <a href={x.url} target='_blank' style={style}>
                            {x.name}
                        </a>;

                        return (
                            <B.MediaObject key={x.name}
                                figure={figure}
                                figureSize='32x32'
                                >
                                <p>
                                    <strong>{title}</strong>
                                    <br />
                                    {x.description}
                                    <br />
                                    <small>{x.dateAdded}</small>
                                </p>
                            </B.MediaObject>
                        );
                    })
                    }
                </B.Content>
            </B.ModalCard>
        );
    }
}
