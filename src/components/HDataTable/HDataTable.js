import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import HTableToolbar from "./HTableToolbar";
import HTableRow from "./HTableRow";
import HTableHead from "./HTableHead";

export default class HDataTable extends React.Component {

  render() {
    const data = this.props.data;
    if (!data || !data.rows || data.rows.length === 0) {
      return <div>Carregando...</div>;
    }
    const { rows, headCells, total, page, pageSize } = this.props.data;
    return (
      <div className="">
        <Paper className="">
          <HTableToolbar
            title={this.props.title}
            onSearch={this.props.onSearch}
            onSearchCancel={this.props.onSearchCancel}
            onCreateRegister={this.props.onCreateRegister}
            searchPlaceHolder={this.props.searchPlaceHolder}
          />
          <TableContainer>
            <Table className="" aria-labelledby="tableTitle" size="medium" aria-label="HDataTable">
              <HTableHead
                headCells={headCells}
                orderBy={this.props.orderBy}
                ascOrder={this.props.ascOrder}
                onSort={this.props.onSort}
                actions={this.props.actions}
              />
              <TableBody>
                {rows.map((row) => {
                  return (
                    <HTableRow
                      row={row}
                      onRowClick={this.props.onSelect}
                      actions={this.props.actions}
                      key={row.key}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage="Linhas"
            rowsPerPageOptions={[5, 10]}
            SelectProps={{
              inputProps: { "aria-label": "Linhas" },
              native: true,
            }}
            component="div"
            count={total}
            rowsPerPage={pageSize}
            page={page - 1}
            onChangePage={this.props.onChangePage}
            onChangeRowsPerPage={this.props.onChangePageSize}
          />
        </Paper>
      </div>
    );
  }
}
