import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { createProcedimento, getProcedimento, updateProcedimento } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Dialog } from "@material-ui/core";
import Procedimento from "../form-tcc/Procedimento";
import {
  mapProcedimentoFormToRequest,
  mapProcedimentoResponseToForm,
} from "../form-tcc/dataFormat";

class FormProcedimento extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    if (this.props.idProcedimento) {
      getProcedimento(
        this.props.idProcedimento,
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
      procedimento: data.data,
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
      text: this.props.idProcedimento ? "Cadastro atualizado!" : "Cadastro realizado!",
    });
    dispatch(reset("wizard"));
    this.props.setTela("");
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  onSubmit = (values, dispatch) => {
    const data = mapProcedimentoFormToRequest(values, this.props.idProcedimento, this.props.perfil.id);
    this.props.idProcedimento
      ? updateProcedimento(data, this.props.setToken, this.showSuccess, this.showError, dispatch)
      : createProcedimento(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    const { page } = this.state;
    const stepCount = 1;
    const dentData = mapProcedimentoResponseToForm(this.state.procedimento);
    return (
      <div className="WizForm">
        <h2>Cadastro de procedimento</h2>
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
          <Procedimento
            previousPage={this.previousPage}
            onSubmit={
              this.props.readOnly
                ? (e, dispatch) => {
                    dispatch(reset("simples"));
                    this.props.setTela("");
                  }
                : this.onSubmit}
            onCancel={this.onCancel}
            stepNumber={1}
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

export default connect(mapStateToProps, { setMessage, setTela })(FormProcedimento);
