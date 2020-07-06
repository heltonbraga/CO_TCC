import React from "react";
import { Redirect } from "react-router-dom";

export default class HomeDentista extends React.Component {
  render() {
    return this.props.perfil !== "dentista" ? (
      <Redirect to={"/" + this.props.perfil} />
    ) : (
      <div>usuário logado como Dentista</div>
    );
  }
}
