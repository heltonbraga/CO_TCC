import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Button, Nav } from "reactstrap";

import { getPerfil } from "./components/Api";

import Header from "./components/Header";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import Menu from "./components/Menu";
import Home from "./components/Home";
import HomeAdmin from "./components/HomeAdmin";
import HomeDentista from "./components/HomeDentista";
import HomeAuxiliar from "./components/HomeAuxiliar";
import HomePaciente from "./components/HomePaciente";

import "./App.css";

function App() {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  const perfil = isAuthenticated ? getPerfil(user) : "";

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
            {isAuthenticated && <Menu perfil={perfil} user={user} logout={logoutWithRedirect} />}
          </Nav>
        </div>
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route exact path="/" render={(props) => <Home perfil={perfil} />} />
            <ProtectedRoute path="/administrador" perfil={perfil} component={HomeAdmin} />
            <ProtectedRoute path="/dentista" perfil={perfil} component={HomeDentista} />
            <ProtectedRoute path="/auxiliar" perfil={perfil} component={HomeAuxiliar} />
            <ProtectedRoute path="/paciente" perfil={perfil} component={HomePaciente} />
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

export default App;
