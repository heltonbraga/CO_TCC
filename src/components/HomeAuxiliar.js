import React from "react";
import { Redirect } from "react-router-dom";

export default class HomeAuxiliar extends React.Component {
  render() {
    return this.props.perfil !== "auxiliar" ? (
      <Redirect to={"/" + this.props.perfil} />
    ) : (
      <div>usuário logado como Auxiliar</div>
    );
  }
}
