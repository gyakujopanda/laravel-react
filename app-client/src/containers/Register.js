import React from 'react';
import { Auth } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/auth';
import { browserHistory } from 'react-router';
import jwtdecode from 'jwt-decode';

class Register extends React.Component {
    
    
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);    
    }
    
    handleRegister(email, name, password) {
        return this.props.registerRequest(email, name, password).then(
            () => {
                if(this.props.status === 'SUCCESS') {
                    Materialize.toast('ログインしてください', 2000);
                    browserHistory.push('/login');
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
                    isLogin={ false }
                    onRegister={ this.handleRegister }
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.auth.register.status,
        error: state.auth.register.error
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        registerRequest: (email, name, password) => {
            return dispatch(registerRequest(email, name, password));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
