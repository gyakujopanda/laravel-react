import React from 'react';

class Write extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contents: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePost = this.handlePost.bind(this);

    }

    handleChange(e) {
        this.setState({
            contents: e.target.value
        });
    }

    handlePost() {
        let contents = this.state.contents;
        
        this.props.onPost(contents).then(
            () => {
                this.setState({
                    contents: ''
                });
            }
        );
    }

    render() {
        return (
            <div className="container write">
                <div className="card">
                    <div className="card-content">
                        <textarea
                            className="materialize-textarea"
                            placeholder="内容を入力"
                            value={ this.state.contents }
                            onChange={ this.handleChange }
                        ></textarea>
                    </div>
                    <div className="card-action">
                        <a onClick={ this.handlePost }>
                            <i className="material-icons" aria-label="書き込む">create</i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

Write.propTypes = {
    onPost: React.PropTypes.func
}

Write.defaultProps = {
    onPost: (contents) => { console.error('onPost'); },
};

export default Write;
