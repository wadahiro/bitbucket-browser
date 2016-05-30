import * as React from 'react';
import { ModifiersProps, ActiveProps, TitleProps, calcClassNames } from './Utils';

interface NavProps {
    style?: any;
}

export class Nav extends React.Component<NavProps, void> {
    static defaultProps = {
        style: {}
    };

    render() {
        const { style } = this.props;

        return (
            <nav className={`nav`} style={style}>
                {this.props.children}
            </nav>
        );
    }
}

interface NavLeftProps {
    style?: any;
}

export class NavLeft extends React.Component<NavLeftProps, void> {
    static defaultProps = {
        style: {}
    };

    render() {
        const { style } = this.props;

        return (
            <nav className={`nav-left`} style={style}>
                {this.props.children}
            </nav>
        );
    }
}

interface NavCenterProps {
    style?: any;
}

export class NavCenter extends React.Component<NavCenterProps, void> {
    static defaultProps = {
        style: {}
    };

    render() {
        const { style } = this.props;

        return (
            <nav className={`nav-center`} style={style}>
                {this.props.children}
            </nav>
        );
    }
}


interface NavRightProps {
    style?: any;
    isMenu?: boolean;
}

export class NavRight extends React.Component<NavRightProps, void> {
    static defaultProps = {
        style: {},
        isMenu: false
    };

    render() {
        const { style, isMenu } = this.props;
        const menu = isMenu ? 'nav-menu' : '';


        return (
            <nav className={`nav-right ${menu}`} style={style}>
                {this.props.children}
            </nav>
        );
    }
}

interface NavItemProps extends React.HTMLProps<HTMLSpanElement>, ModifiersProps, ActiveProps, TitleProps {
}

export class NavItem extends React.Component<NavItemProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <span {...this.props} className={`nav-item ${className}`}>
                {this.props.children}
            </span>
        );
    }
}

interface NavItemLinkProps extends React.HTMLProps<HTMLAnchorElement>, ModifiersProps, ActiveProps, TitleProps {
}

export class NavItemLink extends React.Component<NavItemLinkProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <a {...this.props} className={`nav-item ${className}`}>
                {this.props.children}
            </a>
        );
    }
}

export class NavItemButton extends React.Component<NavItemLinkProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <a {...this.props} className={`nav-item button ${className}`}>
                {this.props.children}
            </a>
        );
    }
}

interface NavToggleProp extends React.HTMLProps<HTMLAnchorElement> {
}

export class NavToggle extends React.Component<NavToggleProp, void> {
    static defaultProps = {
    };

    render() {
        return (
            <span className='nav-toggle'>
                <span></span>
                <span></span>
                <span></span>
            </span>
        );
    }
}

