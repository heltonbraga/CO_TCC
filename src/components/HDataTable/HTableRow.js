import React from "react";
import { Tooltip, IconButton, TableCell, TableRow } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import RedoIcon from "@material-ui/icons/Redo";

export default class HTableRow extends React.Component {
  renderIcon = (acao, disabledActions = []) => {
    const disabled = disabledActions.indexOf(acao) >= 0;
    if (acao === "EDITAR") {
      return <EditIcon color={disabled ? "disabled" : "primary"} />;
    } else if (acao === "DELETAR") {
      return <DeleteIcon color={disabled ? "disabled" : "secondary"} />;
    } else if (acao === "EXPORTAR") {
      return <SaveAltIcon />;
    } else if (acao === "CANCELAR") {
      return <ClearIcon color={disabled ? "disabled" : "secondary"} />;
    } else if (acao === "REMARCAR") {
      return <RedoIcon style={disabled ? {} : { fill: "black" }} />;
    } else if (acao === "CONFIRMAR") {
      return <CheckIcon color={disabled ? "disabled" : "primary"} />;
    }
    return <CheckIcon color="primary" />;
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
                <Tooltip title={action.tooltip} key={action.tooltip + row.key}>
                  <IconButton
                    key={action.tooltip + row.key}
                    aria-label={action.tooltip}
                    tooltip={action.tooltip}
                    onClick={(e) => action.call(e, row.key)}
                  >
                    {this.renderIcon(action.icon, row.disabledActions)}
                  </IconButton>
                </Tooltip>
              );
            })}
          </TableCell>
        ) : null}
      </TableRow>
    );
  }
}
