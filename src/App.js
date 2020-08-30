import React from "react";
import { connect } from "react-redux";
import { setToken, setMessage, setPerfil } from "./actions";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Button, Nav, Alert } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getPerfil } from "./components/Api";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Menu from "./components/Menu";
import Home from "./components/Home";
import HomeAdmin from "./components/HomeAdmin";
import HomeDentista from "./components/HomeDentista";
import HomeAuxiliar from "./components/HomeAuxiliar";
import HomePaciente from "./components/HomePaciente";

import "./App.css";

function App(props) {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  if (isAuthenticated && !props.perfil) {
    getPerfil(user, props.setPerfil);
    getAccessTokenSilently().then((token) => props.setToken(token));
  }

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <CircularProgress
          style={{
            margin: "0px auto",
          }}
        />
      </div>
    );
  }

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const messageAlert = () => {
    if (props.message) {
      setTimeout(() => props.setMessage(null), 10000);
      return props.message.text;
    }
    return "";
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="right-align">
          <Nav pills>
            {!isAuthenticated && (
              <Button color="primary" size="sm" onClick={() => loginWithRedirect({})}>
                Entrar
              </Button>
            )}
            {isAuthenticated && <Menu user={user} logout={logoutWithRedirect} />}
          </Nav>
        </div>
        <Container className="flex-grow-1 mt-5">
          <Alert
            color={props.message ? props.message.color : "primary"}
            isOpen={props.message !== null}
            toggle={(e) => props.setMessage(null)}
          >
            {messageAlert()}
          </Alert>
          <Switch>
            <Route exact path="/" render={(props) => <Home />} />
            <ProtectedRoute path="/administrador" component={HomeAdmin} />
            <ProtectedRoute path="/dentista" component={HomeDentista} />
            <ProtectedRoute path="/auxiliar" component={HomeAuxiliar} />
            <ProtectedRoute path="/paciente" component={HomePaciente} />
            <Route
              path="*"
              component={() => (
                <h3>
                  Acho que você pegou um link defeituoso... toma esse que está novinho:{" "}
                  <a href="..">LINK</a>
                </h3>
              )}
            />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

const mapStateToProps = (state) => {
  return { setToken: state.setToken, message: state.message, perfil: state.perfil };
};

export default connect(mapStateToProps, { setToken, setMessage, setPerfil })(App);
