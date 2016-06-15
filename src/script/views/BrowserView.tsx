import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import * as _ from 'lodash';

import * as B from '../bulma';
import * as API from '../webapis';
import BitbucketTable from '../components/BitbucketTable';
import { Footer } from '../components/Footer';
import { Settings } from '../Settings';
import { SonarQubeLoginModal } from '../components/SonarQubeLoginModal';
import { SidebarFilter, SelectOption } from '../components/SidebarFilter';
import { AppState, FilterState, RootState } from '../reducers';

import * as Actions from '../actions';
import { getSlicedBranchInfos, getPageSize, getFixedCurrentPage } from '../selectors';


interface Props {
    dispatch?: Dispatch

    settings?: Settings;
    api?: API.API;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfos?: API.BranchInfo[];
    visibleBranchInfos?: API.BranchInfo[];

    filter?: FilterState;

    sortColumn?: string;
    sortAscending?: boolean;

    pageSize?: number;
    currentPage?: number;
}

function mapStateToProps(state: RootState, props: Props): Props {
    return {
        settings: state.app.settings,
        api: state.app.api,
        loading: state.app.loading,

        sonarQubeAuthenticated: state.app.sonarQubeAuthenticated,

        filter: state.filter,

        branchInfos: state.browser.branchInfos,
        visibleBranchInfos: getSlicedBranchInfos(state),

        sortColumn: state.browser.currentSortColumn,
        sortAscending: state.browser.currentSortAscending,

        pageSize: getPageSize(state),
        currentPage: getFixedCurrentPage(state)
    };
}

class BrowserView extends React.Component<Props, void> {

    componentDidMount() {
        this.props.dispatch(Actions.initApp());
    }

    handleFilterChanged = (key: string, filter: FilterState) => {
        this.props.dispatch(Actions.changeFilter(filter));
    };

    handleSonarQubeAuthenticated = () => {
        this.props.dispatch(Actions.sonarQubeAuthenticated());
    };

    reloadBranchInfos = () => {
        const { settings } = this.props;
        this.props.dispatch(Actions.reloadBranchInfos(settings));
    };

    handleToggleSidebar = (e: React.SyntheticEvent) => {
        this.props.dispatch(Actions.toggleFilter());
    };

    handlePageChanged = (nextPage: number) => {
        // lazy loading the details of the showing records
        this.props.dispatch(Actions.changePage(nextPage));
    };

    handleSort = (nextSortColumn: string) => {
        this.props.dispatch(Actions.changeSortColumn(nextSortColumn));
    };

    render() {
        const { settings, api,
            loading,
            branchInfos,
            visibleBranchInfos,
            filter,
            sortColumn, sortAscending,
            pageSize, currentPage } = this.props;

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
                onChange={this.handleFilterChanged}
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
                                        results={visibleBranchInfos}
                                        pageSize={pageSize}
                                        currentPage={currentPage}
                                        sortColumn={sortColumn}
                                        sortAscending={sortAscending}
                                        handlePageChanged={this.handlePageChanged}
                                        handleSonarQubeAuthenticated={this.handleSonarQubeAuthenticated}
                                        handleSort={this.handleSort}
                                        />
                                </div>
                            }
                        </B.Container>
                    </B.Section>

                    <Footer settings={settings} />
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

const BrowserViewContainer = connect(
    mapStateToProps
)(BrowserView)

export default BrowserViewContainer;