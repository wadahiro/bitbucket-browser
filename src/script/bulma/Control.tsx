import * as React from 'react';

interface Props {
    hasIcon?: boolean;
    hasIconRigh?: boolean;
    hasAddons?: boolean;
    isGrouped?: boolean;
}

export class Control extends React.Component<Props, void> {
    render() {
        const className = caclClassName(this.props);

        return (
            <p className={`control ${className}`}>
                { this.props.children }
            </p>
        );
    }
}

function caclClassName(props: Props) {
    const classNames = [];

    if (props.hasIcon) {
        classNames.push('has-icon');
    }
    if (props.hasIconRigh) {
        classNames.push('has-icon-right');
    }
    if (props.hasAddons) {
        classNames.push('has-addons');
    }
    if (props.isGrouped) {
        classNames.push('is-grouped');
    }

    return classNames.join(' ');
}

export class HorizontalControl extends React.Component<void, void> {
    render() {
        return (
            <div className={`control is-horizontal`}>
                { this.props.children }
            </div>
        );
    }
}