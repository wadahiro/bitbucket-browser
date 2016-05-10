import * as React from 'react';

export class Footer extends React.Component<any, any> {
    render() {
        return (
            <footer className="footer">
                <div className="container">
                    <div className="content has-text-centered">
                        {this.props.children}
                    </div>
                </div>
            </footer>
        );
    }
}