import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Dialog } from "@material-ui/core";
import { getAllAuxiliares, getAuxiliaresByNome, deleteAuxiliar } from "../Api";
import HDataTable from "../HDataTable/HDataTable";
import { setMessage, setTela } from "../../actions";
import { mapAuxiliarToExcel } from "../form-tcc/dataFormat";
import HDialog from "./HDialog";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PdfAuxiliar from "./PdfAuxiliar";

class TabelaAuxiliares extends React.Component {
  state = {
    auxiliares: null,
    table_pageSize: 10,
    table_page: 1,
    table_orderBy: "nome",
    table_ascOrder: "asc",
    delDialogOpen: false,
    delDialogKey: null,
    pdfDialogKey: null,
    wait: false,
  };

  componentDidMount() {
    getAllAuxiliares(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
  }

  showAuxiliares = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum auxiliar encontrado" });
      return;
    }
    let ord = res.data.parametros.order ? res.data.parametros.order : "nome-asc";
    if (ord.slice(0, 3) === "cro") {
      ord = "nr_" + ord;
    }
    let i = ord.indexOf("-");
    this.setState({
      auxiliares: res.data,
      table_page: res.data.parametros.page ? res.data.parametros.page : 1,
      table_pageSize: res.data.parametros.pagesize ? res.data.parametros.pagesize : 10,
      table_orderBy: ord.slice(0, i),
      table_ascOrder: ord.slice(i + 1),
    });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  getAuxiliarHeader = () => {
    return [
      { id: "nr_cro", numeric: false, disablePadding: false, label: "CRO", style: { width: 80 } },
      { id: "nome", numeric: false, disablePadding: false, label: "Nome" },
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
    let exportar = {
      tooltip: "PDF",
      call: this.table_onPDF,
      icon: "EXPORTAR",
    };
    return [editar, excluir, exportar];
  };

  formatarDadosTabela = () => {
    const den = this.state.auxiliares;
    if (!den) {
      return null;
    }
    const rows = den.registros.map((d) => {
      return {
        key: d.id,
        view: [
          { value: d.nr_cro, align: "left" },
          { value: d.Pessoa.nome, align: "left" },
        ],
      };
    });
    return {
      headCells: this.getAuxiliarHeader(),
      rows: rows,
      total: den.total,
      page: this.state.table_page,
      pageSize: this.state.table_pageSize,
    };
  };

  table_onSearch = (event, key) => {
    getAuxiliaresByNome(key, this.props.setToken, this.showAuxiliares, this.showError);
  };

  table_onSearchCancel = () => {
    getAllAuxiliares(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + (this.state.table_ascOrder ? "-asc" : "-desc"),
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
  };

  alterKey = (key) => {
    return key === "nr_cro" ? "cro" : key;
  };

  table_onChangePage = (event, pageNumber) => {
    getAllAuxiliares(
      pageNumber + 1,
      this.state.table_pageSize,
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
  };

  table_onChangePageSize = (event) => {
    getAllAuxiliares(
      this.state.table_page,
      parseInt(event.target.value, 10),
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
  };

  table_onSort = (event, key) => {
    let asc =
      key === this.state.table_orderBy && this.state.table_ascOrder === "asc" ? "desc" : "asc";
    getAllAuxiliares(
      this.state.table_page,
      this.state.table_pageSize,
      this.alterKey(key) + "-" + asc,
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
  };

  table_onCreateRegister = (event) => {
    this.props.setTela("CREATE_AUXILIAR");
  };

  table_onEditRegister = (event, key) => {
    this.props.setTela("EDIT_AUXILIAR:" + key);
  };

  table_onDeleteRegister = (event, key) => {
    this.setState({ delDialogOpen: true, delDialogKey: key });
  };

  table_onSelect = (event, key) => {
    this.props.setTela("VIEW_AUXILIAR:" + key);
  };

  table_export = (event) => {
    getAllAuxiliares(
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
      return mapAuxiliarToExcel(d);
    });
    console.log(data);
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
    deleteAuxiliar(
      { id: this.state.delDialogKey, admin: this.props.perfil.id },
      this.props.setToken,
      this.onDeleteSuccess,
      this.showError
    );
  };

  onDeleteSuccess = () => {
    getAllAuxiliares(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showAuxiliares,
      this.showError
    );
    this.setState({ delDialogOpen: false, delDialogKey: null });
    this.props.setMessage({ color: "primary", text: "Cadastro deletado!" });
  };

  getAuxiliarSelecionado = () => {
    return this.state.auxiliares && this.state.delDialogKey
      ? this.state.auxiliares.registros.filter((d) => d.id === this.state.delDialogKey)[0]
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
            data={this.getAuxiliarSelecionado()}
            open={this.state.delDialogOpen}
            onClose={(e) => this.setState({ delDialogOpen: false })}
            onCancel={(e) => this.setState({ delDialogOpen: false })}
            onConfirm={this.dialog_onConfirm}
          />
        )}
        {this.state.pdfDialogKey && (
          <PdfAuxiliar
            idAuxiliar={this.state.pdfDialogKey}
            idUser={this.props.perfil.id}
            setToken={this.props.setToken}
            onClose={(e) => this.setState({ pdfDialogKey: null })}
          />
        )}
        <HDataTable
          title="Auxiliares"
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
          actions={this.getTableActions("auxiliar")}
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

export default connect(mapStateToProps, { setMessage, setTela })(TabelaAuxiliares);
