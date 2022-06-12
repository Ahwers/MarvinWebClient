import React from 'react';
import MarvinApplication from './MarvinApplication';
import CommandReciever from './CommandReciever';

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
        httpRequest.setRequestHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiIwZTdjOGUxMy04MTQ4LTQ2ZTAtOTVhNS01MmIwYmE1YzU0M2UiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vODdiN2I1YjAtMmM5ZC00NmM2LTgxMzAtZTI0Yzg2MjU4NjI4L3YyLjAiLCJpYXQiOjE2NTUwNjI4MDgsIm5iZiI6MTY1NTA2MjgwOCwiZXhwIjoxNjU1MDY3MzgxLCJhaW8iOiJBVFFBeS84VEFBQUEzSFBmbDdKKytiUFNjQkdETVhQMjhQUGpraDg5MTFrVGNPU0txaXY3SWt6bXdFZXFyazhvdm5EckZMQjJiR2Y3IiwiYXpwIjoiNTg5MzE4NjUtYWM4Zi00ZGExLWE0ZjQtNjlhNzM0NDFmYzgyIiwiYXpwYWNyIjoiMCIsIm5hbWUiOiJDaHJpcyBHcmVlbiIsIm9pZCI6IjJkOWMwNWQzLTZjYTYtNDliNi1iZjI1LWVjNTMwMDU4OWExNSIsInByZWZlcnJlZF91c2VybmFtZSI6IkNocmlzQGpvc2hqb3BsaXZlY28ub25taWNyb3NvZnQuY29tIiwicmgiOiIwLkFZRUFzTFczaDUwc3hrYUJNT0pNaGlXR0tCT09mQTVJZ2VCR2xhVlNzTHBjVkQ2QkFFVS4iLCJzY3AiOiJhY2Nlc3NfYXNfdXNlciIsInN1YiI6ImdsMjJBbTNhbTNCdWhhNVBneTBOUmFySU5sdVRjdDJSMjctVUZsaXZTeWsiLCJ0aWQiOiI4N2I3YjViMC0yYzlkLTQ2YzYtODEzMC1lMjRjODYyNTg2MjgiLCJ1dGkiOiJSM3E4WDNIYnlVeU03RnJRZ2ZLNkFBIiwidmVyIjoiMi4wIn0.RujuQk-Sa8j495OcA9bnXEEmKiCqbFlWRtRjlVNWVw0m3kMOMOO-CsrDBJhqtTLVAm0X8t_9-gHeZM86Jj75tdNZCYhSxHCoIbuoS7SizD9SMtafKKKeSG2gY72p8WK3ZdlEtcArVlrkHbM1e1xO-B2aNhEZRdiCD2UZ0o19ZUYAQ_AWNL2-FjcOulRyME38MomFoz7-_zLuUF3_2X_OPr3-e9uiwbKpXGNTla5M5C2ioYw2PseiUNBonTPikAEZw3BOLsTVSYFsTvKYK12jlL0ehwhhgLnC4Msctjf5zz-jHaxkxsM3agkEglqwUJJrwVfSc2O0AYCB65-KY9ZSoA");
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

export default MarvinClient;