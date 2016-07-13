import * as React from 'react';

import * as B from '../bulma';
import { Link } from './Link';

interface Props {
    title: string;
    loading: boolean;
    downloading: boolean;
    showMenuButton: boolean;
    onMenuClick: () => void;
    onReloadClick: () => void;
    onDownloadClick: (e: React.SyntheticEvent) => void;
}

export class NavigationHeader extends React.Component<Props, void> {
    static defaultProps = {
        title: ''
    };

    render() {
        const { title, loading, downloading, showMenuButton, onMenuClick, onReloadClick, onDownloadClick } = this.props;

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
                                <B.Button href='#' download={`branches.csv`} onClick={onDownloadClick} disabled={loading || downloading} isSuccess>
                                    {downloading ?
                                        <B.Loading />
                                        :
                                        <B.Icon size={18} iconClassName='fa fa-cloud-download' />
                                    }
                                    &nbsp;
                                    Download
                                </B.Button>
                            </B.NavItem>
                            <B.NavItem>
                                <B.Button onClick={onReloadClick} disabled={loading } isSuccess>
                                    {loading ?
                                        <B.Loading />
                                        :
                                        <B.Icon size={18} iconClassName='fa fa-repeat' />
                                    }
                                    &nbsp;
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