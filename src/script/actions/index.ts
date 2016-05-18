import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import * as SQAPI from '../SonarQubeApi';
import { Settings } from '../Settings';

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
        projectIncludes: string
        repoIncludes: string
        branchIncludes: string
        branchAuthorIncludes: string
        projectExcludes: string
        repoExcludes: string
        branchExcludes: string
        branchAuthorExcludes: string
    };
}
export function initApp(): InitAppAction {
    let params: any = {};
    if (window.location.hash) {
        const param = decodeURIComponent(window.location.hash);
        params = param.substring(1).split('&');
        params = _.reduce<string, {}>(params, (s, p) => {
            const pair = p.split('=');
            s[pair[0]] = pair[1];
            return s;
        }, {});
    }
    let projectIncludes = params['projectIncludes'] ? params['projectIncludes'] : '';
    let repoIncludes = params['repoIncludes'] ? params['repoIncludes'] : '';
    let branchIncludes = params['branchIncludes'] ? params['branchIncludes'] : '';
    let branchAuthorIncludes = params['branchAuthorIncludes'] ? params['branchAuthorIncludes'] : '';

    let projectExcludes = params['projectExcludes'] ? params['projectExcludes'] : '';
    let repoExcludes = params['repoExcludes'] ? params['repoExcludes'] : '';
    let branchExcludes = params['branchExcludes'] ? params['branchExcludes'] : '';
    let branchAuthorExcludes = params['branchAuthorExcludes'] ? params['branchAuthorExcludes'] : '';

    return {
        type: INIT_APP,
        payload: {
            projectIncludes,
            repoIncludes,
            branchIncludes,
            branchAuthorIncludes,
            projectExcludes,
            repoExcludes,
            branchExcludes,
            branchAuthorExcludes
        }
    };
}

export const CHANGE_FILTER: ActionType<ChangeFilterAction> = 'CHANGE_FILTER';
interface ChangeFilterAction extends Action {
    payload: {
        [index: string]: string;
    };
}
export function changeFilter(filter): ChangeFilterAction {
    return {
        type: CHANGE_FILTER,
        payload: filter
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

