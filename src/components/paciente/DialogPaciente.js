import React from "react";
import moment from "moment";
import { createPaciente, getPaciente, updatePaciente } from "../Api";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { Alert } from "reactstrap";
import {
  formatar,
  mapPacienteFormToRequest,
  mapPacienteResponseToForm,
} from "../form-tcc/dataFormat";
import { validarCPF } from "../form-tcc/validate";

const obrigatorios = ["nome", "cpf", "email", "tel1"];

export default class FormPaciente extends React.Component {
  state = {
    wait: false,
    nome: "",
    cpf: "",
    nascimento: "",
    email: "",
    tel1: "",
    erros: [],
  };

  componentDidMount() {
    if (this.props.paciente) {
      const data = mapPacienteResponseToForm(this.props.paciente);
      this.setState({
        idPaciente: data.id,
        nome: data.nome,
        cpf: data.cpf,
        nascimento: data.nascimento,
        email: data.email,
        tel1: data.tel1,
      });
    } else if (this.props.sugestao) {
      this.setState({ nome: this.props.sugestao });
    }
  }

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  showSuccess = (res) => {
    this.props.callback(res.data.id);
  };

  onSubmit = () => {
    const { nome, cpf, nascimento, email, tel1 } = this.state;
    const data = mapPacienteFormToRequest(
      { nome, cpf, nascimento, email, tel1 },
      this.props.paciente ? this.props.paciente.id : null
    );
    this.props.paciente
      ? updatePaciente(data, this.props.token, this.showSuccess, this.showError)
      : createPaciente(data, this.props.token, this.showSuccess, this.showError);
    this.setState({ wait: true });
  };

  validate = (e) => {
    const campo = e.target.id;
    const valor = e.target.value;
    let errors = this.state.erros;
    if (obrigatorios.indexOf(campo) >= 0) {
      errors[campo] = valor === null || valor === "" ? "Preenchimento obrigatório" : null;
    }
    if (valor && campo === "cpf" && !validarCPF(valor.replace(/(\D)/g, ""))) {
      errors[campo] = "CPF inválido";
    } else if (
      valor &&
      campo === "email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(valor)
    ) {
      errors[campo] = "Email inválido";
    } else if (campo === "nascimento") {
      //errors[campo] = moment(valor, "YYYY-MM-DD", true).isValid() ? null : "Data inválida";
      if (!moment(valor, "YYYY-MM-DD", true).isValid()) {
        e.target.value = "";
      }
    }
    this.setState({ erros: errors });
  };

  renderFields = () => {
    const erros = this.state.erros;
    return (
      <div className="formDialog">
        <h2>Cadastro de paciente</h2>
        <div> </div>
        {this.state.wait && <CircularProgress />}
        <TextField
          id="nome"
          label="Nome"
          placeholder="Nome"
          className="FormTextField"
          error={erros.nome !== null && erros.nome !== undefined}
          helperText={erros.nome}
          value={this.state.nome}
          onChange={(e) => {
            this.setState({ nome: e.target.value });
          }}
          onBlur={this.validate}
        />
        <TextField
          id="cpf"
          label="CPF"
          placeholder="CPF"
          className="FormTextField"
          error={erros.cpf !== null && erros.cpf !== undefined}
          helperText={erros.cpf}
          value={this.state.cpf}
          onKeyUp={(e) => {
            e.target.value = formatar(e.target.value, "cpf");
          }}
          onChange={(e) => {
            this.setState({ cpf: e.target.value ? e.target.value : null });
          }}
          onBlur={this.validate}
        />
        <TextField
          id="email"
          label="Email"
          placeholder="Email"
          className="FormTextField"
          error={erros.email !== null && erros.email !== undefined}
          helperText={erros.email}
          value={this.state.email}
          onChange={(e) => {
            this.setState({ email: e.target.value });
          }}
          onBlur={this.validate}
        />
        <TextField
          id="tel1"
          label="Celular"
          placeholder="Celular"
          className="FormTextField"
          error={erros.tel1 !== null && erros.tel1 !== undefined}
          helperText={erros.tel1}
          value={this.state.tel1}
          onKeyUp={(e) => (e.target.value = formatar(e.target.value, "cell"))}
          onChange={(e) => {
            this.setState({ tel1: e.target.value });
          }}
          onBlur={this.validate}
        />
        <TextField
          id="nascimento"
          label="Data de Nascimento"
          type="date"
          className="FormTextField"
          error={erros.nascimento !== null && erros.nascimento !== undefined}
          helperText={erros.nascimento}
          value={this.state.nascimento}
          onChange={(e) => {
            this.setState({ nascimento: e.target.value });
          }}
          InputLabelProps={{
            shrink: true,
          }}
          onBlur={this.validate}
        />
      </div>
    );
  };

  render() {
    const ok =
      this.state.nome &&
      this.state.cpf &&
      this.state.email &&
      this.state.tel1 &&
      this.state.erros.filter((e) => e !== null).length === 0;
    return (
      <Dialog open={true} keepMounted={true}>
        <div className="divCadPac">
          {this.state.errorMessage && (
            <Alert
              color="warning"
              isOpen={this.state.errorMessage !== null}
              toggle={(e) => this.setState({ errorMessage: null })}
            >
              {this.state.errorMessage}
            </Alert>
          )}
          <Grid container justify="center">
            <Grid item>{this.renderFields()}</Grid>
          </Grid>
          <div style={{ marginTop: "30px" }}>
            <Grid container justify="center" spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => this.props.callback()}
                >
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color={ok ? "primary" : "default"}
                  onClick={this.onSubmit}
                  disabled={!ok}
                >
                  Concluir
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </Dialog>
    );
  }
}
