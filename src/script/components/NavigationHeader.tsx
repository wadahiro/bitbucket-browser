import * as React from 'react';
import * as B from '../bulma';
import { Link } from './Link';

export default class NavigationHeader extends React.Component<any, any> {
    render() {
        const leftNav = this.resolveNav(this.props.left);
        const rightNav = this.resolveNav(this.props.right);
        const settings = this.resolveSettings(this.props.settings);

        return (
            <B.Header>
                <B.HeaderLeft>
                    {leftNav}
                </B.HeaderLeft>
                <B.HeaderRight>
                    {rightNav}
                    <B.HeaderItem key='settings'>
                        <B.Dropdown icon='fa fa-cog' position='left'>
                            {settings}
                        </B.Dropdown>
                    </B.HeaderItem>
                </B.HeaderRight>
            </B.Header>
        );
    }

    resolveNav(navDef) {
        const nav = navDef.map(x => {
            const isActive = this.props.active === x.name;
            const item = resolve(x, isActive);
            return <B.HeaderItem key={x.name} isActive={isActive}>{item}</B.HeaderItem>;
        });
        return nav;
    }

    resolveSettings(def) {
        const nav = def.map(x => {
            return resolve(x);
        });
        return (
            <B.DropdownItem>
                {nav}
            </B.DropdownItem>
        );
    }
}

function resolve(def, isActive = false) {
    if (def.link) {
        return (
            <Link key={def.name} to={def.link} className={isActive ? 'is-active' : ''}>
                {def.label}
            </Link>
        );
    } else if (def.modal) {
        if (def.type === 'button') {
            return (
                <B.ModalTriggerButton
                    key={def.name}
                    type='success'
                    modal={def.modal}>
                    {def.label}
                </B.ModalTriggerButton>
            );
        } else {
            return (
                <B.ModalTriggerLink
                    key={def.name}
                    modal={def.modal}>
                    {def.label}
                </B.ModalTriggerLink>
            );
        }
    } else {
        return <h1 key={def.name}>{def.label}</h1>;
    }
}