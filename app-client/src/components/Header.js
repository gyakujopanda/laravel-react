import React from 'react';
import { Link } from 'react-router';
import { Search } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: false
        };
        this.toggleSearch = this.toggleSearch.bind(this);
    }

    toggleSearch() {
        this.setState({
            search: !this.state.search
        });
    }
    
    render() {
        const loginButton = (
            <Link to="/login">
                <i className="material-icons" aria-label="ログイン">vpn_key</i>
            </Link>
        );

        const logoutButton = (
            <a onClick={ this.props.onLogout }>
                <i className="material-icons" aria-label="ログアウト">lock_open</i>
            </a>
        );

        return (
            <div>
                <nav>
                    <div className="nav-wrapper">
                        {
                            this.props.pathName !== '/' && 
                                <Link to="/" className="brand-logo center">
                                    <i className="material-icons" aria-label="ホーム">home</i>
                                </Link>
                        }
                        <ul>
                            <li>
                                <a onClick={ this.toggleSearch }>
                                    <i className="material-icons" aria-label="検索">search</i>
                                </a>
                            </li>
                            <li className="right">
                                { this.props.isLoggedIn ? logoutButton : loginButton }
                            </li>
                        </ul>
                    </div>
                </nav>
                <ReactCSSTransitionGroup 
                    transitionName="search" 
                    transitionEnterTimeout={ 300 } 
                    transitionLeaveTimeout={ 300 }
                >
                    {
                        this.state.search ?
                            <Search
                                onClose={ this.toggleSearch }
                                onSearch={ this.props.onSearch }
                                users={ this.props.users }
                            /> : 
                            undefined
                    }
                </ReactCSSTransitionGroup>
                
            </div>
        );
    }
}

Header.propTypes = {
    isLoggedIn: React.PropTypes.bool,
    onLogout:   React.PropTypes.func,
    onSearch:   React.PropTypes.func,
    pathName:   React.PropTypes.string,
    users:      React.PropTypes.array
};

Header.defaultProps = {
    isLoggedIn: false,
    onLogout: () => {
        console.error('onLogout');
    },
    onSearch: () => {
        console.error('onSearch');
    },
    pathName: undefined,
    users: []
};

export default Header;
