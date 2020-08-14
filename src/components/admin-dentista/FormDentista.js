import React from "react";
import { connect } from "react-redux";
import { reset } from "redux-form";
import { getBancos, getProcedimentos, createDentista, getDentista, updateDentista } from "../Api";
import { setMessage, setTela } from "../../actions";
import { Backdrop, CircularProgress, Dialog } from "@material-ui/core";
import Identificacao from "../form-pessoa/Identificacao";
import Contato from "../form-pessoa/Contato";
import Endereco from "../form-pessoa/Endereco";
import DadosBancarios from "../form-pessoa/DadosBancarios";
import DadosDentista from "../form-pessoa/DadosDentista";
import ProcDispDentista from "../form-pessoa/ProcDispDentista";
import { formatar } from "../form-pessoa/dataFormat";

class FormDentista extends React.Component {
  state = { page: 0, wait: false };

  componentDidMount() {
    getBancos(this.loadBancos, this.showError);
    getProcedimentos(this.loadProcedimentos, this.showError);
    if (this.props.idDentista) {
      getDentista(this.props.idDentista, 1, this.props.setToken, this.initForm, this.showError);
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

  converterFormToRequest = (val) => {
    let bank = { banco: val.banco, agencia: val.agencia, conta: val.conta };
    let pess = {
      id: this.props.idDentista,
      nome: val.nome,
      nr_cpf: val.cpf.replace(/(\D)/g, ""),
      sexo: val.sexo,
      dt_nascimento: val.nascimento,
      //
      email: val.email,
      nr_tel: val.tel1,
      nr_tel_2: val.tel2,
      //
      nr_cep: val.cep.replace(/(\D)/g, ""),
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
      id: this.props.idDentista,
      nr_cro: val.cro,
      dt_liberacao: val.liberacao,
      dt_bloqueio: val.bloqueio,
      pessoa: pess,
      procedimentos: proc,
      disponibilidades: disp,
    };
    return data;
  };

  converterResponseToForm = () => {
    if (!this.state.dentista) {
      return undefined;
    }
    let d = this.state.dentista;
    let bancoPessoa =
      d.Pessoa.DadosBancarios && d.Pessoa.DadosBancarios.length > 0
        ? d.Pessoa.DadosBancarios[0]
        : { banco_codigo: undefined, agencia: undefined, conta: undefined };
    let dentista = {
      id: d.id,
      bloqueio: formatar(d.dt_bloqueio, "dt"),
      liberacao: formatar(d.dt_liberacao, "dt"),
      cro: d.nr_cro,
      //
      nome: d.Pessoa.nome,
      cpf: formatar("0000000000" + d.Pessoa.nr_cpf, "cpf"),
      nascimento: formatar(d.Pessoa.dt_nascimento, "dt"),
      sexo: d.Pessoa.sexo,
      //
      cep: formatar("000000" + d.Pessoa.nr_cep, "cep"),
      estado: d.Pessoa.sg_uf,
      cidade: d.Pessoa.nm_cidade,
      endereco: d.Pessoa.de_endereco,
      complemento: d.Pessoa.de_endereco_comp,
      //
      email: d.Pessoa.email,
      tel1: formatar(d.Pessoa.nr_tel, "cell"),
      tel2: formatar(d.Pessoa.nr_tel_2, "fixo"),
      //
      procedimentosHabilitados: d.Procedimentos,
      horariosDisponiveis: d.Disponibilidades,
      //
      banco: bancoPessoa.banco_codigo,
      agencia: bancoPessoa.agencia,
      conta: bancoPessoa.conta,
    };
    return dentista;
  };

  onSubmit = (values, dispatch) => {
    const data = this.converterFormToRequest(values);
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
    const dentData = this.converterResponseToForm();
    return (
      <div className="WizForm">
        <h2>Cadastro de dentista</h2>
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
  return { setToken: state.setToken, message: state.message, tela: state.tela };
};

export default connect(mapStateToProps, { setMessage, setTela })(FormDentista);
