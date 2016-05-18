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

    projectIncludes?: string;
    projectExcludes?: string;
    repoIncludes?: string;
    repoExcludes?: string;
    branchIncludes?: string;
    branchExcludes?: string;
    branchAuthorIncludes?: string;
    branchAuthorExcludes?: string;

    resultsPerPage?: number;
    sidebarFilterOpened?: boolean;
}

const initialState: AppState = {
    settings: null,
    loading: false,

    sonarQubeAuthenticated: true,

    branchInfosLoaded: false,
    branchInfos: [],

    projectIncludes: '',
    projectExcludes: '',
    repoIncludes: '',
    repoExcludes: '',
    branchIncludes: '',
    branchExcludes: '',
    branchAuthorIncludes: '',
    branchAuthorExcludes: '',

    resultsPerPage: 5,
    sidebarFilterOpened: false
};


export const bApp = (state: AppState = initialState, action: Actions.Action) => {
    let payload;

    switch (action.type) {
        case Actions.INIT_APP_SUCCEEDED:
            payload = action.payload;

            return Object.assign({}, state, payload);

        case Actions.FETCH_SETTINGS_SUCCEEDED:
            payload = action.payload;

            return Object.assign({}, state, payload);

        case Actions.LOAD_BRANCH_INFOS_SUCCEED:
            payload = action.payload;

            return Object.assign({}, state, {
                branchInfos: state.branchInfos.concat(payload.branchInfos)
            });

        case Actions.CHANGE_FILTER:
            const saveFilters = [];
            appendFilter(saveFilters, this.state, 'projectIncludes');
            appendFilter(saveFilters, this.state, 'projectExcludes');
            appendFilter(saveFilters, this.state, 'repoIncludes');
            appendFilter(saveFilters, this.state, 'repoExcludes');
            appendFilter(saveFilters, this.state, 'branchIncludes');
            appendFilter(saveFilters, this.state, 'branchExcludes');
            appendFilter(saveFilters, this.state, 'branchAuthorIncludes');
            appendFilter(saveFilters, this.state, 'branchAuthorExcludes');
            window.location.hash = saveFilters.join('&');
            return Object.assign({}, state, payload);

        case Actions.SONARQUBE_AUTHENTICATED:
            const newBranchInfos = this.state.branchInfos.map(x => {
                x.sonarQubeMetrics = new B.LazyFetch<SQAPI.SonarQubeMetrics>(() => {
                    return SQAPI.fetchMetricsByKey(state.settings, x.repo, x.branch);
                });
                return x;
            });

            return Object.assign({}, state, {
                sonarQubeAuthenticated: true,
                branchInfos: newBranchInfos
            });

        default:
            break;
    }
    return state;
};

function appendFilter(strArray, state, key) {
    if (state[key] !== '') {
        strArray.push(`${key}=${state[key]}`);
    }
}

export default combineReducers({
    app: bApp
});

export interface CombinedState {
    app: AppState
}