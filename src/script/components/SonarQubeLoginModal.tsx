import * as React from 'react';
import * as B from '../bulma';
import { Settings } from '../Settings';
import * as API from '../webapis';

interface Props {
    show?: boolean;
    onHide?: (e: React.SyntheticEvent) => void;
    loginLabel?: string;
    onAuthenticated: () => void;
    api: API.API;
}

interface State {
    login?: string;
    password?: string;
    message?: string;
    show?: boolean;
}

export class SonarQubeLoginModal extends React.Component<Props, State> {
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

        const { api } = this.props;
        const { login, password } = this.state;

        api.authenticateSoarQube(login, password)
            .then(authenticated => {
                console.log('authenticated sonar?', authenticated);
                if (authenticated) {
                    this.setState({
                        show: false,
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
        const { show, onHide, loginLabel } = this.props;
        const { login, password, message } = this.state;

        const footer = <B.Button onClick={this.login} >
            {loginLabel}
        </B.Button>;

        return (
            <B.ModalCard show={show} onHide={onHide} title='SonarQube Login' keyboard footer={footer}>
                <B.Content>
                    <form>
                        <B.Control>
                            <B.Label>Login</B.Label>
                            <B.InputText name='login' onChange={this.handleForm} />
                        </B.Control>
                        <B.Control>
                            <B.Label>Password</B.Label>
                            <B.InputPassword name='password' onChange={this.handleForm} />
                        </B.Control>
                        <p>{message}</p>
                    </form>
                </B.Content>
            </B.ModalCard>
        );
    }
}
