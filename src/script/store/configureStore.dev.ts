import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import rootReducer from '../reducers';
import rootSaga from '../sagas'
import DevTools from '../components/DevTools';

const sagaMiddleware = createSagaMiddleware();

const enhancer = compose(
    // Middleware you want to use in development:
    applyMiddleware(sagaMiddleware),
    // Required! Enable Redux DevTools with the monitors you chose
    // DevTools.instrument()
    window['devToolsExtension'] ? window['devToolsExtension']() : f => f
);

export default function configureStore(initialState) {
    // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
    // See https://github.com/rackt/redux/releases/tag/v3.1.0
    const store = createStore(rootReducer, initialState, enhancer);
    sagaMiddleware.run(rootSaga);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module['hot']) {
        module['hot'].accept('../reducers', () =>
            store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
        );
    }

    return store;
}
