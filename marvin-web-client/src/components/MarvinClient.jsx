import React, {useState} from "react";
import MarvinApplication from './MarvinApplication';
import { CommandReciever } from './CommandReciever';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export const MarvinClient = () => {

    const [ currentApplicationCode, setCurrentApplicationCode ] = useState();
    const [ commandText, setCommandText ] = useState();
    const [ currentTextDisplayApplicationText, setCurrentTextDisplayApplicationText ] = useState();

    React.useEffect(() => {
        var applicationIframe = document.getElementById('application_iframe');
        applicationIframe.addEventListener("load", () => {
            var textDisplay = applicationIframe.contentWindow.document.getElementById("text_display");
            textDisplay.innerHTML = currentTextDisplayApplicationText;
        });
    }, [currentTextDisplayApplicationText]);

    const { instance, accounts } = useMsal();

    function recieveCommand() {
        var command = listenToVoiceCommand();

        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        instance.acquireTokenSilent(request).then((response) => {
            commandMarvinWithAccessToken(command, response.accessToken);
        }).catch((e) => {
            instance.acquireTokenPopup(request).then((response) => {
                commandMarvinWithAccessToken(command, response.accessToken);
            });
        });
    }

    // TODO: Implement
    function listenToVoiceCommand() {
        const command = "who am i";
        setCommandText(command);

        return command;
    }

    function commandMarvinWithAccessToken(command, accessToken) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open("POST", "http://127.0.0.1:8080/MarvinService/service/command", true);
        httpRequest.setRequestHeader("Content-Type", "application/json");
        httpRequest.setRequestHeader("Authorization", ("Bearer " + accessToken));
        httpRequest.onreadystatechange = function() {
            if ((httpRequest.readyState === XMLHttpRequest.DONE) && (httpRequest.status === 200)) {
                const marvinResponse = JSON.parse(httpRequest.responseText);
                processMarvinResponse(marvinResponse);
            }
        };
        var data = { command: command };
        httpRequest.send(JSON.stringify(data));
    }

    // TODO: Toast message or have Marvin read out the resource.message
    function processMarvinResponse(marvinResponse) {
        const resource = marvinResponse.resource;
        if (resource) {
            const resourceType = resource.type;
            // TODO: Save plain text application as html file and load that. Then we can do styles and that
            if (resourceType === "PLAIN_TEXT") {
                setCurrentApplicationCode(getPlainTextDisplayApplicationCode());
                setCurrentTextDisplayApplicationText(resource.content);
            }
            else if (resourceType === "HTML_APPLICATION_INTERFACE") {
                setCurrentApplicationCode(resource.content);
            }
        }
    }

    function getPlainTextDisplayApplicationCode() {
        const code = "<html><head><title>Text Display</title></head><body><div id='text_display_container'></div><script src='https://unpkg.com/react@17/umd/react.development.js' crossorigin></script><script src='https://unpkg.com/react-dom@17/umd/react-dom.development.js' crossorigin></script><script src='https://unpkg.com/babel-standalone@6/babel.min.js'></script><script type='text/babel'>class TextDisplay extends React.Component {render() {return (<div id='text_display'>default</div>)}}const e = React.createElement;const domContainer = document.querySelector('#text_display_container');ReactDOM.render(e(TextDisplay), domContainer);</script></body></html>";
        return code;
    }

    return (
        <div class="h-screen">
            <div class="h-5/6">
                <MarvinApplication code={currentApplicationCode}/>
            </div>
            <div class="h-1/6 border-2">
                <CommandReciever commandText={commandText} onClick={() => recieveCommand()}/>
            </div>
        </div>
    );

}

export default MarvinClient;