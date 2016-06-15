import { takeEvery } from 'redux-saga'
import { take, put, call, fork, spawn, join, select, Effect } from 'redux-saga/effects'
import * as B from '../bulma';

import * as actions from '../actions'
import { getSlicedBranchInfos } from '../selectors'
import { RootState, AppState, FilterState }from '../reducers'
import * as API from '../webapis';
import { Settings } from '../Settings';
import { trimSlash } from '../Utils';

async function fetchSettings(): Promise<Settings> {
    const response = await fetch('./settings.json', {
        headers: {
            'Accept': 'application/json'
        }
    });
    const settings: Settings = await response.json();
    return settings;
}

function* initApp(): Iterable<Effect> {
    const action: actions.InitAppAction = yield take(actions.INIT_APP);

    let settings: Settings = yield call(fetchSettings);

    settings = resolveSettings(settings);

    yield put(<actions.FetchSettingsScceededAction>{
        type: actions.FETCH_SETTINGS_SUCCEEDED,
        payload: {
            settings
        }
    });

    const api: API.API = yield select((state: RootState) => state.app.api);

    const bitbucketAuthenticated = yield call([api, api.isAuthenticatedBitbucket]);

    if (!bitbucketAuthenticated) {
        // Redirect to Bitbucket Login page
        const path = location.pathname.substring(settings.baseUrl.length);
        let hash;
        if (location.hash) {
            hash = `#${encodeURIComponent(location.hash.substring(1))}`;
        }
        location.href = `${settings.baseUrl}/login?next=${path}${hash}`;
    } else {
        const sonarQubeAuthenticated = yield call([api, api.isAuthenticatedSonarQube]);

        yield put(<actions.InitAppAction>{
            type: actions.INIT_APP_SUCCEEDED,
            payload: {
                sonarQubeAuthenticated
            }
        });

        // Auto fetching branchs after app initialized 
        yield put(<actions.FetchBranchInfosAction>{
            type: actions.FETCH_BRANCH_INFOS_REQUESTED
        });
    }
}

function resolveSettings(settings: Settings): Settings {
    // Set HTML Title
    document.title = settings.title;

    // Fix baseUrls
    settings.baseUrl = trimSlash(settings.baseUrl);
    if (settings.items.sonarQubeMetrics && settings.items.sonarQubeMetrics.resolver) {
        settings.items.sonarQubeMetrics.resolver.baseUrl = trimSlash(settings.items.sonarQubeMetrics.resolver.baseUrl);
    }
    return settings;
}

function* pollReloadBranchInfos(action: actions.ReloadBranchInfosAction): Iterable<Effect> {
    while (true) {
        yield take(actions.RELOAD_BRANCH_INFOS);

        yield put(<actions.FetchBranchInfosAction>{
            type: actions.FETCH_BRANCH_INFOS_REQUESTED
        });
    }
}

function* pollFetchBranchInfosRequested(action: actions.FetchBranchInfosAction): Iterable<Effect> {
    while (true) {
        yield take(actions.FETCH_BRANCH_INFOS_REQUESTED);

        const api: API.API = yield select((state: RootState) => state.app.api);

        const repos: API.Repo[] = yield call([api, api.fetchAllRepos]);

        const task = yield fork(handleFetchBranchInfoAll, repos);

        yield join(task);

        yield put(<actions.FetchBranchInfosAction>{
            type: actions.FETCH_BRANCH_INFOS_SUCCEEDED
        });
    }
}

function* handleFetchBranchInfoAll(repos: API.Repo[]): Iterable<Effect> {
    const api: API.API = yield select((state: RootState) => state.app.api);


    for (let i = 0; i < repos.length; i++) {
        const repo = repos[i];
        yield fork(handleFetchBranchInfosPerRepo, api, repo);
    }
}

