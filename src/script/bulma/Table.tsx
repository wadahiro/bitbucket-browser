import * as React from 'react';
import { Pagination } from './Pagination'
import { Loading } from './Loading'

export interface TableProps {
    fixed?: boolean;
    columnMetadata: ColumnMetadata[];
    enableSort?: boolean;
    sortColumn?: string;
    sortAscending?: boolean;
    showPagination?: boolean;
    resultsPerPage?: number;
    rowKey: string;
    borders?: boolean;
    stripes?: boolean;
    narrower?: boolean;
    combine?: boolean;
    results: {
        [index: string]: string | number | boolean;
    }[];
    currentPage?: number;
    handleShowRecord?: (data: any) => void;
    handlePage?: (index: number) => void;
    handleSort?: (columnName: string) => void;
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
        fixed: false,
        sortColumn: null,
        sortAscending: true,
        showPagination: false,
        resultsPerPage: 5,
        results: []
    };

    render() {
        const { fixed, results, columnMetadata, resultsPerPage } = this.props;

        const visibleColumns = columnMetadata.filter(x => x.visible !== false);
        const pageSize = Math.ceil(results.length / resultsPerPage);

        const tableLayout = {} as any;
        if (fixed) {
            tableLayout.tableLayout = 'fixed';
        }

        return (
            <div>
                {this.renderPagination(pageSize) }
                <table style={tableLayout} className={`table ${resolveModifiers(this.props)} `}>
                    <thead>
                        <TR>
                            {this.renderThead(visibleColumns) }
                        </TR>
                    </thead>
                    <tbody>
                        {this.renderBody(visibleColumns, pageSize) }
                    </tbody>
                </table>
                {this.renderPagination(pageSize) }
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

    renderBody(visibleColumns: ColumnMetadata[], pageSize: number): JSX.Element[] {
        const { results, rowKey, showPagination, resultsPerPage, currentPage,
            sortColumn, sortAscending } = this.props;

        // sort
        let sortedResults = results;
        if (sortColumn !== null) {
            sortedResults = results.slice().sort((a, b) => {
                const valueA = toString(a[sortColumn]);
                const valueB = toString(b[sortColumn]);
                if (valueA < valueB) {
                    return sortAscending ? -1 : 1;
                }
                if (valueA === valueB) {
                    return 0;
                }
                if (valueA > valueB) {
                    return sortAscending ? 1 : -1;
                }
            });
        }

        // pagination
        let pageResults = sortedResults;
        if (showPagination) {
            const fixedCurrentPage = fixCurrentPage(currentPage, pageSize);
            const start = fixedCurrentPage * resultsPerPage;
            const end = start + resultsPerPage;
            pageResults = sortedResults.slice(start, end);
        }

        // render
        const body = pageResults.map(x => {
            //TODO
            setTimeout(() => {
                this.props.handleShowRecord(x);
            });

            const tds = visibleColumns.map(col => {
                const tdStyle = {} as any;
                tdStyle.wordBreak = 'break-all';

                const value = getValue(x, col.name);

                // lazy fetch
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

    renderPagination(pageSize): JSX.Element {
        const { results, showPagination, resultsPerPage, currentPage } = this.props;

        if (!showPagination) {
            return <div />;
        }

        const fixedCurrentPage = fixCurrentPage(currentPage, pageSize);

        return <Pagination pageSize={pageSize} currentPage={fixedCurrentPage} onChange={this.handlePageChange} />
    }

    handlePageChange = (newPage: number) => {
        const { handlePage } = this.props;
        handlePage(newPage);
    };
}

function fixCurrentPage(currentPage: number, pageSize: number) {
    if (currentPage >= pageSize) {
        return pageSize - 1;
    }
    return currentPage;
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

function toString(value: any = '') {
    return value + '';
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