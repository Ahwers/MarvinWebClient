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
        this.commandMarvin(command);
    }

    // TODO: Implement
    listenToVoiceCommand() {
        const command = "who am i";
        this.setState({ commandText: command });

        return command;
    }

    commandMarvin(command) {
        var client = this;

        var httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "http://127.0.0.1:8080/MarvinService/service/command", true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.setRequestHeader("Authorization", "Bearer bearer");
        httpRequest.onreadystatechange = function() {
            if ((httpRequest.readyState === XMLHttpRequest.DONE) && (httpRequest.status === 200)) {
                const marvinResponse = JSON.parse(httpRequest.responseText);
                client.processMarvinResponse(marvinResponse);
            }
        };
        var data = { command: command };
        httpRequest.send(JSON.stringify(data));
    }

    // TODO: Toast message or have Marvin read out the resource.message
    processMarvinResponse(marvinResponse) {
        const resource = marvinResponse.resource;
        if (resource) {
            const resourceType = resource.type;
            // TODO: Save plain text application as html file and load that. Then we can do styles and that
            if (resourceType === "PLAIN_TEXT") {
                this.setState(
                    {
                        currentApplicationCode: this.getPlainTextDisplayApplicationCode(),
                    },
                    () => {
                        var applicationIframe = document.getElementById('application_iframe');
                        applicationIframe.addEventListener("load", () => {
                            var textDisplay = applicationIframe.contentWindow.document.getElementById("text_display");
                            textDisplay.innerHTML = resource.content;
                        });
                    }
                );
            }
            else if (resourceType === "HTML_APPLICATION_INTERFACE") {
                this.setState({
                    currentApplicationCode: resource.content,
                });
            }
        }
    }

    getPlainTextDisplayApplicationCode() {
        const code = "<html><head><title>Text Display</title></head><body><div id='text_display_container'></div><script src='https://unpkg.com/react@17/umd/react.development.js' crossorigin></script><script src='https://unpkg.com/react-dom@17/umd/react-dom.development.js' crossorigin></script><script src='https://unpkg.com/babel-standalone@6/babel.min.js'></script><script type='text/babel'>class TextDisplay extends React.Component {render() {return (<div id='text_display'>default</div>)}}const e = React.createElement;const domContainer = document.querySelector('#text_display_container');ReactDOM.render(e(TextDisplay), domContainer);</script></body></html>";
        return code;
    }

    render() {
        return (
            <div class="h-screen">
                <div class="h-5/6">
                    <MarvinApplication code={this.state.currentApplicationCode}/>
                </div>
                <div class="h-1/6 border-2">
                    <CommandReciever commandText={this.state.commandText} onClick={() => this.recieveCommand()}/>
                </div>
            </div>
        );
    }

}

class MarvinApplication extends React.Component {

    render() {
        return <iframe id="application_iframe" srcDoc={this.props.code}></iframe>;
    }

}

class CommandReciever extends React.Component {

    render() {
        return(
            <div class="flex flex-col">
                <p>{this.props.commandText}</p>
                <button onClick={this.props.onClick}>Command</button>
            </div>
        );
    }

}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MarvinClient/>);
