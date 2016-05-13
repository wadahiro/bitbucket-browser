import * as React from 'react';
import * as B from '../bulma';
import { Settings } from '../Settings';
import * as SQAPI from '../SonarQubeApi';

interface Props extends React.Props<SonarQubeLoginModal> {
    settings: Settings;
    show?: boolean;
    loginLabel?: string;
    onAuthenticated: () => void;
}

export class SonarQubeLoginModal extends React.Component<Props, any> {
    static defaultProps = {
        loginLabel: 'Login'
    };

    state = {
        login: '',
        password: '',
        message: ''
    };

    handleForm = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    login = (e: React.SyntheticEvent) => {
        e.preventDefault();

        const { login, password } = this.state;

        SQAPI.authenticate(this.props.settings, login, password)
            .then(authenticated => {
                console.log('authenticated', authenticated);
                if (authenticated) {
                    this.setState({
                        message: ''
                    }, () => {
                        this.props.onAuthenticated();
                    });

                } else {
                    this.setState({
                        message: 'Authentication failed.'
                    });
                }
            })
    };

    render() {
        const { show, loginLabel } = this.props;
        const { login, password, message } = this.state;

        return (
            <B.ModalCard show={show} title='SonarQube Login' showClose={false}>
                <B.Content>
                    <form>
                        <B.InputText label='Login' name='login' onChange={this.handleForm} />
                        <B.InputPassword label='Password' name='password' onChange={this.handleForm} />
                        <p>{message}</p>
                        <B.Button onClick={this.login} >
                            {loginLabel}
                        </B.Button>
                    </form>
                </B.Content>
            </B.ModalCard>
        );
    }
}
