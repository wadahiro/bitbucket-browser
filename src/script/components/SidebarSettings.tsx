import * as React from 'react';
import * as B from '../bulma';
import * as API from '../webapis';
import SearchBox, { SelectOption } from './SearchBox';
import SelectResultsPerPageBox from './SelectResultsPerPageBox';
import SelectColumnsBox from './SelectColumnsBox';
import { Settings } from '../Settings';

const Sidebar = require('react-sidebar').default;

export type SelectOption = SelectOption;

interface Props {
    settings: Settings;
    data: API.BranchInfo[];

    onSettingsChange: (settings: Settings) => void;

    onClose: (e: React.SyntheticEvent) => void;
}

export class SidebarSettings extends React.Component<Props, void> {
    render() {
        const {
            settings,
            data,
            onSettingsChange,
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

                <SettingSection title='Filters' initialOpened={true}>
                    { hasData ?
                        <SearchBox
                            settings={settings}
                            data={data}
                            onChange={onSettingsChange}
                            />
                        :
                        <B.Loading />
                    }
                </SettingSection>

                <SettingSection title='Results per page' initialOpened={true}>
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
            <Sidebar sidebar={sidebarContent} docked={settings.show}>
                {this.props.children}
            </Sidebar>
        );
    }
}

// Utility

const cardStyle = {
    width: 350,
    padding: '0px 0px 0px 0px'
};
const cardHeaderStyle = {
    background: '#f5f7fa',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0
};
const cardContentStyle = {
    padding: '10px 10px'
};
interface SectionProps {
    initialOpened?: boolean;
    title: string;
}
interface SectionState {
    opened: boolean;
}

class SettingSection extends React.Component<SectionProps, SectionState> {
    state = {
        opened: this.props.initialOpened || false
    };

    handleToggel = (e: React.SyntheticEvent) => {
        this.setState({
            opened: !this.state.opened
        });
    };

    render() {
        const icon = this.state.opened ? 'fa fa-angle-down' : 'fa fa-angle-right';

        return <B.Card isFullWidth style={cardStyle}>
            <B.CardHeader title={this.props.title} style={cardHeaderStyle} iconClassName={icon} onToggle={this.handleToggel} />
            { this.state.opened &&
                <B.CardContent style={cardContentStyle}>
                    {this.props.children}
                </B.CardContent>
            }
        </B.Card>
    }
}