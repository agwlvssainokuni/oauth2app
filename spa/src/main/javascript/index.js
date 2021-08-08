import _regeneratorRuntime from "babel-runtime/regenerator";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _this = this;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { uri } from "../javascript/resolver";

var clientConfig = {
    auth: {
        clientId: "oauth2app-spa",
        authority: "https://localhost:8443/auth/realms/mydemo/",
        knownAuthorities: ["localhost:8443"],
        protocolMode: "OIDC"
    }
};

var loginRequest = {
    redirectUri: uri("/blank")
};

var logoutRequest = {
    // mainWindowRedirectUri: uri("/"),
    postLogoutRedirectUri: uri("/blank")
};

var publicClientApplication = new PublicClientApplication(clientConfig);

var login = function login() {
    publicClientApplication.loginPopup(loginRequest);
};

var logout = function logout() {
    publicClientApplication.logoutPopup(logoutRequest);
};

var acquireToken = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var account, response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        account = publicClientApplication.getAllAccounts()[0];

                        if (!account) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 4;
                        return publicClientApplication.acquireTokenSilent(Object.assign({}, loginRequest, {
                            account: account
                        }));

                    case 4:
                        _context.t0 = _context.sent;
                        _context.next = 10;
                        break;

                    case 7:
                        _context.next = 9;
                        return publicClientApplication.acquireTokenPopup(Object.assign({}, loginRequest));

                    case 9:
                        _context.t0 = _context.sent;

                    case 10:
                        response = _context.t0;
                        return _context.abrupt("return", response.accessToken);

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this);
    }));

    return function acquireToken() {
        return _ref.apply(this, arguments);
    };
}();

function App(props) {
    var _this2 = this;

    var _useState = useState(null),
        _useState2 = _slicedToArray(_useState, 2),
        data = _useState2[0],
        setData = _useState2[1];

    var myapi = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
            var accessToken, headers, response, json;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return acquireToken();

                        case 2:
                            accessToken = _context2.sent;
                            headers = new Headers();

                            headers.append("Authorization", "Bearer " + accessToken);
                            _context2.next = 7;
                            return fetch("http://localhost:8081/myapi", {
                                headers: headers
                            });

                        case 7:
                            response = _context2.sent;
                            _context2.next = 10;
                            return response.json();

                        case 10:
                            json = _context2.sent;


                            setData(json);

                        case 12:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2);
        }));

        return function myapi() {
            return _ref2.apply(this, arguments);
        };
    }();

    var renderData = function renderData() {
        if (!data) {
            return React.createElement(React.Fragment, null);
        }
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "\u540D\u524D: "
                ),
                React.createElement(
                    "span",
                    null,
                    data.name
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "issuedAt: "
                ),
                React.createElement(
                    "span",
                    null,
                    data.issuedAt
                )
            ),
            React.createElement(
                "div",
                null,
                React.createElement(
                    "span",
                    null,
                    "expiresAt: "
                ),
                React.createElement(
                    "span",
                    null,
                    data.expiresAt
                )
            ),
            React.createElement(
                "div",
                null,
                "\u30D8\u30C3\u30C0"
            ),
            Object.keys(data.headers).map(function (k) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        null,
                        k,
                        ": "
                    ),
                    React.createElement(
                        "span",
                        null,
                        valueToString(data.headers[k])
                    )
                );
            }),
            React.createElement(
                "div",
                null,
                "\u30AF\u30EC\u30FC\u30E0"
            ),
            Object.keys(data.claims).map(function (k) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        null,
                        k,
                        ": "
                    ),
                    React.createElement(
                        "span",
                        null,
                        valueToString(data.claims[k])
                    )
                );
            })
        );
    };

    var valueToString = function valueToString(value) {
        if (value instanceof String) {
            return value;
        }
        if (value instanceof Number) {
            return value.toString();
        }
        if (value instanceof Array) {
            return "[" + value.map(function (e) {
                return valueToString(e);
            }).join(", ") + "]";
        }
        if (value instanceof Object) {
            return "{" + Object.keys(value).map(function (k) {
                return k.toString() + ": " + valueToString(value[k]);
            }).join(", ") + "}";
        }
        return value.toString();
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            "div",
            null,
            React.createElement(
                UnauthenticatedTemplate,
                null,
                React.createElement(
                    "button",
                    { onClick: function onClick(e) {
                            return login();
                        } },
                    "\u30ED\u30B0\u30A4\u30F3"
                )
            ),
            React.createElement(
                AuthenticatedTemplate,
                null,
                React.createElement(
                    "button",
                    { onClick: function onClick(e) {
                            return logout();
                        } },
                    "\u30ED\u30B0\u30A2\u30A6\u30C8"
                )
            )
        ),
        React.createElement(
            "div",
            null,
            React.createElement(
                "button",
                { onClick: function onClick(e) {
                        return myapi();
                    } },
                "\u30C8\u30FC\u30AF\u30F3\u60C5\u5831"
            )
        ),
        renderData()
    );
}

window.onload = function () {
    ReactDOM.render(React.createElement(
        React.StrictMode,
        null,
        React.createElement(
            MsalProvider,
            { instance: publicClientApplication },
            React.createElement(App, null)
        )
    ), document.querySelector("main"));
};