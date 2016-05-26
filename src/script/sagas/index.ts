import { takeEvery } from 'redux-saga'
import { take, put, call, fork, select, Effect } from 'redux-saga/effects'
import * as B from '../bulma';

import * as actions from '../actions'
import { RootState, AppState, FilterState }from '../reducers'
import * as API from '../webapis';
import { Settings } from '../Settings';


async function fetchSettings(): Promise<Settings> {
    const response = await fetch('./settings.json', {
        headers: {
            'Accept': 'application/json'
        }
    });
    const settings: Settings = await response.json();
    document.title = settings.title;

    return settings;
}

function* handleFetchSettings(): Iterable<Effect> {
    const action: actions.InitAppAction = yield take(actions.INIT_APP);

    const settings: Settings = yield call(fetchSettings);

    yield put(<actions.FetchSettingsScceededAction>{
        type: actions.FETCH_SETTINGS_SUCCEEDED,
        payload: {
            settings
        }
    });
}

function* initApp(): Iterable<Effect> {
    yield take(actions.INIT_APP);

    const action: actions.FetchSettingsScceededAction = yield take(actions.FETCH_SETTINGS_SUCCEEDED);
    const { settings } = action.payload;

    const api: API.API = yield select((state: RootState) => state.app.api);

    const bitbucketAuthenticated = yield call([api, api.isAuthenticatedBitbucket]);

    if (!bitbucketAuthenticated) {
        // Redirect to Bitbucket Login page
        location.href = `${settings.baseUrl}/login?next=${location.pathname}${encodeURIComponent(location.hash)}`;
    } else {
        const sonarQubeAuthenticated = yield call([api, api.isAuthenticatedSonarQube]);

        yield put(<actions.InitAppAction>{
            type: actions.INIT_APP_SUCCEEDED,
            payload: {
                sonarQubeAuthenticated
            }
        });
        yield put(<actions.FetchBranchInfosAction>{
            type: actions.FETCH_BRANCH_INFOS_REQUESTED,
            payload: {
                settings
            }
        });
    }
}

function* fetchBranchInfos(action: actions.FetchBranchInfosAction): Iterable<Effect> {
    while (true) {
        const action = yield take(actions.FETCH_BRANCH_INFOS_REQUESTED);
        const { settings } = action.payload;

        const api: API.API = yield select((state: RootState) => state.app.api);

        const repos: API.Repo[] = yield call([api, api.fetchAllRepos]);

        yield put(<actions.FetchReposAction>{
            type: actions.FETCH_REPOS_SUCCEEDED,
            payload: {
                settings,
                repos
            }
        });
    }
}

function* reloadBranchInfos(action: actions.ReloadBranchInfosAction): Iterable<Effect> {
    while (true) {
        const action = yield take(actions.RELOAD_BRANCH_INFOS);
        const { settings } = action.payload;

        yield put(<actions.FetchBranchInfosAction>{
            type: actions.FETCH_BRANCH_INFOS_REQUESTED,
            payload: {
                settings
            }
        });
    }
}

function* handleFetchBranchInfos(): Iterable<Effect> {
    while (true) {
        const action = yield take(actions.FETCH_REPOS_SUCCEEDED);

        const { settings, repos } = action.payload;

        const api: API.API = yield select((state: RootState) => state.app.api);

        const branchInfosPromises: Promise<API.BranchInfo[]>[] = yield call([api, api.fetchBranchInfos], repos);

        const results = yield branchInfosPromises.map(x => call([api, api.fetchBranchInfo], x));

        const branchInfos = _.flatten(results);

        yield put(<actions.AppendBranchInfosAction>{
            type: actions.APPEND_BRANCH_INFOS,
            payload: {
                branchInfos
            }
        })
    }
}

