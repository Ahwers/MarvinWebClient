import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
import MarvinClient from './components/MarvinClient';

// ========================================

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <MsalProvider instance={msalInstance}>
        <MarvinClient/>
    </MsalProvider>
);
