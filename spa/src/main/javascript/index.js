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
    protocolMode: "OIDC"
  }
};
const loginRequest = {
  redirectUri: uri("/blank")
};
const logoutRequest = {
  // mainWindowRedirectUri: uri("/"),
  postLogoutRedirectUri: uri("/blank")
};
const publicClientApplication = new PublicClientApplication(clientConfig);

const login = () => {
  publicClientApplication.loginPopup(loginRequest);
};

const logout = () => {
  publicClientApplication.logoutPopup(logoutRequest);
};

const acquireToken = async () => {
  const account = publicClientApplication.getAllAccounts()[0];
  let response = account ? await publicClientApplication.acquireTokenSilent({ ...loginRequest,
    account: account
  }) : await publicClientApplication.acquireTokenPopup({ ...loginRequest
  });
  return response.accessToken;
};

function App(props) {
  let [data, setData] = useState(null);

  const myapi = async () => {
    const accessToken = await acquireToken();
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + accessToken);
    let response = await fetch("http://localhost:8081/myapi", {
      headers: headers
    });
    let json = await response.json();
    setData(json);
  };

  const renderData = () => {
    if (!data) {
      return /*#__PURE__*/React.createElement(React.Fragment, null);
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u540D\u524D: "), /*#__PURE__*/React.createElement("span", null, data.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "issuedAt: "), /*#__PURE__*/React.createElement("span", null, data.issuedAt)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "expiresAt: "), /*#__PURE__*/React.createElement("span", null, data.expiresAt)), /*#__PURE__*/React.createElement("div", null, "\u30D8\u30C3\u30C0"), Object.keys(data.headers).map(k => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, k, ": "), /*#__PURE__*/React.createElement("span", null, valueToString(data.headers[k])))), /*#__PURE__*/React.createElement("div", null, "\u30AF\u30EC\u30FC\u30E0"), Object.keys(data.claims).map(k => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, k, ": "), /*#__PURE__*/React.createElement("span", null, valueToString(data.claims[k])))));
  };

  const valueToString = value => {
    if (value instanceof String) {
      return value;
    }

    if (value instanceof Number) {
      return value.toString();
    }

    if (value instanceof Array) {
      return "[" + value.map(e => valueToString(e)).join(", ") + "]";
    }

    if (value instanceof Object) {
      return "{" + Object.keys(value).map(k => k.toString() + ": " + valueToString(value[k])).join(", ") + "}";
    }

    return value.toString();
  };

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(UnauthenticatedTemplate, null, /*#__PURE__*/React.createElement("button", {
    onClick: e => login()
  }, "\u30ED\u30B0\u30A4\u30F3")), /*#__PURE__*/React.createElement(AuthenticatedTemplate, null, /*#__PURE__*/React.createElement("button", {
    onClick: e => logout()
  }, "\u30ED\u30B0\u30A2\u30A6\u30C8"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: e => myapi()
  }, "\u30C8\u30FC\u30AF\u30F3\u60C5\u5831")), renderData());
}

window.onload = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(MsalProvider, {
    instance: publicClientApplication
  }, /*#__PURE__*/React.createElement(App, null))), document.querySelector("main"));
};