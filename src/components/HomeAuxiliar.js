import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setTela } from "../actions";
import TabelaPacientes from "./paciente/TabelaPacientes";
import FormPaciente from "./paciente/FormPaciente";
import TabelaAtendimentos from "./atendimento/TabelaAtendimentos";
import FormAtendimento from "./atendimento/FormAtendimento";
import logo from "./img/logo_md.png";

class HomeAuxiliar extends React.Component {
  renderInterno = (opcao, tela) => {
    if (!tela) {
      switch (opcao) {
        case "auxPac":
          return <TabelaPacientes />;
        case "auxAtd":
          return <TabelaAtendimentos />;
        default:
          return (
            <div className="basicDiv">
              <img
                style={{
                  margin: "0px auto",
                }}
                alt="logo"
                src={logo}
              />
            </div>
          );
      }
    }
    const p1 = tela.indexOf("_");
    const p2 = tela.indexOf(":");
    const acao = tela.slice(0, p1);
    const entidade = tela.slice(p1 + 1, p2 < 0 ? tela.length : p2);
    const id = p2 < 0 ? null : tela.slice(p2 + 1);
    //
    switch (entidade) {
      case "PACIENTE":
        return <FormPaciente idPaciente={id} readOnly={acao === "VIEW"} />;
      case "ATENDIMENTO":
        return <FormAtendimento idAtendimento={id} readOnly={acao === "VIEW"} />;
      default:
        return <div>Auxiliar</div>;
    }
  };

  render() {
    let rota = this.props.perfil ? this.props.perfil.perfil : "";
    return rota !== "auxiliar" ? (
      <Redirect to={"/" + rota} />
    ) : (
      <div className="basicDiv">
        {this.renderInterno(this.props.opcaoSelecionadaMenu, this.props.tela)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    opcaoSelecionadaMenu: state.opcaoSelecionadaMenu,
    setToken: state.setToken,
    tela: state.tela,
    perfil: state.perfil,
  };
};

export default connect(mapStateToProps, { setTela })(HomeAuxiliar);
