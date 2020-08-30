import React from "react";
import { connect } from "react-redux";
import {
  CircularProgress,
  Dialog,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Popper,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getAtendimentos,
  getAtendimentosMes,
  getAllDentistas,
  cancelarAtendimento,
  confirmarAtendimento,
} from "../Api";
import HCustomTable from "../HDataTable/HCustomTable";
import { setMessage, setTela } from "../../actions";
import { mapAtendimentoToExcel } from "../form-tcc/dataFormat";
import HDialog from "../HDataTable/HDialog";
import moment from "moment";
import whatsappIcon from "../img/whatsappIcon.png";
import { toExcel } from "../HDataTable/ExportToFile";

const motivos = ["Agenda do dentista", "Agenda do paciente", "Força maior"];

class TabelaAtendimentos extends React.Component {
  state = {
    atendimentos: null,
    confirmarDialogOpen: false,
    cancelarDialogOpen: false,
    remarcarDialogOpen: false,
    motivoCancelamento: motivos[0],
    dialogKey: null,
    dia: moment().format("YYYY-MM-DD"),
    dentista: 0,
    dentistas: [],
    wait: false,
    compacto: window.innerWidth <= 500,
  };

  componentDidMount() {
    getAllDentistas(
      1,
      1000,
      "nome-asc",
      this.props.setToken,
      this.loadDentistas,
      this.showError,
      null
    );
    getAtendimentos(
      this.props.perfil.id,
      this.state.dentista,
      this.state.dia,
      this.props.setToken,
      this.showAtendimentos,
      this.showError
    );
  }

  loadDentistas = (res) => {
    this.setState({
      dentistas: res.data.registros,
    });
  };

