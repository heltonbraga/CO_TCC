import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Dialog } from "@material-ui/core";
import { getAllProcedimentos, getProcedimentosByNome, deleteProcedimento } from "../Api";
import HDataTable from "../HDataTable/HDataTable";
import { setMessage, setTela } from "../../actions";
import { mapProcedimentoToExcel } from "../form-tcc/dataFormat";
import HDialog from "./HDialog";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

class TabelaProcedimentos extends React.Component {
  state = {
    procedimentos: null,
    table_pageSize: 10,
    table_page: 1,
    table_orderBy: "nome",
    table_ascOrder: "asc",
    delDialogOpen: false,
    delDialogKey: null,
    pdfDialogKey: null,
    wait: false,
    compacto: window.innerWidth <= 500,
  };

  componentDidMount() {
    getAllProcedimentos(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
  }

  showProcedimentos = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum procedimento encontrado" });
      return;
    }
    let ord = res.data.parametros.order ? res.data.parametros.order : "nome-asc";
    if (ord.slice(0, 3) === "cro") {
      ord = "nr_" + ord;
    }
    let i = ord.indexOf("-");
    this.setState({
      procedimentos: res.data,
      table_page: res.data.parametros.page ? res.data.parametros.page : 1,
      table_pageSize: res.data.parametros.pagesize ? res.data.parametros.pagesize : 10,
      table_orderBy: ord.slice(0, i),
      table_ascOrder: ord.slice(i + 1),
    });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  getProcedimentoHeader = () => {
    return this.state.compacto
      ? [
          {
            id: "nome",
            numeric: false,
            disablePadding: false,
            label: "Nome",
            style: { width: "50%", maxWidth: 200 },
          },
          { id: "duracao", numeric: true, disablePadding: false, label: "Duração" },
        ]
      : [
          {
            id: "nome",
            numeric: false,
            disablePadding: false,
            label: "Nome",
            style: { width: "50%", maxWidth: 200 },
          },
          { id: "dm_tipo", numeric: false, disablePadding: false, label: "Tipo" },
          { id: "duracao", numeric: true, disablePadding: false, label: "Duração" },
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
    const den = this.state.procedimentos;
    if (!den) {
      return null;
    }
    const rows = den.registros.map((d) => {
      return {
        key: d.id,
        view: this.state.compacto
          ? [
              { value: d.nome, align: "left" },
              { value: d.duracao, align: "right" },
            ]
          : [
              { value: d.nome, align: "left" },
              { value: d.dm_tipo, align: "left" },
              { value: d.duracao, align: "right" },
            ],
      };
    });
    return {
      headCells: this.getProcedimentoHeader(),
      rows: rows,
      total: den.total,
      page: this.state.table_page,
      pageSize: this.state.table_pageSize,
    };
  };

  table_onSearch = (event, key) => {
    getProcedimentosByNome(key, this.props.setToken, this.showProcedimentos, this.showError);
  };

  table_onSearchCancel = () => {
    getAllProcedimentos(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + (this.state.table_ascOrder ? "-asc" : "-desc"),
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
  };

  alterKey = (key) => {
    return key === "id" ? "id" : key;
  };

  table_onChangePage = (event, pageNumber) => {
    getAllProcedimentos(
      pageNumber + 1,
      this.state.table_pageSize,
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
  };

  table_onChangePageSize = (event) => {
    getAllProcedimentos(
      this.state.table_page,
      parseInt(event.target.value, 10),
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
  };

  table_onSort = (event, key) => {
    let asc =
      key === this.state.table_orderBy && this.state.table_ascOrder === "asc" ? "desc" : "asc";
    getAllProcedimentos(
      this.state.table_page,
      this.state.table_pageSize,
      this.alterKey(key) + "-" + asc,
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
  };

  table_onCreateRegister = (event) => {
    this.props.setTela("CREATE_PROCEDIMENTO");
  };

  table_onEditRegister = (event, key) => {
    this.props.setTela("EDIT_PROCEDIMENTO:" + key);
  };

  table_onDeleteRegister = (event, key) => {
    this.setState({ delDialogOpen: true, delDialogKey: key });
  };

  table_onSelect = (event, key) => {
    this.props.setTela("VIEW_PROCEDIMENTO:" + key);
  };

  table_export = (event) => {
    getAllProcedimentos(
      1,
      10000,
      "nome-asc",
      this.props.setToken,
      this.table_exportCallback,
      this.table_exportError,
      this.props.perfil.id
    );
    this.setState({ wait: true });
  };

  table_exportCallback = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum registro gerado!" });
      this.setState({ dataExport: [] });
    }
    let data = res.data.registros.map((d) => {
      return mapProcedimentoToExcel(d);
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const arquivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    FileSaver.saveAs(arquivo, "planilha.xlsx");
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
    deleteProcedimento(
      { id: this.state.delDialogKey, admin: this.props.perfil.id },
      this.props.setToken,
      this.onDeleteSuccess,
      this.showError
    );
  };

  onDeleteSuccess = () => {
    getAllProcedimentos(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showProcedimentos,
      this.showError
    );
    this.setState({ delDialogOpen: false, delDialogKey: null });
    this.props.setMessage({ color: "primary", text: "Cadastro deletado!" });
  };

  getProcedimentoSelecionado = () => {
    return this.state.procedimentos && this.state.delDialogKey
      ? this.state.procedimentos.registros.filter((d) => d.id === this.state.delDialogKey)[0]
      : {};
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
            data={this.getProcedimentoSelecionado()}
            open={this.state.delDialogOpen}
            onClose={(e) => this.setState({ delDialogOpen: false })}
            onCancel={(e) => this.setState({ delDialogOpen: false })}
            onConfirm={this.dialog_onConfirm}
          />
        )}
        <HDataTable
          title="Procedimentos"
          searchPlaceHolder="filtrar por nome..."
          onSearch={this.table_onSearch}
          onExport={this.table_export}
          dataExport={this.state.dataExport}
          onSearchCancel={this.table_onSearchCancel}
          data={this.formatarDadosTabela()}
          onSelect={this.table_onSelect}
          onChangePage={this.table_onChangePage}
          onChangePageSize={this.table_onChangePageSize}
          onSort={this.table_onSort}
          onCreateRegister={this.table_onCreateRegister}
          orderBy={this.state.table_orderBy}
          ascOrder={this.state.table_ascOrder}
          actions={this.getTableActions("procedimento")}
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

export default connect(mapStateToProps, { setMessage, setTela })(TabelaProcedimentos);
