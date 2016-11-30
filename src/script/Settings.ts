export interface Settings {
    title?: string;
    baseUrl?: string;
    linkBaseUrl?: string;
    items?: Items;
    show?: boolean;
    resultsPerPage?: {
        value: number;
        options: number[];
    }
    filter?: FilterState;
    debug?: boolean;
}

export interface Items {
    project: {
        displayName: string;
        visible: boolean;
    },
    repo: {
        displayName: string;
        visible: boolean;
    },
    branch: {
        displayName: string;
        visible: boolean;
    },
    branchAuthor: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    branchCreated: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    latestCommitDate: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    behindAheadBranch: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    pullRequestStatus: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    buildStatus: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
    },
    sonarForBitbucketStatus: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
        resolver: SonarForBitbucketStatusResolver
    },
    sonarQubeMetrics: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
        resolver: SonarQubeMetricsResolver
    },
    branchNameLink: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
        resolver: BranchNameLinkResolver
    },
    jiraIssue: {
        enabled: boolean;
        displayName: string;
        visible: boolean;
        resolver: JiraIssueResolver
    }
}

export interface BranchNameLinkResolver {
    pattern: string;
    baseUrl: string;
    displayName: string;
}

export interface SonarForBitbucketStatusResolver {
    fields: ResolverField[];
}

export interface SonarQubeMetricsResolver {
    baseUrl: string;
    projectBaseKey: string;
    fields: ResolverField[];
}

export interface JiraIssueResolver {
    pattern: string;
    baseUrl: string;
    linkBaseUrl: string;
    fields: ResolverField[];
}

export interface ResolverField {
    enabled: boolean;
    key: string;
    displayName: string;
    datePattern?: string; // YYYY/MM/DD
}

export interface FilterState {
    projectIncludes?: string[];
    projectExcludes?: string[];
    repoIncludes?: string[];
    repoExcludes?: string[];
    branchIncludes?: string[];
    branchExcludes?: string[];
    branchAuthorIncludes?: string[];
    branchAuthorExcludes?: string[];
}