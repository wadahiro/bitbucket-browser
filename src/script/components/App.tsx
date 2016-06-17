import * as React from 'react';

import * as B from '../bulma';
import { Settings } from '../Settings';
import BrowserView from '../views/BrowserView';

let container;
if (process.env.NODE_ENV === 'production') {
    container = <BrowserView  />;
} else {
    const DevTools = require('./DevTools').default;
    container = <div>
        <BrowserView  />
        <DevTools />
    </div>;
}

export default class App extends React.Component<any, any> {
    render() {
        return container;
    }
}