import { combineReducers } from 'redux';
import * as B from '../bulma';

import * as SQAPI from '../SonarQubeApi';
import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import { Settings } from '../Settings';
import * as Actions from '../actions';

export interface FilterState {
    projectIncludes?: string;
    projectExcludes?: string;
    repoIncludes?: string;
    repoExcludes?: string;
    branchIncludes?: string;
    branchExcludes?: string;
    branchAuthorIncludes?: string;
    branchAuthorExcludes?: string;

    sidebarFilterOpened?: boolean;
}

const initialFilterState: FilterState = {
    projectIncludes: '',
    projectExcludes: '',
    repoIncludes: '',
    repoExcludes: '',
    branchIncludes: '',
    branchExcludes: '',
    branchAuthorIncludes: '',
    branchAuthorExcludes: '',

    sidebarFilterOpened: false
};

export const filterReducer = (state: FilterState = initialFilterState, action: Actions.Action) => {
    if (Actions.isType(action, Actions.CHANGE_FILTER)) {
        const payload = action.payload;

        const saveFilters = Object.keys(state).map(x => {
            return `${x}=${state[x]}`
        });
        window.location.hash = saveFilters.join('&');

        return Object.assign<FilterState, FilterState, FilterState>({}, state, payload);
    }

    if (Actions.isType(action, Actions.TOGGLE_FILTER)) {
        return Object.assign<FilterState, FilterState, FilterState>({}, state, {
            sidebarFilterOpened: !state.sidebarFilterOpened
        });
    }

    return state;
}


export interface AppState {
    settings?: Settings;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfosLoaded?: boolean;
    branchInfos?: BranchInfo[];

    resultsPerPage?: number;
}

const initialAppState: AppState = {
    settings: null,
    loading: false,

    sonarQubeAuthenticated: true,

    branchInfosLoaded: false,
    branchInfos: [],

    resultsPerPage: 5
};

export const appStateReducer = (state: AppState = initialAppState, action: Actions.Action) => {

    if (Actions.isType(action, Actions.INIT_APP_SUCCEEDED)) {
        const payload = action.payload;

        return Object.assign({}, state, payload);
    }

    if (Actions.isType(action, Actions.FETCH_SETTINGS_SUCCEEDED)) {
        const payload = action.payload;

        return Object.assign({}, state, payload);
    }

    if (Actions.isType(action, Actions.LOAD_BRANCH_INFOS_SUCCEED)) {
        const payload = action.payload;

        return Object.assign({}, state, {
            branchInfos: state.branchInfos.concat(payload.branchInfos)
        });
    }

    if (Actions.isType(action, Actions.SONARQUBE_AUTHENTICATED)) {
        const payload = action.payload;

        const newBranchInfos = state.branchInfos.map(x => {
            x.sonarQubeMetrics = new B.LazyFetch<SQAPI.SonarQubeMetrics>(() => {
                return SQAPI.fetchMetricsByKey(state.settings, x.repo, x.branch);
            });
            return x;
        });

        return Object.assign({}, state, {
            sonarQubeAuthenticated: true,
            branchInfos: newBranchInfos
        });
    }

    return state;
};

export default combineReducers({
    app: appStateReducer,
    filter: filterReducer
});

export interface RootState {
    app: AppState;
    filter: FilterState;
}