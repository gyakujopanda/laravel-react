import React from 'react';
import { Auth } from 'components';
import { connect } from 'react-redux';
import { loginRequest } from 'actions/auth';
import { browserHistory } from 'react-router';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleLogin(email, password) {
        return this.props.loginRequest(email, password).then(
            () => {
                if(this.props.status === 'SUCCESS') {
                    let loginData = {
                        isLoggedIn: true
                    };

                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));

                    Materialize.toast('ようこそ「' + this.props.userName + '」!', 2000);
                    browserHistory.push('/');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #ffb4ba">' + this.props.error.message + '</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }
    
    render() {
        return (
            <div>
                <Auth 
                    isLogin={ true }
                    onLogin={ this.handleLogin }
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.auth.login.status,
        userId: state.auth.status.currentUserId,
        userName: state.auth.status.currentUserName,
        error: state.auth.login.error
    };
};

const mapStateToDispatch = (dispatch) => {
    return {
        loginRequest: (email, password) => {
            return dispatch(loginRequest(email, password));
        }
    };
};

export default connect(mapStateToProps, mapStateToDispatch)(Login);
