import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TabelaDentistas from "./admin-dentista/TabelaDentistas";
import { setTela } from "../actions";
import FormIncluirDentista from "./admin-dentista/FormIncluirDentista";

class HomeAdmin extends React.Component {

  renderInterno = (opcao, tela) => {
    if (opcao === "adminDent") {
      if (tela === "CREATE_DENTISTA") {
        return (
          <div>
            <FormIncluirDentista />
          </div>
        );
      }
      return <TabelaDentistas />;
    }
    return <div>Administrador</div>;
  };

  render() {
    return this.props.perfil !== "administrador" ? (
      <Redirect to={"/" + this.props.perfil} />
    ) : (
      <div>{this.renderInterno(this.props.opcaoSelecionadaMenu, this.props.tela)}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    opcaoSelecionadaMenu: state.opcaoSelecionadaMenu,
    setToken: state.setToken,
    tela: state.tela,
  };
};

export default connect(mapStateToProps, { setTela })(HomeAdmin);
