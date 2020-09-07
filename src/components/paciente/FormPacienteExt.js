import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { createPaciente, updatePaciente, verificarUsuario } from "../Api";
import { setMessage, setTela } from "../../actions";
import ReactCodeInput from "react-code-input";
import { CircularProgress, Typography, Grid, TextField, Button } from "@material-ui/core";
import { Alert } from "reactstrap";
import { formatar, mapPacienteFormToRequest } from "../form-tcc/dataFormat";
import { validarCPF } from "../form-tcc/validate";

const obrigatorios = ["nome", "cpf", "email", "tel1"];

class FormPacienteExt extends React.Component {
  state = {
    wait: false,
    mode: "CAD",
    nome: "",
    cpf: "",
    nascimento: "",
    email: "",
    tel1: "",
    erros: [],
  };

  componentDidMount() {
    this.setState({ email: this.props.perfil.email });
  }

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  showSuccess = (res) => {
    this.props.setMessage({
      color: "primary",
      text: this.props.paciente ? "Cadastro atualizado!" : "Cadastro realizado!",
    });
    this.props.setTela("LOAD");
  };

  onSubmit = () => {
    if (this.props.readOnly) {
      return this.onCancel();
    }
    const { nome, cpf, nascimento, email, tel1, situacao } = this.state;
    const data = mapPacienteFormToRequest(
      { nome, cpf, nascimento, email, tel1, situacao },
      this.props.paciente ? this.props.paciente.id : this.props.idPaciente
    );
    this.props.paciente
      ? updatePaciente(data, this.props.setToken, this.showSuccess, this.showError)
      : createPaciente(data, this.props.setToken, this.showSuccess, this.showError);
    this.setState({ wait: true });
  };

  goCheckToken = (value) => {
    verificarUsuario(
      value,
      this.state.tel1.replace(/(\D)/g, ""),
      this.props.setToken,
      this.showTokenCheckResponse,
      this.showTwilioResponse
    );
    this.setState({ wait: true });
  };

  goSendToken = () => {
    verificarUsuario(
      null,
      this.state.tel1.replace(/(\D)/g, ""),
      this.props.setToken,
      this.showTwilioResponse,
      this.showError
    );
    this.setState({ mode: "SMS" });
  };

  showTwilioResponse = (res) => {
    //
  };

  showTokenCheckResponse = (res) => {
    if (res) {
      this.props.setMessage({ color: "primary", text: "Validado!" });
      this.onSubmit();
    }
  };

  handleCodeInputChange = (val) => {
    this.setState({ code: val });
  };

  renderTokenInput = () => {
    return (
      <div>
        <p>
          Foi enviado um código de confirmação por SMS para o número de telefone informado, digite o
          código no campo abaixo para prosseguir:
        </p>
        <ReactCodeInput
          value={this.state.code}
          type="number"
          fields={4}
          onChange={this.handleCodeInputChange}
        />
        <div style={{ marginTop: "30px" }}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={this.onCancel}>
                Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => this.goCheckToken(this.state.code)}
              >
                Validar
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
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
    const ok =
      this.state.nome &&
      this.state.cpf &&
      this.state.email &&
      this.state.tel1 &&
      erros.filter((e) => e !== null).length === 0;
    return (
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
          <Grid item>
            <div className="formDialog">
              <Typography style={{ textAlign: "center" }} variant="h5" component="div">
                Cadastro de paciente
              </Typography>
              <div> </div>
              {this.state.wait && (
                <CircularProgress
                  style={{
                    margin: "0px auto",
                  }}
                />
              )}
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
                disabled={this.props.readOnly}
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
                disabled={this.props.readOnly}
              />
              <TextField
                id="email"
                label="Email"
                placeholder="Email"
                className="FormTextField"
                value={this.state.email}
                disabled={true}
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
                disabled={this.props.readOnly}
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
                disabled={this.props.readOnly}
              />
            </div>
          </Grid>
        </Grid>
        <div style={{ marginTop: "30px" }}>
          <Grid container justify="center" spacing={2}>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={this.onCancel}>
                Cancelar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color={ok && !this.state.wait ? "primary" : "default"}
                onClick={this.goSendToken}
                disabled={!ok || this.state.wait}
              >
                Concluir
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    if (this.state.wait) {
      return <CircularProgress />;
    }
    return (
      <div className="WizForm">
        {this.state.mode === "CAD" && this.renderFields()}
        {this.state.mode === "SMS" && this.renderTokenInput()}
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

export default connect(mapStateToProps, { setMessage, setTela })(FormPacienteExt);
