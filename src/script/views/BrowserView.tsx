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
import { SidebarSettings, SelectOption } from '../components/SidebarSettings';
import { AppState, RootState } from '../reducers';

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

    sortColumn?: string;
    sortAscending?: boolean;

    pageSize?: number;
    currentPage?: number;
}

function mapStateToProps(state: RootState, props: Props): Props {
    return {
        settings: state.settings,
        api: state.app.api,
        loading: state.app.loading,

        sonarQubeAuthenticated: state.app.sonarQubeAuthenticated,

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
        // Lazy fetching
        nextProps.visibleBranchInfos.forEach(x => {
            if (!x.fetchCompleted) {
                this.props.dispatch(Actions.showBranchInfoDetails(x.id));
            }
        });
    }

    handleSettingsChanged = (settings: Settings) => {
        this.props.dispatch(Actions.changeSettings(settings));
    };

    handleSonarQubeAuthenticated = () => {
        this.props.dispatch(Actions.sonarQubeAuthenticated());
    };

    reloadBranchInfos = () => {
        const { settings } = this.props;
        this.props.dispatch(Actions.reloadBranchInfos(settings));
    };

    handleToggleSidebar = () => {
        this.props.dispatch(Actions.toggleSettings());
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
            sortColumn, sortAscending,
            pageSize, currentPage } = this.props;

        if (!settings) {
            return <div>Loading settings...</div>;
        }

        return (
            <SidebarSettings
                settings={settings}
                data={branchInfos}
                onSettingsChange={this.handleSettingsChanged}
                onClose={this.handleToggleSidebar}
                >
                <NavigationHeader
                    title={settings.title}
                    loading={loading}
                    showMenuButton={!settings.show}
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
            </SidebarSettings>
        );
    }
}

const BrowserViewContainer = connect(
    mapStateToProps
)(BrowserView)

export default BrowserViewContainer;