import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

class HomeAdmin extends React.Component {
  render() {
    return this.props.perfil !== "administrador" ? (
      <Redirect to={"/" + this.props.perfil} />
    ) : (
      <div>usuário logado como Admin - {this.props.opcaoSelecionadaMenu}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return { opcaoSelecionadaMenu: state.opcaoSelecionadaMenu };
};

export default connect(mapStateToProps)(HomeAdmin);
