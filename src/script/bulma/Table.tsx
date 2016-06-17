import * as React from 'react';
import { Pagination } from './Pagination'
import { Loading } from './Loading'

export interface TableProps {
    // basic
    tableClassName?: string;
    rowKey: string;
    results: {
        [index: string]: string | number | boolean;
    }[];
    columnMetadata: ColumnMetadata[];

    // sort
    enableSort?: boolean;
    sortColumn?: string;
    sortAscending?: boolean;

    // paging
    showPagination?: boolean;
    pageSize?: number;
    currentPage?: number;

    // layout
    fixed?: boolean;
    borders?: boolean;
    stripes?: boolean;
    narrower?: boolean;
    combine?: boolean;

    // event handlers
    handlePageChanged?: (nextPage: number) => void;
    handleSort?: (nextSortColumn: string) => void;
}

export interface ColumnMetadata {
    name: string;
    label?: string;
    visible?: boolean;
    width?: number | string;
    headerCenter?: boolean;
    sortEnabled?: boolean;
    renderer?: (value: any, values: any, metadata?: ColumnMetadata) => React.ReactElement<any>;
}

const LOADING = <Loading />;

export class Table extends React.Component<TableProps, void> {
    static defaultProps = {
        tableClassName: '',
        fixed: false,
        sortColumn: null,
        sortAscending: true,
        showPagination: false,
        resultsPerPage: 5,
        results: []
    };

    render() {
        const { tableClassName, fixed, results, columnMetadata } = this.props;

        const visibleColumns = columnMetadata.filter(x => x.visible !== false);

        const tableLayout = {} as any;
        if (fixed) {
            tableLayout.tableLayout = 'fixed';
        }

        return (
            <div>
                {this.renderPagination() }
                <table style={tableLayout} className={`table ${tableClassName} ${resolveModifiers(this.props)} `}>
                    <thead>
                        <TR>
                            {this.renderThead(visibleColumns) }
                        </TR>
                    </thead>
                    <tbody>
                        {this.renderBody(visibleColumns) }
                    </tbody>
                </table>
                {this.renderPagination() }
            </div>
        );
    }

    renderThead(visibleColumns: ColumnMetadata[]): JSX.Element[] {
        const { enableSort, sortColumn, sortAscending } = this.props;

        const thead = visibleColumns.map(x => {
            const thStyle = {} as any;
            if (x.width) {
                thStyle.width = x.width;
            }
            if (x.headerCenter) {
                thStyle.textAlign = 'center';
            }
            let sortMark = '';
            if (enableSort && x.sortEnabled !== false && sortColumn === x.name) {
                sortMark = sortAscending ? '▲' : '▼';
            }
            return <th name={x.name} key={x.name} style={thStyle} onClick={this.sort(x) }>{x.label || x.name} {sortMark}</th>;
        });
        return thead;
    }

    sort = (columnMetadata: ColumnMetadata) => (e) => {
        const { enableSort, sortColumn, sortAscending, handleSort } = this.props;

        if (enableSort && handleSort && columnMetadata.sortEnabled !== false) {
            handleSort(columnMetadata.name);
        }
    };

    renderBody(visibleColumns: ColumnMetadata[]): JSX.Element[] {
        const { results, rowKey } = this.props;

        // render
        const body = results.map(x => {
            const tds = visibleColumns.map(col => {
                const tdStyle = {} as any;
                tdStyle.wordBreak = 'break-all';

                const value = getValue(x, col.name);

                // show loading 
                // we use null value as loading state
                if (value === null) {
                    return <TD key={col.name} style={tdStyle}>{LOADING}</TD>;
                }

                // render
                if (col.renderer) {
                    return <TD key={col.name} style={tdStyle}>{col.renderer(value, x, col) }</TD>;
                } else {
                    if (value === undefined) {
                        return <TD key={col.name} style={tdStyle}></TD>;
                    } else {
                        return <TD key={col.name} style={tdStyle}>{value}</TD>;
                    }
                }
            });
            const key = x[rowKey] as string;
            if (!key) {
                console.warn(`No unique key in '${rowKey}'`);
            }
            return <TR key={key}>{tds}</TR>
        });
        return body;
    }

    renderPagination(): JSX.Element {
        const { results, showPagination, pageSize, currentPage } = this.props;

        if (!showPagination) {
            return <div />;
        }

        return <Pagination pageSize={pageSize} currentPage={currentPage} onChange={this.handlePageChanged} />
    }

    handlePageChanged = (newPage: number) => {
        const { handlePageChanged } = this.props;
        handlePageChanged(newPage);
    };
}

function getValue(val: Object, path: string = '') {
    const paths = path.split('.');
    return paths.reduce((s, x) => {
        if (s === null || typeof s === 'undefined') {
            return null;
        }
        // TODO map check
        return s[x];
    }, val);
}

function resolveModifiers(props: TableProps) {
    let className = '';
    if (props.borders) {
        className += ' is-bordered';
    }
    if (props.stripes) {
        className += ' is-stripes';
    }
    if (props.narrower) {
        className += ' is-narrower';
    }
    return className;
}

class TR extends React.Component<any, any> {
    render() {
        return <tr>{this.props.children}</tr>;
    }
}

class TD extends React.Component<any, any> {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.children !== this.props.children;
    }
    render() {
        return <td {...this.props}>{this.props.children}</td>;
    }
}