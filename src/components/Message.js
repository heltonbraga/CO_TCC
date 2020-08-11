import React, { useState } from "react";
import { connect } from "react-redux";
import { setMessage } from "../actions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

function Message(props) {
  const [open, setOpen] = useState(true);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    props.setMessage(null);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={<Alert severity="error">{props.msg}</Alert>}
        action={[
          <IconButton key="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return { message: state.message };
};

export default connect(mapStateToProps, { setMessage })(Message);
