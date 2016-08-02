import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings } from '../Settings';
import { AppState } from '../reducers';

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

export const SHOW_BITBUCKET_LOGIN: ActionType<ShowBitbucketLogin> = 'SHOW_BITBUCKET_LOGIN';
interface ShowBitbucketLogin extends Action {
}
export function showBitbucketLogin(): ShowBitbucketLogin {
    return {
        type: SHOW_BITBUCKET_LOGIN
    };
}

export const INIT_APP: ActionType<InitAppAction> = 'INIT_APP';
export const INIT_APP_SUCCEEDED: ActionType<InitAppAction> = 'INIT_APP_SUCCEEDED';
export interface InitAppAction extends Action {
    payload: {
        sonarQubeAuthenticated: boolean;
        jiraAuthenticated: boolean;
    }
}
export function initApp(): InitAppAction {
    return {
        type: INIT_APP,
        payload: {
            sonarQubeAuthenticated: false,
            jiraAuthenticated: false
        }
    };
}

export const RESTORE_SETTINGS: ActionType<RestoreSettingsAction> = 'RESTORE_SETTINGS';
export interface RestoreSettingsAction extends Action {
    payload: {
        settings: Settings;
    }
}

export const TOGGLE_SETTINGS: ActionType<ToggleSettingsAction> = 'TOGGLE_SETTINGS';
interface ToggleSettingsAction extends Action {
}
export function toggleSettings(): ToggleSettingsAction {
    return {
        type: TOGGLE_SETTINGS
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

export const CHANGE_SETTINGS: ActionType<ChangeSettingsAction> = 'CHANGE_SETTINGS';
interface ChangeSettingsAction extends Action {
    payload: {
        settings: Settings;
    };
}
export function changeSettings(settings: Settings): ChangeSettingsAction {
    return {
        type: CHANGE_SETTINGS,
        payload: {
            settings
        }
    };
}

export const BITBUCKET_AUTHENTICATED: ActionType<BitbucketAuthenticatedAction> = 'BITBUCKET_AUTHENTICATED';
interface BitbucketAuthenticatedAction extends Action {
}
export function bitbucketAuthenticated(): BitbucketAuthenticatedAction {
    return {
        type: BITBUCKET_AUTHENTICATED
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

export const JIRA_AUTHENTICATED: ActionType<JiraAuthenticatedAction> = 'JIRA_AUTHENTICATED';
interface JiraAuthenticatedAction extends Action {
}
export function jiraAuthenticated(): JiraAuthenticatedAction {
    return {
        type: JIRA_AUTHENTICATED
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
export function reloadBranchInfos(): ReloadBranchInfosAction {
    return {
        type: RELOAD_BRANCH_INFOS
    };
}

export const DOWNLOAD_BRANCH_INFOS_REQUEST: ActionType<DownloadBranchInfosRequestAction> = 'DOWNLOAD_BRANCH_INFOS_REQUEST';
export interface DownloadBranchInfosRequestAction extends Action {
}
export function downloadBranchInfosRequest(): DownloadBranchInfosRequestAction {
    return {
        type: DOWNLOAD_BRANCH_INFOS_REQUEST
    };
}

export const DOWNLOAD_BRANCH_INFOS: ActionType<DownloadBranchInfosAction> = 'DOWNLOAD_BRANCH_INFOS';
export interface DownloadBranchInfosAction extends Action {
    payload: {
        downalodHandler: (branchInfos: API.BranchInfo[]) => void;
    }
}
export function downloadBranchInfos(downalodHandler): DownloadBranchInfosAction {
    return {
        type: DOWNLOAD_BRANCH_INFOS,
        payload: {
            downalodHandler
        }
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

export const FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED: ActionType<FetchAllBranchInfosDetails> = 'FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED';
export interface FetchAllBranchInfosDetails extends Action {
    payload: {
        branchInfos: API.BranchInfo[];
    }
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

export const SHOW_ALL_BRANCH_INFO_DETAILS_REQUESTED: ActionType<ShowAllBranchInfoDetailsAction> = 'SHOW_BRANCH_INFO_DETAILS_REQUESTED';
export interface ShowAllBranchInfoDetailsAction extends Action {
}

export const UPDATE_BRANCH_INFO: ActionType<UpdateBranchInfoAction> = 'UPDATE_BRANCH_INFO';
export interface UpdateBranchInfoAction extends Action {
    payload: {
        branchInfo: API.BranchInfo;
    }
}
