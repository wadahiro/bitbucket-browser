import * as React from 'react';

interface Props extends React.Props<Icon> {
    iconClassName: string;
    size?: number;
    color?: string;
    spin?: number;
    lineHeight?: number;
}

export class Icon extends React.Component<Props, any> {
    render() {
        const { iconClassName, size, color, spin, lineHeight } = this.props;
        const iconStyle: any = {};

        if (color) {
            iconStyle.color = color;
        }
        if (size) {
            iconStyle.fontSize = size;
        }
        if (spin) {
            iconStyle.animation = `spin ${spin}s infinite linear`;
            iconStyle.WebkitAnimation = `spin ${spin}s infinite linear`;
        }
        if (lineHeight) {
            iconStyle.lineHeight = `${lineHeight}px`;
        }

        return (
            <span className={`icon`}>
                <i className={iconClassName} style={iconStyle}>
                </i>
            </span>
        );
    }
}