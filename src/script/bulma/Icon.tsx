import * as React from 'react';

interface IconProps {
    iconClassName: string;
    size?: number;
    color?: string;
    spin?: number;
    lineHeight?: number;
}

export class Icon extends React.Component<IconProps, void> {
    render() {
        const { iconClassName } = this.props;
        const iconStyle = calcStyle(this.props);

        return (
            <span className={`icon`}>
                <i className={iconClassName} style={iconStyle}>
                </i>
            </span>
        );
    }
}

interface IconLinkProps extends IconProps, React.HTMLProps<HTMLAnchorElement> {
}

export class IconLink extends React.Component<IconLinkProps, void> {
    render() {
        const { iconClassName } = this.props;
        const iconStyle = calcStyle(this.props);

        return (
            <a {...this.props} className={`icon`}>
                <i className={iconClassName} style={iconStyle}>
                </i>
            </a>
        );
    }
}

function calcStyle(props: IconProps) {
    const { size, color, spin, lineHeight } = props;

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
    return iconStyle;
}