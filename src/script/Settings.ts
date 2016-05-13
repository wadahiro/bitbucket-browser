

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

export interface Settings {
    title: string;
    branchNameLinkResolver: BranchNameLinkResolver;
    sonarStatusResolver: SonarStatusResolver;
}
