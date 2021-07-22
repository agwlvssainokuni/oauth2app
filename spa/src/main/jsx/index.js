/*
 * Copyright 2021 agwlvssainokuni
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// ENTRY

import { PublicClientApplication } from "@azure/msal-browser";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from "@azure/msal-react";
import React from "react";
import ReactDOM from "react-dom";

const clientConfig = {
    auth: {
        clientId: "oauth2app-spa",
        authority: "https://localhost:8443/auth/realms/mydemo/",
        knownAuthorities: ["localhost:8443"],
        protocolMode: "OIDC"
    }
};

const loginRequest = {
    redirectUri: "http://localhost:8082/blank"
};

const logoutRequest = {
    // mainWindowRedirectUri: "http://localhost:8082/",
    postLogoutRedirectUri: "http://localhost:8082/blank"
};

const publicClientApplication = new PublicClientApplication(clientConfig);

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleApiCall = this.handleApiCall.bind(this);
    }

    handleLogin(event) {
        publicClientApplication.loginPopup(loginRequest);
    }

    handleLogout(event) {
        publicClientApplication.logoutPopup(logoutRequest);
    }

    async handleApiCall(event) {
        const account = publicClientApplication.getAllAccounts()[0];
        let response = account ?
            await publicClientApplication.acquireTokenSilent({
                ...loginRequest,
                account: account
            }) :
            await publicClientApplication.acquireTokenPopup({
                ...loginRequest
            });
        let accessToken = response.accessToken;
        this.myapi(accessToken);
    }

    async myapi(accessToken) {
        let headers = new Headers();
        headers.append("Authorization", "Bearer " + accessToken);
        let response = await fetch("http://localhost:8081/myapi", {
            headers: headers
        });
        let json = await response.json();
        this.setState({
            data: json,
        });
    }

    render() {
        return (<React.Fragment>
            <div>
                <UnauthenticatedTemplate>
                    <button onClick={this.handleLogin}>ログイン</button>
                </UnauthenticatedTemplate>
                <AuthenticatedTemplate>
                    <button onClick={this.handleLogout}>ログアウト</button>
                </AuthenticatedTemplate>
            </div>
            <div>
                <button onClick={this.handleApiCall}>トークン情報</button>
            </div>
            {this.renderStateData()}
        </React.Fragment>);
    }

    renderStateData() {
        if (!this.state.data) {
            return <React.Fragment />;
        }
        return (<React.Fragment>
            <div>
                <span>名前: </span>
                <span>{this.state.data.name}</span>
            </div>
            <div>
                <span>issuedAt: </span>
                <span>{this.state.data.issuedAt}</span>
            </div>
            <div>
                <span>expiresAt: </span>
                <span>{this.state.data.expiresAt}</span>
            </div>
            <div>ヘッダ</div>
            {
                Object.keys(this.state.data.headers).map((k) =>
                    <div>
                        <span>{k}: </span>
                        <span>{this.valueToString(this.state.data.headers[k])}</span>
                    </div>
                )
            }
            <div>クレーム</div>
            {
                Object.keys(this.state.data.claims).map((k) =>
                    <div>
                        <span>{k}: </span>
                        <span>{this.valueToString(this.state.data.claims[k])}</span>
                    </div>
                )
            }
        </React.Fragment>);
    }

    valueToString(value) {
        if (value instanceof String) {
            return value;
        }
        if (value instanceof Number) {
            return value.toString();
        }
        if (value instanceof Array) {
            return "[" + value.map((e) => this.valueToString(e)).join(", ") + "]";
        }
        if (value instanceof Object) {
            return "{" + Object.keys(value).map((k) => k.toString() + ": " + this.valueToString(value[k])).join(", ") + "}";
        }
        return value.toString();
    }
}

window.onload = () => {
    ReactDOM.render(
        <React.StrictMode>
            <MsalProvider instance={publicClientApplication}>
                <App />
            </ MsalProvider>
        </React.StrictMode>,
        document.querySelector("main")
    );
};
