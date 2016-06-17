import * as React from 'react';
import * as _ from 'lodash';

import * as API from '../webapis';
import * as B from '../bulma';
import { BehindAheadGraph } from './BehindAheadGraph';
import { BuildStatusModal } from './BuildStatusModal';
import { SonarQubeLoginModal } from './SonarQubeLoginModal';
import { UnauthorizedIcon } from './UnauthorizedIcon';
import { Settings, BranchNameLinkResolver } from '../Settings';

const LOADING = <B.Loading />;
const NONE = <span>-</span>;

const COLUMN_METADATA: B.ColumnMetadata[] = [
    {
        name: 'id',
        visible: false
    },
    {
        name: 'project',
        width: 100,
        visible: true,
        renderer: ProjectLink
    },
    {
        name: 'repo',
        width: 150,
        visible: true,
        renderer: RepoLink
    },
    {
        name: 'branch',
        width: 200,
        visible: true,
        renderer: BranchLink
    },
    {
        name: 'branchAuthor',
        width: 120,
        visible: true
    },
    {
        name: 'branchCreated',
        width: 120,
        visible: true
    },
    {
        name: 'latestCommitDate',
        width: 120,
        visible: true,
        renderer: CommitLink
    },
    {
        name: 'behindAheadBranch',
        renderer: BehindAheadGraphFormatter,
        width: 120,
        headerCenter: true,
        visible: true,
        sortEnabled: false
    },
    {
        name: 'pullRequestStatus',
        width: 130,
        visible: true,
        sortEnabled: false,
        renderer: PullRequestStatusFormatter
    },
    {
        name: 'buildStatus',
        width: 130,
        visible: true,
        sortEnabled: false,
        renderer: BuildStatusFormatter
    },
    {
        name: 'sonarForBitbucketStatus',
        width: 300,
        visible: true,
        sortEnabled: false,
        renderer: SonarQubeStatusFormatter
    },
    {
        name: 'sonarQubeMetrics',
        width: 300,
        visible: true,
        sortEnabled: false
    },
    {
        name: 'branchNameLink',
        width: 100,
        visible: true,
        sortEnabled: true,
    }
];

interface Props {
    settings: Settings;
    api: API.API;
    pageSize: number;
    currentPage: number;
    enableSort?: boolean;
    sortColumn?: string;
    sortAscending?: boolean;
    results: any[];
    showFilter: boolean;
    handlePageChanged: (nextPage: number) => void;
    handleSonarQubeAuthenticated: () => void;
    handleSort: (nextSortColumn: string) => void;
}

export default class BitbucketDataTable extends React.Component<Props, void> {
    static defaultProps = {
        enableSort: true
    };

    render() {
        const { settings, api, results,
            pageSize, currentPage,
            sortColumn, sortAscending,
            handlePageChanged, handleSonarQubeAuthenticated, handleSort } = this.props;

        const resolvedColumnMetadata = COLUMN_METADATA.filter(x => {
            const item = settings.items[x.name];
            return item && item.enabled !== false;
        })
            .map(x => {
                const item = settings.items[x.name];
                x.label = item.displayName;

                const meta = resolveCustomComponent(x);

                // hack
                meta._api = api;

                if (meta.name === 'sonarQubeMetrics') {
                    meta.renderer = SonarQubeMetricsFormatter(api, handleSonarQubeAuthenticated);
                }
                if (meta.name === 'branchNameLink') {
                    meta.renderer = BranchNameLinkFormatter(item.resolver);
                }
                return meta;
            });

        return (
            <B.Section>
                <B.Container isFluid>
                    <div className='branch-table' style={{ padding: '0px 10px 0px 10px' }}>
                        <B.Table
                            tableClassName='branch-table'
                            columnMetadata={resolvedColumnMetadata}
                            rowKey='id'
                            results={this.props.results}
                            enableSort={true}
                            sortColumn={sortColumn}
                            sortAscending={sortAscending}
                            handleSort={handleSort}
                            showPagination={true}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            handlePageChanged={handlePageChanged} />
                    </div>
                </B.Container>
            </B.Section>
        );
    }
}

function resolveCustomComponent(colMeta) {
    if (!colMeta.renderer) {
        colMeta.renderer = DefaultFormatter;
    }
    return colMeta;
}

// CustomComponent
function DefaultFormatter(data, values) {
    return <span>{data}</span>;
}

function LinkFormatter(data, values, metadata, transform) {
    if (transform && data) {
        return <a href={transform(data, values) } target='_blank'>{data}</a>;
    } else {
        return <span>{data}</span>;
    }
}

