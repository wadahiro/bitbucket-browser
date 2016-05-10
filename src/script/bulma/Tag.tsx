import * as React from 'react';

export interface TagProps extends React.Props<Tag> {
    onClick?: (event: React.SyntheticEvent) => void;
    type?: '' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
    size?: '' | 'small' | 'medium' | 'large';
}

export class Tag extends React.Component<TagProps, any> {
    static defaultProps = {
        type: '',
        size: ''
    };

    render() {
        const { size, type } = this.props;

        return (
            <span className={`tag ${withIs(size)} ${withIs(type)}`}>
                { this.props.children }
            </span>
        );
    }
}

function withIs(str: string = '') {
    if (str.length > 0) {
        return `is-${str}`
    }
    return str;
}