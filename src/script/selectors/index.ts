import * as _ from 'lodash';
import { createSelector } from 'reselect';

import * as API from '../webapis';
import { RootState, BrowserState, FilterState } from '../reducers';

const getFilterState = (state: RootState) => state.filter;
const getBranchInfos = (state: RootState) => state.browser.branchInfos;
const getCurrentSortColumn = (state: RootState) => state.browser.currentSortColumn;
const getCurrentSortAscending = (state: RootState) => state.browser.currentSortAscending;
const getCurrentPage = (state: RootState) => state.browser.currentPage;
const getResultsPerPage = (state: RootState) => state.app.settings ? state.app.settings .resultsPerPage.value : 0;

export const getFilteredBranchInfos = createSelector<RootState, API.BranchInfo[], API.BranchInfo[], FilterState>(
    getBranchInfos,
    getFilterState,
    (branchInfos, filterState) => {
        const filtered = filterBranchInfo(branchInfos, filterState);
        return filtered;
    }
);

export const getPageSize = createSelector<RootState, number, API.BranchInfo[], number>(
    getFilteredBranchInfos,
    getResultsPerPage,
    (filteredBranchInfos, resultsPerPage) => {
        const pageSize = Math.ceil(filteredBranchInfos.length / resultsPerPage);
        return pageSize;
    }
);

export const getFixedCurrentPage = createSelector<RootState, number, API.BranchInfo[], number, number>(
    getFilteredBranchInfos,
    getPageSize,
    getCurrentPage,
    (filteredBranchInfos, pageSize, currentPage) => {
        const fixedCurrentPage = fixCurrentPage(currentPage, pageSize);
        return fixedCurrentPage;
    }
);

export const getSortedBranchInfos = createSelector<RootState, API.BranchInfo[], API.BranchInfo[], string, boolean>(
    getFilteredBranchInfos,
    getCurrentSortColumn,
    getCurrentSortAscending,
    (filteredBranchInfos, sortColumn, sortAscending) => {
        const sorted = sortBranchInfo(filteredBranchInfos, sortColumn, sortAscending);
        return sorted;
    }
);

export const getSlicedBranchInfos = createSelector<RootState, API.BranchInfo[], API.BranchInfo[], number, number, number>(
    getSortedBranchInfos,
    getFixedCurrentPage,
    getResultsPerPage,
    getPageSize,
    (sortedBranchInfos, fixedCurrentPage, resultsPerPage, pageSize) => {
        const sliced = sliceBranchInfo(sortedBranchInfos, fixedCurrentPage, resultsPerPage, pageSize);
        return sliced;
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

function sortBranchInfo(branchInfos: API.BranchInfo[], sortColumn: string, sortAscending: boolean) {
    let sortedResults = branchInfos;
    if (sortColumn !== null) {
        sortedResults = branchInfos.slice().sort((a, b) => {
            const valueA = toString(a[sortColumn]);
            const valueB = toString(b[sortColumn]);
            if (valueA < valueB) {
                return sortAscending ? -1 : 1;
            }
            if (valueA === valueB) {
                return 0;
            }
            if (valueA > valueB) {
                return sortAscending ? 1 : -1;
            }
        });
    }
    return sortedResults;
}

function toString(value: any = '') {
    return value + '';
}

function sliceBranchInfo(branchInfos: API.BranchInfo[], fixedCurrentPage: number, resultsPerPage: number, pageSize: number) {
    const start = fixedCurrentPage * resultsPerPage;
    const end = start + resultsPerPage;

    const pageResults = branchInfos.slice(start, end);

    return pageResults;
}

function fixCurrentPage(currentPage: number, pageSize: number) {
    if (currentPage >= pageSize) {
        return pageSize - 1;
    }
    return currentPage;
}