import * as B from '../bulma';

import { Settings } from '../Settings';
import * as BAPI from './BitbucketApi';
import * as SQAPI from './SonarQubeApi';
import * as JAPI from './JiraApi';
import { formatDateTime, formatDate } from '../Utils';

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
    pullRequestStatus: LazyItem<PullRequestStatus>
    buildStatus: LazyItem<BuildStatus>;
    sonarForBitbucketStatus: LazyItem<SonarForBitbucketStatus>;
    sonarQubeMetrics: LazyItem<SonarQubeMetrics>;
    jiraIssue: LazyItem<JiraIssue>;

    fetchCompleted: boolean;
}

export interface LazyItem<T> {
    value: T;
    completed: boolean;
}

function newLazyItem<T>(value: T): LazyItem<T> {
    return {
        value,
        completed: false
    };
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

export type SonarQubeMetrics = SQAPI.SonarQubeMetricsResponse | SQAPI.ErrorResponse;
export function isSonarQubeError(response: any): response is SQAPI.ErrorResponse {
    return SQAPI.isErrorResponse(response);
}

export type JiraIssue = JAPI.JiraIssueResponse | JAPI.ErrorResponse;
export function isJiraError(response: any): response is JAPI.ErrorResponse {
    return JAPI.isErrorResponse(response);
}

export function isFetchCompleted(branchInfo: BranchInfo) {
    const hasFalse = Object.keys(branchInfo)
        .filter(x => branchInfo[x] && branchInfo[x].completed !== undefined)
        .find(x => branchInfo[x].completed === false);
    return !hasFalse;
}

export class API {
    settings: Settings;
    bitbucketApi: BAPI.BitbucketApi;
    sonarQubeApi: SQAPI.SonarQubeApi;
    jiraApi: JAPI.JiraApi;
    linkBaseUrl: string;

    constructor(settings: Settings) {
        this.settings = settings;
        this.bitbucketApi = new BAPI.BitbucketApi({
            baseUrl: settings.baseUrl
        });
        if (settings.items.sonarQubeMetrics) {
            this.sonarQubeApi = new SQAPI.SonarQubeApi({
                baseUrl: settings.items.sonarQubeMetrics.resolver.baseUrl
            });
        }
        if (settings.items.jiraIssue) {
            const fields = settings.items.jiraIssue.resolver.fields.map(x => x.key.split('.')[0]);
            this.jiraApi = new JAPI.JiraApi({
                baseUrl: settings.items.jiraIssue.resolver.baseUrl,
                fields: ['summary'].concat(fields)
            });
        }
        this.linkBaseUrl = settings.linkBaseUrl || settings.baseUrl;
    }

    async isAuthenticatedBitbucket(): Promise<boolean> {
        return await this.bitbucketApi.isAuthenticated();
    }

    async authenticateBitbucket(login: string, password: string): Promise<boolean> {
        const authenticated = await this.bitbucketApi.authenticate(login, password);
        return authenticated;
    }

    async fetchBranchInfo(repo: Repo): Promise<BranchInfo[]> {
        try {
            const branches = await this.fetchBranches(repo);
            const items = this.settings.items;

            const branchInfos: BranchInfo[] = branches.map(b => {
                const branchInfo: BranchInfo = Object.assign({}, b, <BranchInfo>{
                    id: `${b.project}_${b.repo}_${b.branch}`,
                    branchNameLink: getBranchNameLink(this.settings, b.branch),

                    pullRequestStatus: items.pullRequestStatus.enabled ? newLazyItem(null) : null,
                    buildStatus: items.buildStatus.enabled ? newLazyItem(null) : null,
                    sonarForBitbucketStatus: items.sonarForBitbucketStatus.enabled ? newLazyItem(null) : null,
                    sonarQubeMetrics: items.sonarQubeMetrics.enabled ? newLazyItem(null) : null,
                    jiraIssue: items.jiraIssue.enabled ? newLazyItem(null) : null,

                    fetchCompleted: false // update at reducer
                });
                return branchInfo;
            });
            return branchInfos;

        } catch (e) {
            console.error('parsing failed', e);
            return [];
        }
    }

    async fetchRepos(project: string): Promise<Repo[]> {
        const repos = await this.bitbucketApi.fetchRepos(project)

        return repos.map(r => {
            return {
                project: project,
                repo: r.slug,
                repoId: r.id
            };
        });
    }

    async fetchAllRepos(): Promise<Repo[]> {
        const repos = await this.bitbucketApi.fetchAllRepos();

        return repos.map(r => {
            return {
                project: r.project.key,
                repo: r.slug,
                repoId: r.id
            };
        });
    }

    async fetchBranches(repo: Repo): Promise<Branch[]> {
        const branches = await this.bitbucketApi.fetchBranches(repo.project, repo.repo);

        return branches.map(b => {
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

    async fetchPullRequests(repo: Repo): Promise<PullRequestCount> {
        const pullRequests = await this.bitbucketApi.fetchPullRequests(repo.project, repo.repo);

        const result: PullRequestCount = {
            repoId: repo.repoId,
            pullRequestIds: {},
            from: {},
            to: {},
            merged: {},
            declined: {},
        };
        return pullRequests.reduce<PullRequestCount>((s, p) => {
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

    async fetchBuildStatus(commitHash: string): Promise<BuildStatus> {
        const buildStatus = await this.bitbucketApi.fetchBuildStatus(commitHash);

        // sort by dateAdded desc
        buildStatus.sort((a, b) => {
            if (a.dateAdded < b.dateAdded) return 1;
            if (a.dateAdded > b.dateAdded) return -1;
            return 0;
        });

        return {
            commitHash,
            values: buildStatus.map(x => {
                x.dateAdded = formatDateTime(x.dateAdded as number);
                return x;
            })
        };
    }

    async fetchSonarForBitbucketStatus(repoId: number, pullRequestIds: number[] = []): Promise<SonarForBitbucketStatus> {
        const promises = pullRequestIds.map(x => {
            return this.bitbucketApi.fetchSonarForBitbucketStatus(repoId, x);
        });
        const status = await Promise.all<BAPI.BitbucketSonarStatus>(promises);

        return status.reduce((s, x) => {
            if (x !== null) {
                s.values.push(x);
            }
            return s;
        }, <SonarForBitbucketStatus>{ repoId, values: [] });
    }

    // For SonarQube
    async isAuthenticatedSonarQube(): Promise<boolean> {
        const authenticated = await this.sonarQubeApi.isAuthenticated();
        return authenticated;
    }

    async authenticateSoarQube(login: string, password: string): Promise<boolean> {
        const authenticated = await this.sonarQubeApi.authenticate(login, password);
        return authenticated;
    }

    async fetchSonarQubeMetricsByKey(repo: string, branch: string): Promise<SonarQubeMetrics> {
        const sonarBranch = branch.replace('/', '_');
        const resolver = this.settings.items.sonarQubeMetrics.resolver;

        const sonarProjectKey = `${resolver.projectBaseKey}.${repo}`;

        try {
            const metrics = await this.sonarQubeApi.fetchMetricsByKey(sonarProjectKey, sonarBranch, resolver.fields.map(x => x.key).join(','));
            return metrics;
        } catch (e) {
            if (SQAPI.isErrorResponse(e)) {
                return e;
            }
            throw e;
        }
    }

    // For JIRA
    async isAuthenticatedJira(): Promise<boolean> {
        const authenticated = await this.jiraApi.isAuthenticated();
        return authenticated;
    }

    async authenticateJira(login: string, password: string): Promise<boolean> {
        const authenticated = await this.jiraApi.authenticate(login, password);
        return authenticated;
    }

    async fetchJiraIssue(issueId: string): Promise<JiraIssue> {
        try {
            const jiraIssue = await this.jiraApi.fetchIssue(issueId);
            return jiraIssue;
        } catch (e) {
            if (JAPI.isErrorResponse(e)) {
                return e;
            }
            throw e;
        }
    }

    // URL Generator functions

    createBitbucketProjectUrl(branchInfo: BranchInfo) {
        return `${this.linkBaseUrl}/projects/${branchInfo.project}`;
    }

    createBitbucketRepoUrl(branchInfo: BranchInfo) {
        return `${this.createBitbucketProjectUrl(branchInfo)}/repos/${branchInfo.repo}`;
    }

    createBitbucketBranchUrl(branchInfo: BranchInfo) {
        return `${this.createBitbucketRepoUrl(branchInfo)}/browse?at=${branchInfo.branch}`;
    }

    createBitbucketCommitUrl(branchInfo: BranchInfo) {
        return `${this.createBitbucketRepoUrl(branchInfo)}/commits/${branchInfo.latestCommitHash}`;
    }

    createPullRequestLink(branchInfo: BranchInfo, state: string) {
        return `${this.createBitbucketRepoUrl(branchInfo)}/pull-requests?state=${state}`;
    }

    createPullRequestDetailLink(branchInfo: BranchInfo, pullRequestId: number) {
        return `${this.createBitbucketRepoUrl(branchInfo)}/pull-requests/${pullRequestId}/overview`;
    }

    createSonarQubeDashboardUrl(id: number) {
        const url = `${this.settings.items.sonarQubeMetrics.resolver.baseUrl}/dashboard/index/${id}`;
        return url;
    }

    createJiraIssueUrl(jiraIssue: JiraIssue) {
        const url = `${this.settings.items.jiraIssue.resolver.linkBaseUrl}/${jiraIssue.key}`;
        return url;
    }
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
