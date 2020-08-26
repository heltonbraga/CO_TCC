import React from "react";
import { Table, TableBody, TableContainer, Paper, CircularProgress } from "@material-ui/core";
import HTableToolbar from "./HTableToolbar";
import HTableRow from "./HTableRow";
import HTableHead from "./HTableHead";

import "./style.css";

export default class HCustomTable extends React.Component {
  render() {
    if (!this.props.data) {
      return <CircularProgress />;
    }
    const { rows, headCells, total } = this.props.data;
    return (
      <div className="">
        <Paper className="">
          <HTableToolbar
            title={this.props.title}
            onExport={this.props.onExport}
            dataExport={this.props.dataExport}
            onCreateRegister={this.props.onCreateRegister}
            hasCenterPiece={true}
            centerPiece={this.props.centerPiece}
          />
          <TableContainer>
            <Table
              className=""
              aria-labelledby="tableTitle"
              size="medium"
              aria-label="HCustomTable"
            >
              <HTableHead headCells={headCells} actions={this.props.actions} />
              <TableBody>
                {rows
                  ? rows.map((row) => {
                      return (
                        <HTableRow
                          row={row}
                          onRowClick={this.props.onSelect}
                          actions={this.props.actions}
                          key={row.key}
                        />
                      );
                    })
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    );
  }
}
