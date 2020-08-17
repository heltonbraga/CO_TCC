import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import {
  marcarAtendimento,
  getAtendimento,
  confirmarAtendimento,
  cancelarAtendimento,
} from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Dialog } from "@material-ui/core";
import AtdPaciente from "../form-tcc/AtdPaciente";
import AtdVaga from "../form-tcc/AtdVaga";
import {
  mapAtendimentoFormToRequest,
  mapAtendimentoResponseToForm,
} from "../form-tcc/dataFormat";

class FormAtendimento extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    if (this.props.idAtendimento) {
      getAtendimento(
        this.props.idAtendimento,
        this.props.perfil.id,
        this.props.setToken,
        this.initForm,
        this.showError
      );
    } else {
      this.nextPage();
    }
  }

  initForm = (data) => {
    console.log(data.data);
    this.setState({
      atendimento: data.data,
      page: 1,
    });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  showSuccess = (res, dispatch) => {
    this.props.setMessage({
      color: "primary",
      text: this.props.idAtendimento ? "Atendimento atualizado!" : "Atendimento marcado!",
    });
    dispatch(reset("wizard_atd"));
    this.props.setTela("");
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onSubmit = (values, dispatch) => {
    const data = mapAtendimentoFormToRequest(
      values,
      this.props.idAtendimento,
      this.props.perfil.id
    );
    console.log("TODO");
    /*this.props.idAtendimento
      ? updateProcedimento(data, this.props.setToken, this.showSuccess, this.showError, dispatch)
      : createProcedimento(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
    */
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    const { page } = this.state;
    const stepCount = 2;
    const dentData = mapAtendimentoResponseToForm(this.state.atendimento);
    return (
      <div className="WizForm">
        <h2>Marcação de atendimento</h2>
        <div> </div>
        {page === 0 && <CircularProgress />}
        <Dialog
          fullScreen
          open={this.state.wait}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        />
        {this.state.wait && <CircularProgress />}
        {page === 1 && (
          <AtdPaciente
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={1}
            stepCount={stepCount}
            procedimento={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 2 && (
          <AtdVaga
            previousPage={this.previousPage}
            onSubmit={
              this.props.readOnly
                ? (e, dispatch) => {
                    dispatch(reset("wizard_atd"));
                    this.props.setTela("");
                  }
                : this.onSubmit
            }
            onCancel={this.onCancel}
            stepNumber={2}
            stepCount={stepCount}
            procedimento={dentData}
            readOnly={this.props.readOnly}
          />
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

export default connect(mapStateToProps, { setMessage, setTela })(FormAtendimento);
