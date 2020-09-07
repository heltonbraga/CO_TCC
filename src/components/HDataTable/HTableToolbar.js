import React, { useState } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Form } from "reactstrap";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import InputBase from "@material-ui/core/InputBase";
import { Tooltip, Grid } from "@material-ui/core";

function onSubmit(e, props, searchKey) {
  props.onSearch(e, searchKey);
  e.preventDefault();
}

export default function HTableToolbar(props) {
  const [searchKey, setSearchKey] = useState("");
  return (
    <Toolbar>
      <Grid container spacing={0}>
        <Grid item xs={10}>
          <Typography style={{ textAlign: "left" }} variant="h6" component="div">
            {props.title}
          </Typography>
        </Grid>
        <Grid container item xs={2}>
          <Tooltip title="novo">
            <AddCircleOutlineIcon
              style={{ marginTop: "4px" }}
              color="primary"
              onClick={props.onCreateRegister}
            />
          </Tooltip>{" "}
          {props.onExport && (
            <Tooltip title="excel">
              <SaveAltIcon style={{ marginTop: "4px" }} onClick={props.onExport} />
            </Tooltip>
          )}
        </Grid>
        <Grid container item xs={12} spacing={0}>
          {!props.hasCenterPiece && (
            <div>
              <Form onSubmit={(e) => onSubmit(e, props, searchKey)}>
                <InputBase
                  placeholder={props.searchPlaceHolder}
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
          )}
          <div>{props.hasCenterPiece && props.centerPiece()}</div>
        </Grid>
      </Grid>
    </Toolbar>
  );
}
