import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import * as B from '../bulma';
import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from '../BitbucketApi';
import * as SQAPI from '../SonarQubeApi';
import BitbucketTable from '../BitbucketTable';
import Spinner from '../Spinner';
import { Settings } from '../Settings';
import { SonarQubeLoginModal } from '../components/SonarQubeLoginModal';
import { SidebarFilter, SelectOption } from '../components/SidebarFilter';

interface Props {
    settings: Settings;
}

interface State {
    settings?: Settings;
    loading?: boolean;

    sonarQubeAuthenticated?: boolean;

    branchInfosLoaded?: boolean;
    branchInfos?: BranchInfo[];

    projectIncludes?: string;
    projectExcludes?: string;
    repoIncludes?: string;
    repoExcludes?: string;
    branchIncludes?: string;
    branchExcludes?: string;
    branchAuthorIncludes?: string;
    branchAuthorExcludes?: string;

    resultsPerPage?: number;
    sidebarFilterOpened?: boolean;
}

export default class BrowserView extends React.Component<Props, State> {

    state: State = {
        settings: null,
        loading: false,

        sonarQubeAuthenticated: true,

        branchInfosLoaded: false,
        branchInfos: [],

        projectIncludes: '',
        projectExcludes: '',
        repoIncludes: '',
        repoExcludes: '',
        branchIncludes: '',
        branchExcludes: '',
        branchAuthorIncludes: '',
        branchAuthorExcludes: '',

        resultsPerPage: 5,
        sidebarFilterOpened: false
    };

    componentDidMount() {
        this.loadSettings()
            .then(x => {
                this.setState({
                    settings: x
                }, async () => {

                    let params: any = {};
                    if (window.location.hash) {
                        const param = decodeURIComponent(window.location.hash);
                        params = param.substring(1).split('&');
                        params = _.reduce<string, {}>(params, (s, p) => {
                            const pair = p.split('=');
                            s[pair[0]] = pair[1];
                            return s;
                        }, {});
                    }
                    let projectIncludes = params['projectIncludes'] ? params['projectIncludes'] : '';
                    let repoIncludes = params['repoIncludes'] ? params['repoIncludes'] : '';
                    let branchIncludes = params['branchIncludes'] ? params['branchIncludes'] : '';
                    let branchAuthorIncludes = params['branchAuthorIncludes'] ? params['branchAuthorIncludes'] : '';

                    let projectExcludes = params['projectExcludes'] ? params['projectExcludes'] : '';
                    let repoExcludes = params['repoExcludes'] ? params['repoExcludes'] : '';
                    let branchExcludes = params['branchExcludes'] ? params['branchExcludes'] : '';
                    let branchAuthorExcludes = params['branchAuthorExcludes'] ? params['branchAuthorExcludes'] : '';

                    const bitbucketAuthenticated = await isAuthenticated();
                    const sonarQubeAuthenticated = await SQAPI.isAuthenticated(x);

                    if (!bitbucketAuthenticated) {
                        // Redirect to Bitbucket Login page
                        location.href = `/stash/login?next=/stash-browser${encodeURIComponent(location.hash)}`;
                    } else {
                        this.setState({
                            sonarQubeAuthenticated,
                            projectIncludes,
                            repoIncludes,
                            branchIncludes,
                            branchAuthorIncludes,
                            projectExcludes,
                            repoExcludes,
                            branchExcludes,
                            branchAuthorExcludes
                        }, () => {
                            this.loadBranchInfos();
                        });
                    }
                });
            })
            .catch(e => {
                console.error('initialize error.', e.stack);
            });
    }

    loadSettings = async (): Promise<Settings> => {
        const response = await fetch('./settings.json', {
            headers: {
                'Accept': 'application/json'
            }
        });
        const settings: Settings = await response.json();
        document.title = settings.title;

        return Promise.resolve(settings);
    };