function ProjectLink(data, values, metadata) {
    const api: API.API = metadata._api;
    return LinkFormatter(data, values, metadata, (data, branchInfo: API.BranchInfo) => {
        return api.createBitbucketProjectUrl(branchInfo);
    });
}

function RepoLink(data, values, metadata) {
    const api: API.API = metadata._api;
    return LinkFormatter(data, values, metadata, (data, branchInfo: API.BranchInfo) => {
        return api.createBitbucketRepoUrl(branchInfo);
    });
}

function BranchLink(data, values, metadata) {
    const api: API.API = metadata._api;
    return LinkFormatter(data, values, metadata, (data, branchInfo: API.BranchInfo) => {
        return api.createBitbucketBranchUrl(branchInfo);
    });
}

function CommitLink(data, values, metadata) {
    const api: API.API = metadata._api;
    return LinkFormatter(data, values, metadata, (data, branchInfo: API.BranchInfo) => {
        return api.createBitbucketCommitUrl(branchInfo);
    });
}

function BranchNameLinkFormatter(resolver: BranchNameLinkResolver) {
    const transform = (data, values: API.BranchInfo) => {
        if (data) {
            return `${resolver.baseUrl}/${data}`;
        }
        return '';
    };
    return (data, values, metadata) => {
        return LinkFormatter(data, values, metadata, transform);
    }
}

function ProgressBarLink(now, values, metadata, transform) {
    let isDanger, isWarning, isInfo;
    if (now > 8) {
        isDanger = 'danger';
    } else if (now > 5) {
        isWarning = 'warning';
    } else if (now > 2) {
        isInfo = 'info';
    }

    const progressBar =
        <B.ProgressBar
            max={10}
            value={now}
            isSmall
            isDanger={isDanger}
            isWarning={isWarning}
            isInfo={isInfo}
            >
            {now}
        </B.ProgressBar>;

    if (transform) {
        return <a href={ transform(now, values) } target='_blank'>
            {progressBar}
        </a>;
    } else {
        return progressBar;
    }
}

function BehindAheadGraphFormatter(data: API.BehindAheadBranch, values, metadata) {
    return <BehindAheadGraph behind={data.behindBranch} ahead={data.aheadBranch} />;
}

function PullRequestStatusFormatter(item: API.LazyItem<API.PullRequestStatus>, values: API.BranchInfo, metadata) {
    if (!item.completed) {
        return LOADING;
    }

    const data = item.value;

    const style = {
        marginBottom: 10,
        fontSize: 11
    };

    return (
        <div>
            <div style={style}>Open(Source): {data.prCountSource} {PullRequestBarLink(metadata._api, 'open')(data.prCountSource, values, metadata) }</div>
            <div style={style}>Open(Target): {data.prCountTarget}  {PullRequestBarLink(metadata._api, 'open')(data.prCountTarget, values, metadata) }</div>
            <div style={style}>Merged: {data.prCountMerged}  {PullRequestBarLink(metadata._api, 'merged')(data.prCountMerged, values, metadata) }</div>
            <div style={style}>Declined: {data.prCountDeclined}  {PullRequestBarLink(metadata._api, 'declined')(data.prCountDeclined, values, metadata) }</div>
        </div>
    );
}

function PullRequestBarLink(api: API.API, state: string) {
    return (data, values, metadata) => {
        return ProgressBarLink(data, values, metadata, (data, branchInfo: API.BranchInfo) => {
            return api.createPullRequestLink(branchInfo, state);
        });
    };
}

function BuildStatusFormatter(item: API.LazyItem<API.BuildStatus>, values, metadata) {
    if (!item.completed) {
        return LOADING;
    }

    const buildStatus = item.value;

    if (buildStatus.values.length === 0) {
        return NONE;
    }

    const latestBuildStatus = buildStatus.values[0];

    let iconClassName;
    let color;
    if (latestBuildStatus.state === 'SUCCESSFUL') {
        iconClassName = 'fa fa-check-circle-o';
        color = '#14892c'
    } else if (latestBuildStatus.state === 'FAILED') {
        iconClassName = 'fa fa-exclamation-triangle';
        color = '#d04437';
    } else {
        iconClassName = 'fa fa-spinner';
        color = '#4a6785';
    }

    return (
        <B.ModalTriggerLink modal={<BuildStatusModal buildStatus={buildStatus} />}>
            {buildStatus.values.length} Build(s) &nbsp;
            <B.Icon iconClassName={iconClassName} color={color} lineHeight={20} />
        </B.ModalTriggerLink>
    );
}

