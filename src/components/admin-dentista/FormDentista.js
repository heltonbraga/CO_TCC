import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { getBancos, getProcedimentos, createDentista, getDentista, updateDentista } from "../Api";
import { setMessage, setTela } from "../../actions";
import { CircularProgress, Dialog, Typography } from "@material-ui/core";
import Identificacao from "../form-tcc/Identificacao";
import Contato from "../form-tcc/Contato";
import Endereco from "../form-tcc/Endereco";
import DadosBancarios from "../form-tcc/DadosBancarios";
import DadosDentista from "../form-tcc/DadosDentista";
import ProcDispDentista from "../form-tcc/ProcDispDentista";
import { mapDentistaFormToRequest, mapDentistaResponseToForm } from "../form-tcc/dataFormat";

class FormDentista extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    getBancos(this.loadBancos, this.showError);
    getProcedimentos(this.loadProcedimentos, this.showError);
    if (this.props.idDentista) {
      getDentista(
        this.props.idDentista,
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
      dentista: data.data,
      page: 1,
    });
  };

  loadBancos = (res) => {
    this.setState({ bancos: res.data.registros });
  };

  loadProcedimentos = (res) => {
    this.setState({ procedimentos: res.data.registros });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  showSuccess = (res, dispatch) => {
    this.props.setMessage({
      color: "primary",
      text: this.props.idDentista ? "Cadastro atualizado!" : "Cadastro realizado!",
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
    const data = mapDentistaFormToRequest(values, this.props.idDentista, this.props.perfil.id);
    this.props.idDentista
      ? updateDentista(data, this.props.setToken, this.showSuccess, this.showError, dispatch)
      : createDentista(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
    this.setState({ wait: true });
  };

  onCancel = () => {
    this.props.setTela("");
  };

  render() {
    const { page } = this.state;
    const stepCount = 6;
    const dentData = mapDentistaResponseToForm(this.state.dentista);
    return (
      <div className="WizForm">
        <Typography style={{ textAlign: "center" }} variant="h5" component="div">
          Cadastro de dentista
        </Typography>
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
          <DadosDentista
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={5}
            stepCount={stepCount}
            dentista={dentData}
            readOnly={this.props.readOnly}
          />
        )}
        {page === 6 && (
          <ProcDispDentista
            previousPage={this.previousPage}
            onSubmit={
              this.props.readOnly
                ? (e, dispatch) => {
                    dispatch(reset("wizard"));
                    this.props.setTela("");
                  }
                : this.onSubmit
            }
            onCancel={this.onCancel}
            stepNumber={6}
            stepCount={stepCount}
            procedimentos={this.state.procedimentos}
            dentista={dentData}
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

export default connect(mapStateToProps, { setMessage, setTela })(FormDentista);
