import * as B from '../bulma';

import { Settings } from '../Settings';
import * as BAPI from './BitbucketApi';
import * as SQAPI from './SonarQubeApi';
import { baseUrl } from '../Utils';


// bitbucket-browser models
interface Project {
    project: string;
}

export interface Repo extends Project {
    repo: string;
    repoId: number;
}

export interface Branch extends Repo {
    /**
     * displayName for branch
     */
    branch: string;
    ref: string;
    detail: string;
    behindAheadBranch: BehindAheadBranch;
    branchAuthor: string;
    /**
     * YYYY/MM/DD format
     */
    branchCreated: string;
    /**
     * YYYY/MM/DD format
     */
    latestCommitDate: string;
    latestCommitHash: string;
}

export interface PullRequestCount {
    id: string;
    repoId: number;
    pullRequestIds: {
        [index: string]: number[];
    };
    from: {
        [index: string]: number;
    };
    to: {
        [index: string]: number;
    };
    merged: {
        [index: string]: number;
    };
    declined: {
        [index: string]: number;
    };
}
export interface BehindAheadBranch {
    aheadBranch: number;
    behindBranch: number;
}

export interface BranchInfo extends Branch {
    /**
     * Unique Key (${project}_${repo}_${branch})
     */
    id: string;
    branchNameLink: string;
    pullRequestStatus: B.LazyFetch<PullRequestCount> | PullRequestStatus
    buildStatus: B.LazyFetch<BuildStatus> | BuildStatus;
    sonarForBitbucketStatus: B.LazyFetch<SonarForBitbucketStatus> | SonarForBitbucketStatus;
    sonarQubeMetrics: B.LazyFetch<SQAPI.SonarQubeMetrics> | SQAPI.SonarQubeMetrics;
}

export interface PullRequestStatus {
    prCountSource: number;
    prCountTarget: number;
    prCountMerged: number;
    prCountDeclined: number;
    prIds: number[];
}

export interface BuildStatus {
    commitHash: string;
    values: BAPI.BitbucketBuildStatus[];
}
export interface SonarForBitbucketStatus {
    repoId: number;
    values: BAPI.BitbucketSonarStatus[];
}

export async function fetchBranchInfos(settings: Settings, repos: Repo[]): Promise<Promise<BranchInfo[]>[]> {
    try {
        const handleBranchFetch = (branchesOfProject => {
            const branchInfos: BranchInfo[] = branchesOfProject.map(b => {
                const branchInfo: BranchInfo = Object.assign({}, b, <BranchInfo>{
                    id: `${b.project}_${b.repo}_${b.branch}`,
                    branchNameLink: getBranchNameLink(settings, b.branch),
                    pullRequestStatus: null,
                    buildStatus: null,
                    sonarForBitbucketStatus: null,
                    sonarQubeMetrics: null
                });
                return branchInfo;
            });
            return branchInfos;
        });

        let promises = repos.map(repo => {
            return fetchBranches(repo)
                .then(handleBranchFetch)
        });

        return promises

    } catch (e) {
        console.error('parsing failed', e);
        return [];
    }
}

export async function fetchRepos(project: string): Promise<Repo[]> {
    const repos = await BAPI.fetchRepos(project)

    return repos.values.map(r => {
        return {
            project: project,
            repo: r.slug,
            repoId: r.id
        };
    });
}

export async function fetchAllRepos(): Promise<Repo[]> {
    const repos = await BAPI.fetchAllRepos();

    return repos.values.map(r => {
        return {
            project: r.project.key,
            repo: r.slug,
            repoId: r.id
        };
    });
}

export async function fetchBranches(repo: Repo): Promise<Branch[]> {
    const branches = await BAPI.fetchBranches(repo.project, repo.repo);

    return branches.values.map(b => {
        let behindAheadBranch = {
            behindBranch: 0,
            aheadBranch: 0
        };
        let branchAuthor = '-';
        let branchCreated = '-';
        let latestCommitDate = '';
        let latestCommitHash = '';

        if (b.metadata) {
            if (b.metadata['com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider']) {
                const metadata = b.metadata['com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider'];
                behindAheadBranch.aheadBranch = metadata.ahead;
                behindAheadBranch.behindBranch = metadata.behind;
            }
            if (b.metadata['com.atlassian.stash.stash-branch-utils:latest-changeset-metadata']) {
                const metadata = b.metadata['com.atlassian.stash.stash-branch-utils:latest-changeset-metadata'];
                latestCommitDate = formatDateTime(metadata.authorTimestamp);
                latestCommitHash = metadata.id;
            }
            if (b.metadata['com.github.wadahiro.bitbucket.branchauthor:branchAuthor']) {
                const metadata = b.metadata['com.github.wadahiro.bitbucket.branchauthor:branchAuthor'];
                if (metadata.author) {
                    branchAuthor = metadata.author.displayName === metadata.author.emailAddress ? metadata.author.displayName : `${metadata.author.displayName} (${metadata.author.emailAddress})`;
                    branchCreated = formatDate(metadata.created);
                }
            }
        }

        return <Branch>{
            project: repo.project,
            repo: repo.repo,
            repoId: repo.repoId,
            branch: b.displayId,
            ref: b.id,
            behindAheadBranch,
            branchAuthor,
            branchCreated,
            latestCommitDate,
            latestCommitHash
        }
    });
}


