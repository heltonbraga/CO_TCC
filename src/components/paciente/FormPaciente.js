import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { createPaciente, getPaciente, updatePaciente } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Dialog, DialogContent, Grid } from "@material-ui/core";
import Paciente from "../form-tcc/Paciente";
import { mapPacienteFormToRequest, mapPacienteResponseToForm } from "../form-tcc/dataFormat";

class FormPaciente extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    if (this.props.idPaciente) {
      getPaciente(
        this.props.idPaciente,
        this.props.perfil.id,
        this.props.setToken,
        this.initForm,
        this.showError
      );
    } else {
      this.nextPage();
    }
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
    this.props.onDialogUnmount();
  }

  initForm = (data) => {
    console.log(data.data);
    this.setState({
      paciente: data.data,
      page: 1,
    });
  };

  showError = (err) => {
    console.log("erro");
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  showSuccess = (res, dispatch) => {
    console.log("resultado");
    this.props.setMessage({
      color: "primary",
      text: this.props.idPaciente ? "Cadastro atualizado!" : "Cadastro realizado!",
    });
    dispatch(reset("cad_pac"));
    this.props.dialog ? this.props.callback(res.data.id) : this.props.setTela("");
  };

  nextPage = () => {
    console.log("FormPaciente -> Next");
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onSubmit = (values, dispatch) => {
    console.log("request");
    const data = mapPacienteFormToRequest(values, this.props.idPaciente, this.props.perfil.id);
    this.props.idPaciente
      ? updatePaciente(data, this.props.setToken, this.showSuccess, this.showError, dispatch)
      : createPaciente(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.dialog ? this.props.callback() : this.props.setTela("");
  };

  innerRender = () => {
    const { page } = this.state;
    const dentData = mapPacienteResponseToForm(this.state.paciente);
    return (
      <div className="WizForm">
        <h2>Cadastro de paciente</h2>
        <div> </div>
        {this.state.wait && <CircularProgress />}
        {page === 1 && (
          <Paciente
            previousPage={this.previousPage}
            onSubmit={
              this.props.readOnly
                ? (e, dispatch) => {
                    dispatch(reset("cad_pac"));
                    this.props.setTela("");
                  }
                : this.onSubmit
            }
            onCancel={this.onCancel}
            stepNumber={1}
            stepCount={1}
            paciente={dentData}
            sugestao={this.props.sugestao}
            readOnly={this.props.readOnly || this.state.wait}
          />
        )}
      </div>
    );
  };

  renderDialog = () => {
    return (
      <Dialog open={true} keepMounted={true} style={{ minWidth: "200" }}>
        <DialogContent style={{ minWidth: "200" }}>
          <Grid container justify="center">
            <Grid item>{this.innerRender()}</Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    );
  };

  render() {
    return this.props.dialog ? this.renderDialog() : this.innerRender();
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
