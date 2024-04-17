import React from 'react';
import { Post } from 'components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class PostList extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        let update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
        return update;
    }
    
    render() {
        const mapToComponents = data => {
            return data.map((post, i) => {
                return (
                    <Post 
                        data={ post }
                        isLoggedIn={ this.props.isLoggedIn }
                        ownership={ (post.writer === this.props.currentUserId) }
                        key={ post.id }
                        index={ i }
                        onEdit={ this.props.onEdit }
                        onRemove={ this.props.onRemove }
                        onSmile={ this.props.onSmile }
                        currentUserId={ this.props.currentUserId }
                        currentUserName={ this.props.currentUserName }
                    />
                );
            });
        };
        
        return (
            <div>
                <ReactCSSTransitionGroup 
                    transitionName="post" 
                    transitionEnterTimeout={ 2000 } 
                    transitionLeaveTimeout={ 1000 }
                >
                    { mapToComponents(this.props.data) }
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

PostList.propTypes = {
    data: React.PropTypes.array,
    isLoggedIn: React.PropTypes.bool,
    currentUserId: React.PropTypes.string,
    currentUserName: React.PropTypes.string,
    onEdit: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onSmile: React.PropTypes.func,
};

PostList.defaultProps = {
    data: [],
    isLoggedIn: false,
    currentUserId: undefined,
    currentUserName: undefined,
    onEdit: (id, index, contents) => { 
        console.error('onEdit'); 
        
    },
    onRemove: (id, index) => { 
        console.error('onRemove'); 
    },
    onSmile: (id, index) => {
        console.error('onSmile');
    },
};

export default PostList;
