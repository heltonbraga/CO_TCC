import React from "react";
import { Redirect } from "react-router-dom";

export default class HomeDentista extends React.Component {
  render() {
    return this.props.perfil && this.props.perfil.perfil !== "dentista" ? (
      <Redirect to={"/" + this.props.perfil.perfil} />
    ) : (
      <div>usuário logado como Dentista</div>
    );
  }
}
