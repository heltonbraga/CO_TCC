import React from "react";
import { connect } from "react-redux";
import { getProntuario, getAllDentistas, updateProtuario } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Typography } from "@material-ui/core";
import { mapPacienteResponseToForm, mapProntuarioFormToRequest } from "../form-tcc/dataFormat";
import ProAnamnese from "../form-tcc/ProAnamnese";
import ProTratamento from "../form-tcc/ProTratamento";
import ProHistorico from "../form-tcc/ProHistorico";

const stepCount = 3;

class FormProntuario extends React.Component {
  state = {
    wait: false,
    page: 0,
    paciente: null,
    erros: [],
    dentistas: [],
  };

  componentDidMount() {
    if (this.props.idPaciente) {
      getProntuario(
        this.props.idPaciente,
        this.props.perfil.id,
        this.props.setToken,
        this.loadPaciente,
        this.showError
      );
      this.setState({ wait: true });
    }
    getAllDentistas(1, 10000, "nome-asc", this.props.setToken, this.loadDentistas, this.showError);
  }

  loadDentistas = (res) => {
    this.setState({ dentistas: res.data.registros });
  };

  loadPaciente = (res) => {
    const data = mapPacienteResponseToForm(res.data);
    this.setState({ wait: false, paciente: data, page: 1 });
  };

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  showSuccess = (res) => {
    this.props.setMessage({
      color: "primary",
      text: "Prontuário atualizado!",
    });
    this.props.setTela("");
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onSubmit = (values) => {
    if (this.props.readOnly) {
      return this.onCancel();
    }
    let dent = this.state.dentistas.filter((d) => d.id === this.props.perfil.id);
    const data = mapProntuarioFormToRequest(
      values,
      this.state.paciente,
      dent[0],
      this.props.idAtendimento
    );
    updateProtuario(data, this.props.setToken, this.showSuccess, this.showError);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    const page = this.state.page;
    const nome = this.state.paciente ? this.state.paciente.nome : "";
    return (
      <div className="WizForm">
        <Typography style={{ textAlign: "center" }} variant="h5" component="div">
          Prontuário
        </Typography>
        {this.state.wait && (
          <CircularProgress
            style={{
              margin: "0px auto",
            }}
          />
        )}
        {!this.state.wait && (
          <div>
            <p>
              <b>Paciente: </b> {nome}
            </p>
            {page === 1 && (
              <ProAnamnese
                previousPage={this.previousPage}
                handleSubmit={this.nextPage}
                onCancel={this.onCancel}
                stepNumber={1}
                stepCount={stepCount}
                idAtendimento={this.props.idAtendimento}
                paciente={this.state.paciente}
                readOnly={this.props.readOnly}
                setTela={this.props.setTela}
              />
            )}
            {page === 2 && (
              <ProTratamento
                previousPage={this.previousPage}
                handleSubmit={this.nextPage}
                onCancel={this.onCancel}
                stepNumber={2}
                stepCount={stepCount}
                paciente={this.state.paciente}
                readOnly={this.props.readOnly}
              />
            )}
            {page === 3 && (
              <ProHistorico
                previousPage={this.previousPage}
                onSubmit={this.onSubmit}
                onCancel={this.onCancel}
                stepNumber={3}
                stepCount={stepCount}
                perfil={this.props.perfil}
                dentistas={this.state.dentistas}
                paciente={this.state.paciente}
                readOnly={this.props.readOnly}
              />
            )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    setToken: state.setToken,
    message: state.message,
    tela: state.tela,
    perfil: state.perfil,
  };
};

export default connect(mapStateToProps, { setMessage, setTela })(FormProntuario);
