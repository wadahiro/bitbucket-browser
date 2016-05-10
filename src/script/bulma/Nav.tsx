import * as React from 'react';

export class Nav extends React.Component<any, any> {
    static defaultProps = {
        paddingTop: 5,
        paddingBottom: 5
    };
    
    render() {
        const { paddingTop, paddingBottom } = this.props;
        
        return (
            <nav className="navbar" style={{paddingTop, paddingBottom}}>
                <div className="navbar-left">
                    <div className="navbar-item">
                        <p className="subtitle is-5">
                            <strong>123</strong> posts
                        </p>
                    </div>
                    <div className="navbar-item">
                        <p className="control is-grouped">
                            <input className="input" type="text" placeholder="Find a post" />
                            <button className="button">
                                Search
                            </button>
                        </p>
                    </div>
                </div>

                <div className="navbar-right">
                    <p className="navbar-item"><strong>All</strong></p>
                    <p className="navbar-item"><a href="#">Published</a></p>
                    <p className="navbar-item"><a href="#">Drafts</a></p>
                    <p className="navbar-item"><a href="#">Deleted</a></p>
                    <p className="navbar-item"><a className="button is-success">New</a></p>
                </div>
            </nav>
        );
    }
}