import { combineReducers } from 'redux';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings } from '../Settings';
import * as Actions from '../actions';

export interface FilterState {
    projectIncludes?: string[];
    projectExcludes?: string[];
    repoIncludes?: string[];
    repoExcludes?: string[];
    branchIncludes?: string[];
    branchExcludes?: string[];
    branchAuthorIncludes?: string[];
    branchAuthorExcludes?: string[];
}

function initFilterState(): FilterState {
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
    return filterState;
}

export const filterReducer = (state: FilterState = initFilterState(), action: Actions.Action) => {
    if (Actions.isType(action, Actions.RESTORE_STATE)) {
        const payload = action.payload;

        return Object.assign<FilterState, FilterState, FilterState>({}, state, payload.filterState);
    }

    if (Actions.isType(action, Actions.CHANGE_FILTER)) {
        const filter = action.payload.filter;
        return Object.assign<FilterState, FilterState, FilterState>({}, state, filter);
    }

    return state;
}


export interface AppState {
    settings?: Settings;
    api?: API.API;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    sidebarOpened?: boolean;
}

const initialAppState: AppState = {
    settings: null,
    api: null,
    loading: false,

    sonarQubeAuthenticated: true,

    sidebarOpened: false
};

export const appStateReducer = (state: AppState = initialAppState, action: Actions.Action) => {

    if (Actions.isType(action, Actions.RESTORE_STATE)) {
        const payload = action.payload;

        return Object.assign<AppState, AppState, AppState>({}, state, payload.appState);
    }

    if (Actions.isType(action, Actions.INIT_APP_SUCCEEDED)) {
        const payload = action.payload;

        return Object.assign<AppState, AppState, AppState>({}, state, payload);
    }

    if (Actions.isType(action, Actions.FETCH_SETTINGS_SUCCEEDED)) {
        const { settings } = action.payload;

        const api = new API.API(settings);

        return Object.assign<AppState, AppState, AppState>({}, state, {
            settings,
            api
        });
    }

    if (Actions.isType(action, Actions.FETCH_BRANCH_INFOS_REQUESTED)) {
        return Object.assign<AppState, AppState, AppState>({}, state, {
            loading: true
        });
    }

    if (Actions.isType(action, Actions.FETCH_BRANCH_INFOS_SUCCEEDED)) {
        return Object.assign<AppState, AppState, AppState>({}, state, {
            loading: false
        });
    }

    if (Actions.isType(action, Actions.SONARQUBE_AUTHENTICATED)) {
        return Object.assign<AppState, AppState, AppState>({}, state, {
            sonarQubeAuthenticated: true
        });
    }

    if (Actions.isType(action, Actions.TOGGLE_SIDEBAR)) {
        return Object.assign<AppState, AppState, AppState>({}, state, {
            sidebarOpened: !state.sidebarOpened
        });
    }

    if (Actions.isType(action, Actions.CHANGE_SETTINGS)) {
        return Object.assign<AppState, AppState, AppState>({}, state, {
            settings: action.payload.settings
        });
    }

    return state;
};

export interface BrowserState {
    branchInfos?: API.BranchInfo[];

    resultsPerPage?: number;
    currentPage?: number;

    currentSortColumn?: string;
    currentSortAscending?: boolean;
}

const initialBrowserState: BrowserState = {
    branchInfos: [],

    resultsPerPage: 5,
    currentPage: 0,

    currentSortColumn: null,
    currentSortAscending: true
};

export const browserStateReducer = (state: BrowserState = initialBrowserState, action: Actions.Action) => {

    if (Actions.isType(action, Actions.APPEND_BRANCH_INFOS)) {
        const payload = action.payload;
        const nextBranchInfos = state.branchInfos.concat(payload.branchInfos);

        return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
            branchInfos: nextBranchInfos
        });
    }

    if (Actions.isType(action, Actions.RELOAD_BRANCH_INFOS)) {
        return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
            branchInfos: []
        });
    }

    if (Actions.isType(action, Actions.UPDATE_BRANCH_INFO)) {
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
    }

    if (Actions.isType(action, Actions.CHANGE_PAGE)) {
        const payload = action.payload;

        return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
            currentPage: payload.nextPage
        });
    }

    if (Actions.isType(action, Actions.CHANGE_SORT_COLUMN)) {
        const payload = action.payload;

        let nextAscending = state.currentSortAscending;
        if (state.currentSortColumn === payload.nextSortColumn) {
            nextAscending = !nextAscending;
        }

        return Object.assign<BrowserState, BrowserState, BrowserState>({}, state, {
            currentSortColumn: payload.nextSortColumn,
            currentSortAscending: nextAscending
        });
    }

    return state;
};

export default combineReducers({
    app: appStateReducer,
    browser: browserStateReducer,
    filter: filterReducer
});

export interface RootState {
    app: AppState;
    browser: BrowserState;
    filter: FilterState;
}
