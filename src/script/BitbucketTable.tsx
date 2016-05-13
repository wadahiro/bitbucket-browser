import * as React from 'react';
import * as _ from 'lodash';

import { BehindAheadBranch, PullRequestStatus, BuildStatus, SonarStatus,
    BranchInfo, PullRequestCount,
    fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from './BitbucketApi';
import { SonarQubeMetrics } from './SonarQubeApi'
import * as B from './bulma';
import Spinner from './Spinner';
import { BehindAheadGraph } from './components/BehindAheadGraph';
import { BuildStatusModal } from './components/BuildStatusModal';
import { Settings, BranchNameLinkResolver } from './Settings';

const LOADING = <B.Loading />;

const COLUMN_METADATA = [
    {
        name: 'id',
        label: 'ID',
        order: 1,
        visible: false
    },
    {
        name: 'project',
        label: 'Project',
        order: 2,
        width: 100,
        visible: true,
        renderer: ProjectLink
    },
    {
        name: 'repo',
        label: 'Repository',
        order: 3,
        width: 150,
        visible: true,
        renderer: RepoLink
    },
    {
        name: 'branch',
        label: 'Branch',
        order: 4,
        width: 200,
        visible: true,
        renderer: BranchLink
    },
    {
        name: 'branchAuthor',
        label: 'Branch Author',
        order: 5,
        width: 100,
        visible: true
    },
    {
        name: 'branchCreated',
        label: 'Branch Created',
        order: 6,
        width: 100,
        visible: true
    },
    {
        name: 'latestCommitDate',
        label: 'Updated',
        order: 7,
        width: 100,
        visible: true,
        renderer: CommitLink
    },
    {
        name: 'behindAheadBranch',
        label: 'Behind/Ahead Branch',
        renderer: BehindAheadGraphFormatter,
        order: 8,
        width: 200,
        headerCenter: true,
        visible: true,
        sortEnabled: false
    },
    {
        name: 'pullRequestStatus',
        label: 'Pull Request Status',
        order: 9,
        width: 120,
        visible: true,
        sortEnabled: false,
        renderer: PullRequestStatusFormatter
    },
    // {
    //     name: 'prCountSource',
    //     label: 'Pull Request (Source)',
    //     order: 10,
    //     visible: true,
    //     renderer: PullRequestBarLink('open')
    // },
    // {
    //     name: 'prCountTarget',
    //     label: 'Pull Request (Target)',
    //     order: 11,
    //     visible: true,
    //     renderer: PullRequestBarLink('open')
    // },
    // {
    //     name: 'prCountMerged',
    //     label: 'Pull Request (Merged)',
    //     order: 12,
    //     visible: true,
    //     renderer: PullRequestBarLink('merged')
    // },
    // {
    //     name: 'prCountDeclined',
    //     label: 'Pull Request (Declined)',
    //     order: 13,
    //     visible: true,
    //     renderer: PullRequestBarLink('declined')
    // },
    {
        name: 'buildStatus',
        label: 'Build Status',
        order: 14,
        width: 200,
        visible: true,
        sortEnabled: false,
        renderer: BuildStatusFormatter
    },
    {
        name: 'sonarStatus',
        label: 'Sonar for Stash Metric',
        order: 15,
        width: 300,
        visible: true,
        sortEnabled: false,
        renderer: SonarForBitbucketMetricFormatter
    }
    // sonarQubeMetrics column is added in 'componentDidMount'
    // branchNameLink column is added in 'componentDidMount'
];

interface Props extends React.Props<BitbucketDataTable> {
    settings: Settings;
    resultsPerPage?: number;
    enableSort?: boolean;
    results: any[];
    showFilter: boolean;
    handlePullRequestCount: (prCount: B.LazyFetch<PullRequestCount>, branchInfo: BranchInfo) => void;
    handleBuildStatus: (buildStatus: B.LazyFetch<BuildStatus>, branchInfo: BranchInfo) => void;
    handleSonarStatus: (sonarStatus: B.LazyFetch<SonarStatus>, branchInfo: BranchInfo) => void;
    handleSonarQubeMetrics: (sonarQubeMetrics: B.LazyFetch<SonarQubeMetrics>, branchInfo: BranchInfo) => void;
}

export default class BitbucketDataTable extends React.Component<Props, any> {
    static defaultProps = {
        resultsPerPage: 10,
        enableSort: true
    };

    render() {
        const { settings, results, handlePullRequestCount, handleBuildStatus, handleSonarStatus, handleSonarQubeMetrics } = this.props;

        const resolvedColumnMetadata = COLUMN_METADATA.map(colMeta => {
            const meta = resolveCustomComponent(colMeta);
            if (meta.name === 'pullRequestStatus') {
                meta.lazyFetch = handlePullRequestCount;
            }
            if (meta.name === 'buildStatus') {
                meta.lazyFetch = handleBuildStatus;
            }
            if (meta.name === 'sonarStatus') {
                meta.lazyFetch = handleSonarStatus;
            }
            return meta;
        });


        resolvedColumnMetadata.push(
            {
                name: 'sonarQubeMetrics',
                label: 'SonarQube Metrics',
                order: 16,
                width: 300,
                visible: true,
                sortEnabled: false,
                renderer: SonarQubeMetricsFormatter(settings),
                lazyFetch: handleSonarQubeMetrics
            }
        );
        resolvedColumnMetadata.push(
            {
                name: 'branchNameLink',
                label: settings.branchNameLinkResolver.displayName,
                width: 100,
                visible: true,
                renderer: BranchNameLinkFormatter(settings.branchNameLinkResolver)
            }
        );

        return (
            <div>
                <B.Columns>
                    <B.Table
                        fixed={true}
                        columnMetadata={resolvedColumnMetadata}
                        enableSort={true}
                        showPagination={true}
                        resultsPerPage={5}
                        results={this.props.results}
                        rowKey='id' />
                </B.Columns>
            </div>
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
    return LinkFormatter(data, values, metadata, projectLink);
}

function RepoLink(data, values, metadata) {
    return LinkFormatter(data, values, metadata, repoLink);
}

function BranchLink(data, values, metadata) {
    return LinkFormatter(data, values, metadata, branchLink);
}

function CommitLink(data, values, metadata) {
    return LinkFormatter(data, values, metadata, commitLink);
}

function BranchNameLinkFormatter(resolver: BranchNameLinkResolver) {
    const transform = (data, values: BranchInfo) => {
        if (data) {
            return `${resolver.baseUrl}${data}`;
        }
        return '';
    };
    return (data, values, metadata) => {
        return LinkFormatter(data, values, metadata, transform);
    }
}

function ProgressBarLink(now, values, metadata, transform) {
    if (now === null) {
        return LOADING;
    }

    let type: B.Type = 'success';
    if (now > 8) {
        type = 'danger';
    } else if (now > 5) {
        type = 'warning';
    } else if (now > 2) {
        type = 'info';
    }

    if (transform) {
        return <a href={ transform(now, values) } target='_blank'><B.ProgressBar max={10} value={now} type={type} size='small'>{now}</B.ProgressBar></a>;
    } else {
        return <B.ProgressBar max={10} value={now} type={type} size='small'>{now}</B.ProgressBar>;
    }
}

function BehindAheadGraphFormatter(data: BehindAheadBranch, values, metadata) {
    if (data === null) {
        return LOADING;
    }

    return <BehindAheadGraph behind={data.behindBranch} ahead={data.aheadBranch} />;
}

function PullRequestStatusFormatter(data: PullRequestStatus, values: BranchInfo, metadata) {
    if (data === null) {
        return LOADING;
    }

    const style = {
        marginBottom: 10,
        fontSize: 11
    };

    return (
        <div>
            <div style={style}>Open(Source): {data.prCountSource} {PullRequestBarLink('open')(data.prCountSource, values, metadata) }</div>
            <div style={style}>Open(Target): {data.prCountTarget}  {PullRequestBarLink('open')(data.prCountTarget, values, metadata) }</div>
            <div style={style}>Merged: {data.prCountMerged}  {PullRequestBarLink('merged')(data.prCountMerged, values, metadata) }</div>
            <div style={style}>Declined: {data.prCountDeclined}  {PullRequestBarLink('declined')(data.prCountDeclined, values, metadata) }</div>
        </div>
    );
}

function PullRequestBarLink(state: string) {
    const transform = pullRequestLink(state);
    return (data, values, metadata) => {
        return ProgressBarLink(data, values, metadata, transform);
    };
}

function BuildStatusFormatter(buildStatus: BuildStatus, values, metadata) {
    if (buildStatus === null) {
        return LOADING;
    }

    if (buildStatus.values.length === 0) {
        return <span>-</span>;
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
            <B.Icon iconClassName={iconClassName} color={color} />
        </B.ModalTriggerLink>
    );
}

function SonarForBitbucketMetricFormatter(sonarStatus: SonarStatus, branchInfo: BranchInfo, metadata) {
    if (sonarStatus === null) {
        return LOADING;
    }

    const items = sonarStatus.values.map(x => {
        const fromKeys = Object.keys(x.from.statistics);
        const toKeys = Object.keys(x.to.statistics);
        const keys = _.union(fromKeys, toKeys).filter(x => x !== 'componentId');

        const style = {
            fontSize: 11
        };

        const item = <div key={x.pullRequestId}>
            <h3><a href={pullRequestDetailLink(branchInfo.project, branchInfo.repo, x.pullRequestId) }>pull request #{x.pullRequestId}</a></h3>
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
        return <span>-</span>;
    }
    return <div>{items}</div>;
}

function _toSonarDisplayName(key: string): string {
    // see http://docs.sonarqube.org/display/SONARQUBE43/Metric+definitions
    switch (key) {
        case 'lines':
            return 'Dupl. lines';

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


function SonarQubeMetricsFormatter(settings: Settings) {
    return (metrics: SonarQubeMetrics, branchInfo: BranchInfo, metadata) => {
        if (metrics === null) {
            return LOADING;
        }
        if (metrics.err_code === 404) {
            return <span>-</span>;
        }

        const style = {
            fontSize: 11
        };

        return <div>
            <h3><a href={`${settings.sonarStatusResolver.baseUrl}/dashboard/index/${metrics.id}`} target='_blank'>{metrics.name}</a></h3>
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

// transformer
function projectLink(data, values: BranchInfo) {
    return `/stash/projects/${values.project}`;
}

function repoLink(data, values: BranchInfo) {
    return `/stash/projects/${values.project}/repos/${values.repo}`;
}

function branchLink(data, values: BranchInfo) {
    return `/stash/projects/${values.project}/repos/${values.repo}/browse?at=${values.branch}`;
}

function commitLink(data, values: BranchInfo) {
    return `/stash/projects/${values.project}/repos/${values.repo}/commits/${values.latestCommitHash}`;
}

function pullRequestLink(state: string) {
    return (data, values) => {
        return `/stash/projects/${values.project}/repos/${values.repo}/pull-requests?state=${state}`;
    };
}

function pullRequestDetailLink(project, repo, pullRequestId: number) {
    return `/stash/projects/${project}/repos/${repo}/pull-requests/${pullRequestId}/overview`;
}