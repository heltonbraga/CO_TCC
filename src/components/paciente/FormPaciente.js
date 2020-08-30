import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { createPaciente, updatePaciente, getPaciente } from "../Api";
import { setMessage, setTela } from "../../actions";
import {
  CircularProgress,
  Dialog,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";
import { Alert } from "reactstrap";
import {
  formatar,
  mapPacienteFormToRequest,
  mapPacienteResponseToForm,
} from "../form-tcc/dataFormat";
import { validarCPF } from "../form-tcc/validate";

const obrigatorios = ["nome", "cpf", "email", "tel1"];
const situacoes = [
  "em tratamento",
  "pendente exames",
  "pendente retorno",
  "agendado",
  "sem vinculo",
  "sem resposta",
];

class FormPaciente extends React.Component {
  state = {
    wait: false,
    nome: "",
    cpf: "",
    nascimento: "",
    email: "",
    tel1: "",
    situacao: situacoes[0],
    erros: [],
  };

  componentDidMount() {
    if (this.props.idPaciente) {
      getPaciente(this.props.idPaciente, this.props.setToken, this.loadPaciente, this.showError);
      this.setState({ wait: true });
    } else if (this.props.paciente) {
      this.loadPaciente(null, this.props.paciente);
    } else if (this.props.sugestao) {
      this.setState({ nome: this.props.sugestao });
    }
  }

  loadPaciente = (res, paciente) => {
    const pac = res ? res.data : paciente;
    const data = mapPacienteResponseToForm(pac);
    this.setState({
      wait: false,
      idPaciente: data.id,
      nome: data.nome,
      cpf: data.cpf,
      nascimento: data.nascimento,
      email: data.email,
      tel1: data.tel1,
      situacao: data.situacao,
    });
  };

  showError = (err) => {
    this.setState({ wait: false, errorMessage: err });
  };

  showSuccess = (res) => {
    this.props.setMessage({
      color: "primary",
      text: this.props.idPaciente ? "Cadastro atualizado!" : "Cadastro realizado!",
    });
    this.props.dialog ? this.props.callback(res.data.id) : this.props.setTela("");
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
    this.props.paciente || this.props.idPaciente
      ? updatePaciente(data, this.props.setToken, this.showSuccess, this.showError)
      : createPaciente(data, this.props.setToken, this.showSuccess, this.showError);
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
                error={erros.email !== null && erros.email !== undefined}
                helperText={erros.email}
                value={this.state.email}
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                onBlur={this.validate}
                disabled={this.props.readOnly}
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
              {(this.props.paciente || this.props.idPaciente) && (
                <FormControl className="WizFormControl">
                  <InputLabel htmlFor="sitPac">Situação</InputLabel>
                  <Select
                    id="sitPac"
                    className="FormTextField"
                    value={this.state.situacao}
                    onChange={(e) => {
                      this.setState({ situacao: e.target.value });
                    }}
                    disabled={this.props.readOnly}
                  >
                    {situacoes.map((s, i) => (
                      <MenuItem value={s} key={i}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
                onClick={this.onSubmit}
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
    this.props.dialog ? this.props.callback() : this.props.setTela("");
  };

  renderDialog = () => {
    return (
      <Dialog open={true} keepMounted={true}>
        {this.renderFields()}
      </Dialog>
    );
  };

  render() {
    return this.props.dialog ? (
      this.renderDialog()
    ) : (
      <div className="WizForm">{this.renderFields()}</div>
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

export default connect(mapStateToProps, { setMessage, setTela })(FormPaciente);
