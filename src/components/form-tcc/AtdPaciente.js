import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { validate } from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";
import PacienteSelect from "./PacienteSelect";
import { MenuItem, Grid } from "@material-ui/core";

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

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justify="center">
        <PacienteSelect onSelect={selPaciente} selected={paciente} />
        <Field name="convenio" type={"combo-" + off} component={renderField} label="Convênio">
          {convenios.map((c, i) => (
            <MenuItem key={i} value={c}>
              {c}
            </MenuItem>
          ))}
        </Field>
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
