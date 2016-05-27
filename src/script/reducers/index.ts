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

    sidebarFilterOpened?: boolean;
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
        branchAuthorExcludes: [],

        sidebarFilterOpened: false
    };

    // Restore from URL
    if (window.location.hash) {
        const query = decodeURIComponent(window.location.hash);
        const queryParams = query.substring(1).split('&').reduce((s, x) => {
            const pair = x.split('=');
            s[pair[0]] = pair[1];
            return s;
        }, {});
        const restoredFilterState = Object.keys(filterState).reduce((s, x) => {
            if (queryParams[x]) {
                if (x === 'sidebarFilterOpened') {
                    s[x] = queryParams[x].toLowerCase() === 'true';
                } else {
                    s[x] = queryParams[x].split(',');
                }
            }
            return s;
        }, <FilterState>filterState);
    }

    return filterState;
}

export const filterReducer = (state: FilterState = initFilterState(), action: Actions.Action) => {
    if (Actions.isType(action, Actions.CHANGE_FILTER)) {
        const filter = action.payload.filter;
        return Object.assign<FilterState, FilterState, FilterState>({}, state, filter);
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
    api?: API.API;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfosLoaded?: boolean;
    branchInfos?: API.BranchInfo[];

    resultsPerPage?: number;
}

const initialAppState: AppState = {
    settings: null,
    api: null,
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
        const { settings } = action.payload;

        const api = new API.API(settings);

        return Object.assign({}, state, {
            settings,
            api
        });
    }

    if (Actions.isType(action, Actions.APPEND_BRANCH_INFOS)) {
        const payload = action.payload;

        return Object.assign({}, state, {
            branchInfos: state.branchInfos.concat(payload.branchInfos)
        });
    }

    if (Actions.isType(action, Actions.FETCH_BRANCH_INFOS_REQUESTED)) {
        return Object.assign({}, state, {
            loading: true
        });
    }

    if (Actions.isType(action, Actions.FETCH_BRANCH_INFOS_SUCCEEDED)) {
        return Object.assign({}, state, {
            loading: false
        });
    }

    if (Actions.isType(action, Actions.RELOAD_BRANCH_INFOS)) {
        return Object.assign({}, state, {
            branchInfos: []
        });
    }

    if (Actions.isType(action, Actions.UPDATE_BRANCH_INFO)) {
        const { branchInfo } = action.payload;

        return Object.assign({}, state, {
            branchInfos: state.branchInfos.map(x => {
                if (x.id === branchInfo.id) {
                    return Object.assign({}, x, branchInfo);
                }
                return x;
            })
        });
    }

    if (Actions.isType(action, Actions.SONARQUBE_AUTHENTICATED)) {
        return Object.assign({}, state, {
            sonarQubeAuthenticated: true
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