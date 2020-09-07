import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { setTela, setMessage, setPerfil } from "../actions";
import { getUltimoEProximoAtd, cancelarAtendimento, getPerfil } from "./Api";
import FormAtendimentoPaciente from "./atendimento/FormAtendimentoPaciente";
import FormPacienteExt from "./paciente/FormPacienteExt";
import { Button, CircularProgress, Grid } from "@material-ui/core";
import HDialog from "./HDataTable/HDialog";

class HomePaciente extends React.Component {
  state = {
    ultimo: null,
    proximo: null,
    showDialog: false,
  };

  componentDidMount() {
    if (this.props.perfil && this.props.perfil.id > 0) {
      this.reloadAtd();
    }
  }

  reloadAtd = () => {
    this.props.setTela("");
    getUltimoEProximoAtd(
      this.props.perfil.id,
      this.props.setToken,
      this.loadAtendimentos,
      this.showError
    );
  };

  loadAtendimentos = (res) => {
    this.setState({ ultimo: res.data.ultimo, proximo: res.data.proximo, showDialog: false });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  onMarcarAtd = () => {
    if (this.props.perfil.id === 0) {
      this.props.setTela("CADASTRO");
    } else {
      this.props.setTela("MARCAR");
    }
  };

  cancelarAtendimento = () => {
    cancelarAtendimento(
      {
        id: this.state.proximo.id,
        user: this.props.perfil.id,
        motivo: "Pedido do paciente",
      },
      this.props.setToken,
      this.reloadAtd,
      this.showError
    );
  };

  renderCancelamento = () => {
    return (
      <div>
        <p>Atenção: O cancelamento de um atendimento é irreversível!</p>
      </div>
    );
  };

  renderPacienteDash = () => {
    return (
      <div>
        {this.state.proximo && (
          <div>
            <p>
              <b>Próximo atendimento:</b>
            </p>
            <p>
              {moment(this.state.proximo.dt_horario).format("DD/MM/YYYY HH:mm") +
                " - Dr(a) " +
                this.state.proximo.Dentista.Pessoa.nome}
            </p>
            {this.state.proximo.dm_situacao === "agendado" && (
              <div>
                <Grid container justify="center" spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => this.setState({ showDialog: true })}
                    >
                      Cancelar
                    </Button>{" "}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="default"
                      onClick={(e) => this.props.setTela("REMARCAR")}
                    >
                      Remarcar
                    </Button>
                  </Grid>
                </Grid>
              </div>
            )}
          </div>
        )}
        {this.state.ultimo && (
          <div>
            <p>
              <b>Último atendimento:</b>
              {moment(this.state.ultimo.dt_horario).format("DD/MM/YYYY HH:mm") +
                " - " +
                this.state.ultimo.Dentista.Pessoa.nome}
            </p>
          </div>
        )}
        {!this.state.proximo && (
          <div>
            <Button variant="contained" color="primary" onClick={this.onMarcarAtd}>
              Marcar {this.props.perfil.id > 0 ? "próximo" : ""} atendimento
            </Button>
          </div>
        )}
        {this.state.showDialog && (
          <HDialog
            title="Leia com atenção!"
            contentRender={this.renderCancelamento}
            open={this.state.showDialog}
            onClose={(e) => this.setState({ showDialog: false })}
            onPrimary={(e) => this.setState({ showDialog: false })}
            primaryLabel="Não"
            onSecondary={this.cancelarAtendimento}
            secondaryLabel="Sim, quero cancelar este atendimento"
          />
        )}
      </div>
    );
  };

  handlePerfilReload = (val) => {
    this.props.setPerfil(val);
    this.props.setTela("MARCAR");
  };

  renderInterno = () => {
    const tela = this.props.tela && this.props.tela.length > 0 ? this.props.tela : "DASH";
    switch (tela) {
      case "LOAD":
        getPerfil({ email: this.props.perfil.email }, this.handlePerfilReload);
        return <CircularProgress />;
      case "ATD_OK":
        this.reloadAtd();
        return <CircularProgress />;
      case "DASH":
        return this.renderPacienteDash();
      case "CADASTRO":
        return <FormPacienteExt />;
      default:
        return (
          <FormAtendimentoPaciente
            tela={tela}
            atendimento={this.state.proximo}
            idAtendimento={this.state.proximo ? this.state.proximo.id : undefined}
          />
        );
    }
  };

  render() {
    let rota = this.props.perfil ? this.props.perfil.perfil : "";
    return rota !== "paciente" ? (
      <Redirect to={"/" + rota} />
    ) : (
      <div className="basicDiv">{this.renderInterno()}</div>
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

export default connect(mapStateToProps, { setTela, setMessage, setPerfil })(HomePaciente);