function* handleFetchBranchInfosPerRepo(api: API.API, repo: API.Repo): Iterable<Effect> {
    const branchInfos: API.BranchInfo[] = yield call([api, api.fetchBranchInfo], repo);

    yield put(<actions.AppendBranchInfosAction>{
        type: actions.APPEND_BRANCH_INFOS,
        payload: {
            branchInfos
        }
    });

    // Start tasks for lazy loading
    if (branchInfos.length > 0) {
        yield spawn(handleFetchPullRequestCount, branchInfos);

        // Per branch
        for (let i = 0; i < branchInfos.length; i++) {
            yield spawn(handleBuildStatus, branchInfos[i]);
            yield spawn(handleSonarQubeMetrics, branchInfos[i]);
        }
    }
}

function* handleFetchPullRequestCount(branchInfosPerRepo: API.BranchInfo[]): Iterable<Effect> {
    const settings: Settings = yield select((state: RootState) => state.app.settings);
    const api: API.API = yield select((state: RootState) => state.app.api);

    const branchInfo = branchInfosPerRepo[0];

    // wait for showing this branchInfo details
    const actionTypes = branchInfosPerRepo.map(x => `${actions.SHOW_BRANCH_INFO_DETAILS_REQUESTED}:${x.id}`);
    yield take(actionTypes);

    const prCountPerRepo: API.PullRequestCount = yield call([api, api.fetchPullRequests], branchInfosPerRepo[0]);

    for (let i = 0; i < branchInfosPerRepo.length; i++) {
        const branchInfo = branchInfosPerRepo[i];

        const { id, ref } = branchInfo;
        const { pullRequestIds, from, to, merged, declined } = prCountPerRepo;

        const pullRequestStatusPerBranch = {
            prCountSource: from[ref] ? from[ref] : 0,
            prCountTarget: to[ref] ? to[ref] : 0,
            prCountMerged: merged[ref] ? merged[ref] : 0,
            prCountDeclined: declined[ref] ? declined[ref] : 0,
            prIds: pullRequestIds[ref] ? pullRequestIds[ref] : []
        };

        //  Start tasks for lazy loading        
        yield fork(handleSonarForBitbucketStatus, branchInfo, pullRequestStatusPerBranch.prIds);

        yield put(<actions.UpdateBranchInfoAction>{
            type: actions.UPDATE_BRANCH_INFO,
            payload: {
                branchInfo: {
                    id,
                    pullRequestStatus: pullRequestStatusPerBranch
                }
            }
        });
    }
}

function* handleSonarForBitbucketStatus(branchInfo: API.BranchInfo, prIds: number[]): Iterable<Effect> {
    const settings: Settings = yield select((state: RootState) => state.app.settings);
    const api: API.API = yield select((state: RootState) => state.app.api);

    if (!settings.items.sonarForBitbucketStatus.enabled) {
        return;
    }

    let sonarForBitbucketStatus;
    if (prIds.length === 0) {
        sonarForBitbucketStatus = {
            repoId: branchInfo.repoId,
            values: []
        };
    } else {
        const sonarForBitbucketStatus: API.SonarForBitbucketStatus = yield call([api, api.fetchSonarForBitbucketStatus], branchInfo.repoId, prIds);

        yield put(<actions.UpdateBranchInfoAction>{
            type: actions.UPDATE_BRANCH_INFO,
            payload: {
                branchInfo: {
                    id: branchInfo.id,
                    sonarForBitbucketStatus
                }
            }
        });
    }
}

function* handleBuildStatus(branchInfo: API.BranchInfo): Iterable<Effect> {
    const settings: Settings = yield select((state: RootState) => state.app.settings);
    const api: API.API = yield select((state: RootState) => state.app.api);

    if (!settings.items.buildStatus.enabled) {
        return;
    }
    const { id, latestCommitHash } = branchInfo;

    // wait for showing this branchInfo details
    yield take(`${actions.SHOW_BRANCH_INFO_DETAILS_REQUESTED}:${id}`);

    let buildStatus: API.BuildStatus;
    if (latestCommitHash === '') {
        buildStatus = {
            commitHash: '',
            values: []
        };
    } else {
        buildStatus = yield call([api, api.fetchBuildStatus], latestCommitHash);
    }

    yield put(<actions.UpdateBranchInfoAction>{
        type: actions.UPDATE_BRANCH_INFO,
        payload: {
            branchInfo: {
                id,
                buildStatus
            }
        }
    });
}

