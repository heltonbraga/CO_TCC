import React from "react";
import { connect } from "react-redux";
import { CircularProgress, Dialog } from "@material-ui/core";
import { getAllPacientes, getPacientesByNome } from "../Api";
import HDataTable from "../HDataTable/HDataTable";
import { setMessage, setTela } from "../../actions";
import { mapPacienteToExcel } from "../form-tcc/dataFormat";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PdfPaciente from "./PdfPaciente";

class TabelaPacientes extends React.Component {
  state = {
    pacientes: null,
    table_pageSize: 10,
    table_page: 1,
    table_orderBy: "nome",
    table_ascOrder: "asc",
    pdfDialogKey: null,
    wait: false,
    compacto: window.innerWidth <= 500,
  };

  componentDidMount() {
    getAllPacientes(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showPacientes,
      this.showError,
      this.props.perfil.id
    );
  }

  showPacientes = (res) => {
    if (!res || !res.data || !res.data.registros || res.data.registros.length === 0) {
      this.props.setMessage({ color: "warning", text: "Nenhum paciente encontrado" });
      return;
    }
    let ord = res.data.parametros.order ? res.data.parametros.order : "nome-asc";
    let i = ord.indexOf("-");
    this.setState({
      pacientes: res.data,
      table_page: res.data.parametros.page ? res.data.parametros.page : 1,
      table_pageSize: res.data.parametros.pagesize ? res.data.parametros.pagesize : 10,
      table_orderBy: ord.slice(0, i),
      table_ascOrder: ord.slice(i + 1),
    });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  getPacienteHeader = () => {
    return this.state.compacto
      ? [
          {
            id: "nome",
            numeric: false,
            disablePadding: false,
            label: "Nome",
          },
        ]
      : [
          {
            id: "nome",
            numeric: false,
            disablePadding: false,
            label: "Nome",
            style: { width: "50%", maxWidth: 200 },
          },
          { id: "situacao", numeric: true, disablePadding: false, label: "Situação" },
        ];
  };

  getTableActions = (entidade) => {
    let editar = {
      tooltip: "editar",
      call: this.table_onEditRegister,
      icon: "EDITAR",
    };
    let exportar = {
      tooltip: "PDF",
      call: this.table_onPDF,
      icon: "EXPORTAR",
    };
    return [editar, exportar];
  };

  formatarDadosTabela = () => {
    const den = this.state.pacientes;
    if (!den) {
      return null;
    }
    const rows = den.registros.map((d) => {
      return {
        key: d.id,
        view: this.state.compacto
          ? [{ value: d.Pessoa.nome, align: "left" }]
          : [
              { value: d.Pessoa.nome, align: "left" },
              { value: d.dm_situacao, align: "right" },
            ],
      };
    });
    return {
      headCells: this.getPacienteHeader(),
      rows: rows,
      total: den.total,
      page: this.state.table_page,
      pageSize: this.state.table_pageSize,
    };
  };

  table_onSearch = (event, key) => {
    getPacientesByNome(key, this.props.setToken, this.showPacientes, this.showError);
  };

  table_onSearchCancel = () => {
    getAllPacientes(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + (this.state.table_ascOrder ? "-asc" : "-desc"),
      this.props.setToken,
      this.showPacientes,
      this.showError,
      this.props.perfil.id
    );
  };

  table_onChangePage = (event, pageNumber) => {
    getAllPacientes(
      pageNumber + 1,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showPacientes,
      this.showError,
      this.props.perfil.id
    );
  };

  table_onChangePageSize = (event) => {
    getAllPacientes(
      this.state.table_page,
      parseInt(event.target.value, 10),
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showPacientes,
      this.showError,
      this.props.perfil.id
    );
  };

  table_onSort = (event, key) => {
    let asc =
      key === this.state.table_orderBy && this.state.table_ascOrder === "asc" ? "desc" : "asc";
    getAllPacientes(
      this.state.table_page,
      this.state.table_pageSize,
      key + "-" + asc,
      this.props.setToken,
      this.showPacientes,
      this.showError,
      this.props.perfil.id
    );
  };

  table_onCreateRegister = (event) => {
    this.props.setTela("CREATE_PACIENTE");
  };

  table_onEditRegister = (event, key) => {
    this.props.setTela("EDIT_PACIENTE:" + key);
  };

  table_onSelect = (event, key) => {
    this.props.setTela("VIEW_PACIENTE:" + key);
  };

  table_export = (event) => {
    getAllPacientes(
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
      return mapPacienteToExcel(d);
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

  getPacienteSelecionado = () => {
    return this.state.pacientes && this.state.delDialogKey
      ? this.state.pacientes.registros.filter((d) => d.id === this.state.delDialogKey)[0]
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
        {this.state.pdfDialogKey && (
          <PdfPaciente
            idPaciente={this.state.pdfDialogKey}
            idUser={this.props.perfil.id}
            setToken={this.props.setToken}
            onClose={(e) => this.setState({ pdfDialogKey: null })}
          />
        )}
        <HDataTable
          title="Pacientes"
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
          actions={this.getTableActions("paciente")}
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

export default connect(mapStateToProps, { setMessage, setTela })(TabelaPacientes);
