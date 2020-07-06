import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ component: Component, path, perfil, ...rest }) => {

  const { loading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }
    const fn = async () => {
      await loginWithRedirect({
        appState: { targetUrl: path },
      });
    };
    fn();
  }, [loading, isAuthenticated, loginWithRedirect, path]);

  const render = (props) => (isAuthenticated === true ? <Component perfil={perfil} {...props} /> : null);

  return <Route path={path} render={render} {...rest} />;
};

export default ProtectedRoute;
