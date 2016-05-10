import * as React from 'react';

export interface MediaObjectProps extends React.Props<MediaObject> {
    figure: JSX.Element;
    figureSize?: '32x32' | '64x64';
}

export class MediaObject extends React.Component<MediaObjectProps, any> {
    static defaultProps = {
        figureSize: '64x64'
    };

    render() {
        const { figure, figureSize } = this.props;

        return (
            <article className='media'>
                <figure className='media-left'>
                    <p className={`image is-${figureSize}`}>
                        {figure}
                    </p>
                </figure>
                <div className='media-content'>
                    <div className='content'>
                        {this.props.children}
                    </div>
                </div>
            </article>
        );
    }
}