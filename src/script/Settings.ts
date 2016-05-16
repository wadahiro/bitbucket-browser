export interface Settings {
    title: string;
    items: Items;
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
    sonarStatus: {
        enabled: boolean;
        displayName: string;
    },
    sonarQubeMetrics: {
        enabled: boolean;
        displayName: string;
        resolver: SonarStatusResolver
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

export interface SonarStatusResolver {
    baseUrl: string;
    projectBaseKey: string;
    metrics: string;
}
