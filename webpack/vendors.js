require('lodash');
require('react');
require('react-dom');
require('react-redux');
require('redux');
require('redux-saga');
require('redux-saga/effects');
require('react-select');
require('react-sidebar');
require('whatwg-fetch');

// for dev
if (process.env.NODE_ENV !== 'production') {
    require('webpack-dev-server/client');
    // require('webpack/hot/only-dev-server');
    require('react-hot-loader');
    require('redux-devtools');
    require('redux-devtools-log-monitor');
    require('redux-devtools-dock-monitor');
}