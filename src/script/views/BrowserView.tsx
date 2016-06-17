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
import { NavigationHeader } from '../components/NavigationHeader';
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

    sidebarOpened?: boolean;

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

        sidebarOpened: state.app.sidebarOpened,

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

    componentWillReceiveProps(nextProps: Props) {
        nextProps.visibleBranchInfos.forEach(x => {
            if (!x.fetchCompleted) {
                this.props.dispatch(Actions.showBranchInfoDetails(x.id));
            }
        });
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

    handleToggleSidebar = () => {
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
            sidebarOpened,
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
                open={sidebarOpened}
                >
                <NavigationHeader
                    settings={settings}
                    loading={loading}
                    showMenuButton={!sidebarOpened}
                    onMenuClick={this.handleToggleSidebar}
                    onReloadClick={this.reloadBranchInfos}
                    />

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

                <Footer settings={settings} />
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