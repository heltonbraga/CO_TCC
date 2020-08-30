import React from "react";
import { connect } from "react-redux";
import { TextField, Tooltip, Grid } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import EditIcon from "@material-ui/icons/Edit";
import { setMessage } from "../../actions";
import { getAllPacientes, getPaciente } from "../Api";
import { formatar } from "../form-tcc/dataFormat";
import FormPaciente from "../paciente/FormPaciente";

class PacienteSelect extends React.Component {
  state = { pacientes: [], inputKey: null, paciente: null, showSubForm: false };

  componentDidMount() {
    if (!this.props.readOnly) {
      getAllPacientes(
        1,
        10000,
        "nome-asc",
        this.props.setToken,
        this.loadPacientes,
        this.showError
      );
    }
  }

  componentDidUpdate() {
    if (this.props.selected && !this.state.paciente) {
      this.setState({ paciente: this.props.selected });
    }
  }

  loadPacientes = (data) => {
    this.setState({ pacientes: data.data.registros });
  };

  loadPaciente = (data) => {
    let outros = this.state.pacientes;
    outros.push(data.data);
    this.setState({ pacientes: outros, paciente: data.data });
    this.props.onSelect(data.data);
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  onSelect = (pac) => {
    this.setState({ paciente: pac });
    this.props.onSelect(pac);
  };

  subFormResult = (paciente) => {
    if (paciente) {
      getPaciente(paciente, this.props.setToken, this.loadPaciente, this.showError);
      this.props.setMessage({
        color: "primary",
        text: "Cadastro realizado!",
      });
    }
    this.setState({ showSubForm: false });
  };

  editPaciente = () => {
    this.setState({ showSubForm: true });
  };

  onDialogUnmount = () => {
    this.setState({ inputKey: "loading..." });
  };

  render() {
    const pac = this.state.paciente;
    return (
      <Grid container justify="center">
        <Grid container justify="center">
          <Grid container item justify="center">
            <Autocomplete
              id="comboPaciente"
              freeSolo
              value={pac}
              options={this.state.pacientes}
              getOptionLabel={(option) => {
                return (
                  formatar("000000" + option.Pessoa.nr_cpf, "cpf") + " - " + option.Pessoa.nome
                );
              }}
              className="pacAutocomplete"
              renderInput={(params) => (
                <TextField {...params} id="inputPaciente" label="Paciente" variant="standard" />
              )}
              onChange={(e, val) => this.onSelect(val)}
              onInputChange={(e, val) => this.setState({ inputKey: val })}
              disabled={this.props.readOnly}
            />
            {!this.props.readOnly && (
              <div className="plusDiv">
                <Tooltip title="novo">
                  <AddCircleOutlineIcon
                    color={pac === null ? "primary" : "disabled"}
                    onClick={(e) => this.setState({ showSubForm: pac === null })}
                  />
                </Tooltip>
                {this.state.showSubForm && (
                  <FormPaciente
                    dialog={true}
                    callback={this.subFormResult}
                    token={this.props.setToken}
                    sugestao={this.state.inputKey}
                    paciente={this.state.paciente}
                  />
                )}
              </div>
            )}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <div className="divSpacer">
            <Grid item>
              {pac && (
                <p>
                  Celular: <b>{pac.Pessoa.nr_tel}</b> / Email: <b>{pac.Pessoa.email}</b>
                </p>
              )}
            </Grid>
            {!this.props.readOnly && (
              <Grid item>
                {pac && (
                  <div style={{ marginLeft: "10px" }}>
                    <Tooltip title="editar">
                      <EditIcon color="primary" onClick={this.editPaciente} />
                    </Tooltip>
                  </div>
                )}
              </Grid>
            )}
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    setToken: state.setToken,
  };
};

export default connect(mapStateToProps, { setMessage })(PacienteSelect);
