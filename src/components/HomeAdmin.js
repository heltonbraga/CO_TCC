import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TabelaDentistas from "./admin-dentista/TabelaDentistas";
import { setTela } from "../actions";
import FormDentista from "./admin-dentista/FormDentista";

class HomeAdmin extends React.Component {
  renderInterno = (opcao, tela) => {
    if (opcao === "adminDent") {
      if (tela === "CREATE_DENTISTA") {
        return (
          <div>
            <FormDentista />
          </div>
        );
      }

      if (tela && tela.slice(0, 13) === "EDIT_DENTISTA") {
        return (
          <div>
            <FormDentista idDentista={tela.slice(14)} />
          </div>
        );
      }

      if (tela && tela.slice(0, 13) === "VIEW_DENTISTA") {
        return (
          <div>
            <FormDentista idDentista={tela.slice(14)} readOnly={true} />
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
