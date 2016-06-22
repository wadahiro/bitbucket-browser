import * as React from 'react';
import { ModifiersProps, calcClassNames, calcSizeClassNames } from './Utils';

interface Props extends React.HTMLProps<HTMLDivElement>, ModifiersProps {
}

export class Card extends React.Component<Props, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <div {...this.props} className={`card ${className}`}>
                { this.props.children }
            </div>
        );
    }
}

interface CardHeaderProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    iconClassName?: string;
    isSmallIcon?: boolean;
    isMediumlIcon?: boolean;
    isLargeIcon?: boolean;
    onToggle?: (e: React.SyntheticEvent) => void;
}

export class CardHeader extends React.Component<CardHeaderProps, void> {
    render() {
        const iconProps = {
            isSmall: this.props.isSmallIcon,
            isMedium: this.props.isMediumlIcon,
            isLarge: this.props.isLargeIcon
        }
        const iconClassName = calcSizeClassNames(iconProps);

        return (
            <header {...this.props} className={`card-header`}>
                <p className='card-header-title'>
                    { this.props.title }
                </p>
                <a className='card-header-icon' onClick={this.props.onToggle}>
                    <span className={`icon ${iconClassName}`}>
                        <i className={this.props.iconClassName}></i>
                    </span>
                </a>
            </header>
        );
    }
}

interface CardContentProps extends React.HTMLProps<HTMLDivElement> {
}

export class CardContent extends React.Component<CardContentProps, void> {
    render() {
        return (
            <div {...this.props} className={`card-content`}>
                { this.props.children }
            </div>
        );
    }
}

interface CardFooterProps extends React.HTMLProps<HTMLDivElement> {
    title: string;
    iconClassName: string;
}

export class CardFooter extends React.Component<CardFooterProps, void> {
    render() {
        return (
            <footer {...this.props} className={`card-footer`}>
                { this.props.children }
            </footer>
        );
    }
}