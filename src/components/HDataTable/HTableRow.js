import React from "react";
import { Tooltip, IconButton, TableCell, TableRow } from "@material-ui/core";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import RedoIcon from "@material-ui/icons/Redo";

export default class HTableRow extends React.Component {
  state = { viewActions: false };

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

  renderActions = (row) => {
    return (
      <div className="actionsDiv" >
        {this.props.actions.map((action) => {
          return (
            <Tooltip title={action.tooltip} key={action.tooltip + row.key}>
              <IconButton
                key={action.tooltip + row.key}
                aria-label={action.tooltip}
                tooltip={action.tooltip}
                onClick={(e) => {
                  this.setState({ viewActions: false });
                  action.call(e, row.key);
                }}
              >
                {this.renderIcon(action.icon, row.disabledActions)}
              </IconButton>
            </Tooltip>
          );
        })}
      </div>
    );
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
            <div className="actionsToogle">
              <Dropdown
                size="sm"
                isOpen={this.state.viewActions}
                toggle={(e) => this.setState({ viewActions: !this.state.viewActions })}
              >
                <DropdownToggle tag="span" data-toggle="dropdown">
                  <MoreVertIcon />
                </DropdownToggle>
                <DropdownMenu className="actionsDropdown">
                  {this.renderActions(row)}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="actionsPanel">{this.renderActions(row)}</div>
          </TableCell>
        ) : null}
      </TableRow>
    );
  }
}
