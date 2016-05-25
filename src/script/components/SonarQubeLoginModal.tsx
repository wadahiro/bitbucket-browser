import * as React from 'react';
import * as B from '../bulma';
import { Settings } from '../Settings';
import * as API from '../webapis';

interface Props extends React.Props<SonarQubeLoginModal> {
    show?: boolean;
    onHide?: (e: React.SyntheticEvent) => void;
    settings: Settings;
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

        API.authenticateSoarQube(this.props.settings, login, password)
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
            <B.ModalCard show={show} onHide={onHide} title='SonarQube Login' footer={footer}>
                <B.Content>
                    <form>
                        <B.InputText label='Login' name='login' onChange={this.handleForm} />
                        <B.InputPassword label='Password' name='password' onChange={this.handleForm} />
                        <p>{message}</p>
                    </form>
                </B.Content>
            </B.ModalCard>
        );
    }
}
