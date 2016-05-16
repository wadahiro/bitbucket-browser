import * as React from 'react';
import * as _ from 'lodash';
const Select = require('react-select');

import * as B from '../bulma';
import { BranchInfo } from '../BitbucketApi';

interface Props extends React.Props<SearchBox> {
    defaultProjectIncludes?: string;
    defaultRepoIncludes?: string;
    defaultBranchIncludes?: string;
    defaultBranchAuthorIncludes?: string;

    defaultProjectExcludes?: string;
    defaultRepoExcludes?: string;
    defaultBranchExcludes?: string;
    defaultBranchAuthorExcludes?: string;

    data: BranchInfo[];
    onChange: Function;
}

export default class SearchBox extends React.Component<Props, any> {

    state = {
        defaultProjectIncludes: this.props.defaultProjectIncludes,
        defaultProjectExcludes: this.props.defaultProjectExcludes,
        defaultRepoIncludes: this.props.defaultRepoIncludes,
        defaultRepoExcludes: this.props.defaultRepoExcludes,
        defaultBranchIncludes: this.props.defaultBranchIncludes,
        defaultBranchExcludes: this.props.defaultBranchExcludes,
        defaultBranchAuthorIncludes: this.props.defaultBranchAuthorIncludes,
        defaultBranchAuthorExcludes: this.props.defaultBranchAuthorExcludes
    }

    onChange = (key, values, current) => {
        this.props.onChange(key, values);
    }

    render() {
        const { data } = this.props;
        const { defaultProjectIncludes, defaultRepoIncludes, defaultBranchIncludes, defaultBranchAuthorIncludes,
            defaultProjectExcludes, defaultRepoExcludes, defaultBranchExcludes, defaultBranchAuthorExcludes } = this.props;

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
                        <Select name='projectIncludes' placeholder={includes} value={defaultProjectIncludes} options={projectOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'projectIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='projectExcludes' placeholder={excludes} value={defaultProjectExcludes} options={projectOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'projectExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Repository</label>
                    <div style={selectStyle}>
                        <Select name='repoIncludes' placeholder={includes} value={defaultRepoIncludes} options={repoOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'repoIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='repoExcludes' placeholder={excludes} value={defaultRepoExcludes} options={repoOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'repoExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Branch</label>
                    <div style={selectStyle}>
                        <Select name='branchIncludes' placeholder={includes} value={defaultBranchIncludes} options={branchOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='branchExcludes' placeholder={excludes} value={defaultBranchExcludes} options={branchOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchExcludes') } />
                    </div>
                </div>
                <hr />
                <div style={style}>
                    <label className='control-label'>Branch Author</label>
                    <div style={selectStyle}>
                        <Select name='branchAuthorIncludes' placeholder={includes} value={defaultBranchAuthorIncludes} options={branchAuthorOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchAuthorIncludes') } />
                    </div>
                    <div style={selectStyle}>
                        <Select name='branchAuthorExcludes' placeholder={excludes} value={defaultBranchAuthorExcludes} options={branchAuthorOptions} multi={true} allowCreate={true} onChange={this.onChange.bind(null, 'branchAuthorExcludes') } />
                    </div>
                </div>
            </div>
        );
    }
}
