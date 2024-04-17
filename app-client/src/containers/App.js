import React from 'react';
import { Header } from 'components';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { infoRequest, logoutRequest } from 'actions/auth';
import { searchRequest } from 'actions/search';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    
    componentDidMount() {
        // クッキーを取得
        let getCookie = function(name) {
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        };

        // クッキーからログインデータを取得
        let loginData = getCookie('key');

        // データがない場合何もしない
        if(typeof loginData === 'undefined') {
            return;
        } 

        loginData = JSON.parse(atob(loginData));

        // ログインしていない場合も何もしない
        if(! loginData.isLoggedIn) {
            return;
        }

        this.props.infoRequest().then(
            () => {
                if(this.props.authInfo !== 'SUCCESS') {
                    let loginData = {
                        isLoggedIn: false
                    };

                    document.cookie='key=' + btoa(JSON.stringify(loginData));

                    let errorMessage = this.props.authError.message;

                    if(errorMessage === undefined) {
                        errorMessage = 'セッションが切れました';
                    }

                    let $toastContent = $('<span style="color: #ffb4bA">' + errorMessage + '</span>');
                    Materialize.toast($toastContent, 4000);

                    browserHistory.push('/login');
                }
                
            }
        );
    }
    
    handleLogout() {
        this.props.logoutRequest().then(
            () => {
                Materialize.toast('さようなら!', 2000);

                let loginData = {
                    isLoggedIn: false
                };

                document.cookie = 'key=' + btoa(JSON.stringify(loginData));
            }
        );
    }
    
    handleSearch(keyword) {
        this.props.searchRequest(keyword);
    }
    
    render() {
        let isAuth = /^\/(?:login|register)$/.test(this.props.location.pathname);
        return (
            <div>
                {
                    isAuth ?
                        undefined : 
                        <Header 
                            isLoggedIn={ this.props.status.isLoggedIn }
                            onLogout={ this.handleLogout }
                            onSearch={ this.handleSearch }
                            pathName={ this.props.location.pathname }
                            users={ this.props.users }
                        />
                }
                { this.props.children }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        status: state.auth.status,
        authInfo: state.auth.info.status,
        authError: state.auth.info.error,
        users: state.search.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        infoRequest: () => {
            return dispatch(infoRequest());
        },
        logoutRequest: () => {
            return dispatch(logoutRequest());
        },
        searchRequest: (keyword) => {
            return dispatch(searchRequest(keyword));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
