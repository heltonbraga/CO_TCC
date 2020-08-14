import React, { useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Form } from "reactstrap";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import { Tooltip } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "90%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    //pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    //transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function onSubmit(e, props, searchKey) {
  props.onSearch(e, searchKey);
  e.preventDefault();
}

export default function HTableToolbar(props) {
  const [searchKey, setSearchKey] = useState("");
  const classes = useStyles();
  return (
    <Toolbar>
      <Typography className="" variant="h6" id="tableTitle" component="div">
        {props.title}
      </Typography>
      <div className={classes.search}>
        <Form onSubmit={(e) => onSubmit(e, props, searchKey)}>
          <InputBase
            placeholder={props.searchPlaceHolder}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          {searchKey !== "" && (
            <ClearIcon
              color="secondary"
              onClick={(e) => {
                props.onSearchCancel(e);
                setSearchKey("");
              }}
            />
          )}
          {searchKey !== "" && (
            <SearchIcon color="primary" onClick={(e) => onSubmit(e, props, searchKey)} />
          )}
        </Form>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <Tooltip title="novo">
          <AddCircleOutlineIcon color="primary" onClick={props.onCreateRegister} />
        </Tooltip>{" "}
        <Tooltip title="exportar">
          <SaveAltIcon onClick={props.onExport} />
        </Tooltip>
      </div>
    </Toolbar>
  );
}
