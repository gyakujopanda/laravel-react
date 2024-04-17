import React from 'react';
import { connect } from 'react-redux';
import { Write, PostList } from 'components';
import { 
    postWriteRequest, 
    postListRequest, 
    postEditRequest,
    postRemoveRequest,
    postRemoveFromData,
    postSmileRequest,
    postClear
} from 'actions/post';

class Home extends React.Component {
    constructor(props) {
        super(props);
        
        this.loadNewPost = this.loadNewPost.bind(this);
        this.loadOldPost = this.loadOldPost.bind(this);
        
        this.handlePost = this.handlePost.bind(this);
        
        this.handleEdit = this.handleEdit.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSmile = this.handleSmile.bind(this);
       
        
        this.state = {
            loadingState: false,
            initiallyLoaded: false
        };
    }
    
    componentDidMount() {
        let loadPostLoop = () => {
            this.loadNewPost();
            this.postLoaderTimeoutId = setTimeout(loadPostLoop, 5000);
        };
        
        let loadUntilScrollable = () => {
            if($('body').height() < $(window).height()) {
                this.loadOldPost().then(
                    () => {
                        if(! this.props.isLast) {
                            loadUntilScrollable();
                        }
                    }
                );
            }
        };
        
       this.props.postListRequest(true, undefined, undefined, this.props.userId).then(
            () => {
                setTimeout(loadUntilScrollable, 1000);
                loadPostLoop();
                
                this.setState({
                    initiallyLoaded: true
                });
            }
        );
        
        
        $(window).scroll(() => {
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
                if(!this.state.loadingState){
                    this.loadOldPost();
                    this.setState({
                        loadingState: true
                    });
                }
            } else {
                if(this.state.loadingState){
                    this.setState({
                        loadingState: false
                    });
                }
            }
        });
                
                
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.userId !== prevProps.userId) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
    }
    
    componentWillUnmount() {

        clearTimeout(this.postLoaderTimeoutId);
        
        $(window).unbind();
        
        this.setState({
            initiallyLoaded: false
        });
    }
    
    loadNewPost() {
        if(this.props.listStatus === 'WAITING') {
            return new Promise((resolve, reject)=> {
                resolve();
            });
        }    
        
        if(this.props.postData.length === 0 ) {
            return this.props.postListRequest(true, undefined, undefined, this.props.userId);
        }
            
        return this.props.postListRequest(false, 'new', this.props.postData[0].id, this.props.userId);
    }
    
    loadOldPost() {
        if(this.props.isLast) {
            return new Promise(
                (resolve, reject)=> {
                    resolve();
                }
            );
        }
        //console.log(this.props.postData.length);
        let lastId = this.props.postData[this.props.postData.length - 1].id;
        
        return this.props.postListRequest(false, 'old', lastId, this.props.userId).then(() => {
            if(this.props.isLast) {
                Materialize.toast('これ以上のポストはありません', 2000);
            }
        });
    }
    
    /* ポスト登録 */
    handlePost(contents) {
        return this.props.postWriteRequest(contents).then(
            () => {
                if(this.props.writeStatus.status === 'SUCCESS') {
                    this.loadNewPost().then(
                        () => {
                            Materialize.toast('登録が成功しました', 2000);
                        }
                    );
                } else {

                    let $toastContent = $('<span style="color: #ffb4ba">' + this.props.writeStatus.error.message + '</span>');
                    
                    if(this.props.writeStatus.error.code === 1) {
                        setTimeout(()=> {
                            location.reload(false);
                        }, 2000);
                    }
                }
            }
        );
    }
    
    handleEdit(id, index, contents) {
        return this.props.postEditRequest(id, index, contents).then(
            () => {
                if(this.props.editStatus.status === 'SUCCESS') {
                    Materialize.toast('成功!', 2000);
                } else {
                    let $toastContent = $('<span style="color: #ffb4ba">' + this.props.editStatus.error.message + '</span>');
                    Materialize.toast($toastContent, 2000);
                
                    
                    if(this.props.editStatus.error.message.code === 1) {
                        setTimeout(()=> {
                            location.reload(false);
                        }, 2000);
                    }
                    
                }
            }
        );
    }
    
    handleRemove(id, index) {
        this.props.postRemoveRequest(id, index).then(() => {
            if(this.props.removeStatus.status === 'SUCCESS') {
                setTimeout(() => { 
                    if($('body').height() < $(window).height()) {
                        this.loadOldPost();
                    }
                }, 1000);

            } else {
                
                let $toastContent = $('<span style="color: #ffb4ba">' + this.props.removeStatus.error.message + '</span>');
                Materialize.toast($toastContent, 2000);
                if(this.props.removeStatus.error.code === 1) {
                    setTimeout(()=> {
                        location.reload(false);
                    }, 2000);
                }
            }
        });
    }
    
    
    handleSmile(id, index) {
        this.props.postSmileRequest(id, index).then(
            () => {
                if(this.props.smileStatus.status !== 'SUCCESS') {  
                    let $toastContent = $('<span style="color: #ffb4ba">' + this.props.smileStatus.error.message + '</span>');
                    Materialize.toast($toastContent, 2000);
    
    
                    if(this.props.smileStatus.error.code === 1) {
                        setTimeout(()=> {
                            location.reload(false);
                        }, 2000);
                    }
                }
            }
        );
    }
    
    render() {
        const write = (
            <Write onPost={ this.handlePost } />
        );
        
        const emptyView = (
            <div className="container">
                <div className="empty-page">
                    <b>{ this.props.userName }</b> ポストがありません
                </div>
            </div>
        );
        
        const wallHeader = (
            <div>
                <div className="container wall-info">
                    <div className="card wall-info">
                        <div className="card-content">
                            { this.props.userName }
                        </div>
                    </div>
                </div>
                { 
                    this.props.postData.length === 0 && 
                    this.state.initiallyLoaded ? 
                        emptyView : 
                        undefined
                }
            </div>
        );
        
        return (
            <div className="wrapper">
                {
                    typeof this.props.userId !== 'undefined' ? 
                        wallHeader : 
                        undefined
                }
                { 
                    this.props.isLoggedIn && 
                    typeof this.props.userId === 'undefined' ? 
                        write : 
                        undefined
                }
                <PostList
                    data={ this.props.postData }
                    isLoggedIn={ this.props.isLoggedIn }
                    currentUserId={ this.props.currentUserId }
                    currentUserName={ this.props.currentUserName }
                    onEdit={ this.handleEdit }
                    onRemove={ this.handleRemove }
                    onSmile={ this.handleSmile }
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.auth.status.isLoggedIn,
        currentUserId: state.auth.status.currentUserId,
        currentUserName: state.auth.status.currentUserName,
        postData: state.post.list.data,
        listStatus: state.post.list.status,
        isLast: state.post.list.isLast,
        writeStatus: state.post.write,
        editStatus: state.post.edit,
        removeStatus: state.post.remove,
        smileStatus: state.post.smile
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        postWriteRequest: (contents) => {
            return dispatch(postWriteRequest(contents));
        }, 
        postListRequest: (isInitial, listType, id, userId) => {
            return dispatch(postListRequest(isInitial, listType, id, userId));
        },
        postEditRequest: (id, index, contents) => {
            return dispatch(postEditRequest(id, index, contents));
        },
        postRemoveRequest: (id, index) => {
            return dispatch(postRemoveRequest(id, index));
        },
        postRemoveFromData: (index) => {
            return dispatch(postRemoveFromData(index));
        },
        postSmileRequest: (id, index) => {
            return dispatch(postSmileRequest(id, index));
        },
        postClear: () => {
            return dispatch(postClear());
        }
    };
};

Home.PropTypes = {
    userId: React.PropTypes.string,
    userName: React.PropTypes.string
};

Home.defaultProps = {
    userId: undefined,
    userName: undefined
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
