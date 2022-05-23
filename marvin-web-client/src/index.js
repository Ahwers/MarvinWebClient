import React from 'react';
import ReactDOM from 'react-dom/client';

class MarvinClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentApplicationCode: null,
        };
    }

    recieveCommand() {
        var command = this.listenToVoiceCommand();
        var marvinResponse = this.commandMarvin(command);

        this.setState({
            currentApplicationCode: marvinResponse.applicationCode,
        });
    }

    // TODO: Implement
    listenToVoiceCommand() {

    }

    // TODO: Implement
    commandMarvin() {
        const code = "<html><head><title>Like Button</title></head><body><div id='like_button_container'></div><script src='https://unpkg.com/react@17/umd/react.development.js' crossorigin></script><script src='https://unpkg.com/react-dom@17/umd/react-dom.development.js' crossorigin></script><script src='https://unpkg.com/babel-standalone@6/babel.min.js'></script><script type='text/babel'>class LikeButton extends React.Component {constructor(props) {super(props);this.state = {liked: false};}render() {if (this.state.liked) {return 'You liked this.';}return (<button onClick={() => this.setState({ liked: true })}>Like</button>);}}const e = React.createElement;const domContainer = document.querySelector('#like_button_container');ReactDOM.render(e(LikeButton), domContainer);</script></body></html>";
        var response = {
            applicationCode: code,
        };

        return response;
    }

    render() {
        return (
            <div>
                <div>
                    <MarvinApplication code={this.state.currentApplicationCode}/>
                </div>
                <div>
                    <CommandReciever onClick={() => this.recieveCommand()}/>
                </div>
            </div>
        );
    }

}

class MarvinApplication extends React.Component {

    render() {
        return <iframe srcDoc={this.props.code}></iframe>;
    }

}

class CommandReciever extends React.Component {

    render() {
        return <button onClick={this.props.onClick}>Command</button>;
    }

}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MarvinClient/>);
