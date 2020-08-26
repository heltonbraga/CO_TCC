import React from "react";
import { Button, Grid } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DoneIcon from "@material-ui/icons/Done";

const WizButtons = (props) => {
  const { previousPage, stepNumber, stepCount, pristine, submitting, valid } = props.resto;
  const compacto = window.innerWidth <= 500;
  return (
    <div style={{ marginTop: "30px" }}>
      <Grid container justify="center" spacing={2}>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={props.onCancel}>
            {compacto ? <ClearIcon /> : "Cancelar"}
          </Button>
        </Grid>
        <Grid item>
          {stepNumber > 1 && (
            <Button variant="contained" onClick={previousPage}>
              {compacto ? <ArrowBackIcon /> : "Voltar"}
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!valid || pristine || submitting || props.invalid}
          >
            {stepNumber < stepCount ? (
              compacto ? (
                <ArrowForwardIcon />
              ) : (
                "Avançar"
              )
            ) : compacto ? (
              <DoneIcon />
            ) : (
              "Concluir"
            )}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default WizButtons;
