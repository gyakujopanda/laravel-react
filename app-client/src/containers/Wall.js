import React from 'react';
import { Home } from 'containers';

class Wall extends React.Component {
    
    render() {
        return (
            <Home
                userId={ this.props.params.userId } 
                userName={ this.props.params.userName }
            />
        );
    }
}

export default Wall;