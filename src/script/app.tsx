import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import configureStore from './store/configureStore';
import BrowserView from './views/BrowserView';
import DevTools from './components/DevTools';

require('whatwg-fetch');

class App extends React.Component<any, any> {
    render() {
        return <BrowserView  />;
    }
}

const store = configureStore();

let root;
if (process.env.NODE_ENV === 'production') {
    root = <App />;
} else {
    root = <div>
        <App />
        <DevTools />
    </div>;
}


ReactDOM.render(
    <Provider store={store}>
        {root}
    </Provider>,
    document.getElementById('app')
);
