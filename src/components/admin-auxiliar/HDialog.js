import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HDialog(props) {
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">Leia com atenção!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          A deleção do cadastro de um auxiliar é um procedimento irreversível. 
          Deseja confirmar a deleção do cadastro do auxiliar
          <b>{" " + props.data.Pessoa.nome}</b> - CRO <b>{props.data.nr_cro}</b> ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={props.onCancel}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={props.onConfirm} color="secondary">
          Deletar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
