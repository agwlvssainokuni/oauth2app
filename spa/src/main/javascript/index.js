import _regeneratorRuntime from "babel-runtime/regenerator";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var clientConfig = {
    auth: {
        clientId: "oauth2app-spa",
        authority: "https://localhost:8443/auth/realms/mydemo/",
        knownAuthorities: ["localhost:8443"],
        protocolMode: "OIDC"
    }
};

var loginRequest = {
    redirectUri: "http://localhost:8082/blank"
};

var logoutRequest = {
    // mainWindowRedirectUri: "http://localhost:8082/",
    postLogoutRedirectUri: "http://localhost:8082/blank"
};

var publicClientApplication = new PublicClientApplication(clientConfig);

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            data: null
        };
        _this.handleLogin = _this.handleLogin.bind(_this);
        _this.handleLogout = _this.handleLogout.bind(_this);
        _this.handleApiCall = _this.handleApiCall.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "handleLogin",
        value: function handleLogin(event) {
            publicClientApplication.loginPopup(loginRequest);
        }
    }, {
        key: "handleLogout",
        value: function handleLogout(event) {
            publicClientApplication.logoutPopup(logoutRequest);
        }
    }, {
        key: "handleApiCall",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(event) {
                var account, response, accessToken;
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
                                accessToken = response.accessToken;

                                this.myapi(accessToken);

                            case 13:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function handleApiCall(_x) {
                return _ref.apply(this, arguments);
            }

            return handleApiCall;
        }()
    }, {
        key: "myapi",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(accessToken) {
                var headers, response, json;
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                headers = new Headers();

                                headers.append("Authorization", "Bearer " + accessToken);
                                _context2.next = 4;
                                return fetch("http://localhost:8081/myapi", {
                                    headers: headers
                                });

                            case 4:
                                response = _context2.sent;
                                _context2.next = 7;
                                return response.json();

                            case 7:
                                json = _context2.sent;

                                this.setState({
                                    data: json
                                });

                            case 9:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function myapi(_x2) {
                return _ref2.apply(this, arguments);
            }

            return myapi;
        }()
    }, {
        key: "render",
        value: function render() {
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
                            { onClick: this.handleLogin },
                            "\u30ED\u30B0\u30A4\u30F3"
                        )
                    ),
                    React.createElement(
                        AuthenticatedTemplate,
                        null,
                        React.createElement(
                            "button",
                            { onClick: this.handleLogout },
                            "\u30ED\u30B0\u30A2\u30A6\u30C8"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "button",
                        { onClick: this.handleApiCall },
                        "\u30C8\u30FC\u30AF\u30F3\u60C5\u5831"
                    )
                ),
                this.renderStateData()
            );
        }
    }, {
        key: "renderStateData",
        value: function renderStateData() {
            var _this2 = this;

            if (!this.state.data) {
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
                        this.state.data.name
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
                        this.state.data.issuedAt
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
                        this.state.data.expiresAt
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    "\u30D8\u30C3\u30C0"
                ),
                Object.keys(this.state.data.headers).map(function (k) {
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
                            _this2.valueToString(_this2.state.data.headers[k])
                        )
                    );
                }),
                React.createElement(
                    "div",
                    null,
                    "\u30AF\u30EC\u30FC\u30E0"
                ),
                Object.keys(this.state.data.claims).map(function (k) {
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
                            _this2.valueToString(_this2.state.data.claims[k])
                        )
                    );
                })
            );
        }
    }, {
        key: "valueToString",
        value: function valueToString(value) {
            var _this3 = this;

            if (value instanceof String) {
                return value;
            }
            if (value instanceof Number) {
                return value.toString();
            }
            if (value instanceof Array) {
                return "[" + value.map(function (e) {
                    return _this3.valueToString(e);
                }).join(", ") + "]";
            }
            if (value instanceof Object) {
                return "{" + Object.keys(value).map(function (k) {
                    return k.toString() + ": " + _this3.valueToString(value[k]);
                }).join(", ") + "}";
            }
            return value.toString();
        }
    }]);

    return App;
}(React.Component);

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