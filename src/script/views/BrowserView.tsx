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

const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);

interface Props {
    dispatch?: Dispatch

    settings?: Settings;
    api?: API.API;

    initizalized?: boolean;

    loading?: boolean;
    downloading?: boolean;

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

        initizalized: state.app.initizalized,

        loading: state.app.loading,
        downloading: state.app.downloading,

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

    handleJiraAuthenticated = () => {
        this.props.dispatch(Actions.jiraAuthenticated());
    };

    reloadBranchInfos = () => {
        const { settings } = this.props;
        this.props.dispatch(Actions.reloadBranchInfos());
    };

    downloadBranchInfos = (e) => {
        const { settings, branchInfos } = this.props;
        const target = e.target;

        const found = branchInfos.find(x => x.fetchCompleted !== true);
        if (found) {
            e.preventDefault();
            this.props.dispatch(Actions.downloadBranchInfos((branchInfos: API.BranchInfo[]) => {
                target.click();
            }));
        } else {
            download(target, settings, branchInfos);
        }
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
            initizalized,
            loading,
            downloading,
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
                    initizalized={initizalized}
                    loading={loading}
                    downloading={downloading}
                    showMenuButton={!settings.show}
                    onMenuClick={this.handleToggleSidebar}
                    onReloadClick={this.reloadBranchInfos}
                    onDownloadClick={this.downloadBranchInfos}
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
                    handleJiraAuthenticated={this.handleJiraAuthenticated}
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


function download(target, settings: Settings, branchInfos: API.BranchInfo[]) {

    const wrap = (value: string): string => {
        return `"${value.replace(/"/g, '""')}"`;
    }

    const convert = (value: any): string => {
        if (value === undefined || value === null) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'number') {
            return String(value);
        }
        if (typeof value === 'object') {
            if (value.value === null) {
                return '';
            } else if (typeof value.value === 'object') {
                return JSON.stringify(value.value, null, 2);
            }
            return JSON.stringify(value, null, 2);
        }
    }

    const csvHeaderKeys = Object.keys(settings.items).filter(x => settings.items[x].enabled !== false);
    const csvHeader = csvHeaderKeys.map(x => wrap(settings.items[x].displayName));

    const csvBody = branchInfos.map(row => {
        return csvHeaderKeys.map(header => {
            return wrap(convert(row[header]));
        }).join(',');
    });

    const csvHeaderText = csvHeader.join(',');
    const csvBodyText = csvBody.join('\r\n');

    const blob = new Blob([BOM, `${csvHeaderText}\r\n${csvBodyText}`], { "type": "text/csv" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, `branches.csv`);
    } else {
        window.URL = window.URL || window['webkitURL'];
        target.href = window.URL.createObjectURL(blob);
        target.click();
    }
}