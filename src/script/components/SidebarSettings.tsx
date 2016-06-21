import * as React from 'react';
import * as B from '../bulma';
import * as API from '../webapis';
import SearchBox, { SelectOption } from './SearchBox';
import SelectColumnsBox from './SelectColumnsBox';
import { Settings } from '../Settings';

import { FilterState } from '../reducers';

const Sidebar = require('react-sidebar').default;

export type SelectOption = SelectOption;

interface Props {
    settings: Settings;
    data: API.BranchInfo[];

    filter: FilterState;
    onFilterChange: (key: string, filter: FilterState) => void;

    onColumnChange: (settings: Settings) => void;

    open: boolean;
    onClose: (e: React.SyntheticEvent) => void;
}

export class SidebarSettings extends React.Component<Props, void> {
    render() {
        const {
            settings,
            data,
            filter,
            onFilterChange,
            onColumnChange,
            open,
            onClose
        } = this.props;

        const sidebarStyle = {
            width: 350,
            background: '#f5f7fa',
            paddingTop: 15,
            paddingBottom: 15
        };
        const headStyle = {
            marginBottom: 10,
            marginLeft: 5
        };
        const separatorStartStyle = {
            marginTop: 5
        };
        const separatorEndStyle = {
            marginBottom: 5
        };

        const hasData = data && data.length > 0;

        const sidebarContent = (
            <div>
                <section className='hero is-info is-bold'>
                    <nav className='nav'>
                        <div className='container is-fluid'>
                            <div className='nav-left'>
                                <p className='nav-item title'>
                                    Settings
                                </p>
                            </div>
                            <div className='nav-right'>
                                <a className='nav-item title' onClick={onClose}>
                                    <B.Icon iconClassName='fa fa-angle-double-left' />
                                </a>
                            </div>
                        </div>
                    </nav>
                </section>
                { hasData &&
                    <B.Section style={sidebarStyle}>
                        <div className='heading' style={headStyle}>
                            <h2 className="subtitle">
                                Filters
                            </h2>
                        </div>
                        <hr style={separatorStartStyle} />
                        <SearchBox
                            data={data}
                            onChange={onFilterChange}
                            filter={filter}
                            />
                        <hr style={separatorEndStyle} />
                    </B.Section>
                }
                <B.Section style={sidebarStyle}>
                    <div className='heading' style={headStyle}>
                        <h2 className="subtitle">
                            Columns
                        </h2>
                    </div>
                    <hr style={separatorStartStyle} />
                    <SelectColumnsBox
                        settings={settings}
                        onChange={onColumnChange}
                        />
                    <hr style={separatorEndStyle} />
                </B.Section>
            </div>
        );
        return (
            <Sidebar sidebar={sidebarContent} docked={open}>
                {this.props.children}
            </Sidebar>
        );
    }
}