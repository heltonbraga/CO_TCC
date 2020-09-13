import React from "react";
import { connect } from "react-redux";
import { getProntuario, createAnamnese, updateAnamnese } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Typography } from "@material-ui/core";
import { mapAnamneseFormToRequest } from "../form-tcc/dataFormat";
import AnamneseAlergia from "../form-tcc/AnamneseAlergia";
import AnamneseSangue from "../form-tcc/AnamneseSangue";

const stepCount = 2;

class FormAnamnese extends React.Component {
  state = {
    wait: false,
    page: 0,
    paciente: null,
    erros: [],
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
  }

  loadPaciente = (res) => {
    //const data = mapPacienteResponseToForm(res.data);
    this.setState({ wait: false, paciente: res.data, page: 1 });
  };

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  showSuccess = (res) => {
    this.props.setMessage({
      color: "primary",
      text: this.state.paciente.Anamnese ? "Anamnese atualizada!" : "Anamnese respondida!",
    });
    this.props.setTela("EDIT_PRONTUARIO:" + this.props.idPaciente + ":" + this.props.idAtendimento);
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onSubmit = (values, dispatch) => {
    if (this.props.readOnly) {
      return this.onCancel();
    }
    const data = mapAnamneseFormToRequest(
      values,
      this.state.paciente.Anamnese ? this.state.paciente.Anamnese.id : undefined,
      this.state.paciente.id,
      this.props.perfil.id
    );
    this.state.paciente.Anamnese
      ? updateAnamnese(data, this.props.setToken, this.showSuccess, this.showError)
      : createAnamnese(data, this.props.setToken, this.showSuccess, this.showError);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("EDIT_PRONTUARIO:" + this.props.idPaciente + ":" + this.props.idAtendimento);
  };

  render() {
    const page = this.state.page;
    const nome =
      this.state.paciente && this.state.paciente.Pessoa ? this.state.paciente.Pessoa.nome : "";
    return (
      <div className="WizForm">
        <Typography style={{ textAlign: "center" }} variant="h5" component="div">
          Anamnese
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
              <AnamneseAlergia
                previousPage={this.previousPage}
                onSubmit={this.nextPage}
                onCancel={this.onCancel}
                stepNumber={1}
                stepCount={stepCount}
                paciente={this.state.paciente}
                readOnly={this.props.readOnly}
                setTela={this.props.setTela}
              />
            )}
            {page === 2 && (
              <AnamneseSangue
                previousPage={this.previousPage}
                onSubmit={this.onSubmit}
                onCancel={this.onCancel}
                stepNumber={2}
                stepCount={stepCount}
                paciente={this.state.paciente}
                readOnly={this.props.readOnly}
                setTela={this.props.setTela}
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

export default connect(mapStateToProps, { setMessage, setTela })(FormAnamnese);
