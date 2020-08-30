import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { MenuItem, Grid, Button } from "@material-ui/core";
import { validate } from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";
import PacienteSelect from "./PacienteSelect";
import DialogLog from "./DialogLog";

let AtdPaciente = (props) => {
  const convenios = [
    "particular",
    "uniodonto",
    "amil",
    "unimed",
    "metlife",
    "odonto system",
    "camed",
    "gamec",
    "odontoprev",
    "sulamerica",
  ];
  const { onCancel, reset, handleSubmit } = props;
  const [paciente, setPaciente] = React.useState(props.paciente);
  const [showLog, setShowLog] = React.useState(false);

  const selPaciente = (pac) => {
    props.change("paciente", pac);
    setPaciente(pac);
  };

  const off = props.readOnly ? "-" : "";

  React.useEffect(() => {
    if (!props.convenio) {
      props.change("convenio", convenios[0]);
    }
  }, []);

  React.useEffect(() => {
    if (!props.atendimento) {
      return;
    }
    props.change("convenio", props.atendimento.convenio);
    props.change("paciente", props.atendimento.Paciente);
    setPaciente(props.atendimento.Paciente);
  }, [props.atendimento]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center">
        <PacienteSelect
          onSelect={selPaciente}
          selected={paciente}
          readOnly={props.readOnly || !!props.atendimento}
        />
        <Field name="convenio" type={"combo-" + off} component={renderField} label="Convênio">
          {convenios.map((c, i) => (
            <MenuItem key={i} value={c}>
              {c}
            </MenuItem>
          ))}
        </Field>
        {props.readOnly && props.mayViewLog && (
          <div className="WizFormNavButtonsContainer">
            <Button variant="contained" color="default" onClick={(e) => setShowLog(true)}>
              Log
            </Button>
          </div>
        )}
        {props.readOnly && showLog && (
          <DialogLog atendimento={props.atendimento} onClose={(e) => setShowLog(false)} />
        )}
      </Grid>
      <WizButtons
        onCancel={(e) => {
          reset();
          onCancel();
        }}
        resto={props}
        invalid={!props.paciente}
      />
    </form>
  );
};

AtdPaciente = reduxForm({
  form: "wizard_atd",
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
  enableReinitialize: true,
})(AtdPaciente);

const selector = formValueSelector("wizard_atd");
AtdPaciente = connect((state) => {
  const paciente = selector(state, "paciente");
  const convenio = selector(state, "convenio");
  return {
    paciente,
    convenio,
  };
})(AtdPaciente);

export default AtdPaciente;
