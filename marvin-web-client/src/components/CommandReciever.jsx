import React from 'react';

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

export default CommandReciever;