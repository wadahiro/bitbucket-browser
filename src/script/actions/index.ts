import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings } from '../Settings';
import { AppState, FilterState } from '../reducers';

interface ActionType<TAction> extends String { }

export interface Action {
    type: String;
    payload?: any;
}

export function isType<T extends Action>(
    action: Action,
    type: ActionType<T>
): action is T

export function isType<T extends Action>(
    action: Action,
    type: string
): action is T {
    return action.type === type;
}


export const FETCH_SETTINGS_SUCCEEDED: ActionType<FetchSettingsScceededAction> = 'FETCH_SETTINGS_SUCCEEDED'
export interface FetchSettingsScceededAction extends Action {
    payload: {
        settings: Settings;
    }
}

export const INIT_APP: ActionType<InitAppAction> = 'INIT_APP';
export const INIT_APP_SUCCEEDED: ActionType<InitAppAction> = 'INIT_APP_SUCCEEDED';
export interface InitAppAction extends Action {
    payload: {
        sonarQubeAuthenticated: boolean;
    }
}
export function initApp(): InitAppAction {
    return {
        type: INIT_APP,
        payload: {
            sonarQubeAuthenticated: false
        }
    };
}

export const RESTORE_STATE: ActionType<RestoreStateAction> = 'RESTORE_STATE';
export interface RestoreStateAction extends Action {
    payload: {
        filterState: FilterState;
        appState: AppState;
    }
}

export const TOGGLE_SIDEBAR: ActionType<ToggleSidebarAction> = 'TOGGLE_SIDEBAR';
interface ToggleSidebarAction extends Action {
}
export function toggleFilter(): ToggleSidebarAction {
    return {
        type: TOGGLE_SIDEBAR
    };
}

export const CHANGE_PAGE: ActionType<ChangePageAction> = 'CHANGE_PAGE';
export interface ChangePageAction extends Action {
    payload: {
        nextPage: number;
    }
}
export function changePage(nextPage: number): ChangePageAction {
    return {
        type: CHANGE_PAGE,
        payload: {
            nextPage
        }
    };
}

export const CHANGE_SORT_COLUMN: ActionType<ChangeSortColumnAction> = 'CHANGE_SORT_COLUMN';
interface ChangeSortColumnAction extends Action {
    payload: {
        nextSortColumn: string;
    }
}
export function changeSortColumn(nextSortColumn: string): ChangeSortColumnAction {
    return {
        type: CHANGE_SORT_COLUMN,
        payload: {
            nextSortColumn
        }
    };
}

export const CHANGE_FILTER: ActionType<ChangeFilterAction> = 'CHANGE_FILTER';
interface ChangeFilterAction extends Action {
    payload: {
        filter: FilterState;
    };
}
export function changeFilter(filter: FilterState): ChangeFilterAction {
    return {
        type: CHANGE_FILTER,
        payload: {
            filter
        }
    };
}

export const SONARQUBE_AUTHENTICATED: ActionType<SonarQubeAuthenticatedAction> = 'SONARQUBE_AUTHENTICATED';
interface SonarQubeAuthenticatedAction extends Action {
}
export function sonarQubeAuthenticated(): SonarQubeAuthenticatedAction {
    return {
        type: SONARQUBE_AUTHENTICATED
    };
}

export const FETCH_REPOS_SUCCEEDED: ActionType<FetchReposAction> = 'FETCH_REPOS_SUCCEEDED';
export interface FetchReposAction extends Action {
    payload: {
        settings: Settings;
        repos: API.Repo[]
    };
}

export const RELOAD_BRANCH_INFOS: ActionType<ReloadBranchInfosAction> = 'RELOAD_BRANCH_INFOS';
export interface ReloadBranchInfosAction extends Action {
}
export function reloadBranchInfos(settings: Settings): ReloadBranchInfosAction {
    return {
        type: RELOAD_BRANCH_INFOS
    };
}

export const FETCH_BRANCH_INFOS_REQUESTED: ActionType<FetchBranchInfosAction> = 'FETCH_BRANCH_INFOS_REQUESTED';
export interface FetchBranchInfosAction extends Action {
}
export function fetchBranchInfos(settings: Settings): FetchBranchInfosAction {
    return {
        type: FETCH_BRANCH_INFOS_REQUESTED
    };
}

export const FETCH_BRANCH_INFOS_SUCCEEDED: ActionType<FetchBranchInfosSucceededAction> = 'FETCH_BRANCH_INFOS_SUCCEEDED';
export interface FetchBranchInfosSucceededAction extends Action {
}

export const APPEND_BRANCH_INFOS: ActionType<AppendBranchInfosAction> = 'APPEND_BRANCH_INFOS';
export interface AppendBranchInfosAction extends Action {
    payload: {
        branchInfos: API.BranchInfo[];
    }
}

export const SHOW_BRANCH_INFO_DETAILS_REQUESTED: ActionType<ShowBranchInfoDetailsAction> = 'SHOW_BRANCH_INFO_DETAILS_REQUESTED';
export interface ShowBranchInfoDetailsAction extends Action {
}
export function showBranchInfoDetails(id: string): ShowBranchInfoDetailsAction {
    return {
        type: `${SHOW_BRANCH_INFO_DETAILS_REQUESTED}:${id}`
    };
}

export const UPDATE_BRANCH_INFO: ActionType<UpdateBranchInfoAction> = 'UPDATE_BRANCH_INFO';
export interface UpdateBranchInfoAction extends Action {
    payload: {
        branchInfo: API.BranchInfo;
    }
}

