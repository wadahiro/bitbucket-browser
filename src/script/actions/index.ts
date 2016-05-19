import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import * as SQAPI from '../SonarQubeApi';
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
}
export function initApp(): InitAppAction {
    return {
        type: INIT_APP
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

export const LOAD_BRANCH_INFOS_REQUESTED: ActionType<LoadBranchInfosRequestedAction> = 'LOAD_BRANCH_INFOS_REQUESTED';
export interface LoadBranchInfosRequestedAction extends Action {
    payload: {
        settings: Settings;
    }
}

export function loadBranchInfos(settings: Settings): LoadBranchInfosRequestedAction {

    return {
        type: LOAD_BRANCH_INFOS_REQUESTED,
        payload: {
            settings
        }
    };
}

export const LOAD_BRANCH_INFOS_SUCCEED: ActionType<LoadBranchInfosSucceedAction> = 'LOAD_BRANCH_INFOS_SUCCEED';
export interface LoadBranchInfosSucceedAction extends Action {
    payload: {
        branchInfos: BranchInfo[];
    }
}

