import React from 'react';
import { Link, browserHistory } from 'react-router';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:    '',
            name:     '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let email = this.state.email;
        let password = this.state.password;
        
        this.props.onLogin(email, password).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleRegister() {
        let email = this.state.email;
        let name = this.state.name;
        let password = this.state.password;
        
        this.props.onRegister(email, name, password).then(
            (result) => {
                if(!result) {
                    this.setState({
                        email:    '',
                        name:     '',
                        password: ''
                    });
                }
            }
        );
    }

    handleKeyPress(e) {
        if(e.charCode === 13) {
            if(this.props.isLogin) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {
        const formView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        <div>
                            <div className="input-field col s12 email">
                                <label>メール</label>
                                <input
                                    name="email"
                                    type="text"
                                    className="validate"
                                    onChange={ this.handleChange }
                                    value={ this.state.email }
                                />
                            </div>
                            {
                                ! this.props.isLogin && 
                                    <div className="input-field col s12 name">
                                        <label>名前</label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="validate"
                                            onChange={ this.handleChange }
                                            value={ this.state.name }
                                        />
                                    </div>
                            }
                            <div className="input-field col s12">
                                <label>パスワード</label>
                                <input
                                    name="password"
                                    type="password"
                                    className="validate"
                                    onChange={ this.handleChange }
                                    value={ this.state.password }
                                    onKeyPress={ this.handleKeyPress }
                                />
                            </div>
                        </div>
                        { 
                            this.props.isLogin ? 
                                <a className="waves-effect waves-light btn" onClick={ this.handleLogin }>ログイン</a> : 
                                <a className="waves-effect waves-light btn" onClick={ this.handleRegister }>登録</a>
                        }
                    </div>
                </div>
                <div className="footer">
                    <div className="card-content">
                        <div className="left" >
                            {
                                this.props.isLogin ?
                                    <Link to="/">ホームへ戻る</Link> :
                                    <Link to="/login">ログインに戻る</Link>
                            }
                        </div>
                        { 
                            this.props.isLogin &&
                                <div className="right" >
                                    <Link to="/register">新規登録</Link>
                                </div>
                        }
                    </div>
                </div>
            </div>
        );

        return (
            <div className="container auth">
                <div className="card">
                    <div className="header blue darken-3 white-text center">
                        <div className="card-content">{ this.props.mode ? 'ログイン' : '新規登録' }</div>
                    </div>
                    { formView }
                </div>
            </div>
        );
    }
}

Auth.propTypes = {
    isLogin: React.PropTypes.bool,
    onLogin: React.PropTypes.func,
    onRegister: React.PropTypes.func
};

Auth.defaultProps = {
    isLogin: true,
    onLogin: (email, password) => {
        console.error('onLogin');
    },
    onRegister: (email, name, password) => {
        console.error('onRegister');
    }
};

export default Auth;
