import React from 'react';

class MarvinApplication extends React.Component {

    render() {
        return <iframe id="application_iframe" srcDoc={this.props.code}></iframe>;
    }

}

export default MarvinApplication;