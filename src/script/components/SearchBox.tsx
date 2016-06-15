import * as React from 'react';
import * as _ from 'lodash';
const Select = require('react-select');

import * as B from '../bulma';
import * as API from '../webapis';
import { FilterState } from '../reducers';

export interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    filter: FilterState;
    data: API.BranchInfo[];
    onChange: (key: string, filer: FilterState) => void;
}

export default class SearchBox extends React.Component<Props, void> {

    // If upgrading react-select to 1.0.0, need to change this arguments and logic
    // https://github.com/JedWatson/react-select/blob/master/CHANGES.md
    onChange = (key, values: string) => {
        const filter = Object.assign({}, this.props.filter, {
            [key]: values && values !== '' ? values.split(',') : []
        });
        this.props.onChange(key, filter);
    };

    render() {
        const { data } = this.props;
        const { filter } = this.props;

        const options = _.reduce<any, any>(data, (s, x) => {
            s.project.push(x.project);
            s.repo.push(x.repo);
            s.branch.push(x.branch);
            s.branchAuthor.push(x.branchAuthor);
            return s;
        }, {
                project: [],
                repo: [],
                branch: [],
                branchAuthor: []
            });

        const projectOptions = _.chain<string[]>(options.project).uniq().map(x => { return { value: x, label: x } }).value();
        const repoOptions = _.chain<string[]>(options.repo).uniq().map(x => { return { value: x, label: x } }).value();
        const branchOptions = _.chain<string[]>(options.branch).uniq().map(x => { return { value: x, label: x } }).value();
        const branchAuthorOptions = _.chain<string[]>(options.branchAuthor).uniq().map(x => { return { value: x, label: x } }).value();

        const style = {
            padding: '0px 10px 0px 10px'
        };

        const selectStyle = {
            padding: '5px 0px 5px 0px'
        };

        const includes = 'Includes...';
        const excludes = 'Excludes...';

        return (
            <div>
                <div style={style}>
                    <label className='control-label'>Project</label>
                    <div style={selectStyle}>
                        <Select name='projectIncludes' placeholder={includes} value={filter.projectIncludes} options={projectOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'projectIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='projectExcludes' placeholder={excludes} value={filter.projectExcludes} options={projectOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'projectExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Repository</label>
                    <div style={selectStyle}>
                        <Select name='repoIncludes' placeholder={includes} value={filter.repoIncludes} options={repoOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'repoIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='repoExcludes' placeholder={excludes} value={filter.repoExcludes} options={repoOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'repoExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Branch</label>
                    <div style={selectStyle}>
                        <Select name='branchIncludes' placeholder={includes} value={filter.branchIncludes} options={branchOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='branchExcludes' placeholder={excludes} value={filter.branchExcludes} options={branchOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Branch Author</label>
                    <div style={selectStyle}>
                        <Select name='branchAuthorIncludes' placeholder={includes} value={filter.branchAuthorIncludes} options={branchAuthorOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchAuthorIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='branchAuthorExcludes' placeholder={excludes} value={filter.branchAuthorExcludes} options={branchAuthorOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchAuthorExcludes') } />
                    </div>
                </div>
            </div>
        );
    }
}
