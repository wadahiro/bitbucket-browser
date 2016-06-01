import * as React from 'react';

import * as B from '../bulma';
import { Settings } from '../Settings';

interface Props {
    settings: Settings;
    versionInfo?: {
        version: string;
        commitHash: string;
    };
}

export const Footer = (props: Props) => {
    const { settings, versionInfo } = props;

    return (
        <B.Footer>
            <p>
                <strong>{settings && settings.title}</strong> by <a href='https://github.com/wadahiro'> @wadahiro</a>.The source code is licensed <a href='http://opensource.org/licenses/mit-license.php'>MIT</a>.
            </p>
            { versionInfo &&
                <p>
                    Version {versionInfo.version} ({versionInfo.commitHash}).
                </p>
            }
            <p>
                <a className='icon' href='https://github.com/wadahiro/bitbucket-browser'>
                    <i className='fa fa-github'></i>
                </a>
            </p>
        </B.Footer>
    );
};