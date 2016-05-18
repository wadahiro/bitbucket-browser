import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import * as _ from 'lodash';

import * as Actions from './actions';
import reducers from './reducers'
import rootSaga from './sagas'

import * as B from './bulma';
import { PullRequestCount, PullRequestStatus, BranchInfo, BuildStatus, SonarStatus,
    isAuthenticated, fetchAllRepos, fetchBranchInfos, fetchPullRequests, fetchBuildStatus, fetchSonarStatus } from './BitbucketApi';
import * as SQAPI from './SonarQubeApi';
import BitbucketTable from './BitbucketTable';
import Spinner from './Spinner';
import { Settings } from './Settings';
import { SonarQubeLoginModal } from './components/SonarQubeLoginModal';
import { SidebarFilter, SelectOption } from './components/SidebarFilter';
import BrowserView from './views/BrowserView';

// require('babel-polyfill');
require('whatwg-fetch');

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducers,
    applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(rootSaga);


class App extends React.Component<any, any> {

    componentDidMount() {
        // this.loadSettings()
        //     .then(x => {
        //         this.setState({
        //             settings: x
        //         });
        // this.setState({
        //     settings: x
        // }, async () => {

        //     let params: any = {};
        //     if (window.location.hash) {
        //         const param = decodeURIComponent(window.location.hash);
        //         params = param.substring(1).split('&');
        //         params = _.reduce<string, {}>(params, (s, p) => {
        //             const pair = p.split('=');
        //             s[pair[0]] = pair[1];
        //             return s;
        //         }, {});
        //     }
        //     let projectIncludes = params['projectIncludes'] ? params['projectIncludes'] : '';
        //     let repoIncludes = params['repoIncludes'] ? params['repoIncludes'] : '';
        //     let branchIncludes = params['branchIncludes'] ? params['branchIncludes'] : '';
        //     let branchAuthorIncludes = params['branchAuthorIncludes'] ? params['branchAuthorIncludes'] : '';

        //     let projectExcludes = params['projectExcludes'] ? params['projectExcludes'] : '';
        //     let repoExcludes = params['repoExcludes'] ? params['repoExcludes'] : '';
        //     let branchExcludes = params['branchExcludes'] ? params['branchExcludes'] : '';
        //     let branchAuthorExcludes = params['branchAuthorExcludes'] ? params['branchAuthorExcludes'] : '';

        //     const bitbucketAuthenticated = await isAuthenticated();
        //     const sonarQubeAuthenticated = await SQAPI.isAuthenticated(x);

        //     if (!bitbucketAuthenticated) {
        //         // Redirect to Bitbucket Login page
        //         location.href = `/stash/login?next=/stash-browser${encodeURIComponent(location.hash)}`;
        //     } else {
        //         this.setState({
        //             sonarQubeAuthenticated,
        //             projectIncludes,
        //             repoIncludes,
        //             branchIncludes,
        //             branchAuthorIncludes,
        //             projectExcludes,
        //             repoExcludes,
        //             branchExcludes,
        //             branchAuthorExcludes
        //         }, () => {
        //             // this.loadBranchInfos();
        //         });
        //     }
        // });
        // })
        // .catch(e => {
        //     console.error('initialize error.', e.stack);
        // });
    }

    render() {
        return <BrowserView  />;
    }
}

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('app'));
