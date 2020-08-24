import React from "react";
import { Button, Grid } from "@material-ui/core";

const WizButtons = (props) => {
  const { previousPage, stepNumber, stepCount, pristine, submitting, valid } = props.resto;
  return (
    <div style={{ "marginTop": "30px" }}>
      <Grid container justify="center" spacing={2}>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={props.onCancel}>
            Cancelar
          </Button>
        </Grid>
        <Grid item>
          {stepNumber > 1 && (
            <Button variant="contained" onClick={previousPage}>
              Voltar
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
            {stepNumber < stepCount ? "Avançar" : "Concluir"}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default WizButtons;
