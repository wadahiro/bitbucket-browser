import * as React from 'react';

interface Props extends React.Props<Pagination> {
    pageSize: number;
    currentPage: number;
    onChange: (nextPage: number) => void
    paddingTop?: number;
    paddingBottom?: number;
    maxButtons?: number;
}

export class Pagination extends React.Component<Props, any> {
    static defaultProps = {
        paddingTop: 5,
        paddingBottom: 5,
        maxButtons: 10
    };

    render() {
        const { pageSize, currentPage, paddingTop, paddingBottom } = this.props;

        const pages = [];
        const [start, end] = this.resolveDisplayPage();

        for (let i = start; i < end; i++) {
            pages[i] = {
                label: i + 1
            };
            if (currentPage === i) {
                pages[i].active = true;
            }
        }

        const style = {
            paddingTop,
            paddingBottom
        };

        const isFirst = currentPage === 0;
        const isLast = currentPage === pageSize - 1;

        return (
            <nav style={style} className='pagination'>
                <ul>
                    <li >
                        <a className='icon' onClick={this.handleFirst} disabled={isFirst}><i className='fa fa-angle-double-left'></i></a>
                    </li>
                    <li >
                        <a className='icon' onClick={this.handlePrev} disabled={isFirst}><i className='fa fa-angle-left'></i></a>
                    </li>
                    { start > 0 &&
                        <li >
                            <p>...</p>
                        </li>
                    }
                    { pages.map((x, index) => {
                        const isActive = x.active === true ? 'is-active' : '';
                        return (
                            <li key={x.label}>
                                <a name={String(index) } className={isActive} onClick={this.handlePageChange}>{x.label}</a>
                            </li>
                        )
                    }) }
                    { end < pageSize &&
                        <li >
                            <p>...</p>
                        </li>
                    }
                    <li >
                        <a className='icon' onClick={this.handleNext} disabled={isLast}><i className='fa fa-angle-right'></i></a>
                    </li>
                    <li >
                        <a className='icon' onClick={this.handleLast} disabled={isLast}><i className='fa fa-angle-double-right'></i></a>
                    </li>
                </ul>
            </nav>
        );
    }

    resolveDisplayPage() {
        const { pageSize, currentPage, maxButtons } = this.props;

        const leftSize = Math.floor(maxButtons / 2);
        let rightSize = maxButtons - leftSize;
        if (leftSize + rightSize > maxButtons) {
            rightSize -= 1;
        }
        let start = currentPage - leftSize;
        let end = currentPage + rightSize;
        if (start < 0) {
            start = 0;
            end = pageSize < maxButtons ? pageSize : maxButtons;
        } else if (end > pageSize) {
            start = pageSize - maxButtons;
            end = pageSize;
        }
        return [start, end];
    }

    handleFirst = () => {
        this.props.onChange(0);
    };

    handleLast = () => {
        this.props.onChange(this.props.pageSize - 1);
    };

    handlePrev = () => {
        this.props.onChange(this.props.currentPage - 1);
    };

    handleNext = () => {
        this.props.onChange(this.props.currentPage + 1);
    };

    handlePageChange = (e) => {
        const page = e.target.name;
        this.props.onChange(Number(page));
    };
}