  showAtendimentos = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum atendimento encontrado" });
      this.setState({
        atendimentos: { registros: [], total: 0 },
      });
    } else {
      this.setState({
        atendimentos: res.data,
      });
    }
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  getAtendimentoHeader = () => {
    return this.state.compacto
      ? [
          {
            id: "horario",
            numeric: false,
            disablePadding: false,
            label: "Horário",
            style: { width: 80 },
          },
          { id: "situacao", numeric: false, disablePadding: false, label: "Situação" },
        ]
      : [
          {
            id: "horario",
            numeric: false,
            disablePadding: false,
            label: "Horário",
            style: { width: 80 },
          },
          { id: "paciente", numeric: false, disablePadding: false, label: "Paciente" },
          { id: "procedimento", numeric: false, disablePadding: false, label: "Procedimento" },
          { id: "situacao", numeric: false, disablePadding: false, label: "Situação" },
        ];
  };

  getTableActions = (entidade) => {
    let confirmar = {
      tooltip: "confirmar",
      call: this.table_onConfirmarAtd,
      icon: "CONFIRMAR",
    };
    let remarcar = {
      tooltip: "remarcar",
      call: this.table_onRemarcarAtd,
      icon: "REMARCAR",
    };
    let cancelar = {
      tooltip: "cancelar",
      call: this.table_onCancelarAtd,
      icon: "CANCELAR",
    };
    return [confirmar, remarcar, cancelar];
  };

  formatarDadosTabela = () => {
    const den = this.state.atendimentos;
    if (!den) {
      return null;
    }
    const rows = den.registros.map((d) => {
      return {
        key: d.id,
        disabledActions:
          d.dm_situacao === "cancelado" || d.dm_situacao === "realizado"
            ? ["CONFIRMAR", "REMARCAR", "CANCELAR"]
            : d.dm_situacao === "confirmado"
            ? ["CONFIRMAR"]
            : [],
        view: this.state.compacto
          ? [
              { value: moment(d.dt_horario).format("HH:mm"), align: "left" },
              {
                value: <span className={"sit_" + d.dm_situacao}>{d.dm_situacao}</span>,
                align: "left",
              },
            ]
          : [
              { value: moment(d.dt_horario).format("HH:mm"), align: "left" },
              { value: d.Paciente.Pessoa.nome, align: "left" },
              { value: d.Procedimento.nome, align: "left" },
              {
                value: <span className={"sit_" + d.dm_situacao}>{d.dm_situacao}</span>,
                align: "left",
              },
            ],
      };
    });
    return {
      headCells: this.getAtendimentoHeader(),
      rows: rows,
      total: den.total,
    };
  };

  table_onCreateRegister = (event) => {
    this.props.setTela("CREATE_ATENDIMENTO");
  };

  table_onConfirmarAtd = (event, key) => {
    let atd = this.getAtendimentoSelecionado(key);
    if (atd.dm_situacao !== "agendado") {
      return;
    }
    this.setState({ confirmarDialogOpen: true, dialogKey: key });
  };

  table_onCancelarAtd = (event, key) => {
    let atd = this.getAtendimentoSelecionado(key);
    if (atd.dm_situacao === "cancelado" || atd.dm_situacao === "realizado") {
      return;
    }
    this.setState({ cancelarDialogOpen: true, dialogKey: key });
  };

  table_onRemarcarAtd = (event, key) => {
    let atd = this.getAtendimentoSelecionado(key);
    if (atd.dm_situacao === "cancelado" || atd.dm_situacao === "realizado") {
      return;
    }
    this.props.setTela("EDIT_ATENDIMENTO:" + key);
  };

  table_onSelect = (event, key) => {
    this.props.setTela("VIEW_ATENDIMENTO:" + key);
  };

  table_export = (event) => {
    getAtendimentosMes(
      moment(this.state.dia).format("YYYY-MM-DD"),
      this.state.dentista,
      this.props.setToken,
      this.table_exportCallback,
      this.table_exportError
    );
    this.setState({ wait: true });
  };

  table_exportCallback = (res) => {
    toExcel(
      res.data.registros,
      "atendimentos",
      mapAtendimentoToExcel,
      () => this.setState({ wait: false }),
      (msg) => this.table_exportError(msg)
    );
  };

  table_exportError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  cancelarAtendimento = () => {
    cancelarAtendimento(
      {
        id: this.state.dialogKey,
        user: this.props.perfil.id,
        motivo: this.state.motivoCancelamento,
      },
      this.props.setToken,
      this.onDialogRequestSuccess,
      this.showError,
      "Atendimento cancelado."
    );
  };

  confirmarAtendimento = () => {
    confirmarAtendimento(
      {
        id: this.state.dialogKey,
        user: this.props.perfil.id,
      },
      this.props.setToken,
      this.onDialogRequestSuccess,
      this.showError,
      "Atendimento confirmado."
    );
  };

  onDialogRequestSuccess = (res, msg) => {
    getAtendimentos(
      this.props.perfil.id,
      this.state.dentista,
      this.state.dia,
      this.props.setToken,
      this.showAtendimentos,
      this.showError
    );
    this.setState({
      confirmarDialogOpen: false,
      cancelarDialogOpen: false,
      remarcarDialogOpen: false,
      dialogKey: null,
    });
    this.props.setMessage({ color: "primary", text: msg });
  };

  getAtendimentoSelecionado = (key = this.state.dialogKey) => {
    return this.state.atendimentos && key
      ? this.state.atendimentos.registros.filter((d) => d.id === key)[0]
      : {};
  };

  onChangeDentista = (val) => {
    let idDentista = val === null ? 0 : this.state.dentistas.filter((d) => d.id === val.id)[0].id;
    this.setState({ dentista: idDentista });
    getAtendimentos(
      this.props.perfil.id,
      idDentista,
      this.state.dia,
      this.props.setToken,
      this.showAtendimentos,
      this.showError
    );
  };

  onChangeData = (e) => {
    this.setState({ dia: e.target.value });
    getAtendimentos(
      this.props.perfil.id,
      this.state.dentista,
      e.target.value,
      this.props.setToken,
      this.showAtendimentos,
      this.showError
    );
  };

  renderCancelamento = () => {
    return (
      <div>
        <p>Atenção: O cancelamento de um atendimento é irreversível!</p>
        <p>
          Se deseja prosseguir, certifique-se de que as partes envolvidas estejam cientes de que o
          atendimento foi cancelado.
        </p>
        <InputLabel htmlFor="motivoCancelamento">Motivo do cancelamento</InputLabel>
        <Select
          id="motivoCancelamento"
          className="FormTextField"
          value={this.state.motivoCancelamento}
          onChange={(e) => this.setState({ motivoCancelamento: e.target.value })}
        >
          {motivos.map((m, i) => (
            <MenuItem value={m} key={i}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  };

  renderConfirmacao = () => {
    let atd = this.getAtendimentoSelecionado();
    let msg =
      "Olá! Podemos confirmar seu atendimento na clínica odontológica TCC marcado para " +
      moment(atd.dt_horario).format("DD/MM/YYYY") +
      " às " +
      moment(atd.dt_horario).format("hh:mm") +
      "h com o(a) dr(a). " +
      atd.Dentista.Pessoa.nome +
      "?";
    let contatoFormatado = atd.Paciente.Pessoa.nr_tel;
    let contato = contatoFormatado.replace(/(\D)/g, "");
    return (
      <div>
        <p>Lembre-se de entrar em contato com o paciente antes de registrar a confirmação.</p>
        <p>Ao entrar em contato com o paciente, repasse as orientações pré-atendimento.</p>
        <span className="desk">
          <a
            target="_blank"
            href={"https://api.whatsapp.com/send?phone=+55" + contato + "&text=" + msg}
          >
            <Button style={{ backgroundColor: "#25d366", textDecoration: "none" }}>
              Contato: {contatoFormatado} <img alt="whatsapp" src={whatsappIcon} />
            </Button>
          </a>
        </span>
        <span className="cell">
          <a href={"whatsapp://send?phone=+55" + contato + "&text=" + msg}>
            <Button style={{ backgroundColor: "#25d366", textDecoration: "none" }}>
              Contato: {contatoFormatado} <img alt="whatsapp" src={whatsappIcon} />
            </Button>
          </a>
        </span>
      </div>
    );
  };

  renderFiltro = () => {
    return (
      <div className="filtroAtd">
        <Autocomplete
          id="comboDentista"
          options={this.state.dentistas}
          getOptionLabel={(option) => option.Pessoa.nome}
          style={{ width: 200, maxWidth: "45%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dentista"
              variant="standard"
              placeholder="todos dentistas"
            />
          )}
          PopperComponent={(params) => (
            <Popper {...params} style={{ width: 400, maxWidth: "100%" }} placement="bottom-start" />
          )}
          onChange={(e, val) => this.onChangeDentista(val)}
        />
        <TextField
          type="date"
          label="Data"
          value={this.state.dia}
          style={{ width: 150, maxWidth: "45%" }}
          onChange={this.onChangeData}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    );
  };

  render() {
    return (
      <div>
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
        {this.state.cancelarDialogOpen && (
          <HDialog
            title="Cancelar atendimento"
            contentRender={this.renderCancelamento}
            open={this.state.cancelarDialogOpen}
            onClose={(e) => this.setState({ cancelarDialogOpen: false })}
            onPrimary={(e) => this.setState({ cancelarDialogOpen: false })}
            primaryLabel="Não"
            onSecondary={this.cancelarAtendimento}
            secondaryLabel="Sim, quero cancelar este atendimento"
          />
        )}
        {this.state.confirmarDialogOpen && (
          <HDialog
            title="Confirmar atendimento"
            contentRender={this.renderConfirmacao}
            open={this.state.confirmarDialogOpen}
            onClose={(e) => this.setState({ confirmarDialogOpen: false })}
            onSecondary={(e) => this.setState({ confirmarDialogOpen: false })}
            secondaryLabel="Não"
            onPrimary={this.confirmarAtendimento}
            primaryLabel="Sim, quero confirmar este atendimento"
          />
        )}
        <HCustomTable
          title="Atendimentos"
          onExport={this.table_export}
          dataExport={this.state.dataExport}
          data={this.formatarDadosTabela()}
          onSelect={this.table_onSelect}
          onCreateRegister={this.table_onCreateRegister}
          actions={this.getTableActions("atendimento")}
          centerPiece={this.renderFiltro}
        />
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

export default connect(mapStateToProps, { setMessage, setTela })(TabelaAtendimentos);
