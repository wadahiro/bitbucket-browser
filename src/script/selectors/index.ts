import * as _ from 'lodash';
import { createSelector } from 'reselect';

import * as API from '../webapis';
import { RootState, BrowserState, FilterState } from '../reducers';

const getFilterState = (state: RootState) => state.filter
const getBrowserState = (state: RootState) => state.browser

export const getVisibleBranchInfos = createSelector<RootState, API.BranchInfo[], FilterState, BrowserState>(
    getFilterState,
    getBrowserState,
    (filterState, browserState) => {
        const filteredBranchInfos = filterBranchInfo(browserState.branchInfos, filterState);
        return filteredBranchInfos;
    }
);

// Utilities
function filterBranchInfo(data: API.BranchInfo[], filter: FilterState) {
    const projectIncludes = filter.projectIncludes;
    const projectExcludes = filter.projectExcludes;

    const repoIncludes = filter.repoIncludes;
    const repoExcludes = filter.repoExcludes;

    const branchIncludes = filter.branchIncludes;
    const branchExcludes = filter.branchExcludes;

    const branchAuthorIncludes = filter.branchAuthorIncludes;
    const branchAuthorExcludes = filter.branchAuthorExcludes;

    let chain = _.chain(data);

    // Includes
    if (projectIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(projectIncludes, row.project) || match(projectIncludes, row.project);
        });
    }
    if (repoIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(repoIncludes, row.repo) || match(repoIncludes, row.repo);
        });
    }
    if (branchIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(branchIncludes, row.branch) || match(branchIncludes, row.branch);
        });
    }
    if (branchAuthorIncludes.length > 0) {
        chain = chain.filter(row => {
            return _.includes(branchAuthorIncludes, row.branchAuthor) || match(branchAuthorIncludes, row.branchAuthor);
        });
    }

    // Excludes
    if (projectExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(projectExcludes, row.project) || match(projectExcludes, row.project));
        });
    }
    if (repoExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(repoExcludes, row.repo) || match(repoExcludes, row.repo));
        });
    }
    if (branchExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(branchExcludes, row.branch) || match(branchExcludes, row.branch));
        });
    }
    if (branchAuthorExcludes.length > 0) {
        chain = chain.filter(row => {
            return !(_.includes(branchAuthorExcludes, row.branchAuthor) || match(branchAuthorExcludes, row.branchAuthor));
        });
    }
    return chain.value();
}

function match(patterns: string[] = [], target: string) {
    const found = patterns.find(pattern => {
        const re = new RegExp(pattern);
        return re.test(target);
    });
    return found === undefined ? false : true;
}