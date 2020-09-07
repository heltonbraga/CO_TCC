import React from "react";
import { Field, reduxForm } from "redux-form";
import MenuItem from "@material-ui/core/MenuItem";
import {validate} from "./validate";
import renderField from "./renderField";
import WizButtons from "./WizButtons";

const pressao = ["normal", "alta", "baixa"];
const sangue = ["o+", "o-", "a+", "a-", "b+", "b-", "ab+", "ab-"];

const AnamneseSangue = (props) => {
  const { onCancel, reset, handleSubmit } = props;

  React.useEffect(() => {
    if (!props.paciente || !props.paciente.Anamnese) {
      return;
    }
    const a = props.paciente.Anamnese;
    props.change("tipoSanguineo", a.dm_sangue);
    props.change("pressaoArterial", a.dm_pressao);
    props.change("observacao", a.observacao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.paciente]);

  const off = props.readOnly ? "-" : "";

  return (
    <form onSubmit={handleSubmit}>
      <Field name="tipoSanguineo" type={"combo-" + off} component={renderField} label="Tipo sanguíneo">
        {sangue.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </Field>
      <Field name="pressaoArterial" type={"combo-" + off} component={renderField} label="Pressão Arterial">
        {pressao.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </Field>
      <Field
        name="observacao"
        type={"textarea-" + off}
        component={renderField}
        label="Observações"
      />
      <WizButtons
        onCancel={(e) => {
          reset();
          onCancel();
        }}
        resto={props}
      />
    </form>
  );
};

export default reduxForm({
  form: "wizard_anam", 
  destroyOnUnmount: false, 
  forceUnregisterOnUnmount: true, 
  validate,
  enableReinitialize: true,
})(AnamneseSangue);
