import * as React from 'react';
import { Pagination } from './Pagination'
import { Loading } from './Loading'

export interface TableProps extends React.Props<Table> {
    fixed?: boolean;
    columnMetadata: ColumnMetadata[];
    enableSort?: boolean;
    initialSort?: string;
    initialSortAscending?: boolean;
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
    handleShowRecord?: (data: any) => void;
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

export class Table extends React.Component<TableProps, any> {
    static defaultProps = {
        fixed: false,
        initialSort: null,
        initialSortAscending: true,
        showPagination: false,
        resultsPerPage: 5,
        results: []
    };

    state = {
        currentPage: 0,
        currentSortKey: this.props.initialSort,
        sortAscending: this.props.initialSortAscending,
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
        const thead = visibleColumns.map(x => {
            const thStyle = {} as any;
            if (x.width) {
                thStyle.width = x.width;
            }
            if (x.headerCenter) {
                thStyle.textAlign = 'center';
            }
            let sortMark = '';
            if (this.props.enableSort && x.sortEnabled !== false && this.state.currentSortKey === x.name) {
                sortMark = this.state.sortAscending ? '▲' : '▼';
            }
            return <th name={x.name} key={x.name} style={thStyle} onClick={this.sort(x) }>{x.label || x.name} {sortMark}</th>;
        });
        return thead;
    }

    sort = (columnMetadata: ColumnMetadata) => (e) => {
        if (this.props.enableSort && columnMetadata.sortEnabled !== false) {
            let nextSortAscending = this.state.sortAscending;
            if (this.state.currentSortKey === columnMetadata.name) {
                nextSortAscending = !nextSortAscending;
            }
            this.setState({
                currentSortKey: columnMetadata.name,
                sortAscending: nextSortAscending
            });
        }
    };

    renderBody(visibleColumns: ColumnMetadata[], pageSize: number): JSX.Element[] {
        const { results, rowKey, showPagination, resultsPerPage } = this.props;
        const { currentSortKey, sortAscending } = this.state;

        // sort
        let sortedResults = results;
        if (currentSortKey !== null) {
            sortedResults = results.slice().sort((a, b) => {
                const valueA = toString(a[currentSortKey]);
                const valueB = toString(b[currentSortKey]);
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
            const currentPage = fixCurrentPage(this.state.currentPage, pageSize);
            const start = currentPage * resultsPerPage;
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
        const { results, showPagination, resultsPerPage } = this.props;
        let { currentPage } = this.state;

        if (!showPagination) {
            return <div />;
        }

        currentPage = fixCurrentPage(currentPage, pageSize);

        return <Pagination pageSize={pageSize} currentPage={currentPage} onChange={this.handlePageChange} />
    }

    handlePageChange = (newPage: number) => {
        this.setState({
            currentPage: newPage
        });
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