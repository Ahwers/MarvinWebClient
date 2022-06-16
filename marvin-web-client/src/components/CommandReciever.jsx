import React from 'react';
import { SignInButton } from './SignInButton';
import { SignOutButton } from './SignOutButton';
import { useIsAuthenticated } from "@azure/msal-react";

export const CommandReciever = (props) => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <div class="flex flex-col">
            {/* TODO: Put text in middle, like allign in middle? Idk what it's called. */}
            <p>{props.commandText}</p>
            <button onClick={props.onClick}>Command</button>
            { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
        </div>
    );
};
