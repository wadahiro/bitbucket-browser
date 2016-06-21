import * as React from 'react';
import * as B from '../bulma';
import * as API from '../webapis';
import SearchBox, { SelectOption } from './SearchBox';
import SelectResultsPerPageBox from './SelectResultsPerPageBox';
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

    onSettingsChange: (settings: Settings) => void;

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
            onSettingsChange,
            open,
            onClose
        } = this.props;

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

                <SettingSection title='Filters'>
                    { hasData &&
                        <SearchBox
                            data={data}
                            onChange={onFilterChange}
                            filter={filter}
                            />
                    }
                </SettingSection>

                <SettingSection title='Results per page'>
                    <SelectResultsPerPageBox
                        settings={settings}
                        onChange={onSettingsChange}
                        />
                </SettingSection>

                <SettingSection title='Columns'>
                    <SelectColumnsBox
                        settings={settings}
                        onChange={onSettingsChange}
                        />
                </SettingSection>
            </div>
        );
        return (
            <Sidebar sidebar={sidebarContent} docked={open}>
                {this.props.children}
            </Sidebar>
        );
    }
}

// Utility

const sidebarStyle = {
    width: 350,
    background: '#f5f7fa',
    padding: '15px 0px'
};
const headStyle = {
    marginBottom: 10,
    marginLeft: 5
};
const contenStyle = {
    padding: '0px 10px'
};
const separatorStartStyle = {
    marginTop: 5
};
const separatorEndStyle = {
    marginBottom: 5
};

function SettingSection(props): JSX.Element {
    return <B.Section style={sidebarStyle}>
        <div className='heading' style={headStyle}>
            <h2 className="subtitle">
                {props.title}
            </h2>
        </div>
        <hr style={separatorStartStyle} />
        <div style={contenStyle}>
            {props.children}
        </div>
    </B.Section>
}