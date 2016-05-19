import { combineReducers } from 'redux';
import * as B from '../bulma';

import * as SQAPI from '../SonarQubeApi';
import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import { Settings } from '../Settings';
import * as Actions from '../actions';

export interface AppState {
    settings?: Settings;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfosLoaded?: boolean;
    branchInfos?: BranchInfo[];

    resultsPerPage?: number;
    sidebarFilterOpened?: boolean;
}

const initialAppState: AppState = {
    settings: null,
    loading: false,

    sonarQubeAuthenticated: true,

    branchInfosLoaded: false,
    branchInfos: [],

    resultsPerPage: 5,
    sidebarFilterOpened: false
};

export interface FilterState {
    projectIncludes?: string;
    projectExcludes?: string;
    repoIncludes?: string;
    repoExcludes?: string;
    branchIncludes?: string;
    branchExcludes?: string;
    branchAuthorIncludes?: string;
    branchAuthorExcludes?: string;
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
};

export const filterStateReducer = (state: FilterState, action: Actions.Action) => {
    if (Actions.isType(action, Actions.CHANGE_FILTER)) {
        const payload = action.payload;

        return Object.assign({}, state, payload);
    }
    return state;
}


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

    if (Actions.isType(action, Actions.CHANGE_FILTER)) {
        const payload = action.payload;

        const saveFilters = [];
        appendFilter(saveFilters, state, 'projectIncludes');
        appendFilter(saveFilters, state, 'projectExcludes');
        appendFilter(saveFilters, state, 'repoIncludes');
        appendFilter(saveFilters, state, 'repoExcludes');
        appendFilter(saveFilters, state, 'branchIncludes');
        appendFilter(saveFilters, state, 'branchExcludes');
        appendFilter(saveFilters, state, 'branchAuthorIncludes');
        appendFilter(saveFilters, state, 'branchAuthorExcludes');
        window.location.hash = saveFilters.join('&');
        return Object.assign({}, state, payload);
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

function appendFilter(strArray, state, key) {
    if (state[key] !== '') {
        strArray.push(`${key}=${state[key]}`);
    }
}

export default combineReducers({
    app: appStateReducer,
    filter: filterStateReducer
});

export interface CombinedState {
    app: AppState;
    filter: FilterState;
}