    onChange = (key: string, values: SelectOption[]) => {
        this.setState({
            [key]: values ? values.map(x => x.value).join(',') : ''
        }, () => {
            const saveFilters = [];
            appendFilter(saveFilters, this.state, 'projectIncludes');
            appendFilter(saveFilters, this.state, 'projectExcludes');
            appendFilter(saveFilters, this.state, 'repoIncludes');
            appendFilter(saveFilters, this.state, 'repoExcludes');
            appendFilter(saveFilters, this.state, 'branchIncludes');
            appendFilter(saveFilters, this.state, 'branchExcludes');
            appendFilter(saveFilters, this.state, 'branchAuthorIncludes');
            appendFilter(saveFilters, this.state, 'branchAuthorExcludes');
            window.location.hash = saveFilters.join('&');
        });
    };

    handleSonarQubeAuthenticated = () => {
        this.setState({
            sonarQubeAuthenticated: true
        }, () => {
            const { settings } = this.state;

            const newBranchInfos = this.state.branchInfos.map(x => {
                x.sonarQubeMetrics = new B.LazyFetch<SQAPI.SonarQubeMetrics>(() => {
                    return SQAPI.fetchMetricsByKey(settings, x.repo, x.branch);
                });
                return x;
            });

            this.setState({
                branchInfos: newBranchInfos
            });
        });
    };

    loadBranchInfos = () => {
        this.setState({
            loading: true,
            branchInfos: []
        }, async () => {
            const { settings } = this.state;

            const resolveLazyFetch = (branchInfoOfSomeProjects: BranchInfo[]) => {
                // important! share fetch instance
                const fetchPrCount = new B.LazyFetch<PullRequestCount>(() => {
                    return fetchPullRequests(branchInfoOfSomeProjects[0]);
                });

                const newBranchInfos = branchInfoOfSomeProjects.map(x => {
                    x.pullRequestStatus = fetchPrCount;
                    x.sonarQubeMetrics = new B.LazyFetch<SQAPI.SonarQubeMetrics>(() => {
                        return SQAPI.fetchMetricsByKey(settings, x.repo, x.branch);
                    });
                    return x;
                });
                return newBranchInfos;
            };

            const repos = await fetchAllRepos();
            const branchInfosPromises = await fetchBranchInfos(settings, repos);

            const finished = _.chunk(branchInfosPromises, 6).map(async (x) => {
                const results = await Promise.all<BranchInfo[]>(x);
                const branchInfos = _.flatten(results);
                this.setState({
                    branchInfos: this.state.branchInfos.concat(resolveLazyFetch(branchInfos))
                });
                return true;
            });

            Promise.all(finished)
                .then(x => {
                    this.setState({
                        loading: false
                    });
                });
        });
    };

    handlePullRequestCount = (fetch: B.LazyFetch<PullRequestCount>, branchInfo: BranchInfo) => {
        // console.log('handlePullRequestCount', branchInfo.pullRequestStatus)
        if (branchInfo.pullRequestStatus === null) {
            return;
        }

        fetch.fetch()
            .then(prCount => {
                const { pullRequestIds, from, to, merged, declined } = prCount;

                const updatedRows = this.state.branchInfos.map(targetBranchInfo => {
                    if (targetBranchInfo.id === branchInfo.id) {

                        // Update pull request count against branchInfos of args
                        targetBranchInfo.pullRequestStatus = {
                            prCountSource: from[targetBranchInfo.ref] ? from[targetBranchInfo.ref] : 0,
                            prCountTarget: to[targetBranchInfo.ref] ? to[targetBranchInfo.ref] : 0,
                            prCountMerged: merged[targetBranchInfo.ref] ? merged[targetBranchInfo.ref] : 0,
                            prCountDeclined: declined[targetBranchInfo.ref] ? declined[targetBranchInfo.ref] : 0,
                            prIds: pullRequestIds[targetBranchInfo.ref] ? pullRequestIds[targetBranchInfo.ref] : []
                        };

                        // lazy fetch dependents
                        if (!targetBranchInfo.buildStatus) {
                            let buildStatus;
                            if (targetBranchInfo.latestCommitHash === '') {
                                targetBranchInfo.buildStatus = {
                                    commitHash: '',
                                    values: []
                                };
                            } else {
                                const fetch = new B.LazyFetch<BuildStatus>(() => {
                                    return fetchBuildStatus(targetBranchInfo.latestCommitHash);
                                });
                                targetBranchInfo.buildStatus = fetch;
                            }
                        }
                        if (!targetBranchInfo.sonarStatus) {
                            let sonarStatus;
                            const pullRequestStatus = targetBranchInfo.pullRequestStatus as PullRequestStatus;
                            if (pullRequestStatus.prIds.length === 0) {
                                targetBranchInfo.sonarStatus = {
                                    repoId: branchInfo.repoId,
                                    values: []
                                };
                            } else {
                                const fetch = new B.LazyFetch<SonarStatus>(() => {
                                    return fetchSonarStatus(targetBranchInfo.repoId, pullRequestStatus.prIds);
                                });
                                targetBranchInfo.sonarStatus = fetch;
                            }
                        }
                    }
                    return targetBranchInfo;
                });

                this.setState({
                    branchInfos: updatedRows
                });
            });

        const updatedRows = this.state.branchInfos.map(x => {
            if (x.id === branchInfo.id) {
                x.pullRequestStatus = null;
            }
            return x;
        });
        this.setState({
            branchInfos: updatedRows
        });
    };

