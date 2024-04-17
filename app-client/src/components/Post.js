import React from 'react';
import TimeAgo from 'react-timeago';
import japanStrings from 'react-timeago/lib/language-strings/ja';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { Link } from 'react-router';
const timeAgoformatter = buildFormatter(japanStrings);

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            value: props.data.contents
        };
        this.toggleEdit = this.toggleEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSmile = this.handleSmile.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        let current = {
            props: this.props,
            state: this.state
        };
        
        let next = {
            props: nextProps,
            state: nextState
        };
        
        let update = JSON.stringify(current) !== JSON.stringify(next);
        return update;
    }
    
    toggleEdit() {
        if(this.state.editMode) {
            let id = this.props.data.id;
            let index = this.props.index;
            let contents = this.state.value;
            
            this.props.onEdit(id, index, contents).then(() => {
                this.setState({
                    editMode: !this.state.editMode
                });
            });
        } else {
            this.setState({
                editMode: !this.state.editMode
            });   
        }
    }
    
    handleRemove() {
        let id = this.props.data.id;
        let index = this.props.index;
        this.props.onRemove(id, index);
    }
    
    handleSmile() {
        let id = this.props.data.id;
        let index = this.props.index;
        this.props.onSmile(id, index); 
    }
    
    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }
    
    render() {
        const dropDownMenu = (
            <div className="option-button">
                <a 
                    className='dropdown-button' 
                    id={ `dropdown-button-${this.props.data.id}` }
                    data-activates={ `dropdown-${this.props.data.id}` }
                >
                    <i className="material-icons icon-button">more_vert</i>
                </a>
                <ul 
                    id={ `dropdown-${this.props.data.id}` } 
                    className='dropdown-content'
                >
                    <li><a onClick={ this.toggleEdit }>編集</a></li>
                    <li><a onClick={ this.handleRemove }>削除</a></li>
                </ul>
            </div>
        );

        let smileIconStyle = {};

        if(this.props.data.smiled.indexOf(this.props.currentUserId) > -1) {
             smileIconStyle.color = '#ff9980';
        }

        const smileIconLoggedIn = (
            <i 
                className="material-icons log-footer-icon smile icon-button" 
                style={ smileIconStyle }
                onClick={ this.handleSmile }
            >tag_faces</i> 
        );

        const smileIconNotLoggedIn = (
            <i className="material-icons log-footer-icon smile">tag_faces</i>
        );
        
        let editedInfo = (
            <span style={ { color: '#aab5bc' } }> 
                <TimeAgo 
                    date={ this.props.data.updated_at } 
                    live={ true }
                    formatter={ timeAgoformatter }
                />に編集
            </span>
        );
        
        const postView = (
            <div className="card">
                <div className="info">
                    <Link 
                        to={ `/wall/${this.props.data.writer}/${this.props.data.name}` } 
                        className="name"
                    >{ this.props.data.name }</Link>
                    <TimeAgo 
                        date={ this.props.data.created_at } 
                        formatter={ timeAgoformatter }
                    />に登録
                    { 
                        this.props.data.is_edited ? 
                            editedInfo : 
                            undefined
                    }
                    { 
                        this.props.ownership ? 
                            dropDownMenu : 
                            undefined
                    }
                </div>
                <div className="card-content">
                    { this.props.data.contents }
                </div>
                <div className="footer">
                    {
                        this.props.isLoggedIn ? 
                            smileIconLoggedIn : 
                            smileIconNotLoggedIn
                    }
                    <span className="smile-count">{ this.props.data.smiled.length }</span>
                </div>
            </div>
        );
        
        const editView = (
            <div className="write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea"
                            value={ this.state.value }
                            onChange={ this.handleChange }
                        ></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={ this.toggleEdit }>
                            <i className="material-icons icon-button" aria-label="編集">edit</i>
                        </a>
                    </div>
                </div>
            </div>
        );
        
        return (
            <div className="container post post-fade-in">
                {
                    this.state.editMode ? 
                        editView : 
                        postView
                }
            </div>
        );
    }
    
    componentDidUpdate() {
        $('#dropdown-button-' + this.props.data.id).dropdown({
            belowOrigin: true
        });
    }

    componentDidMount() {
        $('#dropdown-button-' + this.props.data.id).dropdown({
            belowOrigin: true
        });
    }
}

Post.propTypes = {
    data: React.PropTypes.object,
    isLoggedIn: React.PropTypes.bool,
    ownership: React.PropTypes.bool,
    onEdit: React.PropTypes.func,
    index: React.PropTypes.number,
    onRemove: React.PropTypes.func,
    onSmile: React.PropTypes.func,
    currentUserId: React.PropTypes.string,
    currentUserName: React.PropTypes.string
};

Post.defaultProps = {
    data: {
        id: undefined,
        writer: 'Writer',
        contents: 'Contents',
        is_edited: false,
        date: {
            edited: new Date(),
            created: new Date()
        },
        smiled: []
    },
    isLoggedIn: false,
    ownership: true,
    onEdit: (id, index, contents) => {
        console.error('onEdit');
    },
    index: -1,
    onRemove: (id, index) => { 
        console.error('onRemove'); 
    },
    onSmile: (id, index) => {
        console.error('onSmile');
    },
    currentUserId: undefined,
    currentUserName: undefined 
}

export default Post;
