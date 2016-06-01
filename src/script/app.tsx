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
    render() {
        return <BrowserView  />;
    }
}

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('app'));
