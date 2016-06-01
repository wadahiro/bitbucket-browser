import * as React from 'react';
import * as B from '../bulma';
import * as API from '../webapis';
import SearchBox, { SelectOption } from './SearchBox';
import { FilterState } from '../reducers';

const Sidebar = require('react-sidebar').default;

export type SelectOption = SelectOption;

interface Props {
    data: API.BranchInfo[];

    filter: FilterState;

    onChange: (key: string, filter: FilterState) => void;
    open: boolean;
    onClose: (e: React.SyntheticEvent) => void;
}

export class SidebarFilter extends React.Component<Props, void> {
    render() {
        const { data,
            filter,
            onChange,
            open,
            onClose
        } = this.props;

        const sidebarStyle = {
            width: 300,
            background: '#f5f7fa'
        };

        const hasData = data && data.length > 0;

        const sidebarContent = (
            <div>
                <section className='hero is-info is-bold'>
                    <nav className='nav'>
                        <div className='container is-fluid'>
                            <div className='nav-left'>
                                <p className='nav-item title'>
                                    Filters
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
                <B.Section style={sidebarStyle}>
                    { hasData &&
                        <SearchBox
                            data={data}
                            onChange={onChange}
                            filter={filter}
                            />
                    }
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