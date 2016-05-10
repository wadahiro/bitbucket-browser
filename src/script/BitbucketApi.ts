import { Settings } from './Settings';
import * as B from './bulma';

// bitbucket rest api models
interface BitBucketPage {
    isLastPage: boolean;
    limit: number;
    size: number;
    start: number;
}
interface BitBucketRepos extends BitBucketPage {
    values: BitBucketRepo[];
}
interface BitBucketRepo {
    cloneUrl: string;
    forkable: boolean;
    id: number;
    name: string;
    public: boolean;
    scmId: string; // git
    slug: string;
    state: string; // AVAILABLE
    statusMessage: string; // Available
    link: {
        rel: string;
        url: string;
    };
    links: {
        clone: {
            href: string;
            name: string; // http or ssh
        }[];
        self: {
            href: string; // browse url
        }[];
    };
    project: {
        id: number;
        key: string;
        link: {
            rel: string;
            url: string;
        };
        links: {
            clone: {
                href: string;
                name: string; // http or ssh
            }[];
            self: {
                href: string; // browse url
            }[];
        };
        name: string;
        public: boolean;
        type: string; // NORMAL
    }
}
interface BitbucketPullRequests extends BitBucketPage {
    values: BitbucketPullRequest[]
}
interface BitbucketPullRequest {
    id: number;
    version: number;
    title: string;
    description: string;
    state: 'OPEN' | 'MERGED' | 'DECLINED';
    open: boolean;
    closed: boolean;
    createdDate: number; // Epock milliseconds
    updatedDate: number; // Epock milliseconds
    fromRef: BitbucketRef;
    toRef: BitbucketRef;
    locked: boolean;
    author: {
        approved: boolean;
        role: string;
        user: {
            active: boolean;
            displayName: string;
            emailAddress: string;
            id: number;
            name: string;
            slug: string;
            type; string;
        };
    };
}
interface BitbucketBranches extends BitBucketPage {
    values: BitbucketBranch[]
}
interface BitbucketBranch {
    displayId: string;
    id: string;
    isDefault: boolean;
    latestChangeset: string;
    latestCommit: string;
    metadata: {
        "com.atlassian.stash.stash-branch-utils:ahead-behind-metadata-provider"?: {
            ahead: number;
            behind: number;
        };
        "com.atlassian.stash.stash-branch-utils:latest-changeset-metadata": {
            author: {
                avatarUrl: string;
                emailAddress: string;
                name: string;
            };
            authorTimestamp: number; // Epock milliseconds
            displayId: string; // Short commit hash
            id: string; // Commit hash
            message: string;
            parents: BitbucketChangeset[];
        };
        "com.atlassian.stash.stash-ref-metadata-plugin:outgoing-pull-request-metadata"?: {
            pullRequest: BitbucketPullRequest | BitbucketPullRequest[];
        };
        "com.github.wadahiro.bitbucket.branchauthor:branchAuthor": {
            author?: {
                displayName: string;
                emailAddress: string;
            };
            created?: number // Epock milliseconds
        };
    };
}
interface BitbucketRef {
    displayId: string;
    id: string;
    latestChangeset: string;
    latestCommit: string;
    repository: {
        forkable: boolean;
        id: number;
        name: string;
        project: {
            id: number;
            key: string;
            name: string;
            public: boolean;
            type: string
        };
        public: boolean;
        scmId: string;
        slug: string;
        state: string;
        statusMessage: string;
    }
}
interface BitbucketChangeset {
    displayId: string;
    id: string;
}
interface BitbucketBuildStatuses extends BitBucketPage {
    values: BitbucketBuildStatus[]
}
interface BitbucketBuildStatus {
    state: 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS';
    key: string;
    name: string;
    url: string;
    description: string;
    dateAdded: number | string; //Epock milliseconds
}
interface BitBucketSonarStatus {
    sonarServer: string; // server url
    from: {
        name: string; // branch name
        statistics: {
            componentId: string;
            duplicatedLines: number;
            coverage: number;
            violations: number;
            technicalDebt: number;
        };
    };
    to: {
        name: string;
        statistics: {
            componentId: string;
            duplicatedLines: number;
            coverage: number;
            violations: number;
            technicalDebt: number;
        };
    };
    // add for trace
    pullRequestId: number;
}

// bitbucket-browser models
interface Project {
    project: string;
}

interface Repo extends Project {
    repo: string;
    repoId: number;
}

