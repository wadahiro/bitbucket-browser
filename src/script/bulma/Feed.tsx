import * as React from 'react';

export class Feed extends React.Component<any, any> {

    render() {
        return (
            <div>
                <article className="media">
                    <figure className="media-left">
                        <img src="http://placehold.it/60x60" />
                    </figure>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                <strong>John Smith</strong> <small> @johnsmith</small> <small>31m</small>
                                <br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.Proin ornare magna eros, eu pellentesque tortor vestibulum ut.Maecenas non massa sem.Etiam finibus odio quis feugiat facilisis.
                            </p>
                        </div>
                        <nav className="navbar">
                            <div className="navbar-left">
                                <a className="navbar-item">
                                    <span className="icon is-small"><i className="fa fa-reply"></i></span>
                                </a>
                                <a className="navbar-item">
                                    <span className="icon is-small"><i className="fa fa-retweet"></i></span>
                                </a>
                                <a className="navbar-item">
                                    <span className="icon is-small"><i className="fa fa-heart"></i></span>
                                </a>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>
        );
    }
}