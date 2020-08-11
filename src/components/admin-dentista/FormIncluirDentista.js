import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { getBancos, getProcedimentos, createDentista } from "../Api";
import { setMessage, setTela } from "../../actions";
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
    this.props.setMessage({ color: "warning", text: err });
  };

  showSuccess = (res, dispatch) => {
    this.props.setMessage({ color: "primary", text: "Cadastro realizado!" });
    dispatch(reset("wizard"));
    this.props.setTela("");
  };

  nextPage = () => {
    this.setState({ page: this.state.page + 1 });
  };

  previousPage = () => {
    this.setState({ page: this.state.page - 1 });
  };

  converterFormToRequest = (val) => {
    let bank = { banco: val.banco, agencia: val.agencia, conta: val.conta };
    let pess = {
      nome: val.nome,
      nr_cpf: val.cpf.replace(/(\D)/g, ""),
      sexo: val.sexo,
      dt_nascimento: val.nascimento,
      //
      email: val.email,
      nr_tel: val.tel1,
      nr_tel_2: val.tel2,
      //
      nr_cep: val.cep,
      sg_uf: val.estado,
      nm_cidade: val.cidade,
      de_endereco: val.endereco,
      de_endereco_comp: val.complemento,
      //
      dadosBancarios: bank,
    };
    let proc = val.procedimentosHabilitados
      ? val.procedimentosHabilitados.map((p) => {
          return { procedimento_id: p.id };
        })
      : [];
    let disp = val.horariosDisponiveis
      ? val.horariosDisponiveis.map((d) => {
          return {
            dm_dia_semana: d.dia_str.toLowerCase(),
            hr_inicio: d.inicio_str,
            hr_fim: d.fim_str,
          };
        })
      : [];
    let data = {
      admin: 1,
      nr_cro: val.cro,
      dt_liberacao: val.liberacao,
      dt_bloqueio: val.bloqueio,
      pessoa: pess,
      procedimentos: proc,
      disponibilidades: disp,
    };
    return data;
  };

  onSubmit = (values, dispatch) => {
    const data = this.converterFormToRequest(values);
    createDentista(data, this.props.setToken, this.showSuccess, this.showError, dispatch);
  };

  onCancel = () => {
    this.props.setTela("");
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
            onCancel={this.onCancel}
            stepNumber={1}
            stepCount={stepCount}
          />
        )}
        {page === 2 && (
          <Contato
            previousPage={this.previousPage}
            handleSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={2}
            stepCount={stepCount}
          />
        )}
        {page === 3 && (
          <Endereco
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={3}
            stepCount={stepCount}
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
          />
        )}
        {page === 5 && (
          <DadosDentista
            previousPage={this.previousPage}
            onSubmit={this.nextPage}
            onCancel={this.onCancel}
            stepNumber={5}
            stepCount={stepCount}
          />
        )}
        {page === 6 && (
          <ProcDispDentista
            previousPage={this.previousPage}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
            stepNumber={6}
            stepCount={stepCount}
            procedimentos={this.state.procedimentos}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { setToken: state.setToken, message: state.message, tela: state.tela };
};

export default connect(mapStateToProps, { setMessage, setTela })(FormIncluirDentista);
