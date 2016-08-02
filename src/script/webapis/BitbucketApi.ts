// bitbucket rest api models
export interface BitBucketPage {
    isLastPage: boolean;
    limit: number;
    size: number;
    start: number;
}
export interface BitBucketProjects extends BitBucketPage {
    values: BitBucketProject[];
}
export interface BitBucketProject {
    project: string;
}
export interface BitBucketRepos extends BitBucketPage {
    values: BitBucketRepo[];
}
export interface BitBucketRepo {
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
export interface BitbucketPullRequests extends BitBucketPage {
    values: BitbucketPullRequest[]
}
export interface BitbucketPullRequest {
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
export interface BitbucketBranches extends BitBucketPage {
    values: BitbucketBranch[]
}
export interface BitbucketBranch {
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
export interface BitbucketRef {
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
export interface BitbucketChangeset {
    displayId: string;
    id: string;
}
export interface BitbucketBuildStatuses extends BitBucketPage {
    values: BitbucketBuildStatus[]
}
export interface BitbucketBuildStatus {
    state: 'SUCCESSFUL' | 'FAILED' | 'INPROGRESS';
    key: string;
    name: string;
    url: string;
    description: string;
    dateAdded: number | string; //Epock milliseconds
}
export interface BitbucketSonarStatus {
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

interface BitbucketApiOptions {
    baseUrl: string;
}

export class BitbucketApi {
    baseUrl: string;

    constructor(options: BitbucketApiOptions) {
        this.baseUrl = trimSlash(options.baseUrl);
    }

    async isAuthenticated(): Promise<boolean> {
        const projects = await this.fetchProjects();

        if (projects.values.length === 0) {
            return false;
        }
        return true;
    }

    async authenticate(loginId: string, password: string): Promise<boolean> {
        // Because of Basic Authorization doesn't return set-cookie header, use form post authentication
        // const response = await fetch(`${this.baseUrl}/rest/api/1.0/projects`, {
        //     credentials: 'same-origin',
        //     headers: {
        //         'Authorization': `Basic ${new Buffer(`${loginId}:${password}`).toString('base64')}`
        //     }
        // });
        const response = await fetch(`${this.baseUrl}/j_stash_security_check`, {
            redirect: 'manual', // for redirect ignore
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `j_username=${encodeURIComponent(loginId)}&j_password=${encodeURIComponent(password)}&_spring_security_remember_me=on`
        });

        return await this.isAuthenticated();
    }

    async fetchProjects(): Promise<BitBucketProjects> {
        const response = await fetch(`${this.baseUrl}/rest/api/1.0/projects`, {
            credentials: 'same-origin'
        });
        const json: BitBucketProjects = await response.json();
        return json;
    }

    async fetchRepos(project): Promise<BitBucketRepos> {
        const response = await fetch(`${this.baseUrl}/rest/api/1.0/projects/${project}/repos`, {
            credentials: 'same-origin'
        });
        const json: BitBucketRepos = await response.json();
        return json;
    }

    async fetchAllRepos(): Promise<BitBucketRepos> {
        const response = await fetch(`${this.baseUrl}/rest/api/1.0/repos?limit=2000`, {
            credentials: 'same-origin'
        });
        const json: BitBucketRepos = await response.json();
        return json;
    }

    async fetchBranches(project: string, repo: string): Promise<BitbucketBranches> {
        const response = await fetch(`${this.baseUrl}/rest/api/1.0/projects/${project}/repos/${repo}/branches?details=true`, {
            credentials: 'same-origin'
        });
        const json: BitbucketBranches = await response.json();
        return json;
    }

    async fetchPullRequests(project: string, repo: string): Promise<BitbucketPullRequests> {
        const response = await fetch(`${this.baseUrl}/rest/api/1.0/projects/${project}/repos/${repo}/pull-requests?state=ALL&withProperties=false&withAttributes=false`, {
            credentials: 'same-origin'
        });
        const json: BitbucketPullRequests = await response.json();
        return json;
    }

    async fetchBuildStatus(commitHash: string): Promise<BitbucketBuildStatuses> {
        const response = await fetch(`${this.baseUrl}/rest/build-status/1.0/commits/${commitHash}`, {
            credentials: 'same-origin'
        });
        const json: BitbucketBuildStatuses = await response.json();
        return json;
    }

    async fetchSonarForBitbucketStatus(repoId: number, pullRequestId: number): Promise<BitbucketSonarStatus> {
        const response = await fetch(`${this.baseUrl}/rest/sonar4stash/latest/statistics?pullRequestId=${pullRequestId}&repoId=${repoId}`, {
            credentials: 'same-origin'
        });
        // Need checking status code because Sonar For Bitbucke returns 404 if the pull request does'n have the SonarQube metrics
        if (response.status !== 200) {
            return null;
        }
        const json: BitbucketSonarStatus = await response.json();
        json.pullRequestId = pullRequestId;
        return json;
    }
}

function trimSlash(url: string) {
    const last = url.substring(url.length - 1);
    if (last === '/') {
        return url.substring(0, url.length - 1)
    }
    return url;
}