    handleBuildStatus = (fetch: B.LazyFetch<BuildStatus>, branchInfo: BranchInfo) => {
        // console.log('handleBuildStatus', branchInfo.buildStatus)
        if (branchInfo.buildStatus === null) {
            return;
        }

        const updateRow = (buildStatus) => {
            const updatedRows = this.state.branchInfos.map(x => {
                if (x.id === branchInfo.id) {
                    x.buildStatus = buildStatus;
                }
                return x;
            });
            this.setState({
                branchInfos: updatedRows
            });
        };

        fetch.fetch()
            .then(buildStatus => {
                updateRow(buildStatus);
            });

        updateRow(null);
    };

    handleSonarStatus = (fetch: B.LazyFetch<SonarStatus>, branchInfo: BranchInfo) => {
        // console.log('handleSonarStatus', branchInfo.sonarStatus)
        if (branchInfo.sonarStatus === null) {
            return;
        }

        const updateRow = (sonarStatus) => {
            const updatedRows = this.state.branchInfos.map(x => {
                if (x.id === branchInfo.id) {
                    x.sonarStatus = sonarStatus;
                }
                return x;
            });
            this.setState({
                branchInfos: updatedRows
            });
        };
        if (branchInfo.sonarStatus !== null) {
            fetch.fetch()
                .then(sonarStatus => {
                    // console.log('handleSonarStatus end')
                    updateRow(sonarStatus);
                });
        }

        updateRow(null);
    };

    handleSonarQubeMetrics = (fetch: B.LazyFetch<SQAPI.SonarQubeMetrics>, branchInfo: BranchInfo) => {
        // console.log('handleSonarQubeMetrics', branchInfo.sonarQubeMetrics)
        if (branchInfo.sonarQubeMetrics === null) {
            return;
        }

        const updateRow = (sonarQubeMetrics: SQAPI.SonarQubeMetrics) => {
            const updatedRows = this.state.branchInfos.map(x => {
                if (x.id === branchInfo.id) {
                    x.sonarQubeMetrics = sonarQubeMetrics;
                }
                return x;
            });
            this.setState({
                branchInfos: updatedRows
            });
        };

        if (this.state.sonarQubeAuthenticated) {
            fetch.fetch()
                .then(sonarQubeMetrics => {
                    // console.log('handleSonarQubeMetrics end')
                    updateRow(sonarQubeMetrics);
                });
            updateRow(null);

        } else {
            updateRow({
                err_code: 401,
                err_msg: 'Unauthorized'
            });
        }
    };

    handleToggleSidebar = (e: React.SyntheticEvent) => {
        this.setState({
            sidebarFilterOpened: !this.state.sidebarFilterOpened
        });
    };

