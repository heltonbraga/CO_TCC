import React from "react";
import ReactDOM from "react-dom";
import WebFont from "webfontloader";
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";

import App from "./App";

import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

WebFont.load({
  google: {
    families: ["Courgette:300,400,700", "sans-serif"],
  },
});

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl ? appState.targetUrl : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN}
    clientId={process.env.REACT_APP_AUTH_CLIENTID}
    audience={process.env.REACT_APP_AUTH_AUDIENCE}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <React.Fragment>
      <Provider store={createStore(reducers)}>
        <App />
      </Provider>
    </React.Fragment>
  </Auth0Provider>,
  document.getElementById("root")
);
