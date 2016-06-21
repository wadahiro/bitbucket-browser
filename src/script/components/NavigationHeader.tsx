import * as React from 'react';

import * as B from '../bulma';
import { Link } from './Link';

interface Props {
    title: string;
    loading: boolean;
    showMenuButton: boolean;
    onMenuClick: () => void;
    onReloadClick: () => void;
}

export class NavigationHeader extends React.Component<Props, void> {
    static defaultProps = {
        title: ''
    };

    render() {
        const { title, loading, showMenuButton, onMenuClick, onReloadClick } = this.props;

        return (
            <B.Hero isInfo>
                <B.Nav>
                    <B.Container isFluid>
                        <B.NavLeft>
                            { showMenuButton &&
                                <B.NavItemLink onClick={onMenuClick}>
                                    <B.Icon iconClassName='fa fa-angle-double-right' color={'white'} />
                                </B.NavItemLink>
                            }
                            <B.NavItem isTitle>
                                {title}
                                &nbsp;
                                {loading &&
                                    <B.Loading />
                                }
                            </B.NavItem>
                        </B.NavLeft>

                        <B.NavToggle>
                        </B.NavToggle>

                        <B.NavRight isMenu>
                            <B.NavItem>
                                <B.Button onClick={onReloadClick} disabled={loading} isSuccess>
                                    Reload
                                </B.Button>
                            </B.NavItem>
                        </B.NavRight>
                    </B.Container>
                </B.Nav>
            </B.Hero>
        );
    }
}