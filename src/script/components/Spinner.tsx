import * as React from 'react';

interface Props extends React.Props<Spinner> {
    show: boolean;
}

export default class Spinner extends React.Component<Props, any> {
    render() {
        const { show } = this.props;
        return show ? <i className='glyphicon glyphicon-refresh spinning'></i> : <span />
    }
}
