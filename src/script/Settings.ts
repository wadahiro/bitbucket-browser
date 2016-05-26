export interface Settings {
    title?: string;
    baseUrl?: string;
    items?: Items;
}

export interface Items {
    project: {
        displayName: string;
    },
    repo: {
        displayName: string;
    },
    branch: {
        displayName: string;
    },
    branchAuthor: {
        enabled: boolean;
        displayName: string;
    },
    branchCreated: {
        enabled: boolean;
        displayName: string;
    },
    latestCommitDate: {
        enabled: boolean;
        displayName: string;
    },
    behindAheadBranch: {
        enabled: boolean;
        displayName: string;
    },
    pullRequestStatus: {
        enabled: boolean;
        displayName: string;
    },
    buildStatus: {
        enabled: boolean;
        displayName: string;
    },
    sonarForBitbucketStatus: {
        enabled: boolean;
        displayName: string;
    },
    sonarQubeMetrics: {
        enabled: boolean;
        displayName: string;
        resolver: SonarQubeMetricsResolver
    },
    branchNameLink: {
        enabled: boolean;
        displayName: string;
        resolver: BranchNameLinkResolver
    }
}

export interface BranchNameLinkResolver {
    pattern: string;
    baseUrl: string;
    displayName: string;
}

export interface SonarQubeMetricsResolver {
    baseUrl: string;
    projectBaseKey: string;
    metrics: string;
}