function* handleFetchPullRequestCount(): Iterable<Effect> {
    while (true) {
        const action: actions.FetchPullRequestCountAction = yield take(actions.FETCH_PULL_REQUEST_COUNT);

        const { fetch, branchInfo } = action.payload;
        const { id, ref } = branchInfo;

        const prCount: API.PullRequestCount = yield fetch.fetch();

        const api: API.API = yield select((state: RootState) => state.app.api);

        const { pullRequestIds, from, to, merged, declined } = prCount;

        const pullRequestStatus = {
            prCountSource: from[ref] ? from[ref] : 0,
            prCountTarget: to[ref] ? to[ref] : 0,
            prCountMerged: merged[ref] ? merged[ref] : 0,
            prCountDeclined: declined[ref] ? declined[ref] : 0,
            prIds: pullRequestIds[ref] ? pullRequestIds[ref] : []
        };

        let buildStatus;
        if (branchInfo.latestCommitHash === '') {
            buildStatus = {
                commitHash: '',
                values: []
            };
        } else {
            buildStatus = new B.LazyFetch<API.BuildStatus>(() => {
                return api.fetchBuildStatus(branchInfo.latestCommitHash);
            });
        }

        let sonarForBitbucketStatus;
        if (pullRequestStatus.prIds.length === 0) {
            sonarForBitbucketStatus = {
                repoId: branchInfo.repoId,
                values: []
            };
        } else {
            sonarForBitbucketStatus = new B.LazyFetch<API.SonarForBitbucketStatus>(() => {
                return api.fetchSonarForBitbucketStatus(branchInfo.repoId, pullRequestStatus.prIds);
            });
        }

        yield put(<actions.UpdateBranchInfoAction>{
            type: actions.UPDATE_BRANCH_INFO,
            payload: {
                branchInfo: {
                    id,
                    pullRequestStatus,
                    buildStatus,
                    sonarForBitbucketStatus
                }
            }
        });
    }
}

function* handleBuildStatus(): Iterable<Effect> {
    while (true) {
        const action: actions.FetchBuildStatusAction = yield take(actions.FETCH_BUILD_STATUS);

        const { fetch, branchInfo } = action.payload;
        const { id } = branchInfo;

        const buildStatus: API.BuildStatus = yield fetch.fetch();

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
}

function* handleSonarForBitbucketStatus(): Iterable<Effect> {
    while (true) {
        const action: actions.FetchSonarForBitbucketStatusAction = yield take(actions.FETCH_SONAR_FOR_BITBUCKET_STATUS);

        const { fetch, branchInfo } = action.payload;
        const { id } = branchInfo;

        const sonarForBitbucketStatus: API.SonarForBitbucketStatus = yield fetch.fetch();

        yield put(<actions.UpdateBranchInfoAction>{
            type: actions.UPDATE_BRANCH_INFO,
            payload: {
                branchInfo: {
                    id,
                    sonarForBitbucketStatus
                }
            }
        });
    }
}

function* handleSonarQubeMetrics(): Iterable<Effect> {
    while (true) {
        const action: actions.FetchSonarQubeMetricsAction = yield take(actions.FETCH_SONAR_QUBE_METRICS);

        const { fetch, branchInfo } = action.payload;
        const { id } = branchInfo;

        const sonarQubeAuthenticated: boolean = yield select((state: RootState) => state.app.sonarQubeAuthenticated);

        if (sonarQubeAuthenticated) {
            const sonarQubeMetrics: API.SonarQubeMetrics = yield fetch.fetch();

            yield put(<actions.UpdateBranchInfoAction>{
                type: actions.UPDATE_BRANCH_INFO,
                payload: {
                    branchInfo: {
                        id,
                        sonarQubeMetrics
                    }
                }
            });
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
        }
    }
}

function* watchAndLog() {
    yield* takeEvery('*', function* logger(action) {
        const state: RootState = yield select((state: RootState) => state);

        if (state.app.settings && state.app.settings.debug) {
            console.log('Action: ', action);
            console.log('State: ', state);
        }
    })
}

function* handleSaveFilter() {
    while (true) {
        const action = yield take([actions.CHANGE_FILTER, actions.TOGGLE_FILTER]);

        const filterState: FilterState = yield select((state: RootState) => state.filter);

        // Save to URL
        const saveFilters = Object.keys(filterState).map(x => {
            return `${x}=${filterState[x]}`
        });
        window.location.hash = saveFilters.join('&');
    }
}

export default function* root(): Iterable<Effect> {
    yield fork(watchAndLog)
    yield fork(handleFetchSettings)
    yield fork(initApp)
    yield fork(fetchBranchInfos)
    yield fork(reloadBranchInfos)
    yield fork(handleFetchBranchInfos)
    yield fork(handleFetchPullRequestCount)
    yield fork(handleBuildStatus)
    yield fork(handleSonarForBitbucketStatus)
    yield fork(handleSonarQubeMetrics)
    yield fork(handleSaveFilter)
}
