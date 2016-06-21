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

export const settingsReducer = (state: Settings = initSettings(), action: Actions.Action): Settings => {
    if (Actions.isType(action, Actions.FETCH_SETTINGS_SUCCEEDED)) {
        return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);
    }

    if (Actions.isType(action, Actions.RESTORE_SETTINGS)) {
        return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);
    }

    if (Actions.isType(action, Actions.TOGGLE_SETTINGS)) {
        return Object.assign<Settings, Settings, Settings>({}, state, {
            show: !state.show
        });
    }

    if (Actions.isType(action, Actions.CHANGE_SETTINGS)) {
        return Object.assign<Settings, Settings, Settings>({}, state, action.payload.settings);
    }

    return state;
}


export interface AppState {
    api?: API.API;
    loading?: boolean;
    sonarQubeAuthenticated?: boolean;
}

const initialAppState: AppState = {
    api: null,
    loading: false,
    sonarQubeAuthenticated: true,
};

export const appStateReducer = (state: AppState = initialAppState, action: Actions.Action) => {
    if (Actions.isType(action, Actions.INIT_APP_SUCCEEDED)) {
        const payload = action.payload;

        return Object.assign<AppState, AppState, AppState>({}, state, payload);
    }

    if (Actions.isType(action, Actions.FETCH_SETTINGS_SUCCEEDED)) {
        const { settings } = action.payload;
        const api = new API.API(settings);

        return Object.assign<AppState, AppState, AppState>({}, state, {
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
    settings: settingsReducer,
    browser: browserStateReducer
});

export interface RootState {
    app: AppState;
    settings: Settings;
    browser: BrowserState;
}
