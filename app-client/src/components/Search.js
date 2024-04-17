import React from 'react';
import { browserHistory, Link } from 'react-router';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            close: false,
            keyword: ''
        };
        this.handleClose = this.handleClose.bind(this); 
        this.handleChange = this.handleChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        
        const listenEscKey = (evt) => {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                this.handleClose();
            }
        };
        
        document.onkeydown = listenEscKey;
    }
    
    handleClose() {
        this.handleSearch("");
        document.onkeydown = null;
        this.props.onClose();
    }
    
    handleSearch(keyword) {
        this.props.onSearch(keyword);
    }
    
    handleChange(e) {
        this.setState({
            keyword: e.target.value
        });
        
        this.handleSearch(e.target.value);
    }
    
    handleKeyDown(e) {
        if(e.keyCode === 13) {
            if(this.props.users.length > 0) {
                this.handleClose();
                browserHistory.push('/wall/' + this.props.users[0].id + '/' . this.props.users[0].name);
            }
        }
    }
    
    render() {
        
        const mapDataToLinks = (data) => {
            return data.map((user, i) => {
                return (
                    <Link
                        onClick={ this.handleClose } to={ `/wall/${user.id}/${user.name}` }
                        key={ i }
                    >{ user.name }</Link>
                );
            });
        }
        
        return (
            <div className="search-screen white-text">
                <div className="right">
                    <a 
                        className="waves-effect waves-light btn red lighten-1"
                        onClick={ this.handleClose }
                    >閉じる</a>
                </div>
                <div className="container">
                    <input 
                        placeholder="ユーザー検索" 
                        value={ this.state.keyword }
                        onChange={ this.handleChange }
                        onKeyDown={ this.handleKeyDown }
                    ></input>
                    <ul className="search-results">
                        { mapDataToLinks(this.props.users) }
                    </ul>
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    onClose: React.PropTypes.func,
    onSearch: React.PropTypes.func,
    status: React.PropTypes.object
}

Search.defaultProps = {
    onClose: () => {
        console.error('onClose');
    },
    onSearch: () => {
        console.error('onSearch');
    },
    users: []
}

export default Search;