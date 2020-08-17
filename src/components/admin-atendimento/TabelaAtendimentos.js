import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Dialog, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAtendimentos, getAllDentistas } from "../Api";
import HCustomTable from "../HDataTable/HCustomTable";
import { setMessage, setTela } from "../../actions";
import { mapAtendimentoToExcel } from "../form-tcc/dataFormat";
import HDialog from "./HDialog";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from "moment";

class TabelaAtendimentos extends React.Component {
  state = {
    atendimentos: null,
    delDialogOpen: false,
    delDialogKey: null,
    pdfDialogKey: null,
    dia: moment().format("YYYY-MM-DD"),
    dentista: 0,
    wait: false,
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
    return [
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
    let editar = {
      tooltip: "editar",
      call: this.table_onEditRegister,
      icon: "EDITAR",
    };
    let excluir = {
      tooltip: "excluir",
      call: this.table_onDeleteRegister,
      icon: "DELETAR",
    };
    return [editar, excluir];
  };

  formatarDadosTabela = () => {
    const den = this.state.atendimentos;
    if (!den) {
      return null;
    }
    const rows = den.registros.map((d) => {
      return {
        key: d.id,
        view: [
          { value: d.horario, align: "left" },
          { value: d.paciente, align: "left" },
          { value: d.situacao, align: "left" },
          { value: d.procedimento, align: "left" },
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

  table_onEditRegister = (event, key) => {
    this.props.setTela("EDIT_ATENDIMENTO:" + key);
  };

  table_onDeleteRegister = (event, key) => {
    this.setState({ delDialogOpen: true, delDialogKey: key });
  };

  table_onSelect = (event, key) => {
    this.props.setTela("VIEW_ATENDIMENTO:" + key);
  };

  table_export = (event) => {
    /*getAllProcedimentos(
      1,
      10000,
      "nome-asc",
      this.props.setToken,
      this.table_exportCallback,
      this.table_exportError,
      this.props.perfil.id
    );
    this.setState({ wait: true });*/
    console.log("TODO: table_export");
  };

  table_exportCallback = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum registro gerado!" });
      this.setState({ dataExport: [] });
    }
    let data = res.data.registros.map((d) => {
      return mapAtendimentoToExcel(d);
    });
    console.log(data);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const arquivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(arquivo, "atendimentos.xlsx");
    this.setState({ wait: false });
  };

  table_exportError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
    this.setState({ wait: false });
  };

  table_onPDF = (event, key) => {
    this.setState({ pdfDialogOpen: true, pdfDialogKey: key });
  };

  dialog_onConfirm = (event) => {
    /*deleteProcedimento(
      { id: this.state.delDialogKey, admin: this.props.perfil.id },
      this.props.setToken,
      this.onDeleteSuccess,
      this.showError
    );*/
  };

  onDeleteSuccess = () => {
    getAtendimentos(
      this.props.perfil.id,
      this.state.dentista,
      this.state.dia,
      this.props.setToken,
      this.showAtendimentos,
      this.showError
    );
    this.setState({ delDialogOpen: false, delDialogKey: null });
    this.props.setMessage({ color: "primary", text: "Cadastro deletado!" });
  };

  getAtendimentoSelecionado = () => {
    /*return this.state.atendimentos && this.state.delDialogKey
      ? this.state.atendimentos.registros.filter((d) => d.id === this.state.delDialogKey)[0]
      : {};*/
    console.log("TODO: getAtendimentoSelecionado");
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

  renderFiltro = () => {
    return (
      <div className="filtroAtd">
        <Autocomplete
          id="comboDentista"
          options={this.state.dentistas}
          getOptionLabel={(option) => option.Pessoa.nome}
          style={{ width: 200 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dentista"
              variant="standard"
              placeholder="todos dentistas"
            />
          )}
          onChange={(e, val) => this.onChangeDentista(val)}
        />
        <TextField
          type="date"
          label="Data"
          value={this.state.dia}
          style={{ width: 150 }}
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
        {this.state.delDialogKey && (
          <HDialog
            data={this.getAtendimentoSelecionado()}
            open={this.state.delDialogOpen}
            onClose={(e) => this.setState({ delDialogOpen: false })}
            onCancel={(e) => this.setState({ delDialogOpen: false })}
            onConfirm={this.dialog_onConfirm}
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
