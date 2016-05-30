import * as React from 'react';
import { SyntaxProps, calcClassNames } from './Utils';

export interface TagProps extends SyntaxProps {
    showDelete?: boolean;
    onDelete?: React.MouseEventHandler;
}

export class Tag extends React.Component<TagProps, void> {
    render() {
        const { showDelete, onDelete } = this.props;
        const className = calcClassNames(this.props);

        return (
            <span className={`tag ${className}`}>
                { this.props.children }
                { showDelete &&
                    <button class='delete' onClick={onDelete} />
                }
            </span>
        );
    }
}
