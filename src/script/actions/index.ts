import { takeEvery, takeLatest } from 'redux-saga';
import { fork, call, put } from 'redux-saga/effects';
import * as B from '../bulma';

import * as API from '../webapis';
import { Settings } from '../Settings';
import { AppState } from '../reducers';


export interface Action {
    type: Types;
    payload?: any;
}

export type Types =
    'FETCH_SETTINGS_SUCCEEDED' |
    'SHOW_BITBUCKET_LOGIN' |

    'INIT_APP' |
    'INIT_APP_SUCCEEDED' |

    'RESTORE_SETTINGS' |
    'TOGGLE_SETTINGS' |

    'CHANGE_PAGE' |
    'CHANGE_SORT_COLUMN' |
    'CHANGE_SETTINGS' |

    'BITBUCKET_AUTHENTICATED' |
    'SONARQUBE_AUTHENTICATED' |
    'JIRA_AUTHENTICATED' |
    'FETCH_REPOS_SUCCEEDED' |

    'RELOAD_BRANCH_INFOS' |
    'DOWNLOAD_BRANCH_INFOS_REQUEST' |
    'DOWNLOAD_BRANCH_INFOS' |

    'FETCH_BRANCH_INFOS_REQUESTED' |
    'FETCH_BRANCH_INFOS_SUCCEEDED' |
    'FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED' |

    'APPEND_BRANCH_INFOS' |

    'SHOW_BRANCH_INFO_DETAILS_REQUESTED' |
    'UPDATE_BRANCH_INFO'
    ;


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

export interface FetchSettingsScceededAction extends Action {
    type: 'FETCH_SETTINGS_SUCCEEDED';
    payload: {
        settings: Settings;
    }
}

export interface ShowBitbucketLogin extends Action {
    type: 'SHOW_BITBUCKET_LOGIN';
}
export function showBitbucketLogin(): ShowBitbucketLogin {
    return {
        type: 'SHOW_BITBUCKET_LOGIN'
    };
}

export interface InitAppAction extends Action {
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

export interface RestoreSettingsAction extends Action {
    type: 'RESTORE_SETTINGS';
    payload: {
        settings: Settings;
    }
}

interface ToggleSettingsAction extends Action {
    type: 'TOGGLE_SETTINGS';
}
export function toggleSettings(): ToggleSettingsAction {
    return {
        type: 'TOGGLE_SETTINGS'
    };
}

export interface ChangePageAction extends Action {
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

interface ChangeSortColumnAction extends Action {
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

interface ChangeSettingsAction extends Action {
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

interface BitbucketAuthenticatedAction extends Action {
    type: 'BITBUCKET_AUTHENTICATED';
}
export function bitbucketAuthenticated(): BitbucketAuthenticatedAction {
    return {
        type: 'BITBUCKET_AUTHENTICATED'
    };
}

interface SonarQubeAuthenticatedAction extends Action {
    type: 'SONARQUBE_AUTHENTICATED';
}
export function sonarQubeAuthenticated(): SonarQubeAuthenticatedAction {
    return {
        type: 'SONARQUBE_AUTHENTICATED'
    };
}

interface JiraAuthenticatedAction extends Action {
    type: 'JIRA_AUTHENTICATED';
}
export function jiraAuthenticated(): JiraAuthenticatedAction {
    return {
        type: 'JIRA_AUTHENTICATED'
    };
}

export interface FetchReposAction extends Action {
    type: 'FETCH_REPOS_SUCCEEDED';
    payload: {
        settings: Settings;
        repos: API.Repo[]
    };
}

export interface ReloadBranchInfosAction extends Action {
    type: 'RELOAD_BRANCH_INFOS';
}
export function reloadBranchInfos(): ReloadBranchInfosAction {
    return {
        type: 'RELOAD_BRANCH_INFOS'
    };
}

export interface DownloadBranchInfosRequestAction extends Action {
    type: 'DOWNLOAD_BRANCH_INFOS_REQUEST';
}
export function downloadBranchInfosRequest(): DownloadBranchInfosRequestAction {
    return {
        type: 'DOWNLOAD_BRANCH_INFOS_REQUEST'
    };
}

export interface DownloadBranchInfosAction extends Action {
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

export interface FetchBranchInfosAction extends Action {
    type: 'FETCH_BRANCH_INFOS_REQUESTED';
}
export function fetchBranchInfos(settings: Settings): FetchBranchInfosAction {
    return {
        type: 'FETCH_BRANCH_INFOS_REQUESTED'
    };
}

export interface FetchBranchInfosSucceededAction extends Action {
    type: 'FETCH_BRANCH_INFOS_SUCCEEDED';
}

export interface FetchAllBranchInfosDetails extends Action {
    type: 'FETCH_ALL_BRANCH_INFO_DETAILS_SUCCEEDED';
    payload: {
        branchInfos: API.BranchInfo[];
    }
}

export interface AppendBranchInfosAction extends Action {
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

export interface ShowAllBranchInfoDetailsAction extends Action {
    type: 'SHOW_BRANCH_INFO_DETAILS_REQUESTED';
}

export interface UpdateBranchInfoAction extends Action {
    type: 'UPDATE_BRANCH_INFO';
    payload: {
        branchInfo: API.BranchInfo;
    }
}
