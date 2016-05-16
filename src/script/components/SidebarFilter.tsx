import * as React from 'react';
import * as B from '../bulma';
import { BranchInfo } from '../BitbucketApi';
import SearchBox from './SearchBox';

const Sidebar = require('react-sidebar').default;

interface Props extends React.Props<SidebarFilter> {
    data: BranchInfo[];

    projectIncludes: string;
    repoIncludes: string;
    branchIncludes: string;
    branchAuthorIncludes: string;

    projectExcludes: string;
    repoExcludes: string;
    branchExcludes: string;
    branchAuthorExcludes: string;

    onChange: Function;
    open: boolean;
    onClose: (e: React.SyntheticEvent) => void;
}

export class SidebarFilter extends React.Component<Props, any> {
    render() {
        const { data,
            projectIncludes, repoIncludes, branchIncludes, branchAuthorIncludes,
            projectExcludes, repoExcludes, branchExcludes, branchAuthorExcludes,
            onChange,
            open,
            onClose
        } = this.props;

        const sidebarStyle = {
            width: 300,
            background: '#f5f7fa'
        };

        const hasData = data && data.length > 0;

        const sidebarContent = (
            <div>
                <section className='hero is-info is-bold'>
                    <nav className='nav'>
                        <div className='container is-fluid'>
                            <div className='nav-left'>
                                <p className='nav-item title'>
                                    Filters
                                </p>
                            </div>
                            <div className='nav-right'>
                                <a className='nav-item title' onClick={onClose}>
                                    <B.Icon iconClassName='fa fa-angle-double-left' />
                                </a>
                            </div>
                        </div>
                    </nav>
                </section>
                <B.Section style={sidebarStyle}>
                    { hasData &&
                        <SearchBox
                            data={data}
                            onChange={onChange}
                            defaultProjectIncludes={projectIncludes}
                            defaultRepoIncludes={repoIncludes}
                            defaultBranchIncludes={branchIncludes}
                            defaultBranchAuthorIncludes={branchAuthorIncludes}
                            defaultProjectExcludes={projectExcludes}
                            defaultRepoExcludes={repoExcludes}
                            defaultBranchExcludes={branchExcludes}
                            defaultBranchAuthorExcludes={branchAuthorExcludes}
                            />
                    }
                </B.Section>
            </div>
        );
        return (
            <Sidebar sidebar={sidebarContent} docked={open}>
                {this.props.children}
            </Sidebar>
        );
    }
}