function* handleSonarQubeMetrics(branchInfo: API.BranchInfo): Iterable<Effect> {
    const settings: Settings = yield select((state: RootState) => state.app.settings);
    const api: API.API = yield select((state: RootState) => state.app.api);

    if (!settings.items.sonarQubeMetrics.enabled) {
        return;
    }

    const { id } = branchInfo;

    // wait for showing this branchInfo details
    yield take(`${actions.SHOW_BRANCH_INFO_DETAILS_REQUESTED}:${id}`);

    const sonarQubeAuthenticated: boolean = yield select((state: RootState) => state.app.sonarQubeAuthenticated);

    if (sonarQubeAuthenticated) {
        yield fork(updateSonarQubeMetrics, branchInfo);

    } else {
        const sonarQubeMetrics = {
            err_code: 401,
            err_msg: 'Unauthorized'
        };

        yield put(<actions.UpdateBranchInfoAction>{
            type: actions.UPDATE_BRANCH_INFO,
            payload: {
                branchInfo: {
                    id,
                    sonarQubeMetrics
                }
            }
        });

        yield take(actions.SONARQUBE_AUTHENTICATED);

        // Retry after authenticated
        yield fork(updateSonarQubeMetrics, branchInfo);
    }
}

function* updateSonarQubeMetrics(branchInfo: API.BranchInfo) {
    const api: API.API = yield select((state: RootState) => state.app.api);
    const { id, repo, branch } = branchInfo;

    const sonarQubeMetrics: API.SonarQubeMetrics = yield call([api, api.fetchSonarQubeMetricsByKey], repo, branch);

    yield put(<actions.UpdateBranchInfoAction>{
        type: actions.UPDATE_BRANCH_INFO,
        payload: {
            branchInfo: {
                id,
                sonarQubeMetrics
            }
        }
    });
}

function* watchAndLog() {
    yield take(actions.FETCH_SETTINGS_SUCCEEDED);

    const state: RootState = yield select((state: RootState) => state);

    if (state.app.settings && state.app.settings.debug) {
        yield* takeEvery('*', function* logger(action) {

            console.log('Action: ', action);
            console.log('State: ', state);
        });
    }
}

function* pollSaveFilters() {
    while (true) {
        const action = yield take([actions.CHANGE_FILTER, actions.TOGGLE_SIDEBAR]);

        const filterState: FilterState = yield select((state: RootState) => state.filter);

        // Save to URL
        const saveFilters = Object.keys(filterState).map(x => {
            return `${x}=${filterState[x]}`
        });
        window.location.hash = saveFilters.join('&');
    }
}

function* pollAddedBranchInfo() {
    while (true) {
        const action: actions.AppendBranchInfosAction = yield take(actions.APPEND_BRANCH_INFOS);

        const appended = action.payload.branchInfos

        const rootState: RootState = yield select((state: RootState) => state);

        const branchInfos = getSlicedBranchInfos(rootState);

        for (let i = 0; i < branchInfos.length; i++) {
            const branchInfo = branchInfos[i];

            for (let j = 0; j < appended.length; j++) {
                const append = appended[j];
                if (append.id === branchInfo.id) {
                    // lazy load the details of the branch
                    yield put(actions.showBranchInfoDetails(branchInfo.id));
                }
            }
        }
    }
}

function* pollChangePage() {
    while (true) {
        const action: actions.ChangePageAction = yield take(actions.CHANGE_PAGE);

        const rootState: RootState = yield select((state: RootState) => state);

        const branchInfos = getSlicedBranchInfos(rootState);

        for (let i = 0; i < branchInfos.length; i++) {
            const branchInfo = branchInfos[i];

            // lazy load the details of the branch
            yield put(actions.showBranchInfoDetails(branchInfo.id));
        }
    }
}

export default function* root(): Iterable<Effect> {
    yield fork(watchAndLog)
    yield fork(initApp)
    yield fork(pollFetchBranchInfosRequested)
    yield fork(pollReloadBranchInfos)
    yield fork(pollSaveFilters)
    yield fork(pollAddedBranchInfo)
    yield fork(pollChangePage)
}
