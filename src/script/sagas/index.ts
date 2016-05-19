import { takeEvery } from 'redux-saga'
import { take, put, call, fork, select, Effect } from 'redux-saga/effects'
import * as B from '../bulma';

import * as actions from '../actions'
import { RootState }from '../reducers'
import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import * as SQAPI from '../SonarQubeApi';
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
    const action = yield take('INIT_APP');

    console.log('handleFetchSettings1', action)

    const settings = yield call(fetchSettings);

    console.log('handleFetchSettings2', settings)

    yield put({
        type: 'FETCH_SETTINGS_SUCCEEDED',
        payload: {
            settings
        }
    });
}

function* initApp(): Iterable<Effect> {
    let action = yield take('INIT_APP');

    console.log('initApp1', action)

    action = yield take('FETCH_SETTINGS_SUCCEEDED');

    console.log('initApp2', action)

    const bitbucketAuthenticated = yield call(isAuthenticated);
    const sonarQubeAuthenticated = yield call(SQAPI.isAuthenticated, action.payload.settings);
    console.log(bitbucketAuthenticated)


    if (!bitbucketAuthenticated) {
        // Redirect to Bitbucket Login page
        location.href = `/stash/login?next=/stash-browser${encodeURIComponent(location.hash)}`;
    } else {
        yield put({
            type: actions.INIT_APP_SUCCEEDED,
            payload: Object.assign({}, action.payload, {
                sonarQubeAuthenticated
            })
        });
    }
}

function* loadBranchInfos(action: actions.LoadBranchInfosRequestedAction): Iterable<Effect> {
    while (true) {
        const action = yield take('INIT_APP_SUCCEEDED');
        const { settings } = action.payload;

        const repos = yield call(fetchAllRepos);

        yield put({
            type: 'FETCH_REPOS_OK',
            payload: {
                settings,
                repos
            }
        });
    }
}

function* handleFetchBranchInfos(): Iterable<Effect> {
    while (true) {
        const action = yield take('FETCH_REPOS_OK');
        console.log(action)

        const { settings, repos } = action.payload;

        const branchInfosPromises: Promise<BranchInfo[]>[] = yield call(fetchBranchInfos, settings, repos);

        console.log(branchInfosPromises)

        const results = yield branchInfosPromises.map(x => call(fetchBranchInfo, settings, x))

        const branchInfos = _.flatten(results);

        console.log(branchInfos)

        yield put({
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
        console.log(action)

        const { fetch, branchInfo } = action.payload;

        const prCount: PullRequestCount = yield fetch.fetch();
        const branchInfos: BranchInfo[] = yield select((state: RootState) => state.app.branchInfos);

        console.log(prCount)
        console.log(branchInfos)

        const { pullRequestIds, from, to, merged, declined } = prCount;

        const updatedRows = branchInfos.map(targetBranchInfo => {
            if (targetBranchInfo.id === branchInfo.id) {

                // Update pull request count against branchInfos of args
                targetBranchInfo.pullRequestStatus = {
                    prCountSource: from[targetBranchInfo.ref] ? from[targetBranchInfo.ref] : 0,
                    prCountTarget: to[targetBranchInfo.ref] ? to[targetBranchInfo.ref] : 0,
                    prCountMerged: merged[targetBranchInfo.ref] ? merged[targetBranchInfo.ref] : 0,
                    prCountDeclined: declined[targetBranchInfo.ref] ? declined[targetBranchInfo.ref] : 0,
                    prIds: pullRequestIds[targetBranchInfo.ref] ? pullRequestIds[targetBranchInfo.ref] : []
                };

                // lazy fetch dependents
                if (!targetBranchInfo.buildStatus) {
                    let buildStatus;
                    if (targetBranchInfo.latestCommitHash === '') {
                        targetBranchInfo.buildStatus = {
                            commitHash: '',
                            values: []
                        };
                    } else {
                        const fetch = new B.LazyFetch<BuildStatus>(() => {
                            return fetchBuildStatus(targetBranchInfo.latestCommitHash);
                        });
                        targetBranchInfo.buildStatus = fetch;
                    }
                }
                if (!targetBranchInfo.sonarStatus) {
                    let sonarStatus;
                    const pullRequestStatus = targetBranchInfo.pullRequestStatus as PullRequestStatus;
                    if (pullRequestStatus.prIds.length === 0) {
                        targetBranchInfo.sonarStatus = {
                            repoId: branchInfo.repoId,
                            values: []
                        };
                    } else {
                        const fetch = new B.LazyFetch<SonarStatus>(() => {
                            return fetchSonarStatus(targetBranchInfo.repoId, pullRequestStatus.prIds);
                        });
                        targetBranchInfo.sonarStatus = fetch;
                    }
                }
            }
            return targetBranchInfo;
        });

        yield put({
            type: actions.UPDATE_BRANCH_INFOS,
            payload: {
                branchInfos: updatedRows
            }
        });
    }
}

function* handleBuildStatus(): Iterable<Effect> {
    while (true) {
        const action: actions.FetchBuildStatusAction = yield take(actions.FETCH_BUILD_STATUS);

        const { fetch, branchInfo } = action.payload;

        const buildStatus: BuildStatus = yield fetch.fetch();
        const branchInfos: BranchInfo[] = yield select((state: RootState) => state.app.branchInfos);

        const updatedRows = branchInfos.map(x => {
            if (x.id === branchInfo.id) {
                x.buildStatus = buildStatus;
            }
            return x;
        });
        
        yield put({
            type: actions.UPDATE_BRANCH_INFOS,
            payload: {
                branchInfos: updatedRows
            }
        });
    }
}

async function fetchBranchInfo(settings, branchInfoPromise: Promise<BranchInfo[]>): Promise<BranchInfo[]> {
    const branchInfos = await branchInfoPromise;
    return resolveLazyFetch(settings, branchInfos);
}

function* watchAndLog() {
    yield* takeEvery('*', function* logger(action) {
        const state = yield select(state => state)
        console.log('action', action)
        console.log('state after', state)
    })
}

function* handleSaveFilter() {
    while (true) {
        const action = yield take([actions.CHANGE_FILTER, actions.TOGGLE_FILTER]);

        const filterState = yield select((state: RootState) => state.filter);

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
    yield fork(loadBranchInfos)
    yield fork(handleFetchBranchInfos)
    yield fork(handleFetchPullRequestCount)
    yield fork(handleBuildStatus)
    yield fork(handleSaveFilter)
}

function resolveLazyFetch(settings: Settings, branchInfoOfSomeProjects: BranchInfo[]) {
    // important! share fetch instance
    const fetchPrCount = new B.LazyFetch<PullRequestCount>(() => {
        return fetchPullRequests(branchInfoOfSomeProjects[0]);
    });

    const newBranchInfos = branchInfoOfSomeProjects.map(x => {
        x.pullRequestStatus = fetchPrCount;
        x.sonarQubeMetrics = new B.LazyFetch<SQAPI.SonarQubeMetrics>(() => {
            return SQAPI.fetchMetricsByKey(settings, x.repo, x.branch);
        });
        return x;
    });
    return newBranchInfos;
}