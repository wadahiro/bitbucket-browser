import { combineReducers } from 'redux';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings, Items, FilterState } from '../Settings';
import * as Actions from '../actions';


function initSettings(): Settings {
    const filterState: FilterState = {
        projectIncludes: [],
        projectExcludes: [],
        repoIncludes: [],
        repoExcludes: [],
        branchIncludes: [],
        branchExcludes: [],
        branchAuthorIncludes: [],
        branchAuthorExcludes: []
    };
    return {
        items: {} as any,
        show: false,
        filter: filterState,
        resultsPerPage: {
            value: 0,
            options: []
        }
    };
}

export const settingsReducer = (state: Settings = initSettings(), action: Actions.ActionTypes): Settings => {
    switch (action.type) {
        case 'FETCH_SETTINGS_SUCCEEDED':
            return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);

        case 'RESTORE_SETTINGS':
            return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);

        case 'TOGGLE_SETTINGS':
            return Object.assign<Settings, Settings, Settings>({}, state, {
                show: !state.show
            });

        case 'CHANGE_SETTINGS':
            return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);
    }

    return state;
}


export interface AppState {
    api?: API.API;
    showBitbucketLogin?: boolean;
    initizalized?: boolean;
    loading?: boolean;
    downloading?: boolean;
    limit?: number;
    numOfRunning?: number;
    bitbucketAuthenticated?: boolean;
    sonarQubeAuthenticated?: boolean;
    jiraAuthenticated?: boolean;
}

const initialAppState: AppState = {
    api: null,
    showBitbucketLogin: false,
    initizalized: false,
    loading: false,
    downloading: false,
    limit: 5,
    numOfRunning: 0,
    bitbucketAuthenticated: true,
    sonarQubeAuthenticated: true,
    jiraAuthenticated: true
};

export const appStateReducer = (state: AppState = initialAppState, action: Actions.ActionTypes) => {
    switch (action.type) {
        case 'FETCH_SETTINGS_SUCCEEDED':
            const { settings } = action.payload;
            const api = new API.API(settings);

            return Object.assign<AppState, AppState, AppState>({}, state, {
                api
            });

        case 'SHOW_BITBUCKET_LOGIN':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                showBitbucketLogin: true
            });

        case 'BITBUCKET_AUTHENTICATED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                showBitbucketLogin: false
            });

        case 'INIT_APP_SUCCEEDED':
            const payload = action.payload;

            return Object.assign<AppState, AppState, AppState, AppState>({}, state, payload, {
                initizalized: true
            });

        case 'FETCH_BRANCH_INFOS_REQUESTED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                loading: true
            });

        case 'FETCH_BRANCH_INFOS_SUCCEEDED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                loading: false
            });

        case 'DOWNLOAD_BRANCH_INFOS_REQUEST':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                downloading: true
            });

        case 'FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                downloading: false
            });

        case 'SONARQUBE_AUTHENTICATED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                sonarQubeAuthenticated: true
            });

        case 'JIRA_AUTHENTICATED':
            return Object.assign<AppState, AppState, AppState>({}, state, {
                jiraAuthenticated: true
            });
    }

    return state;
};

export interface BrowserState {
    branchInfos?: API.BranchInfo[];

    currentPage?: number;

    currentSortColumn?: string;
    currentSortAscending?: boolean;
}

const initialBrowserState: BrowserState = {
    branchInfos: [],

    currentPage: 0,

    currentSortColumn: null,
    currentSortAscending: true
};

export const browserStateReducer = (state: BrowserState = initialBrowserState, action: Actions.ActionTypes) => {

    switch (action.type) {
        case 'APPEND_BRANCH_INFOS':
            const nextBranchInfos = state.branchInfos.concat(action.payload.branchInfos);

            return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
                branchInfos: nextBranchInfos
            });

        case 'RELOAD_BRANCH_INFOS':
            return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
                branchInfos: []
            });

        case 'UPDATE_BRANCH_INFO':
            const { branchInfo } = action.payload;

            return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
                branchInfos: state.branchInfos.map(x => {
                    if (x.id === branchInfo.id) {
                        const newBranchInfo = Object.assign({}, x, branchInfo);

                        // Check lazy loading completed
                        const fetchCompleted = API.isFetchCompleted(newBranchInfo);
                        newBranchInfo.fetchCompleted = fetchCompleted;

                        return newBranchInfo;
                    }
                    return x;
                })
            });

        case 'CHANGE_PAGE':
            return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
                currentPage: action.payload.nextPage
            });

        case 'CHANGE_SORT_COLUMN':
            let nextAscending = state.currentSortAscending;
            if (state.currentSortColumn === action.payload.nextSortColumn) {
                nextAscending = !nextAscending;
            }

            return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
                currentSortColumn: action.payload.nextSortColumn,
                currentSortAscending: nextAscending
            });
    }

    return state;
};

export default combineReducers({
    app: appStateReducer,
    settings: settingsReducer,
    browser: browserStateReducer
});

export interface RootState {
    app: AppState;
    settings: Settings;
    browser: BrowserState;
}
