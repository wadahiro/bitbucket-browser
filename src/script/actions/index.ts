import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings } from '../Settings';
import { AppState } from '../reducers';

export type ActionTypes =
    FetchSettingsScceededAction |
    ShowBitbucketLogin |
    InitAppAction |
    RestoreSettingsAction |
    ToggleSettingsAction |
    ChangePageAction |
    ChangeSortColumnAction |
    ChangeSettingsAction |

    BitbucketAuthenticatedAction |
    SonarQubeAuthenticatedAction |
    JiraAuthenticatedAction |

    FetchReposAction |
    ReloadBranchInfosAction |

    DownloadBranchInfosRequestAction |
    DownloadBranchInfosAction |

    FetchBranchInfosAction |
    FetchBranchInfosSucceededAction |
    FetchAllBranchInfosDetails |
    AppendBranchInfosAction |

    ShowAllBranchInfoDetailsAction |
    UpdateBranchInfoAction
    ;

interface FetchSettingsScceededAction {
    type: 'FETCH_SETTINGS_SUCCEEDED';
    payload: {
        settings: Settings;
    }
}

interface ShowBitbucketLogin {
    type: 'SHOW_BITBUCKET_LOGIN';
}
export function showBitbucketLogin(): ShowBitbucketLogin {
    return {
        type: 'SHOW_BITBUCKET_LOGIN'
    };
}

export interface InitAppAction {
    type: 'INIT_APP' | 'INIT_APP_SUCCEEDED';
    payload: {
        sonarQubeAuthenticated: boolean;
        jiraAuthenticated: boolean;
    }
}
export function initApp(): InitAppAction {
    return {
        type: 'INIT_APP',
        payload: {
            sonarQubeAuthenticated: false,
            jiraAuthenticated: false
        }
    };
}

export interface RestoreSettingsAction {
    type: 'RESTORE_SETTINGS';
    payload: {
        settings: Settings;
    }
}

interface ToggleSettingsAction {
    type: 'TOGGLE_SETTINGS';
}
export function toggleSettings(): ToggleSettingsAction {
    return {
        type: 'TOGGLE_SETTINGS'
    };
}

export interface ChangePageAction {
    type: 'CHANGE_PAGE';
    payload: {
        nextPage: number;
    }
}
export function changePage(nextPage: number): ChangePageAction {
    return {
        type: 'CHANGE_PAGE',
        payload: {
            nextPage
        }
    };
}

interface ChangeSortColumnAction {
    type: 'CHANGE_SORT_COLUMN';
    payload: {
        nextSortColumn: string;
    }
}
export function changeSortColumn(nextSortColumn: string): ChangeSortColumnAction {
    return {
        type: 'CHANGE_SORT_COLUMN',
        payload: {
            nextSortColumn
        }
    };
}

interface ChangeSettingsAction {
    type: 'CHANGE_SETTINGS';
    payload: {
        settings: Settings;
    };
}
export function changeSettings(settings: Settings): ChangeSettingsAction {
    return {
        type: 'CHANGE_SETTINGS',
        payload: {
            settings
        }
    };
}

interface BitbucketAuthenticatedAction {
    type: 'BITBUCKET_AUTHENTICATED';
}
export function bitbucketAuthenticated(): BitbucketAuthenticatedAction {
    return {
        type: 'BITBUCKET_AUTHENTICATED'
    };
}


interface SonarQubeAuthenticatedAction {
    type: 'SONARQUBE_AUTHENTICATED';
}
export function sonarQubeAuthenticated(): SonarQubeAuthenticatedAction {
    return {
        type: 'SONARQUBE_AUTHENTICATED'
    };
}

interface JiraAuthenticatedAction {
    type: 'JIRA_AUTHENTICATED';
}
export function jiraAuthenticated(): JiraAuthenticatedAction {
    return {
        type: 'JIRA_AUTHENTICATED'
    };
}

export interface FetchReposAction {
    type: 'FETCH_REPOS_SUCCEEDED';
    payload: {
        settings: Settings;
        repos: API.Repo[]
    };
}

export interface ReloadBranchInfosAction {
    type: 'RELOAD_BRANCH_INFOS';
}
export function reloadBranchInfos(): ReloadBranchInfosAction {
    return {
        type: 'RELOAD_BRANCH_INFOS'
    };
}

export interface DownloadBranchInfosRequestAction {
    type: 'DOWNLOAD_BRANCH_INFOS_REQUEST';
}
export function downloadBranchInfosRequest(): DownloadBranchInfosRequestAction {
    return {
        type: 'DOWNLOAD_BRANCH_INFOS_REQUEST'
    };
}

export interface DownloadBranchInfosAction {
    type: 'DOWNLOAD_BRANCH_INFOS';
    payload: {
        downalodHandler: (branchInfos: API.BranchInfo[]) => void;
    }
}
export function downloadBranchInfos(downalodHandler): DownloadBranchInfosAction {
    return {
        type: 'DOWNLOAD_BRANCH_INFOS',
        payload: {
            downalodHandler
        }
    };
}

export interface FetchBranchInfosAction {
    type: 'FETCH_BRANCH_INFOS_REQUESTED'
}
export function fetchBranchInfos(settings: Settings): FetchBranchInfosAction {
    return {
        type: 'FETCH_BRANCH_INFOS_REQUESTED'
    };
}

export interface FetchBranchInfosSucceededAction {
    type: 'FETCH_BRANCH_INFOS_SUCCEEDED';
}

export interface FetchAllBranchInfosDetails {
    type: 'FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED';
    payload: {
        branchInfos: API.BranchInfo[];
    }
}

export interface AppendBranchInfosAction {
    type: 'APPEND_BRANCH_INFOS';
    payload: {
        branchInfos: API.BranchInfo[];
    }
}

export const SHOW_BRANCH_INFO_DETAILS_REQUESTED = 'SHOW_BRANCH_INFO_DETAILS_REQUESTED';
export interface ShowBranchInfoDetailsAction {
    type: string;
}
export function showBranchInfoDetails(id: string): ShowBranchInfoDetailsAction {
    return {
        type: `${SHOW_BRANCH_INFO_DETAILS_REQUESTED}:${id}`
    };
}

export interface ShowAllBranchInfoDetailsAction {
    type: 'SHOW_BRANCH_INFO_DETAILS_REQUESTED';
}

export interface UpdateBranchInfoAction {
    type: 'UPDATE_BRANCH_INFO';
    payload: {
        branchInfo: API.BranchInfo;
    }
}