interface Branch extends Repo {
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

// exported Models
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
export interface BranchInfo extends Branch {
    /**
     * Unique Key (${project}_${repo}_${branch})
     */
    id: string;
    branchNameLink: string;
    pullRequestStatus: B.LazyFetch<PullRequestCount> | PullRequestStatus
    buildStatus: B.LazyFetch<BuildStatus> | BuildStatus;
    sonarStatus: B.LazyFetch<SonarStatus> | SonarStatus;
}
export interface BehindAheadBranch {
    aheadBranch: number;
    behindBranch: number;
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
    values: BitbucketBuildStatus[];
}
export interface SonarStatus {
    repoId: number;
    values: BitBucketSonarStatus[];
}

// exported Functions
export async function isAuthenticated(): Promise<boolean> {
    const projects = await fetchProjects();

    if (projects.length === 0) {
        return false;
    }
    return true;
}

export async function loadBranchInfos(settings: Settings, handleProjectBranchInfos: (rows: BranchInfo[]) => void, executorSize = 5): Promise<boolean[]> {
    try {
        const repos = await fetchAllRepos();
        const result = _.chain(repos)
            .map(r => {
                return fetchBranches(r);
            })
            .chunk(executorSize)
            .map(p => {
                Promise.all<Branch[]>(p)
                    .then(results => {
                        results.forEach(branchesOfProject => {
                            const branchInfos = branchesOfProject.map(b => {
                                const branchInfo = Object.assign({}, b, {
                                    id: `${b.project}_${b.repo}_${b.branch}`,
                                    branchNameLink: getBranchNameLink(settings, b.branch),
                                    pullRequestStatus: null,
                                    buildStatus: null,
                                    sonarStatus: null
                                } as BranchInfo);
                                return branchInfo;
                            });

                            handleProjectBranchInfos(branchInfos);
                        });
                    });
                return true;
            })
            .value();
        return Promise.all(result);
    } catch (e) {
        console.error('parsing failed', e);
        return [];
    }
}

export async function fetchProjects(): Promise<Project[]> {
    const response = await fetch('/stash/rest/api/1.0/projects', {
        credentials: 'same-origin'
    });
    const json = await response.json();

    if (json.values) {
        return json.values.map(p => {
            return p.key;
        });
    } else {
        return [];
    }
}

export async function fetchRepos(projectKey): Promise<Repo[]> {
    const response = await fetch(`/stash/rest/api/1.0/projects/${projectKey}/repos`, {
        credentials: 'same-origin'
    });
    const json: BitBucketRepos = await response.json();

    if (json.values) {
        return json.values.map(r => {
            return {
                project: projectKey,
                repo: r.slug,
                repoId: r.id
            };
        });
    } else {
        return [];
    }
}

export async function fetchAllRepos(): Promise<Repo[]> {
    const response = await fetch(`/stash/rest/api/1.0/repos?limit=2000`, {
        credentials: 'same-origin'
    });
    const json: BitBucketRepos = await response.json();

    if (json.values) {
        return json.values.map(r => {
            return {
                project: r.project.key,
                repo: r.slug,
                repoId: r.id
            };
        });
    } else {
        return [];
    }
}

export async function fetchBranches(repo: Repo): Promise<Branch[]> {
    const response = await fetch(`/stash/rest/api/1.0/projects/${repo.project}/repos/${repo.repo}/branches?details=true`, {
        credentials: 'same-origin'
    });
    const json: BitbucketBranches = await response.json();

    if (json.values) {
        return json.values.map(b => {
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

            return {
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
            } as Branch
        });
    } else {
        return [];
    }
}

export async function fetchPullRequests(branchInfo: BranchInfo): Promise<PullRequestCount> {
    const response = await fetch(`/stash/rest/api/1.0/projects/${branchInfo.project}/repos/${branchInfo.repo}/pull-requests?state=ALL&withProperties=false&withAttributes=false`, {
        credentials: 'same-origin'
    });
    const json: BitbucketPullRequests = await response.json();

    const result: PullRequestCount = {
        id: branchInfo.id,
        repoId: branchInfo.repoId,
        pullRequestIds: {},
        from: {},
        to: {},
        merged: {},
        declined: {},
    };
    if (json.values) {
        return _.reduce<BitbucketPullRequest, PullRequestCount>(json.values, (s, p) => {
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
    } else {
        return result;
    }
}

export async function fetchBuildStatus(commitHash: string): Promise<BuildStatus> {
    const response = await fetch(`/stash/rest/build-status/1.0/commits/${commitHash}`, {
        credentials: 'same-origin'
    });
    const json: BitbucketBuildStatuses = await response.json();

    // sort by dateAdded desc
    json.values.sort((a, b) => {
        if (a.dateAdded < b.dateAdded) return 1;
        if (a.dateAdded > b.dateAdded) return -1;
        return 0;
    });

    const buildStatus: BuildStatus = {
        commitHash,
        values: json.values.map(x => {
            x.dateAdded = formatDateTime(x.dateAdded as number);
            return x;
        })
    };
    return buildStatus;
}

export async function fetchSonarStatus(repoId: number, pullRequestIds: number[] = []): Promise<SonarStatus> {
    const promises = pullRequestIds.map(x => {
        return _fetchSonarStatus(repoId, x);
    });
    const status = await Promise.all<BitBucketSonarStatus>(promises);

    return status.reduce((s, x) => {
        s.values.push(x);
        return s;
    }, { repoId, values: [] } as SonarStatus);
}

export async function _fetchSonarStatus(repoId: number, pullRequestId: number): Promise<BitBucketSonarStatus> {
    const response = await fetch(`/stash/rest/sonar4stash/latest/statistics?pullRequestId=${pullRequestId}&repoId=${repoId}`, {
        credentials: 'same-origin'
    });
    const json: BitBucketSonarStatus = await response.json();
    json.pullRequestId = pullRequestId;
    return json;
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
    const matched = branch.match(settings.branchNameLinkResolver.pattern);

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