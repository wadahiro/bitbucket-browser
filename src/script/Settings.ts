export interface Settings {
    title: string;
    branchNameLinkResolver: BranchNameLinkResolver;
}

export interface BranchNameLinkResolver {
    pattern: string;
    baseUrl: string;
    displayName: string;
}

