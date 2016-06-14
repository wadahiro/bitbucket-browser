// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
let configureStore;
if (process.env.NODE_ENV === 'production') {
    configureStore = require('./configureStore.prod');
} else {
    configureStore = require('./configureStore.dev');
}
export default configureStore.default;