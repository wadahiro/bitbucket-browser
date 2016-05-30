import * as React from 'react';
import { ModifiersProps, calcClassNames } from './Utils';

interface HeroProps extends ModifiersProps {
}

export class Hero extends React.Component<HeroProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <section {...this.props} className={`hero ${className}`}>
                { this.props.children }
            </section>
        );
    }
}

interface HeroHeadProps extends ModifiersProps {
}

export class HeroHead extends React.Component<HeroHeadProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <div {...this.props} className={`hero-head ${className}`}>
                { this.props.children }
            </div>
        );
    }
}

interface HeroBodyProps extends ModifiersProps {
}

export class HeroBody extends React.Component<HeroBodyProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <div {...this.props} className={`hero-body ${className}`}>
                { this.props.children }
            </div>
        );
    }
}

interface HeroFooterProps extends ModifiersProps {
}

export class HeroFooter extends React.Component<HeroFooterProps, void> {
    render() {
        const className = calcClassNames(this.props);

        return (
            <div {...this.props} className={`hero-footer ${className}`}>
                { this.props.children }
            </div>
        );
    }
}