import React from "react";
import PropTypes from "prop-types";
import { getBancos, getProcedimentos } from "../Api";
import Identificacao from "../form-pessoa/Identificacao";
import Contato from "../form-pessoa/Contato";
import Endereco from "../form-pessoa/Endereco";
import DadosBancarios from "../form-pessoa/DadosBancarios";
import DadosDentista from "../form-pessoa/DadosDentista";
import ProcDispDentista from "../form-pessoa/ProcDispDentista";

class FormIncluirDentista extends React.Component {
  componentDidMount() {
    getBancos(this.loadBancos, this.showError);
    getProcedimentos(this.loadProcedimentos, this.showError);
  }

  state = {
    page: 1,
  };

  loadBancos = (res) => {
    this.setState({ bancos: res.data.registros });
  };

  loadProcedimentos = (res) => {
    this.setState({ procedimentos: res.data.registros });
  };

  showError = (err) => {
    this.props.setMessage(err.response.data.message);
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  render() {
    const { page } = this.state;
    const stepCount = 6;
    return (
      <div className="WizForm">
        <h2>Cadastro de dentista</h2>
        <div> </div>
        {page === 1 && (
          <Identificacao
            previousPage={this.previousPage}
            handleSubmit={this.nextPage}
            onCancel={this.props.onCancel}
            stepNumber={1}
            stepCount={stepCount}
          />
        )}
        {page === 2 && (
          <Contato
            previousPage={this.previousPage}
            handleSubmit={this.nextPage}
            onCancel={this.props.onCancel}
            stepNumber={2}
            stepCount={stepCount}
          />
        )}
        {page === 3 && (
          <Endereco
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.props.onCancel}
            stepNumber={3}
            stepCount={stepCount}
          />
        )}
        {page === 4 && (
          <DadosBancarios
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.props.onCancel}
            stepNumber={4}
            stepCount={stepCount}
            bancos={this.state.bancos}
          />
        )}
        {page === 5 && (
          <DadosDentista
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.props.onCancel}
            stepNumber={5}
            stepCount={stepCount}
          />
        )}
        {page === 6 && (
          <ProcDispDentista
            previousPage={this.previousPage}
            onSubmit={this.props.onSubmit}
            onCancel={this.props.onCancel}
            stepNumber={6}
            stepCount={stepCount}
            procedimentos={this.state.procedimentos}
          />
        )}
      </div>
    );
  }
}

FormIncluirDentista.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FormIncluirDentista;
