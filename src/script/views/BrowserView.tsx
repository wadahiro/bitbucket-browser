import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as _ from 'lodash';

import * as B from '../bulma';
import * as API from '../webapis';
import BitbucketTable from '../components/BitbucketTable';
import { Settings } from '../Settings';
import { SonarQubeLoginModal } from '../components/SonarQubeLoginModal';
import { SidebarFilter, SelectOption } from '../components/SidebarFilter';
import { AppState, FilterState, RootState } from '../reducers';

import * as Actions from '../actions';


interface Props extends React.Props<any> {
    dispatch?: Dispatch

    settings?: Settings;
    api?: API.API;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfosLoaded?: boolean;
    branchInfos?: API.BranchInfo[];

    filter?: FilterState;

    resultsPerPage?: number;
}

function mapStateToProps(state: RootState, props: Props): Props {
    return {
        settings: state.app.settings,
        api: state.app.api,
        loading: state.app.loading,

        sonarQubeAuthenticated: state.app.sonarQubeAuthenticated,

        branchInfosLoaded: state.app.branchInfosLoaded,
        branchInfos: state.app.branchInfos,

        filter: state.filter,

        resultsPerPage: state.app.resultsPerPage,
    };
}

class BrowserView extends React.Component<Props, void> {

    componentDidMount() {
        this.props.dispatch(Actions.initApp());
    }

    onChange = (key: string, filter: FilterState) => {
        this.props.dispatch(Actions.changeFilter(filter));
    };

    handleSonarQubeAuthenticated = () => {
        this.props.dispatch(Actions.sonarQubeAuthenticated());
    };

    reloadBranchInfos = () => {
        const { settings } = this.props;
        this.props.dispatch(Actions.reloadBranchInfos(settings));
    };

    handleShowBranchInfo = (branchInfo: API.BranchInfo) => {
        this.props.dispatch(Actions.showBranchInfoDetails(branchInfo.id));
    };

    handleToggleSidebar = (e: React.SyntheticEvent) => {
        this.props.dispatch(Actions.toggleFilter());
    };

    render() {
        const { settings, api,
            branchInfos, loading, branchInfosLoaded,
            filter,
            resultsPerPage } = this.props;

        const filteredBranchInfos = filterBranchInfo(branchInfos, filter);

        const leftNav = [
            {
                name: 'home',
                label: settings ? settings.title : '',
                link: '/'
            }
        ];

        if (!settings) {
            return <div>Loading settings...</div>;
        }

        return (
            <SidebarFilter
                data={branchInfos}
                onChange={this.onChange}
                filter={filter}
                onClose={this.handleToggleSidebar}
                open={filter.sidebarFilterOpened}
                >
                <div>
                    <B.Hero isInfo>
                        <B.Nav>
                            <B.Container isFluid>
                                <B.NavLeft>
                                    { !filter.sidebarFilterOpened &&
                                        <B.NavItemLink onClick={this.handleToggleSidebar}>
                                            <B.Icon iconClassName='fa fa-angle-double-right' color={'white'} />
                                        </B.NavItemLink>
                                    }
                                    <B.NavItem isTitle>
                                        {settings && settings.title}
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
                                        <B.Button onClick={this.reloadBranchInfos} disabled={loading} isSuccess>
                                            Reload
                                        </B.Button>
                                    </B.NavItem>
                                </B.NavRight>
                            </B.Container>
                        </B.Nav>
                    </B.Hero>

                    <B.Section>
                        <B.Container isFluid>
                            {
                                settings &&
                                <div className='branch-table' style={{ padding: '0px 10px 0px 10px' }}>
                                    <BitbucketTable
                                        settings={settings}
                                        api={api}
                                        showFilter={true}
                                        results={filteredBranchInfos}
                                        resultsPerPage={resultsPerPage}
                                        handleShowBranchInfo={this.handleShowBranchInfo}
                                        handleSonarQubeAuthenticated={this.handleSonarQubeAuthenticated}
                                        />
                                </div>
                            }
                        </B.Container>
                    </B.Section>

                    <B.Footer>
                        <p>
                            <strong>{settings && settings.title}</strong>.The source code is licensed <a href='http://opensource.org/licenses/mit-license.php'>MIT</a>.
                        </p>
                    </B.Footer>
                </div >
            </SidebarFilter>
        );
    }
}

function appendFilter(strArray, state, key) {
    if (state[key] !== '') {
        strArray.push(`${key}=${state[key]}`);
    }
}

function filterBranchInfo(data: API.BranchInfo[], filter: FilterState) {
    const projectIncludes = filter.projectIncludes;
    const projectExcludes = filter.projectExcludes;

    const repoIncludes = filter.repoIncludes;
    const repoExcludes = filter.repoExcludes;

    const branchIncludes = filter.branchIncludes;
    const branchExcludes = filter.branchExcludes;

    const branchAuthorIncludes = filter.branchAuthorIncludes;
    const branchAuthorExcludes = filter.branchAuthorExcludes;

    let chain = _.chain(data);

    // Includes
    if (projectIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(projectIncludes, row.project) || match(projectIncludes, row.project);
        });
    }
    if (repoIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(repoIncludes, row.repo) || match(repoIncludes, row.repo);
        });
    }
    if (branchIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(branchIncludes, row.branch) || match(branchIncludes, row.branch);
        });
    }
    if (branchAuthorIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(branchAuthorIncludes, row.branchAuthor) || match(branchAuthorIncludes, row.branchAuthor);
        });
    }

    // Excludes
    if (projectExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(projectExcludes, row.project) || match(projectExcludes, row.project));
        });
    }
    if (repoExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(repoExcludes, row.repo) || match(repoExcludes, row.repo));
        });
    }
    if (branchExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(branchExcludes, row.branch) || match(branchExcludes, row.branch));
        });
    }
    if (branchAuthorExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(branchAuthorExcludes, row.branchAuthor) || match(branchAuthorExcludes, row.branchAuthor));
        });
    }
    return chain.value();
}

function match(patterns: string[] = [], target: string) {
    const found = patterns.find(pattern => {
        const re = new RegExp(pattern);
        return re.test(target);
    });
    return found === undefined ? false : true;
}

const RIGHT_NAV = [
    {
        name: 'reload',
        label: 'Reload',
        type: 'button'
    }
];

const BrowserViewContainer = connect(
    mapStateToProps
)(BrowserView)

export default BrowserViewContainer;