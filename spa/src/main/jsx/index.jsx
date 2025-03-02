/*
 * Copyright 2021,2022 agwlvssainokuni
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
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { uri } from "./resolver";

const clientConfig = {
    auth: {
        clientId: "oauth2app-spa",
        authority: "https://localhost:8443/auth/realms/mydemo/",
        knownAuthorities: ["localhost:8443"],
        protocolMode: "OIDC",
    }
};

const loginRequest = {
    redirectUri: uri("/blank"),
};

const logoutRequest = {
    // mainWindowRedirectUri: uri("/"),
    postLogoutRedirectUri: uri("/blank"),
};

const publicClientApplication = new PublicClientApplication(clientConfig);

const login = () => {
    publicClientApplication.loginPopup(loginRequest);
}

const logout = () => {
    publicClientApplication.logoutPopup(logoutRequest);
}

const acquireToken = async () => {
    const account = publicClientApplication.getAllAccounts()[0];
    let response = account ?
        await publicClientApplication.acquireTokenSilent({
            ...loginRequest,
            account: account,
        }) :
        await publicClientApplication.acquireTokenPopup({
            ...loginRequest,
        });
    return response.accessToken;
}

function App(props) {
    let [data, setData] = useState(null);

    const myapi = async () => {
        const accessToken = await acquireToken();

        let headers = new Headers();
        headers.append("Authorization", "Bearer " + accessToken);
        let response = await fetch("http://localhost:8081/myapi", {
            headers: headers,
        });
        let json = await response.json();

        setData(json);
    }

    const renderData = () => {
        if (!data) {
            return <React.Fragment />;
        }
        return (<React.Fragment>
            <div>
                <span>名前: </span>
                <span>{data.name}</span>
            </div>
            <div>
                <span>issuedAt: </span>
                <span>{data.issuedAt}</span>
            </div>
            <div>
                <span>expiresAt: </span>
                <span>{data.expiresAt}</span>
            </div>
            <div>ヘッダ</div>
            {
                Object.keys(data.headers).map((k) =>
                    <div>
                        <span>{k}: </span>
                        <span>{valueToString(data.headers[k])}</span>
                    </div>
                )
            }
            <div>クレーム</div>
            {
                Object.keys(data.claims).map((k) =>
                    <div>
                        <span>{k}: </span>
                        <span>{valueToString(data.claims[k])}</span>
                    </div>
                )
            }
        </React.Fragment>);
    }

    const valueToString = (value) => {
        if (value instanceof String) {
            return value;
        }
        if (value instanceof Number) {
            return value.toString();
        }
        if (value instanceof Array) {
            return "[" + value.map((e) => valueToString(e)).join(", ") + "]";
        }
        if (value instanceof Object) {
            return "{" + Object.keys(value).map((k) => k.toString() + ": " + valueToString(value[k])).join(", ") + "}";
        }
        return value.toString();
    }

    return (<React.Fragment>
        <div>
            <UnauthenticatedTemplate>
                <button onClick={(e) => login()}>ログイン</button>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <button onClick={(e) => logout()}>ログアウト</button>
            </AuthenticatedTemplate>
        </div>
        <div>
            <button onClick={(e) => myapi()}>トークン情報</button>
        </div>
        {renderData()}
    </React.Fragment>);
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
