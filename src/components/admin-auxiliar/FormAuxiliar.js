import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { getBancos, createAuxiliar, getAuxiliar, updateAuxiliar } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Dialog } from "@material-ui/core";
import Identificacao from "../form-tcc/Identificacao";
import Contato from "../form-tcc/Contato";
import Endereco from "../form-tcc/Endereco";
import DadosBancarios from "../form-tcc/DadosBancarios";
import DadosAuxiliar from "../form-tcc/DadosAuxiliar";
import {
  mapAuxiliarFormToRequest,
  mapAuxiliarResponseToForm,
} from "../form-tcc/dataFormat";

class FormAuxiliar extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    getBancos(this.loadBancos, this.showError);
    if (this.props.idAuxiliar) {
      getAuxiliar(
        this.props.idAuxiliar,
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
      auxiliar: data.data,
      page: 1,
    });
  };

  loadBancos = (res) => {
    this.setState({ bancos: res.data.registros });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  showSuccess = (res, dispatch) => {
    this.props.setMessage({
      color: "primary",
      text: this.props.idAuxiliar ? "Cadastro atualizado!" : "Cadastro realizado!",
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
    const data = mapAuxiliarFormToRequest(values, this.props.idAuxiliar, this.props.perfil.id);
    this.props.idAuxiliar
      ? updateAuxiliar(data, this.props.setToken, this.showSuccess, this.showError, dispatch)
      : createAuxiliar(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    const { page } = this.state;
    const stepCount = 5;
    const dentData = mapAuxiliarResponseToForm(this.state.auxiliar);
    return (
      <div className="WizForm">
        <h2>Cadastro de auxiliar</h2>
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
          <Identificacao
            previousPage={this.previousPage}
            handleSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={1}
            stepCount={stepCount}
            pessoa={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 2 && (
          <Contato
            previousPage={this.previousPage}
            handleSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={2}
            stepCount={stepCount}
            pessoa={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 3 && (
          <Endereco
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={3}
            stepCount={stepCount}
            pessoa={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 4 && (
          <DadosBancarios
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={4}
            stepCount={stepCount}
            bancos={this.state.bancos}
            pessoa={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 5 && (
          <DadosAuxiliar
            previousPage={this.previousPage}
            onSubmit={
              this.props.readOnly
                ? (e, dispatch) => {
                    dispatch(reset("wizard"));
                    this.props.setTela("");
                  }
                : this.onSubmit}
            onCancel={this.onCancel}
            stepNumber={5}
            stepCount={stepCount}
            auxiliar={dentData}
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

export default connect(mapStateToProps, { setMessage, setTela })(FormAuxiliar);
