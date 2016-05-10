import * as React from 'react';
import * as B from '../bulma';

interface Props extends React.Props<Dropdown> {
    label?: string;
    icon?: string;
    position?: 'right' | 'left';
}

export class Dropdown extends React.Component<Props, any> {
    static defaultProps = {
        position: 'right'
    };
    state = {
        show: false
    };

    toggle = () => {
        this.setState({
            show: !this.state.show
        })
    };

    render() {
        let { label, icon, position } = this.props;

        let iconEl;
        if (icon) {
            iconEl = <i className={icon}></i>;
        }

        const open = this.state.show ? 'open' : '';

        return (
            <div className={`dropdown ${open}`}>
                <B.Button onClick={this.toggle}>
                    {iconEl}{label}
                </B.Button>
                <ul className={`dropdown-menu dropdown-menu-${position}`}>
                    {this.props.children}
                </ul>
            </div>
        );
    }
}

export class DropdownItem extends React.Component<any, any> {
    render() {
        return (
            <li>{this.props.children}</li>
        );
    }
}