    render() {
        const { settings,
            branchInfos, loading, branchInfosLoaded,
            projectIncludes, projectExcludes,
            repoIncludes, repoExcludes,
            branchIncludes, branchExcludes, branchAuthorIncludes, branchAuthorExcludes,
            resultsPerPage, sidebarFilterOpened } = this.state;

        const filteredBranchInfos = filterBranchInfo(branchInfos,
            toArray(projectIncludes), toArray(projectExcludes),
            toArray(repoIncludes), toArray(repoExcludes),
            toArray(branchIncludes), toArray(branchExcludes),
            toArray(branchAuthorIncludes), toArray(branchAuthorExcludes));

        const leftNav = [
            {
                name: 'home',
                label: settings ? settings.title : '',
                link: '/'
            }
        ];

        return (
            <SidebarFilter
                data={branchInfos}
                onChange={this.onChange}
                projectIncludes={projectIncludes}
                repoIncludes={repoIncludes}
                branchIncludes={branchIncludes}
                branchAuthorIncludes={branchAuthorIncludes}
                projectExcludes={projectExcludes}
                repoExcludes={repoExcludes}
                branchExcludes={branchExcludes}
                branchAuthorExcludes={branchAuthorExcludes}
                onClose={this.handleToggleSidebar}
                open={sidebarFilterOpened}
                >
                <div>
                    <section className='hero is-info is-left is-bold'>
                        <nav className='nav'>
                            <div className='container is-fluid'>
                                <div className='nav-left'>
                                    { !sidebarFilterOpened &&
                                        <p className='nav-item'>
                                            <a onClick={this.handleToggleSidebar}>
                                                <B.Icon iconClassName='fa fa-angle-double-right' color={'white'} />
                                            </a>
                                        </p>
                                    }
                                    <p className='nav-item title'>
                                        {settings && settings.title}
                                        &nbsp;
                                        {loading &&
                                            <B.Loading />
                                        }
                                    </p>
                                </div>

                                <span className='nav-toggle'>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>

                                <div className='nav-right nav-menu'>
                                    <span className='nav-item'>
                                        <a className='button is-success' onClick={this.loadBranchInfos} disabled={loading}>Reload</a>
                                    </span>
                                </div>
                            </div>
                        </nav>
                    </section>

                    <B.Section>
                        <B.Container isFluid>
                            {
                                settings &&
                                <div className='branch-table' style={{ padding: '0px 10px 0px 10px' }}>
                                    <BitbucketTable
                                        settings={settings}
                                        showFilter={true}
                                        results={filteredBranchInfos}
                                        resultsPerPage={resultsPerPage}
                                        handlePullRequestCount={this.handlePullRequestCount}
                                        handleBuildStatus={this.handleBuildStatus}
                                        handleSonarStatus={this.handleSonarStatus}
                                        handleSonarQubeMetrics={this.handleSonarQubeMetrics}
                                        handleSonarQubeAuthenticated={this.handleSonarQubeAuthenticated}
                                        />
                                </div>
                            }
                        </B.Container>
                    </B.Section>

                    <B.Footer>
                        <p>
                            <strong>{settings && settings.title}</strong>.The source code is licensed <a href='http://opensource.org/licenses/mit-license.php'>MIT</a>.
                        </p>
                    </B.Footer>
                </div >
            </SidebarFilter>
        );
    }
}

function toArray(str: string): string[] {
    if (!str || str === '') {
        return [];
    }
    return str.split(',');
}

function appendFilter(strArray, state, key) {
    if (state[key] !== '') {
        strArray.push(`${key}=${state[key]}`);
    }
}

function filterBranchInfo(data: BranchInfo[],
    projectIncludes: string[], projectExcludes: string[],
    repoIncludes: string[], repoExcludes: string[],
    branchIncludes: string[], branchExcludes: string[],
    branchAuthorIncludes: string[], branchAuthorExcludes: string[]) {

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

const RIGHT_NAV = [
    {
        name: 'reload',
        label: 'Reload',
        type: 'button'
    }
];
