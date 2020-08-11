import React from "react";
import { connect } from "react-redux";
import { getAllDentistas, getDentistasByNome } from "../Api";
import HDataTable from "../HDataTable/HDataTable";
import { setMessage, setTela } from "../../actions";

class TabelaDentistas extends React.Component {
  state = {
    dentistas: null,
    table_pageSize: 10,
    table_page: 1,
    table_orderBy: "nome",
    table_ascOrder: "asc",
  };

  componentDidMount() {
    getAllDentistas(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showDentistas,
      this.showError
    );
  }

  showDentistas = (res) => {
    let ord = res.data.parametros.order ? res.data.parametros.order : "nome-asc";
    if (ord.slice(0, 3) === "cro") {
      ord = "nr_" + ord;
    }
    let i = ord.indexOf("-");
    this.setState({
      dentistas: res.data,
      table_page: res.data.parametros.page ? res.data.parametros.page : 1,
      table_pageSize: res.data.parametros.pagesize ? res.data.parametros.pagesize : 10,
      table_orderBy: ord.slice(0, i),
      table_ascOrder: ord.slice(i + 1),
    });
  };

  showError = (err) => {
    this.props.setMessage({ color: "warning", text: err });
  };

  getDentistaHeader = () => {
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
    return [editar, excluir];
  };

  formatarDadosTabela = () => {
    const den = this.state.dentistas;
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
      headCells: this.getDentistaHeader(),
      rows: rows,
      total: den.total,
      page: this.state.table_page,
      pageSize: this.state.table_pageSize,
    };
  };

  table_onSearch = (event, key) => {
    getDentistasByNome(key, this.props.setToken, this.showDentistas, this.showError);
  };

  table_onSearchCancel = () => {
    getAllDentistas(
      this.state.table_page,
      this.state.table_pageSize,
      this.state.table_orderBy + (this.state.table_ascOrder ? "-asc" : "-desc"),
      this.props.setToken,
      this.showDentistas,
      this.showError
    );
  };

  alterKey = (key) => {
    return key === "nr_cro" ? "cro" : key;
  };

  table_onChangePage = (event, pageNumber) => {
    getAllDentistas(
      pageNumber + 1,
      this.state.table_pageSize,
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showDentistas,
      this.showError
    );
  };

  table_onChangePageSize = (event) => {
    getAllDentistas(
      this.state.table_page,
      parseInt(event.target.value, 10),
      this.alterKey(this.state.table_orderBy) + "-" + this.state.table_ascOrder,
      this.props.setToken,
      this.showDentistas,
      this.showError
    );
  };

  table_onSort = (event, key) => {
    let asc =
      key === this.state.table_orderBy && this.state.table_ascOrder === "asc" ? "desc" : "asc";
    getAllDentistas(
      this.state.table_page,
      this.state.table_pageSize,
      this.alterKey(key) + "-" + asc,
      this.props.setToken,
      this.showDentistas,
      this.showError
    );
  };

  table_onCreateRegister = (event) => {
    this.props.setTela("CREATE_DENTISTA");
  };

  table_onEditRegister = (event, key) => {
    //TODO
    this.props.setMessage({ color: "primary", text: "AHOY!" });
    console.log("EDIT" + key);
  };

  table_onDeleteRegister = (event, key) => {
    //TODO
    this.props.setMessage({ color: "warning", text: "ERROU" });
    console.log("DELETE" + key);
  };

  table_onSelect = (event, key) => {
    //TODO
    console.log("SELECTED: " + key);
  };

  render() {
    return (
      <HDataTable
        title="Dentistas"
        searchPlaceHolder="nome..."
        onSearch={this.table_onSearch}
        onSearchCancel={this.table_onSearchCancel}
        data={this.formatarDadosTabela()}
        onSelect={this.table_onSelect}
        onChangePage={this.table_onChangePage}
        onChangePageSize={this.table_onChangePageSize}
        onSort={this.table_onSort}
        onCreateRegister={this.table_onCreateRegister}
        orderBy={this.state.table_orderBy}
        ascOrder={this.state.table_ascOrder}
        actions={this.getTableActions("dentista")}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return { setToken: state.setToken, message: state.message, tela: state.tela };
};

export default connect(mapStateToProps, { setMessage, setTela })(TabelaDentistas);
