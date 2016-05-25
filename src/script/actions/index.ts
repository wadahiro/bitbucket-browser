import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import * as API from '../webapis';
import * as SQAPI from '../webapis/SonarQubeApi';
import { Settings } from '../Settings';
import { FilterState } from '../reducers';

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

export const TOGGLE_FILTER: ActionType<ToggleFilterAction> = 'TOGGLE_FILTER';
interface ToggleFilterAction extends Action {
}
export function toggleFilter(): ToggleFilterAction {
    return {
        type: TOGGLE_FILTER
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
    }
}

export const RELOAD_BRANCH_INFOS: ActionType<ReloadBranchInfosAction> = 'RELOAD_BRANCH_INFOS';
export interface ReloadBranchInfosAction extends Action {
    payload: {
        settings: Settings;
    }
}
export function reloadBranchInfos(settings: Settings): ReloadBranchInfosAction {
    return {
        type: RELOAD_BRANCH_INFOS,
        payload: {
            settings
        }
    };
}

export const FETCH_BRANCH_INFOS_REQUESTED: ActionType<FetchBranchInfosAction> = 'FETCH_BRANCH_INFOS_REQUESTED';
export interface FetchBranchInfosAction extends Action {
    payload: {
        settings: Settings;
    }
}

export function fetchBranchInfos(settings: Settings): FetchBranchInfosAction {
    return {
        type: FETCH_BRANCH_INFOS_REQUESTED,
        payload: {
            settings
        }
    };
}

export const APPEND_BRANCH_INFOS: ActionType<AppendBranchInfosAction> = 'APPEND_BRANCH_INFOS';
export interface AppendBranchInfosAction extends Action {
    payload: {
        branchInfos: API.BranchInfo[];
    }
}

export const UPDATE_BRANCH_INFO: ActionType<UpdateBranchInfoAction> = 'UPDATE_BRANCH_INFO';
export interface UpdateBranchInfoAction extends Action {
    payload: {
        branchInfo: API.BranchInfo;
    }
}

export const FETCH_PULL_REQUEST_COUNT: ActionType<FetchPullRequestCountAction> = 'FETCH_PULL_REQUEST_COUNT';
export interface FetchPullRequestCountAction extends Action {
    payload: {
        fetch: B.LazyFetch<API.PullRequestCount>,
        branchInfo: API.BranchInfo
    }
}
export function fetchPullRequestCount(fetch: B.LazyFetch<API.PullRequestCount>, branchInfo: API.BranchInfo): FetchPullRequestCountAction {
    if (branchInfo.pullRequestStatus === null) {
        return;
    }
    return {
        type: FETCH_PULL_REQUEST_COUNT,
        payload: {
            fetch,
            branchInfo
        }
    };
}

export const FETCH_BUILD_STATUS: ActionType<FetchBuildStatusAction> = 'FETCH_BUILD_STATUS';
export interface FetchBuildStatusAction extends Action {
    payload: {
        fetch: B.LazyFetch<API.BuildStatus>,
        branchInfo: API.BranchInfo
    }
}
export function fetchBuildStatus(fetch: B.LazyFetch<API.BuildStatus>, branchInfo: API.BranchInfo): FetchBuildStatusAction {
    if (branchInfo.buildStatus === null) {
        return;
    }
    return {
        type: FETCH_BUILD_STATUS,
        payload: {
            fetch,
            branchInfo
        }
    };
}

export const FETCH_SONAR_FOR_BITBUCKET_STATUS: ActionType<FetchSonarForBitbucketStatusAction> = 'FETCH_SONAR_FOR_BITBUCKET_STATUS';
export interface FetchSonarForBitbucketStatusAction extends Action {
    payload: {
        fetch: B.LazyFetch<API.SonarForBitbucketStatus>,
        branchInfo: API.BranchInfo
    }
}
export function fetchSonarForBitbucketStatus(fetch: B.LazyFetch<API.SonarForBitbucketStatus>, branchInfo: API.BranchInfo): FetchSonarForBitbucketStatusAction {
    if (branchInfo.sonarForBitbucketStatus === null) {
        return;
    }
    return {
        type: FETCH_SONAR_FOR_BITBUCKET_STATUS,
        payload: {
            fetch,
            branchInfo
        }
    };
}

export const FETCH_SONAR_QUBE_METRICS: ActionType<FetchSonarQubeMetricsAction> = 'FETCH_SONAR_QUBE_METRICS';
export interface FetchSonarQubeMetricsAction extends Action {
    payload: {
        fetch: B.LazyFetch<SQAPI.SonarQubeMetrics>,
        branchInfo: API.BranchInfo
    }
}
export function fetchSonarQubeMetrics(fetch: B.LazyFetch<SQAPI.SonarQubeMetrics>, branchInfo: API.BranchInfo): FetchSonarQubeMetricsAction {
    if (branchInfo.sonarQubeMetrics === null) {
        return;
    }
    return {
        type: FETCH_SONAR_QUBE_METRICS,
        payload: {
            fetch,
            branchInfo
        }
    };
}
