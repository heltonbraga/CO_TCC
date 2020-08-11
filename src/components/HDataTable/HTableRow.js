import React from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";

export default class HTableRow extends React.Component {
  renderIcon = (acao) => {
    if (acao === "EDITAR") {
      return <EditIcon color="primary" />;
    } else if (acao === "DELETAR") {
      return <DeleteIcon color="secondary" />;
    }
    return <CheckIcon color="#6A6" />;
  };

  render() {
    const row = this.props.row;
    return (
      <TableRow tabIndex={-1} key={row.key}>
        {row.view.map((cell, i) => (
          <TableCell
            align={cell.align}
            key={i}
            onClick={(event) => this.props.onRowClick(event, row.key)}
          >
            {cell.value}
          </TableCell>
        ))}
        {this.props.actions ? (
          <TableCell align="center">
            {this.props.actions.map((action) => {
              return (
                <IconButton
                  key={action.tooltip + row.key}
                  aria-label={action.tooltip}
                  tooltip={action.tooltip}
                  onClick={(e) => action.call(e, row.key)}
                >
                  {this.renderIcon(action.icon)}
                </IconButton>
              );
            })}
          </TableCell>
        ) : null}
      </TableRow>
    );
  }
}
