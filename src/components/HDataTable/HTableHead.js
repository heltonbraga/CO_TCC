import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";

export default class HTableHead extends React.Component {
  render() {
    return (
      <TableHead>
        <TableRow>
          {this.props.headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              sortDirection={this.props.orderBy === headCell.id ? this.props.ascOrder : false}
              style={headCell.style}
            >
              <TableSortLabel
                active={this.props.orderBy === headCell.id}
                direction={this.props.orderBy === headCell.id ? this.props.ascOrder : "asc"}
                onClick={(event) => this.props.onSort(event, headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
          {this.props.actions ? <TableCell align="center">Ações</TableCell> : null}
        </TableRow>
      </TableHead>
    );
  }
}