function SonarQubeStatusFormatter(item: API.LazyItem<API.SonarForBitbucketStatus>, branchInfo: API.BranchInfo, metadata) {
    if (!item.completed) {
        return LOADING;
    }

    const sonarForBitbucketStatus = item.value;

    const api: API.API = metadata._api;

    const items = sonarForBitbucketStatus.values.map(x => {
        const fromKeys = Object.keys(x.from.statistics);
        const toKeys = Object.keys(x.to.statistics);
        const keys = _.union(fromKeys, toKeys).filter(x => x !== 'componentId');

        const style = {
            fontSize: 11
        };

        const item = <div key={x.pullRequestId}>
            <h3><a href={api.createPullRequestDetailLink(branchInfo, x.pullRequestId) }>pull request #{x.pullRequestId}</a></h3>
            <table className='table is-narrow' style={style}>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>{x.from.name}</th>
                        <th>{x.to.name}</th>
                    </tr>
                </thead>
                <tbody>
                    { keys.map(key => {
                        return (
                            <tr key={key}>
                                <td>{_toSonarDisplayName(key) }</td>
                                <td>{_toSonarDisplayValue(key, x.from.statistics[key]) }</td>
                                <td>{_toSonarDisplayValue(key, x.to.statistics[key]) }</td>
                            </tr>
                        );
                    }) }
                </tbody>
            </table>
        </div>;
        return item;
    });

    if (items.length === 0) {
        return NONE;
    }
    return <div>{items}</div>;
}

function _toSonarDisplayName(key: string): string {
    // see http://docs.sonarqube.org/display/SONARQUBE43/Metric+definitions
    switch (key) {
        case 'lines':
            return 'Lines';

        case 'duplicatedLines': // Sonar For Bitbucket
        case 'duplicated_lines':
            return 'Dupl. lines';

        case 'coverage': // Sonar For Bitbucket
            return 'Coverage';

        case 'violations': // Sonar For Bitbucket
            return 'All issues';

        case 'blocker_violations':
            return 'Blocker issues';
        case 'critical_violations':
            return 'Critical issues';
        case 'mejor_violations':
            return 'Major issues';
        case 'minor_violations':
            return 'Minor issues';
        case 'info_violations':
            return 'Info issues';

        case 'technicalDebt': // Sonar For Bitbucket
        case 'sqale_index':
            return 'Tech. dept';

        default:
            return key;
    }
}

function _toSonarDisplayValue(key: string, value: string | number): string {
    const v = String(value);
    switch (key) {
        case 'duplicatedLines':
            return String(value);
        case 'coverage':
            if (value === -1) {
                return 'n/a';
            } else {
                return String(value);
            }
        case 'violations':
            return String(value);
        case 'technicalDebt':
            if (typeof value === 'number') {
                if (value >= 60) {
                    value = value as number / 60;
                    if (value >= 8) {
                        value = value as number / 8; // 1day = 8hour 
                    }
                }
                return String(Math.floor(value as number));
            }
            return '-';
        default:
            return String(value);
    }
}


function SonarQubeMetricsFormatter(api: API.API, onAuthenticated: () => void) {
    return (item: API.LazyItem<API.SonarQubeMetrics>, branchInfo: API.BranchInfo, metadata) => {
        if (!item.completed) {
            return LOADING;
        }

        const metrics = item.value;

        if (API.isSonarQubeError(metrics)) {
            // Show needing authentication
            if (metrics.err_code === 401) {
                return (
                    <B.ModalTriggerLink modal={<SonarQubeLoginModal api={api} onAuthenticated={onAuthenticated} />}>
                        <UnauthorizedIcon type='danger' />
                        Unauthorized.&nbsp; Please click me.
                    </B.ModalTriggerLink>
                );
            }

            // Not Found
            if (metrics.err_code === 404) {
                return NONE;
            }
        } else {
            const style = {
                fontSize: 11
            };

            return <div>
                <h3><a href={api.createSonarQubeDashboardUrl(metrics.id) } target='_blank'>{metrics.name}</a></h3>
                <table className='table is-narrow' style={style}>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        { metrics.msr.map(metric => {
                            return (
                                <tr key={metric.key}>
                                    <td>{_toSonarDisplayName(metric.key) }</td>
                                    <td>{metric.frmt_val}</td>
                                </tr>
                            );
                        }) }
                    </tbody>
                </table>
            </div>;
        }
    }
}