import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setTela } from "../actions";
import TabelaDentistas from "./dentista/TabelaDentistas";
import FormDentista from "./dentista/FormDentista";
import TabelaAuxiliares from "./auxiliar/TabelaAuxiliares";
import FormAuxiliar from "./auxiliar/FormAuxiliar";
import TabelaPacientes from "./paciente/TabelaPacientes";
import FormPaciente from "./paciente/FormPaciente";
import TabelaProcedimentos from "./procedimento/TabelaProcedimentos";
import FormProcedimento from "./procedimento/FormProcedimento";
import TabelaAtendimentos from "./atendimento/TabelaAtendimentos";
import FormAtendimento from "./atendimento/FormAtendimento";
import FormRelatorio from "./relatorio/FormRelatorio";
import logo from "./img/logo_md.png";

class HomeAdmin extends React.Component {
  renderInterno = (opcao, tela) => {
    if (!tela) {
      switch (opcao) {
        case "adminDent":
          return <TabelaDentistas />;
        case "adminAux":
          return <TabelaAuxiliares />;
        case "adminPac":
          return <TabelaPacientes />;
        case "adminProc":
          return <TabelaProcedimentos />;
        case "adminAtend":
          return <TabelaAtendimentos />;
        case "adminRel":
          return <FormRelatorio />;
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
      case "DENTISTA":
        return <FormDentista idDentista={id} readOnly={acao === "VIEW"} />;
      case "AUXILIAR":
        return <FormAuxiliar idAuxiliar={id} readOnly={acao === "VIEW"} />;
      case "PACIENTE":
        return <FormPaciente idPaciente={id} readOnly={acao === "VIEW"} />;
      case "PROCEDIMENTO":
        return <FormProcedimento idProcedimento={id} readOnly={acao === "VIEW"} />;
      case "ATENDIMENTO":
        return <FormAtendimento idAtendimento={id} readOnly={acao === "VIEW"} />;
      default:
        return <div>Administrador</div>;
    }
  };

  render() {
    let rota = this.props.perfil ? this.props.perfil.perfil : "";
    return rota !== "administrador" ? (
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

export default connect(mapStateToProps, { setTela })(HomeAdmin);