export async function fetchPullRequests(branchInfo: BranchInfo): Promise<PullRequestCount> {
    const pullRequests = await BAPI.fetchPullRequests(branchInfo.project, branchInfo.repo);

    const result: PullRequestCount = {
        id: branchInfo.id,
        repoId: branchInfo.repoId,
        pullRequestIds: {},
        from: {},
        to: {},
        merged: {},
        declined: {},
    };
    return pullRequests.values.reduce<PullRequestCount>((s, p) => {
        const { pullRequestIds, from, to, merged, declined } = s;
        if (p.state === 'OPEN') {
            _count(from, p.fromRef.id);
            _count(to, p.toRef.id);
            _savePRId(pullRequestIds, p.fromRef.id, p.id);
        } else if (p.state === 'MERGED') {
            _count(merged, p.fromRef.id);
        } else if (p.state === 'DECLINED') {
            _count(declined, p.fromRef.id);
        }
        return s;
    }, result);
}

export async function fetchBuildStatus(commitHash: string): Promise<BuildStatus> {
    const buildStatus = await BAPI.fetchBuildStatus(commitHash);

    // sort by dateAdded desc
    buildStatus.values.sort((a, b) => {
        if (a.dateAdded < b.dateAdded) return 1;
        if (a.dateAdded > b.dateAdded) return -1;
        return 0;
    });

    return {
        commitHash,
        values: buildStatus.values.map(x => {
            x.dateAdded = formatDateTime(x.dateAdded as number);
            return x;
        })
    };
}

export async function fetchSonarForBitbucketStatus(repoId: number, pullRequestIds: number[] = []): Promise<SonarForBitbucketStatus> {
    const promises = pullRequestIds.map(x => {
        return BAPI.fetchSonarForBitbucketStatus(repoId, x);
    });
    const status = await Promise.all<BAPI.BitbucketSonarStatus>(promises);

    return status.reduce((s, x) => {
        if (x !== null) {
            s.values.push(x);
        }
        return s;
    }, <SonarForBitbucketStatus>{ repoId, values: [] });
}


export async function isAuthenticatedSonarQube(settings: Settings): Promise<boolean> {
    const { resolver } = settings.items.sonarQubeMetrics;
    const url = baseUrl(resolver.baseUrl);

    const authenticated = await SQAPI.isAuthenticated(url);

    return authenticated;
}

export async function authenticateSoarQube(settings: Settings, login: string, password: string): Promise<boolean> {
    const { resolver } = settings.items.sonarQubeMetrics;
    const url = baseUrl(resolver.baseUrl);

    const authenticated = await SQAPI.authenticate(url, login, password);

    return authenticated;
}

export async function fetchSonarQubeMetricsByKey(settings: Settings, repo: string, branch: string): Promise<SQAPI.SonarQubeMetrics> {
    const sonarBranch = branch.replace('/', '_');
    const resolver = settings.items.sonarQubeMetrics.resolver;

    const url = baseUrl(resolver.baseUrl);
    const sonarProjectKey = `${resolver.projectBaseKey}.${repo}`;

    const metrics = await SQAPI.fetchMetricsByKey(url, sonarProjectKey, sonarBranch, resolver.metrics);

    // TODO convert own type
    return metrics;
}

function _count(container, key) {
    let count = container[key];
    if (!count) {
        container[key] = 1;
    } else {
        container[key] = count + 1;
    }
}

function _savePRId(container, key, prId) {
    let prIds = container[key];
    if (!prIds) {
        container[key] = [prId];
    } else {
        container[key].push(prId);
    }
}

function getBranchNameLink(settings: Settings, branch: string): string {
    const matched = branch.match(settings.items.branchNameLink.resolver.pattern);

    if (matched && matched.length > 0) {
        // console.log(branch, matched[0])
        return matched[0];
    }

    return undefined;
}

function formatDateTime(dateMilliseconds: number) {
    return formatDate(dateMilliseconds, 'YYYY/MM/DD hh:mm:ss');
}

function formatDate(dateMilliseconds: number, format = 'YYYY/MM/DD') {
    if (!dateMilliseconds) {
        return '';
    }
    const date = new Date(dateMilliseconds);
    format = format.replace(/YYYY/g, date.getFullYear() + '');
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};