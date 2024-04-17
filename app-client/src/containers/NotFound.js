import React from 'react';

class NotFound extends React.Component {
    render() {
        return (
            <div className="container auth">
                <div className="card">
                    <div className="header blue darken-3 white-text center">
                        <div className="card-content">404</div>
                    </div>
                    <div className="card-content">ページが存在しません</div>
                </div>
            </div>    
        );
    }
}

export default NotFound;