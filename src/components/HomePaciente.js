import React from "react";
import { Redirect } from "react-router-dom";

export default class HomePaciente extends React.Component {
  render() {
    return this.props.perfil !== "paciente" ? (
      <Redirect to={"/" + this.props.perfil} />
    ) : (
      <div>usuário logado como Paciente</div>
    );
  }
}
